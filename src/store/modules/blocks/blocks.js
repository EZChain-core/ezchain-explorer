import { getEVMBlock } from '@/services/evmblocks';
import { parseEVMBlocks } from './helpers/parseEVMBlocks';
const defaultState = {
    evmBlock: null,
};
const blocks_module = {
    namespaced: true,
    modules: {},
    state: defaultState,
    mutations: {
        addEVMBlock(state, block) {
            state.evmBlock = block;
        },
    },
    actions: {
        async getEVMBlock(store, height) {
            const blockRes = await getEVMBlock(height);
            if (blockRes) {
                const parsedBlock = await parseEVMBlocks(blockRes);
                store.commit('addEVMBlock', parsedBlock);
            }
        },
    },
};
export default blocks_module;
//# sourceMappingURL=blocks.js.map