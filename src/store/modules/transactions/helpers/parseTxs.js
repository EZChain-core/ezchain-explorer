import { Transaction } from '@/js/Transaction';
export function parseTxs(txRes) {
    return {
        ...txRes,
        transactions: txRes.transactions.map((tx) => {
            return new Transaction(tx);
        }),
    };
}
//# sourceMappingURL=parseTxs.js.map