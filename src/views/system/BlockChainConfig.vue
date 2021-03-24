<template>
    <div class="container">
        <div>
            <el-button size="small" @click="loadList"><i class="el-icon-refresh"></i></el-button>
        </div>
        <el-table
                :data="tableData"
                stripe @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave"
                style="width: 100%">
            <el-table-column prop="name" label="Name"></el-table-column>
            <el-table-column prop="value" label="Value"></el-table-column>
        </el-table>
    </div>
</template>

<script>

    export default {
        name: "BlockChainConfig",
        data() {
            return {
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

            loadList() {
                this.tableData = []
                const request = {
                    command: 'dex.resume',
                    comment: 'resume'
                };
                // this.doCommand(request, 'system/list-config', this.loadListDirect)
                this.loadListDirect(request, 'system/get-block-chain-config')
                // this.getRpc('/system/list-config').then(data=>{
                //     this.tableData = data;
                // })
            },
            loadListDirect(request, url) {
                this.getRpc(url, request).then((list)=>{
                    const arr = []
                    Object.keys(list).forEach(k=>{
                        arr.push({name: k, value: `${list[k]}`})
                    });
                    this.tableData = arr;
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