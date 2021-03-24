<template>
    <div>
        <p>Last closing price:</p>
        <el-button size="small" @click="refreshPrice"><i class="el-icon-refresh"/></el-button>
        {{msg}}
        <el-table
                :data="tableData"
                stripe
                style="width: 100%">
            <el-table-column prop="name" label="Product Name"></el-table-column>
            <el-table-column prop="lastClosingPrice" label="lastClosingPrice"></el-table-column>
            <el-table-column prop="time" label="time" :formatter="fmtDate"></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: "Price",
    data() {
        return {
            tableData: [],
            msg: ''
        }
    },
    methods: {
        loadProducts() {
            this.getRpc('products?offset=0&limit=20').then(data => {
                data.items.forEach(p=>p['lastClosingPrice'] = '--')
                this.tableData = data.items;
                this.refreshPrice();
            });
        },
        refreshPrice() {
            this.tableData.forEach(p=>this.loadPrice(p))
        },
        loadPrice(productObj) {
            productObj['lastClosingPrice'] = 'Loading...';
            this.getRpc(`market/trades/last-closing-price?product=${productObj.name}`).then(data=>{
                productObj['lastClosingPrice'] = data.price;
                productObj['time'] = data.time;
            })
        }
    },
    mounted() {
        this.loadProducts();
    }
}
</script>

<style scoped>

</style>