<template>
    <div class="container">
        <div>
            <el-button size="small" @click="loadList"><i class="el-icon-refresh"></i></el-button>
            <el-button size="small" @click="showAddConfig"><i class="el-icon-plus"></i></el-button>
            My IP: {{myIP}}
            Filter Mode:
            <el-radio-group v-model="filterMode" size="mini" @change="confirmSetMode">
                <el-radio-button label="NONE"></el-radio-button>
                <el-radio-button label="ONLY_WHITELIST"></el-radio-button>
            </el-radio-group>
            {{filterMode}}
        </div>
        <el-dialog title="Result" :visible.sync="dialogTableVisible" :closeOnClickModal="false"
                   :closeOnPressEscape="false">
            <el-form>
                <el-form-item label="IP">
                    <el-input v-model="setForm.ip"></el-input>
                </el-form-item>
                <el-form-item label="URL(Optional,starts with / )">
                    <el-input v-model="setForm.url"></el-input>
                </el-form-item>
                <el-form-item label="Type">
                    <el-radio-group v-model="setForm.type">
                        <el-radio-button value="Whitelist" label="Whitelist"></el-radio-button>
                        <el-radio-button value="Blacklist" label="Blacklist"></el-radio-button>
                        <el-radio-button value="Other" label="Other"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="Rate">
                    <el-input v-model="setForm.rate" :disabled="setForm.type !== 'Other'"
                              type="number"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                               :disabled="setForm.ip.trim().length === 0"
                               @click="setRate">Commit</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-table
                :data="tableData"
                stripe @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave"
                style="width: 100%">
            <el-table-column prop="id" label="id"></el-table-column>
            <el-table-column prop="key" label="key"></el-table-column>
            <el-table-column prop="ip" label="ip"></el-table-column>
            <el-table-column prop="url" label="url"></el-table-column>
            <el-table-column prop="banTimes" label="times:ban/over-limit">
                <template slot-scope="d">
                    {{d.row.banTimes}}/{{d.row.overRateTimes}}
                </template>
            </el-table-column>
            <el-table-column prop="rate" label="rate">
                <template slot-scope="d">
                    {{d.row.rate}}
                    <el-tag v-if="d.row.rate === 0" type="success">Whitelist</el-tag>
                    <el-tag v-if="d.row.rate < 0" type="danger">Blacklist</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="rate" label="...">
                <template slot-scope="d">
                    <span @click="del(d.row)">Delete</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

    export default {
        name: "QPSConfig",
        data() {
            return {
                myIP: '',
                filterMode: '#',
                filterModeCache: '#',
                setForm: {
                    ip: '',
                    url: '',
                    type: 'Other',
                    rate: 0,
                },
                tableData: [],
                mouseOverRow: null,
                dialogTableVisible: false,
            }
        },
        methods: {
            del(row) {
                this.$confirm(`Delete it ? ${row.key}`, 'Confirm').then(()=>{
                    this.rpc('system/del-qps-limit', row).then(()=>this.loadList())
                }).catch(()=>{})
            },
            getFilterMode() {
                this.rpc('system/get-qps-filter-mode').then(data=>{
                    this.filterMode = data;
                    this.filterModeCache = data;
                })
            },
            setFilterMode(v) {
                this.rpc(`system/set-qps-filter-mode?mode=${v}`).then(()=>{
                    this.filterModeCache = v;
                    this.getFilterMode();
                })
            },
            confirmSetMode(v) {
                this.$prompt(`Set qps filter mode to ${v}, input SET to confirm:`, 'Confirm', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    inputPattern: /^SET$/,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    inputErrorMessage: 'invalid confirm token'
                }).then(() => {
                    this.setFilterMode(v);
                }).catch(() => {
                    this.filterMode = this.filterModeCache;
                });
            },
            cellMouseEnter(row) {
                this.mouseOverRow = row;
            },
            cellMouseLeave() {
                this.mouseOverRow = null;
            },
            showAddConfig() {
                this.dialogTableVisible = true;
            },
            setRate() {
                const data = {
                    key: this.setForm.ip.trim(),
                    rate: this.setForm.rate
                }
                switch (this.setForm.type) {
                    case 'Whitelist': data.rate = 0; break;
                    case 'Blacklist': data.rate = -1; break;
                }
                let url = this.setForm.url.trim();
                if (url.length > 0) {
                    data.key += "#"+url
                }
                this.rpc('system/set-qps-limit', data).then(()=>{
                    this.loadList();
                    this.dialogTableVisible = false;
                })
            },
            loadList() {
                this.tableData = []
                this.rpc('system/list-qps-limit').then((list)=>{
                    this.tableData = list;
                })
                this.getRpc('system/echo-ip').then(ip=>{
                    this.myIP = ip;
                })
                this.getFilterMode();
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
    span:hover{
        background-color: black;
        color: white;
        cursor: pointer;
    }
</style>