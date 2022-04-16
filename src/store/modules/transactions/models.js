export var OutputType;
(function (OutputType) {
    OutputType["TRANSFERABLE"] = "";
    OutputType["NFT_TRANSFERABLE"] = "NFT";
    OutputType["MINT"] = "Mint";
    OutputType["NFT_MINT"] = "NFT Minting Rights";
    OutputType["ATOMIC_EXPORT_TX"] = "Atomic Export";
    OutputType["ATOMIC_IMPORT_TX"] = "Atomic Import";
})(OutputType || (OutputType = {}));
export var BlockType;
(function (BlockType) {
    BlockType["PROPOSAL"] = "Proposal";
    BlockType["ABORT"] = "Abort";
    BlockType["COMMIT"] = "Commit";
    BlockType["STANDARD"] = "Standard";
    BlockType["ATOMIC"] = "Atomic";
})(BlockType || (BlockType = {}));
//# sourceMappingURL=models.js.map