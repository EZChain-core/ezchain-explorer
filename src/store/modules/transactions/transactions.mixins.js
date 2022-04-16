import { __decorate } from "tslib";
import { Vue, Component } from 'vue-property-decorator';
import { getTx, getTxs, getRecentTxs, getTxsByAsset, getTxsByAddress, getTxsByBlockchain, getEVMTx, } from './transactions.getters';
let TransactionsGettersMixin = class TransactionsGettersMixin extends Vue {
    getTx() {
        return getTx();
    }
    getTxs() {
        return getTxs();
    }
    getRecentTxs() {
        return getRecentTxs();
    }
    getTxsByAddress() {
        return getTxsByAddress();
    }
    getTxsByAsset() {
        return getTxsByAsset();
    }
    getTxsByBlockchain() {
        return getTxsByBlockchain();
    }
    getEVMTx() {
        return getEVMTx();
    }
};
TransactionsGettersMixin = __decorate([
    Component
], TransactionsGettersMixin);
export { TransactionsGettersMixin };
//# sourceMappingURL=transactions.mixins.js.map