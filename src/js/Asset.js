import { profanities } from '@/js/Profanities';
import Big from 'big.js';
import { stringToBig } from '@/helper';
import store from '../store';
class Asset {
    constructor(assetData, isUnknown) {
        this.id = assetData.id;
        this.alias = assetData.alias;
        this.chainID = assetData.chainID;
        // TODO: supply is genesis TX only
        this.currentSupply = Big(assetData.currentSupply).div(Math.pow(10, assetData.denomination));
        this.denomination = assetData.denomination;
        this.name = assetData.name;
        this.symbol = assetData.symbol;
        this.timestamp = assetData.timestamp;
        this.variableCap = assetData.variableCap;
        this.nft = assetData.nft;
        this.aggregates = assetData.aggregates;
        // aggregate data
        this.volume_day = Big(0);
        this.txCount_day = 0;
        this.addressCount_day = 0;
        this.outputCount_day = 0;
        this.isHistoryUpdated = false;
        // not in indexer
        this.isUnknown = isUnknown;
        // FE metadata
        this.profane = false;
        this.checkForProfanities(this.name);
        this.checkForProfanities(this.symbol);
    }
    // Daily Volume
    updateAggregates(assetAggregate) {
        if (this.isUnknown === false) {
            this.volume_day = stringToBig(assetAggregate.transactionVolume, this.denomination);
            this.txCount_day = assetAggregate.transactionCount;
            this.addressCount_day = assetAggregate.addressCount;
            this.outputCount_day = assetAggregate.outputCount;
            this.isHistoryUpdated = true;
            store.commit('updateAssetInSubsetForAggregation', this.id);
        }
    }
    checkForProfanities(value) {
        if (this.profane) {
            return;
        }
        this.profane = profanities.screen(value);
    }
}
export { Asset };
//# sourceMappingURL=Asset.js.map