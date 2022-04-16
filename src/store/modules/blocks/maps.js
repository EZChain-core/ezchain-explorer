export const txTypeMap = new Map([
    [
        'base',
        {
            long: 'Base',
            short: '',
        },
    ],
    [
        'create_asset',
        {
            long: 'Create Asset',
            short: 'Mint',
        },
    ],
]);
export function getMappingForType(type) {
    return txTypeMap.get(type).short || '';
}
//# sourceMappingURL=maps.js.map