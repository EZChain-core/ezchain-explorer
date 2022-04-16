import api from '@/axios';
import { resolveResponseData } from '@/services/helpers';
import qs from 'qs';
const EVM_TRANSACTIONS_API_BASE_URL = process.env
    .VUE_APP_EVM_TRANSACTIONS_V2_API_BASE_URL;
/**
 * Get a list of EVM transactions (C-Chain)
 * @param params api release
 * @link https://docs.avax.network/build/tools/ortelius#list-c-chain-transactions
 */
export function getEVMTransaction(params) {
    return api
        .get(EVM_TRANSACTIONS_API_BASE_URL, {
        params,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    })
        .then(resolveResponseData);
}
//# sourceMappingURL=evmtransactions.service.js.map