import api from '@/axios';
import { resolveResponseData } from '@/services/helpers';
const ADDRESS_CHAINS_V2_API_BASE_URL = process.env.VUE_APP_ADDRESS_CHAINS_V2_API_BASE_URL;
export function getAddressChains(id) {
    return api
        .get(`${ADDRESS_CHAINS_V2_API_BASE_URL}?address=${id}`)
        .then(resolveResponseData);
}
//# sourceMappingURL=addressChains.service.js.map