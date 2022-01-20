interface VMDict {
    [key: string]: IVirtualMachine
}

interface IVirtualMachine {
    name: string
    fullName: string
    documentation: string
}

const dict: VMDict = {
    '': {
        name: 'platformvm',
        fullName: 'Platform',
        documentation:
            'https://github.com',
    },
    jvYyfQTxGMJLuGWa55kdP2p2zSUYsQ5Raupu4TW34ZAUBAbtq: {
        name: 'avm',
        fullName: 'EZC',
        documentation:
            'https://github.com',
    },
    mgj786NP7uDwBCcq6YwThhaN8FLyybkCa4zBWTQbNgmK6k9A6: {
        name: 'evm',
        fullName: 'Ethereum',
        documentation:
            'https://github.com',
    },
}

export default dict
