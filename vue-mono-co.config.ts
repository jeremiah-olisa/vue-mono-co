import { IMonoConfig } from "./types";

const config: IMonoConfig = { MONO_CO_PK: null, MONO_CO_SK: null }

/**
 * The function `setMonoConfig` sets the MONO_CO_PK and MONO_CO_SK values in the config object based on
 * the input parameter.
 * @param {IMonoConfig} param - IMonoConfig
 */
export const setMonoConfig = (param: IMonoConfig) => {
    config.MONO_CO_PK = param.MONO_CO_PK;
    config.MONO_CO_SK = param.MONO_CO_SK;
}

/**
 * The function `getMonoConfig` returns the configuration object `config`.
 * @returns The `getMonoConfig` function is returning the `config` object.
 */
export const getMonoConfig = () => {
    return config;
}