<template>
    <div>
        <el-button size="small" @click="loadList"><i class="el-icon-refresh"/></el-button>
        <div>Block chain service polls deposit event from:</div>
        <el-table
                :data="tableData"
                stripe
                style="width: 100%">

            <el-table-column prop="id" label="id"></el-table-column>
            <el-table-column prop="name" label="name"></el-table-column>
            <el-table-column prop="contractAddress" label="contractAddress"></el-table-column>
            <el-table-column prop="status" label="">
                <template slot-scope="d">
                    <span v-show="d.row.listened">Listened</span>
                    <span v-show="!d.row.listened" @click="listen(d.row)">Click to Listen</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "ListenedAddress",
        data() {
            return {
                tableData: []
            }
        },
        methods: {
            listen(row) {
                this.rpc('currencies/add2blockchain', row).then(()=>this.loadList());
            },
            loadList() {
                const data = {}
                this.tableData = []
                Promise.all([
                    this.rpc('currencies/get-listened-address', data),
                    this.getRpc('currencies?offset=0&limit=50')]
                ).then((arr)=>{
                    const listened = arr[0];
                    const currencies = arr[1];
                    console.info('listened', listened, currencies);
                    currencies.items.sort((a,b)=>a.id - b.id);
                    currencies.items.forEach(c=>c.listened = listened.includes(c.contractAddress))
                    this.tableData = currencies.items;
                })
            }
        },
        mounted() {
            this.loadList();
        }
    }
</script>

<style scoped>

</style>