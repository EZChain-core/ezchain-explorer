import { getTransaction } from '@/services/transactions';
import { getEVMTransaction, } from '@/services/evmtransactions';
import { Transaction } from '@/js/Transaction';
import { parseTxs } from './helpers';
import { getEVMBlock } from '@/services/evmblocks';
import { parseEVMTxs } from './helpers/parseEVMTxs';
const defaultState = {
    tx: null,
    txRes: {
        startTime: '',
        endTime: '',
        next: '',
        transactions: [],
    },
    recentTxRes: {
        startTime: '',
        endTime: '',
        next: '',
        transactions: [],
    },
    assetTxRes: {
        startTime: '',
        endTime: '',
        next: '',
        transactions: [],
    },
    addressTxRes: {
        startTime: '',
        endTime: '',
        next: '',
        transactions: [],
    },
    blockchainTxRes: {
        startTime: '',
        endTime: '',
        next: '',
        transactions: [],
    },
    evmTx: null,
};
const transactions_module = {
    namespaced: true,
    modules: {},
    state: defaultState,
    mutations: {
        addTx(state, tx) {
            state.tx = tx;
        },
        addTxs(state, txRes) {
            state.txRes = txRes;
        },
        addRecentTxs(state, txRes) {
            state.recentTxRes = txRes;
        },
        addAssetTxs(state, txRes) {
            state.assetTxRes = txRes;
        },
        addAddressTxs(state, txRes) {
            state.addressTxRes = txRes;
        },
        addBlockchainTxs(state, txRes) {
            state.blockchainTxRes = txRes;
        },
        addEVMTx(state, evmTx) {
            state.evmTx = evmTx;
        },
    },
    actions: {
        async getTx(store, payload) {
            const txRes = await getTransaction(payload.id);
            if (txRes)
                store.commit('addTx', new Transaction(txRes));
        },
        async getTxs(store, payload) {
            const txRes = await getTransaction(payload.id, payload.params);
            store.commit('addTxs', parseTxs(txRes));
        },
        async getRecentTxs(store, payload) {
            const txRes = await getTransaction(payload.id, payload.params);
            store.commit('addRecentTxs', parseTxs(txRes));
        },
        async getTxsByAddress(store, payload) {
            const txRes = await getTransaction(payload.id, payload.params);
            store.commit('addAddressTxs', parseTxs(txRes));
        },
        async getTxsByAsset(store, payload) {
            const txRes = await getTransaction(payload.id, payload.params);
            store.commit('addAssetTxs', parseTxs(txRes));
        },
        async getTxsByBlockchain(store, payload) {
            const txRes = await getTransaction(payload.id, payload.params);
            store.commit('addBlockchainTxs', parseTxs(txRes));
        },
        async getNFTPayloads(store, payload) {
            // get the asset creation tx
            const txRes = await getTransaction(payload.id);
            // find the NFT Minting Right UTXO
            const NFTMintUTXO = txRes.outputs.find((utxo) => utxo.outputType === 10);
            // the redeemedTx of the NFT Minting Right UTXO has the payloads
            const txResNFT = await getTransaction(NFTMintUTXO?.redeemingTransactionID);
            // get a list of payload tuples [payload, groupID]
            // remove empty strings and duplicates
            const payloads = txResNFT.outputs
                .map((utxo) => [utxo.payload, utxo.groupID])
                .filter((payload) => {
                if (payload[0])
                    return payload[0].length !== 0;
            })
                .filter((value, index, self) => self.indexOf(value) === index);
            return payloads;
        },
        async getEVMTx(store, params) {
            const txRes = await getEVMTransaction(params);
            const tx = txRes.Transactions[0];
            if (tx) {
                const blockRes = await getEVMBlock(tx.block);
                const parsedTx = parseEVMTxs(tx, blockRes);
                store.commit('addEVMTx', parsedTx);
            }
        },
    },
};
export default transactions_module;
//# sourceMappingURL=transactions.js.map