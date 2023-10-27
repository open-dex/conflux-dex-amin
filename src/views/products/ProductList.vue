<template>
    <div>
        <div>
            <el-button type="primary" size="mini" @click="showAdd"><i class="el-icon-plus"/>Add</el-button>
            <el-checkbox style="margin: 6px 6px" v-model="filter" @change="loadList">filter disabled</el-checkbox>
            <el-button size="mini" @click="loadList"><i class="el-icon-refresh"/></el-button>
            <el-button @click="clearListCache" type="" size="mini">Clear List Cache</el-button>
            <el-dialog title="Add Product" :visible.sync="showAddDialog">
                <el-form v-model="addForm" label-width="200px" size="mini">
                    <el-form-item label="Name">
                      <el-row>
                        <el-col :span="6">
                          <el-input v-model="addForm.name"></el-input>
                        </el-col>
                        <el-col :span="6"><el-button :disabled="addForm.checkedCurrencies.length<2" :style="{marginLeft:'6px'}" @click="()=>{
                          if (addForm.checkedCurrencies.length===2) {
                            addForm.name = (currencies.find(c=>c.id===addForm.checkedCurrencies[0]) || {}).name
                             + '-' + (currencies.find(c=>c.id===addForm.checkedCurrencies[1]) || {}).name
                          }
                        }" size="mini">Build Name</el-button></el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item label="Select Currency">
                        <el-checkbox-group
                                v-model="addForm.checkedCurrencies"
                                :min="0"
                                :max="2">
                            <el-checkbox
                                v-for="item in currencies"
                                v-model="item.checked"
                                :label="item.id"
                                :key="item.id">{{item.id}}:{{item.name}}</el-checkbox>
                        </el-checkbox-group>
                    <el-button @click="loadList" size="mini">Reload currencies</el-button>
                    </el-form-item>
                    <el-form-item label="Currency Pair">
                        <el-row>
                            <el-col :span="12">Base:<span style="color:#409EFF; font-weight: 500;">{{(currencies.find(c=>c.id===addForm.checkedCurrencies[0]) || {}).name}}</span></el-col>
                            <el-col :span="12">Quote:<span style="color:#409EFF; font-weight: 500;">{{(currencies.find(c=>c.id===addForm.checkedCurrencies[1]) || {}).name}}</span></el-col>
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
            <el-table-column prop="name" label="Name" width="150">
                <template slot-scope="d">
                    {{d.row.name}}
                    <br/>
                    <span style="color: #ff0000">{{ d.row.disabled ? 'disabled' : '' }}</span>
                </template>
            </el-table-column>
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
                filter: false,
                products: [],
                showAddDialog: false,
                showEditDialog: false,
                currencies: [],
                editForm: {
                    name: '',
                    baseCurrencyId: -1,
                    quoteCurrencyId: -1,
                    fundsPrecision: 6,
                    pricePrecision: 6,
                    amountPrecision: 6,
                    maxOrderAmount: 99999999.999999,
                    minOrderAmount: 0.000001,
                    minOrderFunds: 0.000001,
                },
                addForm: {
                    checkedCurrencies: [],

                    name: '',
                    baseCurrencyId: -1,
                    quoteCurrencyId: -1,
                    fundsPrecision: 6,
                    pricePrecision: 6,
                    amountPrecision: 6,
                    maxOrderAmount: 99999999.999999,
                    minOrderAmount: 0.000001,
                    minOrderFunds: 0.000001,
                }
            }
        },
        methods: {
            submit() {
                const product = Object.assign({}, this.addForm);
                product.baseCurrencyId = this.addForm.checkedCurrencies[0];
                product.quoteCurrencyId = this.addForm.checkedCurrencies[1];
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
                const filterIt = this.filter ? '' : '&filter=false'
                this.getRpc(`products?offset=0&limit=20${filterIt}`).then(data=>{
                    data.items.sort((a,b)=>a.id - b.id);
                    this.products = data.items
                });
                this.getRpc('currencies?offset=0&limit=20').then(data=>{
                    this.currencies = data.items;
                })
            },
            clearListCache() {
                const body = {
                    key: 'list',
                    cacheName: 'dao.product',
                };
                this.rpc('cache/ehcache/remove', body).then(removed=>{
                    this.$notify({
                        title: 'Remove result',
                        message: removed ? 'Removed' : 'Not found',
                        type: removed ? 'success' : 'warning'
                    });
                    this.loadList();
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