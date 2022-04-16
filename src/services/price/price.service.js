import api from '@/price';
import { resolveResponseData } from '@/services/helpers';
import qs from 'qs';
const PRICE_API_URL = process.env.VUE_APP_PRICE_API_URL;
export function getPrices(params) {
    return api
        .get(`${PRICE_API_URL}`, {
        params,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma', encode: false }),
    })
        .then(resolveResponseData);
}
//# sourceMappingURL=price.service.js.map