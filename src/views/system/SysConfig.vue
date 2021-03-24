<template>
    <div class="container">
        <el-tabs v-model="activeName">
            <el-tab-pane name="databaseConfig" label="Database config">
        <div>
            <el-button size="small" @click="loadList"><i class="el-icon-refresh"></i></el-button>
            <el-button size="small" @click="addConfig"><i class="el-icon-plus"></i></el-button>
        </div>
        <el-table
                :data="tableData"
                stripe @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave"
                style="width: 100%">
            <el-table-column prop="name" label="Name"></el-table-column>
            <el-table-column prop="value" label="Value"></el-table-column>
            <el-table-column prop="value" label="">
                <template slot-scope="d">
                    <div v-show="d.row === mouseOverRow">
                        <el-link @click="edit(d.row)" size="small">
                            <i class="el-icon-edit"/>
                        </el-link>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                   title="Result" :visible.sync="dialogTableVisible">
            <el-table :data="resultList">
                <el-table-column property="name" label="Config Name"></el-table-column>
                <el-table-column property="message" label="Result"></el-table-column>
            </el-table>
        </el-dialog>
            </el-tab-pane>
            <el-tab-pane name="blockChainConfig" label="Block Chain Config">
                <BlockChainConfig></BlockChainConfig>
            </el-tab-pane>
            <el-tab-pane name="QPSConfig" label="QPSConfig">
                <QPSConfig></QPSConfig>
            </el-tab-pane>
            <el-tab-pane name="BinLog" label="BinLog">
                <BinLog></BinLog>
            </el-tab-pane>
            <el-tab-pane name="Slowdown" label="Slowdown">
                <SlowdownConfig></SlowdownConfig>
            </el-tab-pane>
            <el-tab-pane name="MarketMaker" label="MarketMaker">
                <MarketMaker></MarketMaker>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>

    import BlockChainConfig from "./BlockChainConfig";
    import QPSConfig from "@/views/system/QPSConfig";
    import BinLog from "@/views/system/BinLog";
    import SlowdownConfig from "@/views/system/SlowdownConfig";
    import MarketMaker from "@/views/system/MarketMaker";
    export default {
        name: "SysConfig",
        components: {MarketMaker, SlowdownConfig, BinLog, QPSConfig, BlockChainConfig},
        data() {
            return {
                activeName: 'databaseConfig',
                tableData: [],
                resultList: [],
                mouseOverRow: null,
                dialogTableVisible: false,
            }
        },
        methods: {
            cellMouseEnter(row) {
                this.mouseOverRow = row;
            },
            cellMouseLeave() {
                this.mouseOverRow = null;
            },
            callSetConfig(config, newV) {
                const request = {
                    name: config.name,
                    value: newV,
                    encodeType: 'system/encode-config-request'
                };
                this.doCommand(request, 'system/set-config', (data)=>{
                    console.info('set config return ', data);
                    const list =  [];
                    // make the modified one first
                    let modifiedOne = {name: config.name, message: data[config.name]};
                    delete data[config.name];
                    for (let k of Object.keys(data)) {
                        list.push({name: k, message: data[k]})
                    }
                    list.sort((a,b)=> {
                        if (a.message === b.message) {
                            return 0;
                        } else if ('not found' === a.message) {
                            return 1;
                        } else if ('not found' === b.message) {
                            return -1;
                        } else {
                            return a.message > b.message ? 1 : -1;
                        }
                    });
                    list.unshift(modifiedOne);
                    this.resultList = list;
                    this.dialogTableVisible = true;
                    this.loadList();
                });
            },
            addConfig() {
                this.$prompt('Add new config, input name:', 'Add Config', {
                    confirmButtonText: 'OK',
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    cancelButtonText: 'Cancel',
                    inputPattern: /[\w]+/,
                    inputErrorMessage: 'Input can not be empty'
                }).then(({ value }) => {
                    this.edit({name : value, value: ''});
                }).catch(() => {
                    console.info('cancel add')
                });
            },
            edit(config){
                this.$prompt('Input new value for:'+config.name+", current: " + config.value, 'Edit Config', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    inputPattern: /[\w]+/,
                    inputValue: config.value || '',
                    inputErrorMessage: 'Input can not be empty'
                }).then(({ value }) => {
                    this.callSetConfig(config, value);
                }).catch((e) => {
                    console.info(e)
                    this.$message({
                        type: 'info',
                        message: 'Cancelled'
                    });
                });
            },
            loadList() {
                this.tableData = []
                const request = {
                    command: 'dex.resume',
                    comment: 'resume'
                };
                // this.doCommand(request, 'system/list-config', this.loadListDirect)
                this.loadListDirect(request, 'system/list-config')
                // this.getRpc('/system/list-config').then(data=>{
                //     this.tableData = data;
                // })
            },
            loadListDirect(request, url) {
                this.rpc(url, request).then((list)=>{
                    this.tableData = list;
                })
            },

        },
        mounted() {
            this.loadList();
        }
    }
</script>

<style scoped>
    .container{
        height: 100%;
    }
</style>