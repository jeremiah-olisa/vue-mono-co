type Required<T> = {
    [K in keyof T]-?: T[K];
};

export interface IMonoConfig {
    MONO_CO_PK: string | null
    MONO_CO_SK: string | null
};

export interface IConnect {
    new(config: {
        key: string;
        onSuccess: OnMonoConnectSuccess;
        onClose: OnMonoConnectClose;
    }): any;
    setup(): void;
    open(): void;
}

export type OnMonoConnectSuccess = (response: { code: string }) => void;
export type OnMonoConnectClose = () => void;

interface MonoAccountDetailsResponse {
    account: MonoAccount;
    meta: Meta;
}

interface MonoAccount {
    id: string;
    name: string;
    currency: string;
    type: string;
    account_number: string;
    balance: number;
    bvn: string;
    institution: MonoBankInstitution;
}

interface MonoBankInstitution {
    id?: string;
    name: string;
    bank_code: string;
    type: string;
}

export interface Meta {
    data_status: string;
    auth_method: string;
}

export type IMonoAPIResponse<Data = any, ResponseMeta = any> = {
    status: string;
    message: string;
    timestamp?: string;
    data: Data;
} & ResponseMeta;

export type IMonoAccountAuthResponse = IMonoAPIResponse<{ id: string }>;
export type IMonoAccountIdentificationResponse = IMonoAPIResponse<{
    full_name: string;
    email: string;
    phone: string;
    gender: string;
    dob: any;
    bvn: string;
    marital_status: any;
    address_line1: string;
    address_line2: string;
    created_at: string;
    updated_at: string;
}>;

export type IMonoAccountDetailsResponse =
    IMonoAPIResponse<MonoAccountDetailsResponse>;
export type IMonoUnlinkAccountResponse = IMonoAPIResponse<undefined>;

interface MonoAccountList {
    id: string;
    name: string;
    account_number: string;
    currency: string;
    balance: number;
    auth_method: string;
    status: string;
    bvn: string;
    type: string;
    institution: Required<MonoBankInstitution>;
    customer: MonoCustomer;
}

interface MonoCustomer {
    id: string;
    name: string;
}

export type IMonoAccountListResponse = IMonoAPIResponse<MonoAccountList[]>;

interface MonoAccountStatement {
    count: number;
    requested_length: any;
    available_length: number;
    statement: MonoStatement[];
}

interface MonoStatement {
    id: string;
    type: string;
    amount: number;
    balance: any;
    date: string;
    narration: string;
    currency: string;
}

export type IMonoAccountStatementResponse =
    IMonoAPIResponse<MonoAccountStatement>;
export type IMonoAccountPDFStatementResponse = IMonoAPIResponse<{
    id: string;
    status: string;
    path: string;
}>;

export type GetAccountStatementReturnType<Output extends "pdf" | "json"> =
    Output extends "pdf"
    ? IMonoAccountPDFStatementResponse
    : IMonoAccountStatementResponse;

export interface MonoPaginationMeta {
    total: number;
    page: number;
    previous: any;
    next: string;
}

export type IMonoAccountTransactionsResponse = Required<
    IMonoAPIResponse<
        {
            id: string;
            narration: string;
            amount: number;
            type: string;
            balance: number;
            date: string;
            category: string;
        },
        { meta: MonoPaginationMeta }
    >
>;
