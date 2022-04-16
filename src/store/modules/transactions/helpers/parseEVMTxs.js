import { parseLogs } from '../../blocks/helpers/parseEVMLogs';
import { parseEVMTraces } from './parseEVMTraces';
import { toAVAX } from '@/helper';
export function getLogs(block, transaction) {
    if (!block.logs)
        return [];
    let logs = block.logs.filter((l) => l.transactionHash === transaction.hash);
    logs = parseLogs(logs);
    return logs;
}
export function parseEVMTxs(tx, block) {
    // Parse raw data
    const logs = getLogs(block, tx);
    const traces = tx.traces;
    const tracesGraph = parseEVMTraces(tx.traces, tx.input);
    // Munge tx and block
    const transaction = {
        ...tx,
        // PAYLOAD
        gasPrice: toAVAX(parseInt(tx.gasPrice), 18),
        ...block,
        logs,
        traces,
        tracesGraph,
        transfers: [],
    };
    // console.log('munged tx      ', transaction)
    return transaction;
}
//# sourceMappingURL=parseEVMTxs.js.map