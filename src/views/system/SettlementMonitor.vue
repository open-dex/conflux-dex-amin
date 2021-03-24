<template>
    <div>
        <Epoch></Epoch>
        <el-tabs  v-model="activeName"  @tab-click="changeTab">
        <el-tab-pane name="confirmQ" label="Transaction Confirmation Monitor">
            <div>
                <el-button size="small" @click="loadList('system/tx-items', 'confirmQ')"><i class="el-icon-refresh"></i></el-button>
                {{ (tableData['confirmQ'] || []).length}}
                <span>{{message}}</span>
            </div>
            <el-table
                    :data="tableData['confirmQ']"
                    stripe
                    style="width: 100%">
                <el-table-column prop="id" label="id" ></el-table-column>
                <el-table-column prop="settledEpoch" label="settledEpoch" ></el-table-column>
                <el-table-column prop="settledTxHash" label="settledTxHash" ></el-table-column>
                <el-table-column prop="settledTxNonce" label="settledTxNonce" ></el-table-column>
                <el-table-column prop="typeName" label="typeName" ></el-table-column>
                <el-table-column prop="status" label="status" ></el-table-column>
                <el-table-column prop="checkResult" label="checkResult" ></el-table-column>
                <el-table-column prop="" label="" >
                    <template slot-scope="d">
                        <el-link @click="check(d.row)" style="color: #409EFF">Check</el-link>｜
                        <el-link @click="remove(d.row)" style="color: #409EFF">Remove</el-link>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane name="sendQ" label="Block Chain Settlement Service">
            <div>
                <el-button size="small" @click="loadList('system/tx/off-chain', 'sendQ')"><i class="el-icon-refresh"></i></el-button>
                {{ (tableData['sendQ'] || []).length}}
                <span>{{message}}</span>
            </div>
            <el-table
                    :data="tableData['sendQ']"
                    stripe
                    style="width: 100%">
                <el-table-column prop="id" label="id" ></el-table-column>
                <el-table-column prop="typeName" label="typeName" ></el-table-column>
                <el-table-column prop="status" label="status" ></el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>
    </div>
</template>

<script>
    import Epoch from "./Epoch";
    export default {
        name: "SettlementMonitor",
        components: {Epoch},
        data() {
            return {
                message: '',
                activeName: 'confirmQ',
                tableData: []
            }
        },
        methods: {
            remove(row) {
                const request = {
                    command: 'remove-tx-from-monitor',
                    comment: row['settledTxNonce'],
                    encodeType: 'system/encode'
                };
                this.doCommand(request, 'system/tx/remove', (ret)=>{
                    if ( typeof ret !== 'undefined'){
                        this.$message("Executed!")
                    }
                });
            },
            check(row) {
                row.checkResult = 'Checking';
                this.$forceUpdate();
                this.getRpc('system/tx/check?txNonce='+row.settledTxNonce).then(data=>{
                    console.info(`check ${row.settledTxNonce} return ${data}`);
                    row.checkResult = data;
                    this.$forceUpdate();
                })
            },
            changeTab(tab) {
                console.info(tab.name);
                switch (tab.name) {
                    case 'confirmQ':
                        this.loadList('system/tx-items', tab.name);
                        break;
                    case 'sendQ':
                        this.loadList('system/tx/off-chain', tab.name);
                        break;
                }
            },
            loadList(url, what) {
                this.message = 'Loading...';
                this.getRpc(url).then(data => {
                    data.forEach(d=>d.checkResult = '-');
                    this.tableData[what] = data;
                    this.message = '';
                    this.$forceUpdate();
                })
            }
        },
        mounted() {
            this.loadList('system/tx-items', 'confirmQ')
        }
    }
</script>

<style scoped>

</style>