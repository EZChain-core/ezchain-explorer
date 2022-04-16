import store from '@/store';
import { TX_NAMESPACE } from './transactions.constants';
export var TXACTION;
(function (TXACTION) {
    TXACTION["GET_TX"] = "getTx";
    TXACTION["GET_TXS"] = "getTxs";
    TXACTION["GET_TX_RECENT"] = "getRecentTxs";
    TXACTION["GET_TXS_BY_ASSET"] = "getTxsByAsset";
    TXACTION["GET_TXS_BY_ADDRESS"] = "getTxsByAddress";
    TXACTION["GET_EVM_TX"] = "getEVMTx";
})(TXACTION || (TXACTION = {}));
export function dispatchGetTx() {
    return store.dispatch(`${TX_NAMESPACE}/${TXACTION.GET_TX}`);
}
export function dispatchGetTxs() {
    return store.dispatch(`${TX_NAMESPACE}/${TXACTION.GET_TXS}`);
}
export function dispatchGetRecentTxs() {
    return store.dispatch(`${TX_NAMESPACE}/${TXACTION.GET_TX_RECENT}`);
}
export function dispatchGetTxsByAsset() {
    return store.dispatch(`${TX_NAMESPACE}/${TXACTION.GET_TXS_BY_ASSET}`);
}
export function dispatchGetTxsByAddress() {
    return store.dispatch(`${TX_NAMESPACE}/${TXACTION.GET_TXS_BY_ADDRESS}`);
}
export function dispatchGetEVMTx() {
    return store.dispatch(`${TX_NAMESPACE}/${TXACTION.GET_EVM_TX}`);
}
//# sourceMappingURL=transactions.dispatchers.js.map