import Vue from 'vue';
import Vuex from 'vuex';
import { Asset } from '@/js/Asset';
import AddressDict from '@/known_addresses';
import Platform from './modules/platform/platform';
import Address from './modules/address/address';
import Network from './modules/network/network';
import Notifications from './modules/notifications/notifications';
import Transactions from './modules/transactions/transactions';
import Blocks from './modules/blocks/blocks';
import { avm } from '@/avalanche';
import { getTransaction } from '@/services/transactions';
import { getAssetAggregates } from '@/services/aggregates';
import { parseTxs } from './modules/transactions/helpers';
import { X } from '@/known_blockchains';
import { getCacheAssets } from '@/services/assets';
import { getPrices } from '@/services/price';
import { AVAX_PRICE_ID, VS_CURRENCIES } from '@/known_prices';
import { getABI } from '@/services/abi/abi.service';
//@ts-ignore
import abiDecoder from 'abi-decoder';
Vue.use(Vuex);
const store = new Vuex.Store({
    modules: {
        Platform,
        Address,
        Notifications,
        Network,
        Transactions,
        Blocks,
    },
    state: {
        assets: {},
        assetsLoaded: false,
        assetAggregatesLoaded: false,
        known_addresses: AddressDict,
        chainId: 'X',
        recentTxRes: {},
        assetsSubsetForAggregations: {},
        // this is a bandaid until the API precomputes aggregate data for assets
        // it holds a subset of the assets and checks if they have aggregation data
        // temporarily responsible for triggering assetAggregatesLoaded
        collisionMap: {},
        pricesLoaded: false,
        prices: null,
        abisLoaded: false,
        abis: null,
        abiDecoder: null,
    },
    actions: {
        async init(store) {
            // Get and set initial list of all indexed assets
            await store.dispatch('getAssets');
            store.dispatch('getPrice');
            store.dispatch('getABI');
            // Once we have assets, next get recent transactions
            store.dispatch('getRecentTransactions', {
                id: null,
                params: {
                    sort: 'timestamp-desc',
                    limit: 10,
                },
            });
            // Then get asset aggregation data
            store.dispatch('getAssetAggregates');
            // Uniqueify Symbols
            const collisionMap = await store.dispatch('getCollisionMap');
            store.commit('addCollisionMap', collisionMap);
        },
        /**
         * Get and set initial list of all indexed assets
         */
        async getAssets(store) {
            const assetsData = await getCacheAssets();
            assetsData.forEach((assetData) => {
                store.commit('addAsset', new Asset(assetData, false));
            });
            store.commit('finishLoading');
        },
        async getAssetAggregates(store) {
            const assetAggregates = await getAssetAggregates();
            assetAggregates.forEach((agg) => {
                // only request aggregates for assets that are in the Ortelius assets map
                if (store.state.assets[agg.asset]) {
                    store.commit('updateAssetWithAggregationData', agg);
                }
            });
            store.commit('finishAggregatesLoading');
        },
        async getRecentTransactions(store, payload) {
            const txRes = await getTransaction(payload.id, payload.params);
            store.commit('addRecentTransactions', parseTxs(txRes));
        },
        // Adds an unknown asset id to the assets dictionary
        async addUnknownAsset({ commit }, assetId) {
            const desc = await avm.getAssetDescription(assetId);
            const newAssetData = {
                alias: '',
                chainID: X.id,
                currentSupply: '0',
                denomination: desc.denomination,
                id: assetId,
                name: desc.name,
                symbol: desc.symbol,
                timestamp: '',
                variableCap: 0,
                nft: 0,
                aggregates: null,
            };
            commit('addAsset', new Asset(newAssetData, true));
        },
        getCollisionMap({ state }) {
            const map = {};
            const assets = state.assets;
            for (const asset in assets) {
                const symbol = assets[asset].symbol;
                const id = assets[asset].id;
                if (map[symbol]) {
                    map[symbol].push(id);
                }
                else {
                    map[symbol] = [id];
                }
            }
            return map;
        },
        async getPrice({ commit }) {
            const price = await getPrices({
                ids: [AVAX_PRICE_ID],
                vs_currencies: [VS_CURRENCIES],
            });
            commit('addPrices', price[AVAX_PRICE_ID]);
            commit('finishPricesLoading');
        },
        async getABI({ commit }) {
            const ERC20 = await getABI('erc20');
            const ERC721 = await getABI('erc721');
            const ERC20Events = ERC20.filter((i) => i.type === 'event');
            abiDecoder.addABI(ERC20Events);
            // TODO: Deal with collisions due to canonical sigs
            // const ERC721Events = ERC721.filter((i: any) => i.type === 'event')
            // abiDecoder.addABI(ERC721Events)
            const ABIS = {
                erc20: ERC20,
                erc721: ERC721,
            };
            commit('addABIs', ABIS);
            commit('addABIDecoder', abiDecoder);
            commit('finishABIsLoading');
        },
    },
    mutations: {
        finishLoading(state) {
            state.assetsLoaded = true;
        },
        // ASSETS
        addAsset(state, asset) {
            Vue.set(state.assets, asset.id, asset);
        },
        addAssetToSubsetForAggregation(state, assetID) {
            Vue.set(state.assetsSubsetForAggregations, assetID, false);
        },
        updateAssetInSubsetForAggregation(state, assetID) {
            Vue.set(state.assetsSubsetForAggregations, assetID, true);
        },
        updateAssetWithAggregationData(state, agg) {
            //@ts-ignore
            state.assets[agg.asset].updateAggregates(agg.aggregate.aggregates);
        },
        finishAggregatesLoading(state) {
            state.assetAggregatesLoaded = true;
        },
        // TRANSACTIONS
        addRecentTransactions(state, txRes) {
            state.recentTxRes = txRes;
        },
        addCollisionMap(state, collisionMap) {
            state.collisionMap = collisionMap;
        },
        addPrices(state, prices) {
            state.prices = prices;
        },
        finishPricesLoading(state) {
            state.pricesLoaded = true;
        },
        addABIs(state, abis) {
            state.abis = abis;
        },
        finishABIsLoading(state) {
            state.abisLoaded = true;
        },
        addABIDecoder(state, abiDecoder) {
            state.abiDecoder = abiDecoder;
        },
    },
    getters: {
        assetsArray(state) {
            const res = [];
            for (const i in state.assets) {
                res.push(state.assets[i]);
            }
            res.sort((a, b) => {
                const diff = b.volume_day.minus(a.volume_day);
                if (diff.gt(0))
                    return -1;
                else if (diff.lt(0))
                    return 1;
                else
                    return 0;
            });
            return res;
        },
        assetsArrayNonProfane(state, getters) {
            return getters.assetsArray.filter((val) => {
                return !val.profane;
            });
        },
        assetsArrayProfane(state, getters) {
            return getters.assetsArray.filter((val) => {
                return val.profane;
            });
        },
        // TODO: remove when API implements precomputed aggregates
        assetsSubsetForAggregationArray(state) {
            const res = [];
            for (const i in state.assetsSubsetForAggregations) {
                res.push(state.assetsSubsetForAggregations[i]);
            }
            return res;
        },
        // TODO: disable-count
        totalTransactions(state) {
            let totalTransactions = 0;
            for (const asset in state.assets) {
                totalTransactions += state.assets[asset].txCount_day;
            }
            return totalTransactions;
        },
    },
});
export default store;
//# sourceMappingURL=index.js.map