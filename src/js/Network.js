let network_id = 0;
export default class Network {
    constructor(name, url, networkId, chainId, explorerUrl, explorerFEUrl) {
        this.protocol = 'http';
        this.ip = 'localhost';
        this.port = 9650;
        this.id = network_id++;
        this.name = name;
        this.networkId = networkId;
        this.chainId = chainId;
        this.url = url;
        this.updateURL(url);
        this.explorerUrl = explorerUrl;
        this.explorerFEUrl = explorerFEUrl || '';
    }
    updateURL(url) {
        // parse the url
        const split = url.split('://');
        // parse protocol
        this.protocol = split[0];
        // parse port
        if (split[1].includes(':')) {
            // if the URL contains a port setting
            const urlSplit = split[1].split(':');
            const ip = urlSplit[0];
            const port = urlSplit[1];
            this.ip = ip;
            this.port = parseInt(port);
        }
        else {
            this.ip = split[1];
            if (this.protocol === 'http') {
                this.port = 80;
            }
            else {
                this.port = 443;
            }
        }
    }
    getFullURL() {
        return `${this.protocol}://${this.ip}:${this.port}`;
    }
}
//# sourceMappingURL=Network.js.map