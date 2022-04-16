const DEFAULT_NETWORK_ID = parseInt(process.env.VUE_APP_DEFAULT_NETWORKID || '4');
export const AVAX_ID = DEFAULT_NETWORK_ID === 1
    ? process.env.VUE_APP_AVAXID
    : process.env.VUE_APP_TEST_AVAXID;
export const BAGUETTE_ID = DEFAULT_NETWORK_ID === 1
    ? 'F4MyJcUvq3Rxbqgd4Zs8sUpvwLHApyrp4yxJXe2bAV86Vvp38'
    : undefined;
const dict = {};
dict[AVAX_ID] = {
    logo: 'img/avax_icon_circle.png',
};
if (BAGUETTE_ID) {
    dict[BAGUETTE_ID] = {
        logo: 'img/baguette_icon_circle.jpg',
    };
}
export default dict;
//# sourceMappingURL=known_assets.js.map