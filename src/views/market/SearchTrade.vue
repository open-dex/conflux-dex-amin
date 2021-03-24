<template>
    <div>
        <el-form inline>
            <el-form-item label="TradeId">
                <el-input size="mini" v-model="form.tradeId"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="mini" type="primary" @click="loadById">Search</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="trades" border>
            <el-table-column prop="id" label="..." type="expand">
                <template slot-scope="d">
                    <B>Hash:</B>{{d.row.txHash}}
                    <B> CreateTime:</B>{{d.row.createTime}}
                </template>
            </el-table-column>
            <el-table-column prop="id" label="id" ></el-table-column>
            <el-table-column prop="productId" label="productId" ></el-table-column>
            <el-table-column prop="amount" label="amount" ></el-table-column>
            <el-table-column prop="funds" label="funds" ></el-table-column>
            <el-table-column prop="price" label="price" ></el-table-column>
            <el-table-column prop="side" label="side" ></el-table-column>
            <el-table-column prop="status" label="status" ></el-table-column>
            <el-table-column prop="makerOrderId" label="makerOrderId" ></el-table-column>
            <el-table-column prop="takerOrderId" label="takerOrderId" ></el-table-column>
            <el-table-column prop="txNonce" label="txNonce" ></el-table-column>
            <el-table-column prop="updateTime" label="updateTime" :formatter='fmtDate'></el-table-column>
            <el-table-column prop="id" label="">
                <template slot-scope="d">
                    <span @click="remove(d.row)">OK</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: "SearchTrade",
    data() {
        return {
            form: {
                tradeId: 0
            },
            trades: []
        }
    },
    methods: {
        remove(row) {
            this.trades = this.trades.filter(o=>o.id !== row.id)
        },
        loadById() {
            this.rpc(`system/get-trade-by-id?id=${this.form.tradeId}`).then(data=>{
                if (data === null) {
                    data = {id : this.form.tradeId, txNonce: 'TradeNotFound'}
                }
                this.remove(data);
                this.trades.push(data)
            })
        }
    },
    mounted() {

    }
}
</script>

<style scoped>
span:hover {
    background-color: black;
    color: white;
    cursor: pointer;
}
</style>