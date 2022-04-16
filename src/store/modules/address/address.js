import Vue from 'vue';
import api from '@/axios';
const address_module = {
    namespaced: true,
    state: {
        addresses: {},
        addressesList: [],
        addressesLoaded: false,
    },
    mutations: {
        addAddress(state, address) {
            Vue.set(state.addresses, address.id, address);
        },
        finishLoading(state) {
            state.addressesLoaded = true;
        },
    },
    actions: {
        init({ dispatch }) {
            dispatch('getAddresses');
        },
        async getAddresses({ state, commit }) {
            // TODO: support service for multiple chains
            await api.get('/x/addresses').then((res) => {
                const addresses = res.data.addresses;
                addresses.forEach((addressData) => {
                    commit('addAddress', addressData);
                });
            });
            state.addressesLoaded = true;
        },
    },
    getters: {
    // addressesArray(state: IAddressState): IAddress[] {
    //     let res: IAddress[] = [];
    //     for (let i in state.addresses) {
    //         res.push(state.addresses[i]);
    //     }
    //     return res;
    // },
    },
};
export default address_module;
//# sourceMappingURL=address.js.map