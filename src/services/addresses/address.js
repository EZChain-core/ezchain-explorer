import { stringToBig } from '@/helper';
import { AVAX_ID } from '@/known_assets';
import Big from 'big.js';
// set asset metadata for convenience
export function setAssetMetadata(asset, balance) {
    balance.name = asset.name;
    balance.denomination = asset.denomination;
    balance.symbol = asset.symbol;
}
// set balance data (relies on asset metadata)
export function setBalanceData(balanceDatum, denomination, balance) {
    balance.balance = stringToBig(balanceDatum.balance, denomination);
    balance.totalReceived = stringToBig(balanceDatum.totalReceived, denomination);
    balance.totalSent = stringToBig(balanceDatum.totalSent, denomination);
}
export function setUnlockedXP(assets) {
    return assets[AVAX_ID] ? Big(assets[AVAX_ID].balance) : Big(0);
}
export function setUnlockedX(assets) {
    const result = assets.find((asset) => asset.id === AVAX_ID);
    return result ? result.balance : Big(0);
}
export function setUnlockedXC(assets) {
    return assets[AVAX_ID] ? Big(assets[AVAX_ID].balance) : Big(0);
}
//# sourceMappingURL=address.js.map