<template>
    <div>
        <el-button size="small" @click="load"><i class="el-icon-refresh"></i></el-button>
        <div>{{message}}</div>
        <div v-for="item in Object.keys(lists)" :key="item" class="tableWrap">
            {{item}}
            <el-table :data="lists[item]" border class="table">
                <el-table-column prop="status" label="status">
                    <template slot-scope="d">
                        <span :style="getColor(d.row.status)">{{d.row.status}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="count" label="count" width="120"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    name: "CountByStatus",
    data() {
        return {
            lists: {
                countOrderByStatus: [],
                countOrderCancelByStatus: [],
                countOrderPruneByStatus: [],
                countTradeByStatus: [],
                countTransferByStatus: [],
                countWithdrawByStatus: [],
            },
            message: '',
        }
    },
    methods: {
        getColor(status){
            switch (status) {
                case 'Filled':
                case 'OnChainConfirmed':
                case 'ALL':
                case 'Cancelled':
                    return {};
            }
            return {background: 'orange'}
        },
        load() {
            this.message = "Loading";
            this.rpc(`system/count-status`).then(map => {
                this.lists = map;
                this.message = "";
            })
        }
    },
    mounted() {
        this.load();
    }
}
</script>

<style scoped>
    .table{
        width: 300px;
    }
    .tableWrap{
        display: inline-block;
        vertical-align: top;
        margin-left: 2px;
        margin-top: 6px;
    }
</style>