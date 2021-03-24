<template>
    <div>
        <div>
            <el-button type="primary" size="small" @click="showAdd"><i class="el-icon-plus"/>Add</el-button>
            <el-button size="small" @click="loadList"><i class="el-icon-refresh"/></el-button>
            <el-dialog title="Add Product" :visible.sync="showAddDialog">
                <el-form v-model="addForm" label-width="200px">
                    <el-form-item label="Name">
                        <el-input v-model="addForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="Select Currency">
                        <el-checkbox-group
                                v-model="addForm.checkedCurrencies"
                                :min="0"
                                :max="2">
                            <el-checkbox v-for="item in currencies" :label="item" :key="item.id">{{item.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="Currency Pair">
                        <el-row>
                            <el-col :span="12">Base:<span style="color:#409EFF; font-weight: 500;">{{(addForm.checkedCurrencies[0] || {}).name}}</span></el-col>
                            <el-col :span="12">Quote:<span style="color:#409EFF; font-weight: 500;">{{(addForm.checkedCurrencies[1] || {}).name}}</span></el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="Funds Precision">
                        <el-input v-model="addForm.fundsPrecision"></el-input>
                    </el-form-item>
                    <el-form-item label="Price Precision">
                        <el-input v-model="addForm.pricePrecision"></el-input>
                    </el-form-item>
                    <el-form-item label="Amount Precision">
                        <el-input v-model="addForm.amountPrecision"></el-input>
                    </el-form-item>
                    <el-form-item label="Max Order Amount">
                        <el-input v-model="addForm.maxOrderAmount"></el-input>
                    </el-form-item>
                    <el-form-item label="Min Order Amount">
                        <el-input v-model="addForm.minOrderAmount"></el-input>
                    </el-form-item>
                    <el-form-item label="Min Order Funds">
                        <el-input v-model="addForm.minOrderFunds"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :disabled="addForm.name === '' || addForm.checkedCurrencies.length !== 2"
                                type="primary" size="small" @click="submit">Submit</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
        <el-table
                :data="products"
                stripe
                style="width: 100%">
            <el-table-column prop="id" label="Id" width="40" ></el-table-column>
            <el-table-column prop="name" label="Name" width="100"></el-table-column>
            <el-table-column prop="" label="Currency Id" width="100">
                <template slot-scope="d">
                    {{d.row.baseCurrencyId}}-{{d.row.quoteCurrencyId}}
                </template>
            </el-table-column>
            <el-table-column prop="" label="Precision">
                <template slot-scope="d">
                    <div>Funds Precision:{{d.row.fundsPrecision}}</div>
                    <div>Price Precision:{{d.row.pricePrecision}}</div>
                    <div>Amount Precision:{{d.row.amountPrecision}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="" label="Order">
                <template slot-scope="d">
                    <div>Max Order Amount:{{d.row.maxOrderAmount}}</div>
                    <div>Min Order Amount:{{d.row.minOrderAmount}}</div>
                    <div>Min Order Funds:{{d.row.minOrderFunds}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="" label="Trigger daily limit status">
                <template slot-scope="d">
                    <el-link @click="triggerOpenStatus(d.row.name, true)">Open</el-link>
                    <el-link style="margin-left: 10px"
                            @click="triggerOpenStatus(d.row.name, false)">Close</el-link>
                </template>
            </el-table-column>
            <el-table-column width="40">
                <template slot-scope="d">
                    <el-link @click="showEdit(d.row)">
                        <i class="el-icon-edit-outline"></i>
                    </el-link>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="`Edit Product - ${editForm.name}`" :visible.sync="showEditDialog">
            <el-form v-model="editForm" label-width="200px">
                <el-form-item label="Funds Precision">
                    <el-input v-model="editForm.fundsPrecision"></el-input>
                </el-form-item>
                <el-form-item label="Price Precision">
                    <el-input v-model="editForm.pricePrecision"></el-input>
                </el-form-item>
                <el-form-item label="Amount Precision">
                    <el-input v-model="editForm.amountPrecision"></el-input>
                </el-form-item>
                <el-form-item label="Max Order Amount">
                    <el-input v-model="editForm.maxOrderAmount"></el-input>
                </el-form-item>
                <el-form-item label="Min Order Amount">
                    <el-input v-model="editForm.minOrderAmount"></el-input>
                </el-form-item>
                <el-form-item label="Min Order Funds">
                    <el-input v-model="editForm.minOrderFunds"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                               type="primary" size="small" @click="edit">Update</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "ProductList",
        data() {
            return {
                products: [],
                showAddDialog: false,
                showEditDialog: false,
                currencies: [],
                editForm: {
                    name: '',
                    baseCurrencyId: -1,
                    quoteCurrencyId: -1,
                    fundsPrecision: 8,
                    pricePrecision: 2,
                    amountPrecision: 6,
                    maxOrderAmount: 99999999.999999,
                    minOrderAmount: 0.0001,
                    minOrderFunds: 1e-8,
                },
                addForm: {
                    checkedCurrencies: [],

                    name: '',
                    baseCurrencyId: -1,
                    quoteCurrencyId: -1,
                    fundsPrecision: 8,
                    pricePrecision: 2,
                    amountPrecision: 6,
                    maxOrderAmount: 99999999.999999,
                    minOrderAmount: 0.0001,
                    minOrderFunds: 1e-8,
                }
            }
        },
        methods: {
            submit() {
                const product = Object.assign({}, this.addForm);
                product.baseCurrencyId = this.addForm.checkedCurrencies[0].id;
                product.quoteCurrencyId = this.addForm.checkedCurrencies[1].id;
                delete product.checkedCurrencies;
                const request = {product};
                request.encodeType = 'products/encode-add-product';
                // console.info('request is ', request);
                this.doCommand(request, 'products', ()=>{
                    this.$message.info("Executed");
                    this.showAddDialog = false;
                    this.loadList();
                })
            },
            edit() {
                let request = Object.assign({},this.editForm);
                request.product = request.name;
                request.encodeType = 'products/encode-update-product';
                this.doCommand(request, 'products/update-product', ()=>{
                    this.showEditDialog = false;
                    this.$message.info('Updated');
                    this.loadList();
                })
            },
            showEdit(p) {
                Object.assign(this.editForm, p);
                this.showEditDialog = true;
            },
            showAdd() {
                this.showAddDialog = true;
            },
            triggerOpenStatus(name, open) {
                const request = {product: name, open: open}
                request.encodeType = 'products/encode-change-product-open-status';
                this.doCommand(request, 'products/dailyLimit/changeStatus', ()=>{
                    this.showEditDialog = false;
                    this.$message.info('Updated');
                    this.loadList();
                })
            },
            loadList() {
                this.products = [];
                this.getRpc('products?offset=0&limit=20').then(data=>{
                    data.items.sort((a,b)=>a.id - b.id);
                    this.products = data.items
                });
                this.getRpc('currencies?offset=0&limit=20').then(data=>{
                    this.currencies = data.items;
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