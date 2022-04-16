import * as avalancheJS from 'avalanche';
const DEFAULT_NETWORK_ID = parseInt(process.env.VUE_APP_DEFAULT_NETWORKID || '4');
let PROTOCOL = '';
let IP = '';
let PORT = 80;
let NETWORK_ID = 0;
let CHAIN_ID = 'X';
if (DEFAULT_NETWORK_ID === 1) {
    PROTOCOL = process.env.VUE_APP_AVALANCHE_JS_PROTOCOL;
    IP = process.env.VUE_APP_AVALANCHE_JS_IP;
    PORT = parseInt(process.env.VUE_APP_AVALANCHE_JS_PORT);
    NETWORK_ID = parseInt(process.env.VUE_APP_AVALANCHE_JS_NETWORKID);
    CHAIN_ID = process.env.VUE_APP_AVALANCHE_JS_CHAINID;
}
else {
    PROTOCOL = process.env.VUE_APP_TEST_AVALANCHE_JS_PROTOCOL;
    IP = process.env.VUE_APP_TEST_AVALANCHE_JS_IP;
    PORT = parseInt(process.env.VUE_APP_TEST_AVALANCHE_JS_PORT);
    NETWORK_ID = parseInt(process.env.VUE_APP_TEST_AVALANCHE_JS_NETWORKID);
    CHAIN_ID = process.env.VUE_APP_TEST_AVALANCHE_JS_CHAINID;
}
const avalanche = new avalancheJS.Avalanche(IP, PORT, PROTOCOL, NETWORK_ID, CHAIN_ID);
const avm = avalanche.XChain();
const platform = avalanche.PChain();
export { avalanche, avm, platform };
//# sourceMappingURL=avalanche.js.map