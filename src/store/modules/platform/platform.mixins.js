import { __decorate } from "tslib";
import { Vue, Component } from 'vue-property-decorator';
import { getTotalValidators, getTotalPendingValidators, getTotalStake, getTotalPendingStake, getCumulativeStake, getCumulativePendingStake, getTotalBlockchains, getStakingRatio, } from './platform.getters';
let PlatformGettersMixin = class PlatformGettersMixin extends Vue {
    getTotalValidators() {
        return getTotalValidators();
    }
    getTotalPendingValidators() {
        return getTotalPendingValidators();
    }
    getTotalStake() {
        return getTotalStake();
    }
    getTotalPendingStake() {
        return getTotalPendingStake();
    }
    getCumulativeStake() {
        return getCumulativeStake();
    }
    getCumulativePendingStake() {
        return getCumulativePendingStake();
    }
    getTotalBlockchains() {
        return getTotalBlockchains();
    }
    getStakingRatio() {
        return getStakingRatio();
    }
};
PlatformGettersMixin = __decorate([
    Component
], PlatformGettersMixin);
export { PlatformGettersMixin };
//# sourceMappingURL=platform.mixins.js.map