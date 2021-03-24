<template>
    <div>
        <div>
            <el-button size="mini" @click="getTokenAddr">GetTokenAddressFromContract</el-button>
            {{tokenAddr}}
        </div>
        <div style="margin-top: 2px"></div>
        <div>
            TokenAddress:<el-input size="mini" v-model="inputTokenAddr" style="width: 500px"></el-input>
            <el-button size="mini" @click="setTokenAddr">Set</el-button>
            {{setMessage}}
            <el-link v-if="txHash"
                    target="_blank" :href="`https://confluxscan.io/transaction/${txHash}`">
                <i class="el-icon-link" size="mini"></i>Scan
            </el-link>
        </div>
    </div>
</template>

<script>
export default {
    name: "CrclContract",
    props: {
        crclAddr: {
            type: String
        }
    },
    data() {
        return {
            tokenAddr: '',
            inputTokenAddr: '',
            setMessage: '',
            txHash: '',
        }
    },
    methods: {
        setTokenAddr() {
            this.setMessage = 'Loading...'
            this.rpc(`system/set-crcl-token?crcl=${this.crclAddr}&token=${this.inputTokenAddr}`).then(data=>{
                this.setMessage = 'Tx:' + data;
                this.txHash = data;
            })
        },
        getTokenAddr() {
            this.tokenAddr = 'Loading'
            this.rpc(`system/get-crcl-token?crcl=${this.crclAddr}`).then(data=>{
                this.tokenAddr = data || 'null';
            })
        }
    },
    mounted() {

    }
}
</script>

<style scoped>

</style>