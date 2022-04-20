<template>
    <div class="header">
        <div class="left">
            <h2>{{ heading }}</h2>

            <v-alert class="testnet_alert" text type="info" rounded="0">
                <p class="description">
                    Notice: This explorer only indexes the X-Chain and P-Chain.
                    To view C-Chain transactions (EVM chain), click
                    <a class="bold c_chain_link" :href="cChainURL">here</a>.
                </p>
            </v-alert>
            <p style="font-weight: bold; font-size: 16px; margin-bottom: 16px">
                No. of transactions in last 60 seconds: {{ countTransaction }}
            </p>
            <p class="chain">
                <span class="label">You are viewing transactions for</span>
                <v-tooltip>
                    <template v-slot:activator="{ on }">
                        <span
                            class="chain_tag"
                            :style="{
                                backgroundColor: pChain.darkColor,
                            }"
                            v-on="on"
                            >{{ pChain.name }}</span
                        >
                    </template>
                    <span
                        >The P-Chain is the metadata blockchain on EZChain,
                        managing validators and custom subnets. Validators stake
                        EZC on the P-Chain to secure the network.</span
                    >
                </v-tooltip>
                <v-tooltip>
                    <template v-slot:activator="{ on }">
                        <span
                            class="chain_tag margin-left"
                            :style="{
                                backgroundColor: xChain.darkColor,
                            }"
                            v-on="on"
                            >{{ xChain.name }}</span
                        >
                    </template>
                    <span
                        >The X-Chain is the default asset blockchain on EZChain
                        enabling the creation and instant exchange of assets.
                        This blockchain is for transfers that benefit from
                        high-throughput and instant finality. Think X for
                        eXchanging assets.
                    </span>
                </v-tooltip>
                <v-tooltip>
                    <template v-slot:activator="{ on }">
                        <span
                            class="chain_tag margin-left"
                            :style="{
                                backgroundColor: cChain.darkColor,
                            }"
                            v-on="on"
                            >{{ cChain.name }} (atomic txs only)</span
                        >
                    </template>
                    <span
                        >The C-Chain is the default smart contract blockchain on
                        EZChain and enables the creation of any
                        Ethereum-compatible applications and assets with lower
                        fees and faster transactions.</span
                    >
                </v-tooltip>
            </p>
        </div>
        <div class="right" bottom>
            <v-btn
                :loading="loading"
                :text="true"
                class="refresh ava_btn"
                @click="updateTx"
            >
                <fa icon="sync"></fa>
                <span class="ava-btn-label">Refresh</span>
            </v-btn>
            <v-btn :text="true" class="ava_btn" @click="goToTx">
                View All Transactions
            </v-btn>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import {Vue, Component, Prop, Watch} from 'vue-property-decorator'
import { P, X, C, getTxChainType } from '@/known_blockchains'
import { getNoTransactionOf60s } from '@/helper.ts'
import {
    DEFAULT_NETWORK_ID,
    cChainExplorerURL,
    cChainExplorerURL_test,
} from '@/store/modules/network/network'

@Component({
    components: {},
})
export default class RecentTxHeader extends Vue {
    @Prop() heading!: string
    @Prop() loading!: boolean
    @Prop() transactions: any
    countTransaction: any = null
    updateTx() {
        this.transactions60s()
        this.$emit('update')
    }

    get xChain() {
        return getTxChainType(X.id)
    }

    get pChain() {
        return getTxChainType(P.id)
    }

    get cChain() {
        return getTxChainType(C.id)
    }

    get cChainURL() {
        return DEFAULT_NETWORK_ID === 1
            ? cChainExplorerURL
            : cChainExplorerURL_test
    }

    goToTx() {
        this.$router.push('/tx')
    }
  @Watch('transactions')
    async transactions60s() {
        const transactionCount = await getNoTransactionOf60s()
        this.countTransaction = transactionCount
    }
    created() {
        this.transactions60s()
    }
}
</script>
<style scoped lang="scss">
.testnet_alert {
    background-color: $white !important;
}

@if $VUE_APP_DEFAULT_NETWORKID == 1 {
    .v-alert--text:before {
        background-color: $white;
    }
}

.bold {
    font-weight: 700;
}

.margin-left {
    margin-left: 10px;
}

.refresh {
    margin-left: 16px;
}

.ava-btn-label {
    padding-left: 8px;
}

.c_chain_link {
    color: #2196f3 !important;
    text-decoration: underline;
}

.header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    h2 {
        padding-bottom: 10px;
    }

    .refresh {
        color: $primary-color;
        text-transform: none;
        border: none;
    }

    .left {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        flex-grow: 1;
    }

    .right {
        flex-grow: 1;
        display: flex;
        flex-direction: row-reverse;
        align-items: flex-end;
    }
}
@include smOnly {
    .header {
        padding-bottom: 0;

        .right {
            display: none;
        }
    }
}

@include xsOrSmaller {
    .header {
        display: flex;
        flex-direction: column;

        .left {
            display: flex;
            width: 100%;
            justify-content: space-between;
            margin-bottom: 5px;
        }

        .right {
            padding: 15px 0;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-content: center;
        }
    }
}
</style>
