<template>
    <div>
        <el-form inline>
            <el-form-item label="Hash">
                <el-input v-model="txHash" size="mini" style="width: 500px" @change="loadList"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="mini" type="primary" @click="loadList()">Search</el-button>
            </el-form-item>
        </el-form>
        <el-table border
                  :data="orders">
            <el-table-column prop="onChain.recorded" label="onChain.recorded" :formatter='fmtBool'></el-table-column>
            <el-table-column prop="onChain.filled" label="onChain.filled"></el-table-column>
            <el-table-column prop="onChain.cancelled" label="onChain.cancelled" :formatter='fmtBool'></el-table-column>
            <el-table-column prop="onChain.max" label="onChain.max"></el-table-column>
            <el-table-column prop="onChain.timestamp" label="onChain.timestamp"></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: "DiagnoseOrderOnChain",
    data() {
        return {
            txHash: '',
            orders: [],
            order: {
                onChain: {'max': '',filled:'',cancelled:'',timestamp:'',recorded:''}
            }
        }
    },
    methods:{
        // eslint-disable-next-line no-unused-vars
        fmtBool(row, column, cellValue, index) {
            // row, column, cellValue, index
            return `${cellValue}`
        },
        loadList() {
            this.orders = []
            this.rpc(`system/get-order-on-chain?hash=${this.txHash}`).then(orderOnChain=>{
                this.order.onChain = orderOnChain;
                this.orders.push(this.order)
            })
        }
    }
}
</script>

<style scoped>

</style>