<template>
    <div>
        <el-form inline>
            <el-form-item label="Nonce">
                <el-input v-model="nonce" size="mini" style="width: 500px" @change="loadList"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="mini" type="primary" @click="loadList()">Search</el-button>
            </el-form-item>
        </el-form>
        {{ tableData.length }}
        <el-table
                :data="tableData"
                stripe @expand-change="loadOrderOnChain"
                style="width: 100%">
            <el-table-column prop="id" label="" type="expand">
                <template slot-scope="d">
                    <B>Hash:</B>{{d.row.txHash}}
                    <el-table border
                            :data="d.row.orders">
                        <el-table-column prop="ui_name" label="Side"></el-table-column>
                        <el-table-column prop="onChain.recorded" label="onChain.recorded" :formatter='fmtBool'></el-table-column>
                        <el-table-column prop="onChain.filled" label="onChain.filled"></el-table-column>
                        <el-table-column prop="onChain.cancelled" label="onChain.cancelled" :formatter='fmtBool'></el-table-column>
                        <el-table-column prop="onChain.max" label="onChain.max"></el-table-column>
                        <el-table-column prop="onChain.timestamp" label="onChain.timestamp"></el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column prop="id" label="id"></el-table-column>
            <el-table-column prop="amount" label="amount"></el-table-column>
            <el-table-column prop="funds" label="funds"></el-table-column>
            <el-table-column prop="price" label="price"></el-table-column>
            <el-table-column prop="side" label="side"></el-table-column>
            <el-table-column prop="status" label="status"></el-table-column>
            <el-table-column prop="txNonce" label="txNonce"></el-table-column>
            <el-table-column prop="updateTime" label="updateTime" :formatter='fmtDate'></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: "AdminTrade",
    data() {
        return {
            tableData: [],
            nonce: ''
        }
    },
    methods: {
        // eslint-disable-next-line no-unused-vars
        fmtBool(row, column, cellValue, index) {
            // row, column, cellValue, index
            return `${cellValue}`
        },
        loadOrderOnChain(row) {
            [row.takerOrderId, row.makerOrderId].forEach((id, index)=>{
                this.getRpc(`orders/${id}`).then(order=>{
                    order['ui_name'] = index === 0 ? 'Taker' : 'Maker'
                    order.onChain = {'max': '',filled:'',cancelled:'',timestamp:'',recorded:''}
                    row.orders.push(order)
                    this.rpc(`system/get-order-on-chain?hash=${row.txHash}`).then(orderOnChain=>{
                        order.onChain = orderOnChain;
                    })
                })

            })
        },
        loadList() {
            this.tableData = [];
            this.rpc(`system/list-trade-by-nonce?nonce=${this.nonce}`).then((list) => {
                list.forEach(row=>row.orders = [])
                this.tableData = list;
            })
        },
    },
    mounted() {
    }
}
</script>

<style scoped>

</style>