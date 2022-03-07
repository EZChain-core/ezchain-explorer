<template>
    <div class="stats">
        <div class="header">
            <h4 class="meta_title">Staking Stats</h4>
            <p class="subtitle"></p>
        </div>
        <article class="meta">
            <p class="label">
                Validators
                <TooltipMeta
                    content="Total number of nodes validating transactions on EZChain"
                    :color="'#2196f3'"
                />
            </p>
            <div>
                <p v-if="subnetsLoaded" class="meta_val">
                    {{ totalValidatorsCount.toLocaleString() }}
                </p>
                <v-progress-circular
                    v-else
                    key="1"
                    :size="16"
                    :width="2"
                    color="#E84970"
                    indeterminate
                />
            </div>
        </article>
        <article class="meta">
            <p class="label">
                Total Staked
                <TooltipMeta
                    content="Total value of EZC locked to secure EZChain"
                    :color="'#2196f3'"
                />
            </p>
            <div>
                <p v-if="subnetsLoaded" class="meta_val">
                    {{ totalStake }}
                    <span class="unit">EZC</span>
                </p>
                <v-progress-circular
                    v-else
                    key="1"
                    :size="16"
                    :width="2"
                    color="#E84970"
                    indeterminate
                />
            </div>
        </article>
        <article class="meta">
            <p class="label">
                Staking Ratio
                <TooltipMeta
                    content="Percentage of EZC locked to secure EZChain out of total EZC supply"
                    :color="'#2196f3'"
                />
            </p>
            <div>
                <p v-if="subnetsLoaded" class="meta_val">
                    {{ percentStaked }}%
                </p>
                <v-progress-circular
                    v-else
                    key="1"
                    :size="16"
                    :width="2"
                    color="#E84970"
                    indeterminate
                />
            </div>
        </article>
        <article class="meta">
            <p class="label">Annual Staking Reward</p>
            <div>
                <p v-if="subnetsLoaded" class="meta_val">
                    {{ annualStakingRewardPercentage }}
                </p>
                <v-progress-circular
                    v-else
                    key="1"
                    :size="16"
                    :width="2"
                    color="#E84970"
                    indeterminate
                />
            </div>
        </article>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Mixins, Component } from 'vue-property-decorator'
import TooltipMeta from '@/components/Home/TopInfo/TooltipMeta.vue'
import { bigToDenomBig } from '@/helper'
import { PlatformGettersMixin } from '@/store/modules/platform/platform.mixins'
import Big from 'big.js'
import BN from 'bn.js'

const SECONDS_PER_YEAR = 31536000 //31556952

const RAT_1 = new Big(1)
const RAT_0 = new Big(1)
const BIG_2 = new Big(2)
const BASE_TS = new BN('1000000000000000000000000')

const PC_BASE = new Big(50).div(100)
const PC_STEP = new Big(-4).div(100)
const REWARD_POOL = new Big(15).div(100)


function convert(n: any): any {
    const sign: string = +n < 0 ? '-' : ''
    let toStr: string = n.toString()
    if (!/e/i.test(toStr)) {
        return n
    }
    toStr = toStr.replace(/^-/, '')
    const data: Array<any> = toStr.replace(/^([0-9]+)(e.*)/, '$1.$2').split(/e|\./)
    const [lead, decimal, pow]: Array<any> = data
    if (+pow < 0) {
        return sign + '0.' + '0'.repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) + lead + decimal
    } else {
        let p: string
        if (+pow >= decimal.length) {
            p = decimal + '0'.repeat(Math.max(+pow - decimal.length || 0, 0))
        } else {
            p = decimal.slice(0, +pow) + '.' + decimal.slice(+pow)
        }
        return sign + lead + p
    }
}


function rewardPercent(ts: number): Big {
    let _b: BN
    const x: Big = new Big(ts).div(new Big(BASE_TS.toString()))
    const tsLen: number = parseInt(convert(ts), 10).toString(2).length
    const baseLen: number = parseInt(convert(BASE_TS), 10).toString(2).length
    const bitLength: number = tsLen - baseLen
    const b: BN = new BN(bitLength)
    if (b.cmp(new BN(0)) == -1) {
        _b = new BN(-1)
    } else {
        _b = b
    }
    const a: BN = new BN(BIG_2.div(1).toString()).pow(_b)
    let r: Big = x.div(a.toString())
    r = r.add(b.toString())
    r = r.sub(RAT_1)
    let p: Big = r.mul(PC_STEP)
    p = p.add(PC_BASE)
    if(p.gt(PC_BASE)){
        p = PC_BASE
    } else if (p.s < 0) {
        p = RAT_1
    }
    return p
}



@Component({
    components: {
        TooltipMeta,
    },
})
export default class ValidatorStats extends Mixins(PlatformGettersMixin) {
    get subnetsLoaded(): boolean {
        return this.$store.state.Platform.subnetsLoaded
    }

    get totalValidatorsCount() {
        return this.getTotalValidators()
    }

    get totalPendingValidatorsCount() {
        return this.getTotalPendingValidators()
    }

    get totalStake(): string {
        let totalStake = this.getTotalStake()
        totalStake = bigToDenomBig(totalStake, 9)
        return totalStake.toLocaleString(0)
    }

    get percentStaked() {
        return this.getStakingRatio()
    }

    get annualStakingRewardPercentage(): string {
        const totalStake = parseInt(this.getTotalStake().toString())
        const APR = rewardPercent(totalStake * 10**9).mul(100)
        return `${APR.toFixed(1)}%`
    }
}
</script>

<style scoped lang="scss">
.header {
    padding-bottom: 30px;
}

h3,
h4 {
    margin: 0;
    font-weight: 400;
}

.subtitle {
    margin-top: 0.2em;
    font-size: 0.875rem;
}
.stats {
    display: flex;
    flex-direction: column;

    .meta {
        font-size: 12px;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: flex-start;
        flex-wrap: wrap;
        font-weight: 700;
        padding-bottom: 24px;

        &:last-of-type {
            padding-bottom: 0;
        }

        .stat {
            display: flex;
            flex-direction: column;

            &:hover {
                text-decoration: none !important;
                opacity: 0.7;
            }
        }

        .stat > div {
            display: flex;
        }

        p {
            padding: 2px 0;
            font-weight: 400;
        }

        .label {
            text-transform: capitalize;
            font-size: 12px;
            margin-bottom: 6px;
            padding-left: 3px;
        }

        .meta_val {
            font-size: 36px;
            line-height: 1em;

            .unit {
                font-family: 'Inter', sans-serif;
                font-size: 12px;
                opacity: 0.7;
            }
        }
    }
}
</style>
