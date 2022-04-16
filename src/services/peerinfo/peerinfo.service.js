import { DEFAULT_NETWORK_ID, peerInfoURL, peerInfoURL_test, } from '@/store/modules/network/network';
import { toAVAX } from '@/helper';
import { getTotalStake } from './peerinfo';
const PEER_INFO_URL = DEFAULT_NETWORK_ID === 1 ? peerInfoURL : peerInfoURL_test;
function removePrefix(s) {
    return s.includes('ezcgo/') ? s.split('ezcgo/')[1] : s;
}
/**
 * get a list of peers, ordered by latest version
 */
export async function getPeerInfo() {
    const res = await fetch(PEER_INFO_URL, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((data) => data.stakeInfo);
    const totalStake = getTotalStake(res);
    const peerInfo = res
        .sort((a, b) => a.version.localeCompare(b.version, undefined, { numeric: true }))
        .reverse()
        .map((peer) => {
        return {
            version: removePrefix(peer.version),
            nodeCount: peer.nodeCount,
            stakeAmount: toAVAX(peer.stakeAmount),
            stakePercent: parseFloat(((peer.stakeAmount / totalStake) * 100).toFixed(2)),
        };
    });
    // move 'offline' nodes to end of array
    const offline = peerInfo.shift();
    peerInfo.push(offline);
    return peerInfo;
}
//# sourceMappingURL=peerinfo.service.js.map