<template>
    <div class="container">
        <div>
            <el-button size="small" @click="loadList"><i class="el-icon-refresh"></i></el-button>
        </div>
        <el-table
                :data="tableData"
                stripe @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave"
                style="width: 100%">
            <el-table-column prop="logName" label="logName"></el-table-column>
            <el-table-column prop="fileSize" label="fileSize"></el-table-column>
            <el-table-column prop="fileSize" label="fileSize">
                <template slot-scope="d">
                    <span  v-show="d.$index > 0" @click="confirmPurge(d.row)">Purge To Here</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

    export default {
        name: "BinLog",
        data() {
            return {
                tableData: [],
                mouseOverRow: null,
            }
        },
        methods: {
            purge(v) {
                this.rpc(`system/purge-bin-logs?to=${v.logName}`).then(()=>{
                    this.loadList();
                })
            },
            confirmPurge(v) {
                this.$prompt(`Purge binlog to ${v.logName}, input PURGE to confirm:`, 'Confirm', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    inputPattern: /^PURGE$/,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    inputErrorMessage: 'invalid PURGE token'
                }).then(() => {
                    this.purge(v);
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
            loadList() {
                this.tableData = []
                this.rpc('system/show-bin-logs').then((list)=>{
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
    span:hover{
        background-color: black;
        color: white;
        cursor: pointer;
    }
</style>