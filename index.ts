import { ref, onMounted } from "vue";
import type {
    GetAccountStatementReturnType,
    IConnect,
    IMonoAccountAuthResponse,
    IMonoAccountDetailsResponse,
    IMonoAccountIdentificationResponse,
    IMonoUnlinkAccountResponse,
    OnMonoConnectClose,
    OnMonoConnectSuccess,
} from "./types";
import axios from "axios";
import { getMonoConfig } from "./vue-mono-co.config";
import { objectToQueryString } from "./utils";
// import MonoComponent from './MonoComponent';

// export const MonoButton = MonoComponent;

const { MONO_CO_PK, MONO_CO_SK } = getMonoConfig();

export const monoApiClient = axios.create({
    baseURL: "https://api.withmono.com/v2",
    timeout: 8000,
    headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "mono-sec-key": MONO_CO_SK,
    },
});

declare var Connect: IConnect;

export const useMonoConnect = (
    onSuccess: OnMonoConnectSuccess,
    onClose?: OnMonoConnectClose
) => {
    const connect = ref<IConnect>();

    if (!MONO_CO_PK) throw new Error("MONO_PK is required");

    onClose ??= () => { };
    const config = {
        key: MONO_CO_PK,
        onSuccess,
        onClose,
    };

    onMounted(() => {
        const script = document.createElement("script");
        script.src = "https://connect.withmono.com/connect.js";
        script.async = true;
        script.onload = () => {
            connect.value = new Connect(config);
            if (connect.value) connect.value.setup();
        };
        document.head.appendChild(script);
    });

    const openConnect = () => {
        if (connect.value) connect.value.open();
    };

    const exchangeToken = async (code: string) => {
        const { data } = await monoApiClient.post<IMonoAccountAuthResponse>(
            "/accounts/auth",
            { code }
        );

        if (data.status.toLowerCase() != "successful") throw data.message;

        return data.data.id;
    };

    const getAccountIdentity = async (id: string) => {
        const { data } =
            await monoApiClient.get<IMonoAccountIdentificationResponse>(
                `/accounts/${id}/identify`
            );

        if (data.status.toLowerCase() != "successful") throw data.message;

        return data.data;
    };

    const getAccountDetails = async (id: string) => {
        const { data } = await monoApiClient.get<IMonoAccountDetailsResponse>(
            `/accounts/${id}`
        );

        if (data.status.toLowerCase() != "successful") throw data.message;

        return data.data;
    };

    const getAccounts = async () => {
        const { data } =
            await monoApiClient.get<IMonoAccountDetailsResponse>(`/accounts`);

        if (data.status.toLowerCase() != "successful") throw data.message;

        return data.data;
    };

    const unlinkAccount = async (id: string) => {
        const { data } = await monoApiClient.post<IMonoUnlinkAccountResponse>(
            `/accounts/${id}/unlink`
        );

        if (data.status.toLowerCase() != "successful") throw data.message;

        return data.status == "successful";
    };

    const getAccountStatement = async <Output extends "pdf" | "json" = "json">(
        id: string,
        period?: string,
        output?: Output,
        format?: "v1" | "v2"
    ) => {
        const { data } = await monoApiClient.get<
            GetAccountStatementReturnType<Output>
        >(
            `/accounts/${id}/statement?${objectToQueryString({ period, output, format })}`
        );

        if (data.status.toLowerCase() !== "successful")
            throw new Error(data.message);

        return data.data;
    };

    const getAccountTransaction = async (
        id: string,
        start?: Date,
        end?: Date,
        narration?: string,
        type?: "credit" | "debit",
        paginate?: boolean,
        limits?: boolean
    ) => {
        const { data } = await monoApiClient.get(
            `/accounts/${id}/transactions?${objectToQueryString({ start, end, narration, type, paginate, limits })}`
        );

        if (data.status.toLowerCase() !== "successful")
            throw new Error(data.message);

        return data.data;
    };

    return {
        openConnect,
        exchangeToken,
        getAccountIdentity,
        getAccountDetails,
        getAccounts,
        unlinkAccount,
        getAccountStatement,
        getAccountTransaction,
    };
};
