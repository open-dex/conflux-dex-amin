<template>
    <div>
        <el-tabs v-model="activeName"  @tab-click="changeTab">
            <el-tab-pane v-for="item in products" :name="item.name" :label="item.label" :key="item.name">
                <div>
                    <el-button size="small" @click="loadList(item.name)"><i class="el-icon-refresh"></i></el-button>
                    [{{item.name}}] {{ (tableData[item.name] || []).length}}
                </div>
                <el-table
                        :data="tableData[item.name]"
                        stripe
                        style="width: 100%">
                    <el-table-column prop="id" label="..." type="expand">
                        <template slot-scope="d">
                            {{JSON.stringify(d.row)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="id" label="id" ></el-table-column>
                    <el-table-column prop="amount" label="amount" ></el-table-column>
                    <el-table-column prop="funds" label="funds" ></el-table-column>
                    <el-table-column prop="price" label="price" ></el-table-column>
                    <el-table-column prop="side" label="side" ></el-table-column>
                    <el-table-column prop="status" label="status" ></el-table-column>
                    <el-table-column prop="txNonce" label="txNonce" ></el-table-column>
                    <el-table-column prop="updateTime" label="updateTime" :formatter='fmtDate'></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="SearchTrade" label="SearchTrade">
                <SearchTrade></SearchTrade>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import SearchTrade from "@/views/market/SearchTrade";
    export default {
        name: "Trade",
        components: {SearchTrade},
        data() {
            return {
                products: [],
                activeName: 'EOS-CNY',
                tableData: []
            }
        },
        methods: {
            changeTab(tab) {
                if (tab.name === 'SearchTrade') {
                    return;
                }
                console.info(tab.name);
                this.loadList(tab.name)
            },
            loadList(product) {
                this.tableData[product] = [];
                this.getRpc(`market/trades?product=${product}`).then((list)=>{
                    this.tableData[product] = list;
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