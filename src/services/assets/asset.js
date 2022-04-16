import { AssetType } from './models';
export function getAssetType(asset) {
    return asset.nft
        ? AssetType.NFT
        : asset.variableCap
            ? AssetType.VARIABLE_CAP
            : AssetType.FIXED_CAP;
}
//# sourceMappingURL=asset.js.map