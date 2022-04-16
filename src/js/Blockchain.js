import { P, X, C } from '@/known_blockchains';
import { profanities } from '@/js/Profanities';
export default class Blockchain {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.subnetID = data.subnetID;
        this.vmID = data.vmID;
        this.addressCount = null;
        this.txCount = null;
        this.burned = null;
        this.indexed = this.updateIndexed();
        this.profane = false;
        this.checkForProfanities(this.name);
    }
    updateIndexed() {
        switch (this.id) {
            case P.id:
                return true;
            case X.id:
                return true;
            case C.id:
                return true;
            default:
                return false;
        }
    }
    checkForProfanities(value) {
        if (this.profane) {
            return;
        }
        this.profane = profanities.screen(value);
    }
    updateAddressCount(value) {
        if (!value)
            return;
        this.addressCount = parseInt(value);
    }
    updateTxCount(value) {
        if (!value)
            return;
        this.txCount = parseInt(value);
    }
    updateBurned(value) {
        if (!value)
            return;
        this.burned = value;
    }
}
//# sourceMappingURL=Blockchain.js.map