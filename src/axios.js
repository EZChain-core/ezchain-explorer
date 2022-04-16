import axios from 'axios';
const DEFAULT_NETWORK_ID = parseInt(process.env.VUE_APP_DEFAULT_NETWORKID || '4');
const ORTELIUS_URL = DEFAULT_NETWORK_ID === 1
    ? process.env.VUE_APP_ORTELIUS_URL
    : process.env.VUE_APP_TEST_ORTELIUS_URL;
export default axios.create({
    baseURL: ORTELIUS_URL,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
    },
});
//# sourceMappingURL=axios.js.map