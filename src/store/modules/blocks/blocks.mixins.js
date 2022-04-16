import { __decorate } from "tslib";
import { Vue, Component } from 'vue-property-decorator';
import { getEVMBlock } from './blocks.getters';
let BlocksGettersMixin = class BlocksGettersMixin extends Vue {
    getEVMBlock() {
        return getEVMBlock();
    }
};
BlocksGettersMixin = __decorate([
    Component
], BlocksGettersMixin);
export { BlocksGettersMixin };
//# sourceMappingURL=blocks.mixins.js.map