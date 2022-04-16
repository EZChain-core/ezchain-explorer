import { txTypeMap } from '@/store/modules/transactions/maps';
const DEFAULT_NETWORK_ID = parseInt(process.env.VUE_APP_DEFAULT_NETWORKID || '4');
export function isMainnetNetwork() {
    return DEFAULT_NETWORK_ID === 1;
}
export const P = {
    id: (isMainnetNetwork()
        ? process.env.VUE_APP_PCHAINID
        : process.env.VUE_APP_TEST_PCHAINID),
    name: 'P-Chain',
    fullname: 'Platform',
    code: 'P',
    color: '#F19100',
    darkColor: '#FFF8EE',
    txTypes: [
        ['add_validator', txTypeMap.get('add_validator')],
        ['add_subnet_validator', txTypeMap.get('add_subnet_validator')],
        ['add_delegator', txTypeMap.get('add_delegator')],
        ['create_subnet', txTypeMap.get('create_subnet')],
        ['create_chain', txTypeMap.get('create_chain')],
        ['pvm_export', txTypeMap.get('pvm_export')],
        ['pvm_import', txTypeMap.get('pvm_import')],
    ],
};
export const X = {
    id: (isMainnetNetwork()
        ? process.env.VUE_APP_XCHAINID
        : process.env.VUE_APP_TEST_XCHAINID),
    name: 'X-Chain',
    fullname: 'Exchange',
    code: 'X',
    color: '#005FED',
    darkColor: '#EFF7FF',
    txTypes: [
        ['base', txTypeMap.get('base')],
        ['create_asset', txTypeMap.get('create_asset')],
        ['operation', txTypeMap.get('operation')],
        ['import', txTypeMap.get('import')],
        ['export', txTypeMap.get('export')],
    ],
};
export const C = {
    id: (isMainnetNetwork()
        ? process.env.VUE_APP_CCHAINID
        : process.env.VUE_APP_TEST_CCHAINID),
    name: 'C-Chain',
    fullname: 'Contract',
    code: 'C',
    color: '#088223',
    darkColor: '#F6FFF6',
    txTypes: [
        ['atomic_import_tx', txTypeMap.get('atomic_import_tx')],
        ['atomic_export_tx', txTypeMap.get('atomic_export_tx')],
    ],
};
const dict = {};
dict[P.id] = P;
dict[X.id] = X;
dict[C.id] = C;
export default dict;
export const txChainTypeMap = new Map([
    [C.id, C],
    [P.id, P],
    [X.id, X],
]);
export function getTxChainType(type) {
    return txChainTypeMap.get(type);
}
//# sourceMappingURL=known_blockchains.js.map