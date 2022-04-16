import { AVAX_ID } from './known_assets';
export const AVAX_PRICE_ID = process.env.VUE_APP_AVAX_PRICE_ID;
export const VS_CURRENCIES = process.env.VUE_APP_VS_CURRENCIES;
const dict = {};
dict[AVAX_ID] = AVAX_PRICE_ID;
export default dict;
//# sourceMappingURL=known_prices.js.map