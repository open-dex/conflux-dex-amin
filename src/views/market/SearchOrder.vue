<template>
    <div>
        <el-form inline>
            <el-form-item label="OrderId">
                <el-input size="mini" v-model="form.orderId"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="mini" type="primary" @click="loadById">Search</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="orders" border>
            <el-table-column prop="id" label="..." type="expand">
                <template slot-scope="d">
                    <B>Hash:</B>{{d.row.hash}}
                    <B>signature:</B>{{d.row.signature}}
                </template>
            </el-table-column>
            <el-table-column prop="id" label="id"></el-table-column>
            <el-table-column prop="productId" label="productId" ></el-table-column>
            <el-table-column prop="price" label="price" ></el-table-column>
            <el-table-column prop="amount" label="amount" ></el-table-column>
            <el-table-column prop="filledAmount" label="filledAmount" ></el-table-column>
            <el-table-column prop="side" label="side" ></el-table-column>
            <el-table-column prop="status" label="status" ></el-table-column>
            <el-table-column prop="type" label="type" ></el-table-column>
            <el-table-column prop="userId" label="userId" ></el-table-column>
            <el-table-column prop="createTime" label="createTime" :formatter='fmtDate'></el-table-column>
            <el-table-column prop="updateTime" label="updateTime" :formatter='fmtDate'></el-table-column>
            <el-table-column prop="id" label="...">
                <template slot-scope="d">
                    <span @click="remove(d.row)">OK</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: "SearchOrder",
    data() {
        return {
            form: {
                orderId: 0
            },
            orders: []
        }
    },
    methods: {
        remove(row) {
            this.orders = this.orders.filter(o=>o.id !== row.id)
        },
        loadById() {
            this.getRpc(`orders/${this.form.orderId}`).then(data=>{
                this.remove(data)
                this.orders.push(data)
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