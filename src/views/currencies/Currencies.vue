<template>
    <div>
        <el-form inline>
            <el-form-item>
                <el-button size="small" @click="loadList"><i class="el-icon-refresh"/></el-button>
            </el-form-item>
            <el-form-item label="Currency Name">
                <el-input v-model="form.name" size="mini"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="deploy" type="primary" size="mini" :disabled="form.name === ''">Deploy CRCL&Token</el-button>
            </el-form-item>
              <el-form-item>
                <el-button @click="clearListCache" type="" size="mini">Clear List Cache</el-button>
              </el-form-item>
        </el-form>
        {{deployTempFile}} <span @click="loadDeployStatus">{{ deployMessage }}</span>
        <div v-show="deployTempFile">
            <el-input type="textarea" v-model="deployLog" :rows="20"></el-input>
        </div>
        <el-table
                :data="tableData"
                stripe
                style="width: 100%">
            <el-table-column prop="" label="..." type="expand">
                <template slot-scope="d">
                    <div v-if="d.row.crossChainToken">
                        FromCustodian:
                        <B>withdrawFee:</B>{{ d.row.crossChainToken.withdrawFee }}
                        <B>address:</B>{{ d.row.crossChainToken.address }}
                        <B>decimals:</B>{{ d.row.crossChainToken.decimals }}
                        <B>minWithdrawAmount:</B>{{ d.row.crossChainToken.minWithdrawAmount }}
                        <B>name:</B>{{ d.row.crossChainToken.name }}
                    </div>
                    <el-collapse class="anchor">
                        <el-collapse-item title="Devops" name="1">
                            <div>
                                <el-button size="mini" @click="registerAbi(d.row, 'CRCL', `CRCL_${d.row.name}`)">
                                    Register CRCL ABI
                                </el-button>
                                <tempalte v-if="d.row.crossChainToken"></tempalte>
                                <template v-else>
                                    <el-button size="mini" @click="registerAbi(d.row, d.row.name, d.row.name)">Register
                                        Token ABI
                                    </el-button>
                                </template>
                                <div style="margin-top: 2px">
                                    <CrclContract :crcl-addr="d.row.contractAddress"></CrclContract>
                                </div>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </template>
            </el-table-column>
            <el-table-column prop="id" label="Id" width="40"></el-table-column>
            <el-table-column prop="name" label="Name" width="80"></el-table-column>
            <el-table-column prop="contractAddress" label="CRCL Contract Address">
                <template slot-scope="d">
                    {{ d.row.contractAddress }}
                    <el-link target="_blank" :href="`https://confluxscan.io/address/${d.row.contractAddress}`">
                        <i class="el-icon-link" size="mini"></i>Scan
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column prop="tokenAddress" label="Token/CFX contract Address">
                <template slot-scope="d">
                    {{ d.row.tokenAddress }}
                    <el-link target="_blank" :href="`https://confluxscan.io/address/${d.row.tokenAddress}`">
                        <i class="el-icon-link" size="mini"></i>Scan
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column prop="" label="BTC/Ethereum Address">
                <template slot-scope="d" v-if="d.row.crossChainToken">
                    {{ d.row.crossChainToken.name }}
                    <el-link target="_blank" :href="`https://cn.etherscan.com/address/${d.row.crossChainToken.name}`">
                        <i class="el-icon-link" size="mini"></i>EtherScan
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column prop="decimalDigits" label="Decimal Digits" width="120"></el-table-column>
            <el-table-column prop="crossChain" label="Cross Chain" width="100">
                <template slot-scope="d">
                    {{d.row.crossChain ? "Yes" : "No"}}
                </template>
            </el-table-column>
          <el-table-column prop="" label="Withdraw Fee">
            <template slot-scope="d" v-if="d.row.crossChainToken">
              {{d.row.crossChainToken.withdrawFee}}
            </template>
          </el-table-column>
            <el-table-column prop="" label="Minimum Withdraw Amount">
                <template slot-scope="d">
                    {{d.row.minimumWithdrawAmount}}
                    <el-link @click="showEditDialog(d.row)" style="float:right">
                        <i class="el-icon-edit-outline"></i>
                    </el-link>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="`Edit Currency ${editOrigin.name}`" :visible.sync="visibleEditDialog">
            <el-form>
                <el-form-item :label="`Current Minimum Withdraw Amount: ${editOrigin.minimumWithdrawAmount}`">
                    <el-input v-model="editForm.minimumWithdrawAmount"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="update">Update</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import CrclContract from "@/views/currencies/CrclContract";
    export default {
        name: "Currencies",
        components: {CrclContract},
        data() {
            return {
                visibleEditDialog: false,
                tableData: [],
                editForm: {
                    minimumWithdrawAmount: 0,
                    name: ''
                },
                editOrigin: {},
                form: {
                    name: ''
                },
                deployTempFile: '',
                deployMessage: '',
                deployLog: ''
            }
        },
        methods: {
            registerAbi(row, what, name) {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                this.rpc(`system/register-contract-abi?addr=${
                    what === 'CRCL' ? row.contractAddress : row.tokenAddress}&abiType=${
                    what}&name=${name}`).then(data=>{
                        console.info(`reg abi return ${data}`)
                        if (!data.toString().startsWith("0x")) {
                          const arr = JSON.parse(data)
                          data = arr[0].transactionHash
                        }
                        this.$message(`Transaction committed: ${data}`)
                }).finally(()=>{
                    loading.close()
                })
            },
            showEditDialog(row) {
                this.editOrigin = row;
                this.editForm.name = row.name;
                this.editForm.minimumWithdrawAmount = row.minimumWithdrawAmount;
                this.visibleEditDialog = true;
            },
            update() {
                this.editForm.encodeType = 'currencies/encode-update-currency';
                this.doCommand(this.editForm, 'currencies/update-currency', ()=>{
                    this.$message.info('Updated.');
                    this.visibleEditDialog = false;
                    this.loadList();
                })
            },
            deploy() {
                const request = {
                    command: 'deploy currency',
                    comment: this.form.name,
                    encodeType: 'system/encode'
                }
                this.doCommand(request, 'system/deploy-currency', (path)=>{
                    this.deployTempFile = path;
                    this.$message('Deploy started.')
                    this.deployMessage = 'Running';
                    setTimeout(this.loadDeployStatus, 1000);
                })
            },
            loadDeployStatus() {
                this.getRpc(`system/deploy-status?tempFilePath=${this.deployTempFile}`)
                    .then(data=>{
                        console.info(`loadDeployStatus`, data)
                        this.deployLog = data.logContent.join('\n');
                        if (data.alive) {
                            this.deployMessage = "Still running";
                            setTimeout(this.loadDeployStatus, 1000);
                        } else {
                            this.deployMessage = `Exit with ${data.exitValue}`;
                        }
                        this.$forceUpdate();
                    })
            },
            loadList() {
                this.tableData = []
                this.deployLog = this.deployTempFile = this.deployMessage = '';
                this.getRpc('currencies?offset=0&limit=50').then(data=>{
                    data.items.sort((a,b)=>a.id - b.id);
                    this.tableData = data.items;
                })
            },
          clearListCache() {
            const body = {
              key: 'list',
              cacheName: 'dao.currency',
            };
            this.rpc('cache/ehcache/remove', body).then(removed=>{
              this.$notify({
                title: 'Remove result',
                message: removed ? 'Removed' : 'Not found',
                type: removed ? 'success' : 'warning'
              });
              this.list();
            })
          }
        },
        mounted() {
            this.loadList();
        }
    }
</script>

<style scoped>
.anchor>>>.el-collapse-item__content{
    padding-bottom: 2px;
}
.anchor>>>.el-collapse-item__header{
    line-height: unset;
    height: unset;
}
</style>