<template>
    <div>
        Tick
        <el-select v-model="period" size="small" @change="loadList(activeName)">
            <el-option v-for="item in periods" :label="item" :key="item" :value="item"></el-option>
        </el-select>
        <el-tabs v-model="activeName"  @tab-click="changeTab">
            <el-tab-pane v-for="item in products" :name="item.name" :label="item.label" :key="item.name">
                <div>
                    <el-button size="small" @click="loadList(item.name)"><i class="el-icon-refresh"></i></el-button>
                    [{{item.name}}] {{ (tableData[item.name] || []).length}}
                    {{message[item.name]}}
                </div>
                <el-table
                        :data="tableData[item.name]"
                        stripe
                        style="width: 100%">
                    <el-table-column prop="id" label="id"></el-table-column>
                    <el-table-column prop="open" label="open" ></el-table-column>
                    <el-table-column prop="close" label="close" ></el-table-column>
                    <el-table-column prop="low" label="low" ></el-table-column>
                    <el-table-column prop="high" label="high" ></el-table-column>
                    <el-table-column prop="count" label="count" ></el-table-column>
                    <el-table-column prop="baseCurrencyVolume" label="baseCurrencyVolume" ></el-table-column>
                    <el-table-column prop="quoteCurrencyVolume" label="quoteCurrencyVolume" ></el-table-column>
                    <el-table-column prop="createTime" label="createTime" :formatter='fmtDate' width="160"></el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        name: "Tick",
        data() {
            return {
                products: [],
                periods: ['1min', '5min', '15min', '30min', '60min', '1day', '1week', '1month'],
                activeName: 'EOS-CNY',
                message: [],
                period: '1min',
                tableData: []
            }
        },
        methods: {
            changeTab(tab) {
                console.info(tab.name);
                this.loadList(tab.name)
            },
            loadList(product) {
                this.tableData[product] = [];
                this.message[product] = 'Loading...';
                this.getRpc(`market/tickers?product=${product}&period=${this.period}`).then((list)=>{
                    this.tableData[product] = list;
                    this.message[product] = '';
                    this.$forceUpdate();
                    console.info(`${product} loaded trades ${list.length}`)
                })
            },
            loadProducts() {
                this.getRpc('products?offset=0&limit=20').then(data=> {
                    data.items.forEach(item=>item.label = item.name)
                    this.products = data.items;
                    const hasProduct = this.products.filter(p=>p.name === this.activeName).length > 0;
                    if (!hasProduct) {
                      this.activeName = (this.products[0] || {}).name;
                    }
                });
            }
        },
        mounted() {
            this.loadProducts();
            // this.loadList();
        }
    }
</script>

<style scoped>

</style>