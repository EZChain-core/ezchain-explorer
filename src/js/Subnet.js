import avalanche_go_api from '@/avalanche_go_api';
import { AVALANCHE_SUBNET_ID } from '@/store/modules/platform/platform';
import axios from 'axios';
export default class Subnet {
    constructor(data) {
        this.id = data.id;
        this.controlKeys = data.controlKeys;
        this.threshold = parseInt(data.threshold);
        this.blockchains = [];
        this.validators = [];
        this.pendingValidators = [];
        this.delegators = [];
        this.pendingDelegators = [];
    }
    // TODO: get address details for Platform Keys (https://docs.avax.network/v1.0/en/api/platform/#platformgetaccount)
    async updateValidators(endpoint) {
        /* ==========================================
            GET DATA FROM SERVICE
           ========================================== */
        const req = {
            jsonrpc: '2.0',
            method: endpoint,
            params: {
                subnetID: this.id,
            },
            id: 1,
        };
        const response = await avalanche_go_api.post('', req);
        // console.log(`------------- ${this.id.substring(0,4)} ------------ ${endpoint}`);
        // console.log("result:                        ", response.data.result);
        /* ==========================================
            CURRENT VALIDATORS
           ========================================== */
        if (endpoint === 'platform.getCurrentValidators') {
            const validatorsData = response.data.result
                .validators;
            let validators = [];
            let delegators = [];
            if (validatorsData.length > 0) {
                // All Subnets
                const newDataNodeId = [];
                validatorsData.forEach((el) => {
                    newDataNodeId.push(el.nodeID);
                });
                const nodeIDs = newDataNodeId.toLocaleString();
                // const a = await getNameValidator(nodeIDs)
                // console.log('a', a)
                const dataNameNodeId = await axios.get(`https://api.ezchain.com/v1/service/validators?node_ids=${nodeIDs}`);
                if (dataNameNodeId.data.data) {
                    for (let i = 0; i < validatorsData.length; i++) {
                        const validator = validatorsData[i];
                        dataNameNodeId.data.data.forEach((els) => {
                            if (els.node_id === validator.nodeID) {
                                validator.name = els.name;
                                validator.logoUrl = els.logo_url;
                            }
                        });
                    }
                }
                console.log(validatorsData);
                validators = this.setValidators(validatorsData);
                validators = this.sortByStake(validators, this.id);
                // Primary Network Only
                if (this.id === AVALANCHE_SUBNET_ID) {
                    validators.forEach((v) => {
                        if (v.delegators !== null) {
                            v.delegators?.forEach((d) => delegators.push(d));
                        }
                    });
                }
                delegators = this.sortDelegators(delegators);
            }
            this.validators = validators;
            this.delegators = delegators;
        }
        else if (endpoint === 'platform.getPendingValidators') {
            /* ==========================================
            PENDING VALIDATORS
           ========================================== */
            const pendingValidatorsData = response.data.result
                .validators;
            let pendingValidators = [];
            let pendingDelegators = [];
            // All Subnets
            if (pendingValidatorsData.length > 0) {
                pendingValidators = this.setPendingValidators(pendingValidatorsData);
            }
            // Primary Network Only
            if (this.id === AVALANCHE_SUBNET_ID) {
                const pendingDelegatorsData = response.data.result
                    .delegators;
                if (pendingDelegatorsData.length > 0) {
                    pendingDelegators = this.setPendingDelegators(pendingDelegatorsData);
                }
            }
            this.pendingValidators = pendingValidators;
            this.pendingDelegators = pendingDelegators;
        }
    }
    addBlockchain(data) {
        this.blockchains.push(data);
    }
    /**
     * Convert API data to validators
     */
    setValidators(validatorsData) {
        const validators = validatorsData.map((v) => {
            const validator = {
                nodeID: v.nodeID,
                name: v.name,
                logoUrl: v.logoUrl,
                startTime: new Date(parseInt(v.startTime) * 1000),
                endTime: new Date(parseInt(v.endTime) * 1000),
            };
            // Primary Network
            if ({}.hasOwnProperty.call(v, 'stakeAmount')) {
                validator.rewardOwner = {
                    locktime: parseInt(v.rewardOwner.locktime),
                    threshold: parseInt(v.rewardOwner.threshold),
                    addresses: v.rewardOwner.addresses,
                };
                validator.potentialReward = parseInt(v.potentialReward);
                validator.stakeAmount = parseInt(v.stakeAmount);
                validator.uptime = parseFloat(v.uptime) * 100; // percentage
                validator.connected = v.connected;
                validator.delegationFee = parseInt(v.delegationFee);
                validator.delegators = this.setDelegators(v.delegators);
                validator.totalStakeAmount = this.calculateTotalStakeAmount(validator.delegators, validator.stakeAmount);
                validator.elapsed = this.getElapsedStakingPeriod(validator);
            }
            // Subnets
            if ({}.hasOwnProperty.call(v, 'weight')) {
                validator.weight = parseInt(v.weight);
            }
            return validator;
        });
        return validators;
    }
    /**
     * Convert API data to delegators
     */
    setDelegators(delegatorsData) {
        let delegators = null;
        if (delegatorsData) {
            delegators = delegatorsData.map((d) => {
                const delegator = {
                    nodeID: d.nodeID,
                    startTime: new Date(parseInt(d.startTime) * 1000),
                    endTime: new Date(parseInt(d.endTime) * 1000),
                    rewardOwner: {
                        locktime: parseInt(d.rewardOwner.locktime),
                        threshold: parseInt(d.rewardOwner.threshold),
                        addresses: d.rewardOwner.addresses,
                    },
                    potentialReward: parseInt(d.potentialReward),
                    stakeAmount: parseInt(d.stakeAmount),
                };
                return delegator;
            });
        }
        return delegators;
    }
    /**
     * Convert API data to pending validators
     */
    setPendingValidators(pendingValidatorsData) {
        const pendingValidators = pendingValidatorsData.map((pv) => {
            const pendingValidator = {
                nodeID: pv.nodeID,
                startTime: new Date(parseInt(pv.startTime) * 1000),
                endTime: new Date(parseInt(pv.endTime) * 1000),
                stakeAmount: parseInt(pv.stakeAmount),
                delegators: null,
            };
            // Pending Validators - set optional props
            if ({}.hasOwnProperty.call(pv, 'connected')) {
                pendingValidator.connected = pv.connected;
                pendingValidator.delegationFee = parseInt(pv.delegationFee);
            }
            return pendingValidator;
        });
        return pendingValidators;
    }
    /**
     * Convert API data to pending delegators
     */
    setPendingDelegators(pendingDelegatorsData) {
        let pendingDelegators = [];
        if (pendingDelegatorsData) {
            pendingDelegators = pendingDelegatorsData.map((pd) => {
                const pendingDelegator = {
                    nodeID: pd.nodeID,
                    startTime: new Date(parseInt(pd.startTime) * 1000),
                    endTime: new Date(parseInt(pd.endTime) * 1000),
                    stakeAmount: parseInt(pd.stakeAmount),
                };
                return pendingDelegator;
            });
        }
        return pendingDelegators;
    }
    /**
     *  validated + delegated stake
     */
    calculateTotalStakeAmount(delegators, stakeAmount) {
        let totalStakeAmount = stakeAmount;
        if (delegators) {
            let delegatedStakeAmount = 0;
            delegators.forEach((d) => (delegatedStakeAmount += d.stakeAmount));
            totalStakeAmount += delegatedStakeAmount;
        }
        return totalStakeAmount;
    }
    /**
     *  Sort by stake or weight and add rank
     */
    sortByStake(validators, id) {
        id === AVALANCHE_SUBNET_ID
            ? validators.sort((a, b) => b.totalStakeAmount -
                a.totalStakeAmount)
            : validators.sort((a, b) => b.weight - a.weight);
        validators.forEach((v, i) => (v.rank = i + 1));
        return validators;
    }
    /**
     *  Sort by stake
     */
    sortDelegators(delegators) {
        return delegators.length > 0
            ? delegators.sort((a, b) => b.stakeAmount - a.stakeAmount)
            : [];
    }
    /**
     *  Elapsed staking period (%)
     */
    getElapsedStakingPeriod(validator) {
        const currentTime = new Date().getTime();
        const numerator = currentTime - validator.startTime.getTime();
        const denominator = validator.endTime.getTime() - validator.startTime.getTime();
        return Math.round((numerator / denominator) * 100);
    }
}
//# sourceMappingURL=Subnet.js.map