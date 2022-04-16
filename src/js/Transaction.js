import { stringToBig } from '@/helper';
import { txChainTypeMap } from '@/known_blockchains';
function getOutput(output) {
    return {
        ...output,
        timestamp: new Date(output.timestamp),
        amount: stringToBig(output.amount),
    };
}
export function getTransactionChainType(chainID) {
    return txChainTypeMap.get(chainID);
}
export function getTransactionOutputs(outputs) {
    return outputs.map((output) => {
        const chainType = getTransactionChainType(output.chainID);
        // switch for addresses (bech32) or caddresses (hex)
        const addresses = output.addresses !== null ? output.addresses : output.caddresses;
        const prefix = output.addresses !== null ? `${chainType?.code}-` : ``;
        return {
            ...output,
            addresses: addresses.map((address) => ({
                address,
                displayAddress: `${prefix}${address}`,
            })),
        };
    });
}
export function getTransactionInputs(inputs) {
    return inputs.map((input) => ({
        credentials: input.credentials,
        output: getTransactionOutputs([input.output])[0],
    }));
}
export class Transaction {
    constructor(data) {
        this.id = data.id;
        this.chainID = data.chainID;
        this.type = data.type;
        this.inputs =
            data.inputs === null || data.inputs.length === 0
                ? []
                : data.inputs.map((input) => {
                    return {
                        credentials: input.credentials,
                        output: getOutput(input.output),
                    };
                });
        this.outputs =
            data.outputs === null || data.outputs.length === 0
                ? []
                : data.outputs
                    .map((output) => getOutput(output))
                    .sort((a, b) => a.outputIndex - b.outputIndex);
        this.memo = data.memo;
        this.inputTotals = data.inputTotals;
        this.outputTotals = data.outputTotals;
        this.reusedAddressTotals = data.reusedAddressTotals;
        this.timestamp = data.timestamp;
        this.txFee = data.txFee;
        this.genesis = data.genesis;
        this.rewarded = data.rewarded;
        this.rewardedTime = data.rewardedTime;
        this.epoch = data.epoch;
        this.vertexId = data.vertexId;
        this.validatorNodeID = data.validatorNodeID;
        this.validatorStart = data.validatorStart;
        this.validatorEnd = data.validatorEnd;
        this.txBlockId = data.txBlockId;
    }
    getInputAddresses() {
        const res = [];
        const inputs = this.inputs || [];
        inputs.forEach((input) => {
            res.push(...input.output.addresses);
        });
        return res;
    }
}
//# sourceMappingURL=Transaction.js.map