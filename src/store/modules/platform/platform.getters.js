import store from '@/store';
import { AVALANCHE_SUBNET_ID } from './platform';
import Big from 'big.js';
import { ONEAVAX } from 'avalanche/dist/utils';
import { bigToDenomBig } from '@/helper';
/**
 * @returns Count of active validators in Primary Network
 */
export function getTotalValidators() {
    const defaultSubnet = store.state.Platform.subnets[AVALANCHE_SUBNET_ID];
    return !defaultSubnet ? 0 : defaultSubnet.validators.length;
}
/**
 * @returns Count of pending validators in Primary Network
 */
export function getTotalPendingValidators() {
    const defaultSubnet = store.state.Platform.subnets[AVALANCHE_SUBNET_ID];
    return !defaultSubnet ? 0 : defaultSubnet.pendingValidators.length;
}
/**
 * @returns Total $AVAX active stake on Primary Network
 */
export function getTotalStake() {
    const defaultSubnet = store.state.Platform.subnets[AVALANCHE_SUBNET_ID];
    let total = Big(0);
    return !defaultSubnet
        ? total
        : (total = defaultSubnet.validators.reduce((a, v) => a.add(Big(v.totalStakeAmount)), total));
}
/**
 * @returns Total $AVAX pending stake on Primary Network
 */
export function getTotalPendingStake() {
    const defaultSubnet = store.state.Platform.subnets[AVALANCHE_SUBNET_ID];
    let total = Big(0);
    return !defaultSubnet
        ? total
        : (total = defaultSubnet.pendingValidators.reduce((a, v) => a.add(Big(v.stakeAmount)), total));
}
/**
 * @returns Accumulative distribution of active stakes
 */
export function getCumulativeStake() {
    const defaultSubnet = store.state.Platform.subnets[AVALANCHE_SUBNET_ID];
    const res = [];
    let total = 0;
    if (defaultSubnet) {
        defaultSubnet.validators.forEach((v) => {
            total += v.totalStakeAmount;
            res.push(total);
        });
    }
    return res;
}
/**
 * @returns Accumulative distribution of pending stakes
 */
export function getCumulativePendingStake() {
    const defaultSubnet = store.state.Platform.subnets[AVALANCHE_SUBNET_ID];
    const res = [];
    let total = 0;
    if (defaultSubnet) {
        defaultSubnet.pendingValidators.forEach((v) => {
            total += v.stakeAmount;
            res.push(total);
        });
    }
    return res;
}
/**
 * @returns Count of blockchains across all subnets
 */
export function getTotalBlockchains() {
    let total = 0;
    for (const subnetID of Object.keys(store.state.Platform.subnets)) {
        total += store.state.Platform.subnets[subnetID].blockchains.length;
    }
    return total;
}
/**
 * @returns AVAX Market Cap in USD
 */
export function getMarketCapUSD() {
    const currentSupplyBN = store.state.Platform.currentSupply;
    const currentSupplyBig = Big(currentSupplyBN.div(ONEAVAX).toString());
    // TODO: need to use circulatingSupply as currentSupply is both locked and unlocked AVAX
    if (store.state.prices) {
        const marketCapUSD = currentSupplyBig.times(store.state.prices['usd']);
        return marketCapUSD.toLocaleString(2);
    }
    return '-';
}
export function getStakingRatio() {
    let totalStake = getTotalStake();
    totalStake = bigToDenomBig(totalStake, 9);
    const currentSupply = store.state.Platform.currentSupply
        .div(ONEAVAX)
        .toNumber();
    const percentStaked = totalStake.div(currentSupply).times(100);
    return parseFloat(percentStaked.toFixed(2));
}
//# sourceMappingURL=platform.getters.js.map