import store from '@/store';
import { BLOCK_NAMESPACE } from './blocks.constants';
export var BLOCKACTION;
(function (BLOCKACTION) {
    BLOCKACTION["GET_EVM_BLOCK"] = "getEVMBlock";
})(BLOCKACTION || (BLOCKACTION = {}));
export function dispatchGetEVMBlock() {
    return store.dispatch(`${BLOCK_NAMESPACE}/${BLOCKACTION.GET_EVM_BLOCK}`);
}
//# sourceMappingURL=blocks.dispatchers.js.map