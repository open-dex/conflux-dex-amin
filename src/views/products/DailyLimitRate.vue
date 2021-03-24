<template>
    <div>
        <div>
            <el-button type="primary" size="small" @click="showAdd"><i class="el-icon-plus"/>Add</el-button>
            <el-button size="small" @click="loadList"><i class="el-icon-refresh"/></el-button>
            <span style="margin-left: 10px" size="">Tips: Add new limit to replace current ones.</span>
            <span style="margin-left: 10px" size="">Update cache at Product List tab(trigger daily limit).</span>
            <el-dialog title="Add Daily Limit Rate" :visible.sync="showAddDialog">
                <el-form v-model="addForm" label-width="120px">
                    <el-form-item label="Product">
                        <el-select v-model="addForm.product">
                            <el-option v-for="item in products"
                                       :value="item"
                                       :label="item === '' ? 'Select' : item"
                                       :key="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Lower Limit Rate">
                        <el-input-number v-model="addForm.lowerLimitRate"></el-input-number>
                    </el-form-item>
                    <el-form-item label="Upper Limit Rate">
                        <el-input-number v-model="addForm.upperLimitRate"></el-input-number>
                    </el-form-item>
                    <el-form-item label="Initial Price">
                        <el-input-number v-model="addForm.initialPrice"></el-input-number>
                    </el-form-item>
                    <el-form-item>
                        <el-button :disabled="addForm.product === ''"
                                type="primary" size="small" @click="submit">Submit</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
        <el-table
                :data="tableData"
                stripe
                style="width: 100%">
            <el-table-column prop="productId" label="Product Id"></el-table-column>
            <el-table-column prop="name" label="Product Name"></el-table-column>
            <el-table-column prop="lowerLimitRate" label="Lower Limit Rate"></el-table-column>
            <el-table-column prop="upperLimitRate" label="Upper Limit Rate"></el-table-column>
            <el-table-column prop="initialPrice" label="Initial Price"></el-table-column>
        </el-table>
        <div>
            <Price></Price>
        </div>
    </div>
</template>

<script>
    import Price from "@/views/market/Price";
    export default {
        name: "DailyLimitRate",
        components: {Price},
        data() {
            return {
                tableData: [],
                productList: [], // product object list
                products: [''], // only names
                productMap: {},
                showAddDialog: false,
                addForm: {
                    product: '',
                    upperLimitRate: 0,
                    lowerLimitRate: 0,
                    initialPrice: 0,
                }
            }
        },
        methods: {
            submit() {
                const request = Object.assign({}, this.addForm);
                request.encodeType = 'products/encode-daily-limit-rate'
                // console.info('request is ', request);
                this.doCommand(request, 'products/dailyLimitRate', ()=>{
                    this.$message.info("Executed");
                    this.showAddDialog = false;
                    this.loadList();
                })
            },
            addTimeRange() {
                this.addForm.timeRanges.push({range: [
                        '00:00:00', '23:59:59'
                    ]})
            },
            removeTimeRange(i) {
                this.addForm.timeRanges.splice(i, 1)
            },
            showAdd() {
                this.showAddDialog = true;
            },
            loadList() {
                this.rpc('products/list-daily-limit-rate').then(data=>{
                    this.tableData = data;
                    this.fillProductName();
                })
            },
            loadProducts() {
                this.getRpc('products?offset=0&limit=20').then(data=>{
                    this.productList = data.items;
                    this.products = data.items.map(p=>p.name);
                    this.products.unshift('')
                    //
                    const map = {};
                    data.items.forEach(p=>map[p.id] = p);
                    this.productMap = map;
                    this.fillProductName();
                });
            },
            fillProductName() {
                if (this.products.length === 0) {
                    return;
                }
                if (Object.keys(this.productMap).length === 0) {
                    return;
                }
                this.tableData.forEach(p=>p['name'] = (this.productMap[p.productId] || {}).name );
            }
        },
        mounted() {
            this.loadList();
            this.loadProducts();
            this.addTimeRange()
        }
    }
</script>

<style scoped>

</style>