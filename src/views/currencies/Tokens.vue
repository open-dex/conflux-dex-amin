<template>
    <div>
        <el-button size="small" @click="loadList"><i class="el-icon-refresh"/></el-button>
        <el-button size="small" @click="refreshCrossChainTokens">Refresh Cross Chain Tokens</el-button>
        <div></div>
        <span>Custodian proxy address : {{custodianProxyAddress}}</span>
        <el-form inline>
            <el-form-item label="CFX token address">
                <el-input size="mini" v-model="cfxTokenAddress" style="width: 400px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="mini" @click="queryCustodian">Query from custodian proxy</el-button>
            </el-form-item>
        </el-form>
        <div>
            <template v-for="key in Object.keys(tokenFromCustodian)">
                <B :key="key">{{key}}:</B>{{tokenFromCustodian[key]}}
            </template>
        </div>
        <el-table
                :data="tableData"
                stripe
                style="width: 100%">
            <el-table-column prop="name" label="name/ether contract">
                <template slot-scope="d">
                    {{d.row.name}}
                    <el-link target="_blank" :href="`https://cn.etherscan.com/address/${d.row.name}`">
                        <i class="el-icon-link" size="mini"></i>EtherScan
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column prop="withdrawFee" label="withdrawFee"></el-table-column>
            <el-table-column prop="" label="CFX contract address">
                <template slot-scope="d">
                    {{d.row.address}}
                    <el-link target="_blank" :href="`https://confluxscan.io/address/${d.row.address}`">
                        <i class="el-icon-link" size="mini"></i>Scan
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column prop="decimals" label="decimals" width="80"></el-table-column>
            <el-table-column prop="minWithdrawAmount" label="minWithdrawAmount"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "Tokens",
        data() {
            return {
                cfxTokenAddress: '',
                tokenFromCustodian: {},
                custodianProxyAddress: '',
                visibleEditDialog: false,
                tableData: [],
                editForm: {
                    minimumWithdrawAmount: 0,
                    name: ''
                },
                editOrigin: {}
            }
        },
        methods: {
            queryCustodian() {
                const data = {address: this.cfxTokenAddress}
                this.tokenFromCustodian = {msg:'Loading'}
                this.rpc('system/query-token-from-custodian', data).then(data=>{
                    this.tokenFromCustodian = data;
                })
            },
            refreshCrossChainTokens() {
                const request = {
                    command: 'dex.refresh.ctoken',
                    encodeType: 'system/encode'
                }
                this.doCommand(request, 'system/crosschain/tokens/refresh', ()=>{
                    this.showEditDialog = false;
                    this.$message.info('Executed, it may take seconds to finish.');
                    this.loadList();
                })
            },
            loadList() {
                this.tableData =[];
                this.getRpc('currencies/crosschain/tokens').then(data=>{
                    this.tableData = data;
                });
                this.getRpc('common/custodian-proxy').then(data=>this.custodianProxyAddress=data)
            }
        },
        mounted() {
            this.loadList();
        }
    }
</script>

<style scoped>

</style>