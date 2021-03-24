<template>
    <div>
        Orders:
        <el-tabs v-model="activeName"  @tab-click="changeTab">
            <el-tab-pane v-for="item in products" :name="item.name" :label="item.label" :key="item.name">
                {{message}}
                <div>
                    <el-tag type="">Pending:</el-tag>
                    <el-button size="small" class="ml6"
                               @click="loadList(item.name, 'Pending')"><i class="el-icon-refresh"></i></el-button>
                    [{{item.label}}] {{ (tableData[item.name+'Pending'] || []).length}}
                </div>
                <el-table
                        :data="tableData[item.name+'Pending']"
                        stripe
                        style="width: 100%">
                    <el-table-column prop="id" label="id" ></el-table-column>
                    <el-table-column prop="productId" label="productId" ></el-table-column>
                    <el-table-column prop="price" label="price" ></el-table-column>
                    <el-table-column prop="amount" label="amount" ></el-table-column>
                    <el-table-column prop="filledAmount" label="filledAmount" ></el-table-column>
                    <el-table-column prop="side" label="side" ></el-table-column>
                    <el-table-column prop="hash" label="hash" ></el-table-column>
                    <el-table-column prop="status" label="status" ></el-table-column>
                    <el-table-column prop="type" label="type" ></el-table-column>
                    <el-table-column prop="userId" label="userId" ></el-table-column>
                    <el-table-column prop="createTime" label="createTime" :formatter='fmtDate'></el-table-column>
                    <el-table-column prop="updateTime" label="updateTime" :formatter='fmtDate'></el-table-column>
                </el-table>
                <el-divider>-</el-divider>
                <div>
                    <el-tag>Open:</el-tag>
                    <el-button class="ml6" size="small"
                               @click="loadList(item.name, 'Open')">
                        <i class="el-icon-refresh"></i>
                    </el-button>
                    [{{item.label}}] {{ (tableData[item.name+'Open'] || []).length}}
                </div>
                <el-table
                        :data="tableData[item.name+'Open']"
                        stripe
                        style="width: 100%">
                    <el-table-column prop="id" label="id" ></el-table-column>
                    <el-table-column prop="productId" label="productId" ></el-table-column>
                    <el-table-column prop="price" label="price" ></el-table-column>
                    <el-table-column prop="amount" label="amount" ></el-table-column>
                    <el-table-column prop="filledAmount" label="filledAmount" ></el-table-column>
                    <el-table-column prop="side" label="side" ></el-table-column>
                    <el-table-column prop="hash" label="hash" ></el-table-column>
                    <el-table-column prop="status" label="status" ></el-table-column>
                    <el-table-column prop="type" label="type" ></el-table-column>
                    <el-table-column prop="userId" label="userId" ></el-table-column>
                    <el-table-column prop="createTime" label="createTime" :formatter='fmtDate'></el-table-column>
                    <el-table-column prop="updateTime" label="updateTime" :formatter='fmtDate'></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="SearchOrder" name="SearchOrder">
                <SearchOrder></SearchOrder>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import SearchOrder from "@/views/market/SearchOrder";
    export default {
        name: "OrderList",
        components: {SearchOrder},
        data() {
            return {
                products: [],
                activeName: 'EOS-CNY',
                tableData: [],
                message: ''
            }
        },
        methods: {
            changeTab(tab) {
                if (tab.name === 'SearchOrder') {
                    return;
                }
                console.info(tab.name);
                this.loadList(tab.name, 'Pending')
                this.loadList(tab.name, 'Open')
            },
            loadList(product, status) {
                if (product === 'All') {
                    product = '';
                }
                this.tableData[product+status] = [];
                this.message = 'Loading'
                this.getRpc(`orders/monitor?product=${product}&status=${status}`).then((list)=>{
                    this.tableData[product+status] = list;
                    this.message = ''
                    this.$forceUpdate();
                    console.info(`${product} ${status} loaded trades ${list.length}`)
                })
            },
            loadProducts() {
                this.getRpc('products?offset=0&limit=20').then(data=> {
                    data.items.forEach(item=>item.label = item.name)
                    data.items.push({label: 'All', name: ''})
                    this.products = data.items;
                    const hasProduct = this.products.filter(p=>p.name === this.activeName).length > 0;
                    if (!hasProduct) {
                      this.activeName = (this.products[0] || {}).name;
                    }
                  this.changeTab({name: this.activeName})
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
    .ml6{
        margin-left: 6px;
    }
</style>