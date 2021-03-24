<template>
    <div>
        <div>
            <el-button type="primary" size="small" @click="showAdd"><i class="el-icon-plus"/>Add</el-button>
            <el-button size="small" @click="loadList"><i class="el-icon-refresh"/></el-button>
            <el-tag style="margin-left: 10px" size="">Add new limit to replace current ones.</el-tag>
            <el-dialog title="Add Daily Limit" :visible.sync="showAddDialog">
                <el-form v-model="addForm" label-width="80px">
                    <el-form-item label="Product">
                        <el-select v-model="addForm.product">
                            <el-option v-for="item in products"
                                       :value="item"
                                       :label="item === '' ? 'Select' : item"
                                       :key="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-for="(item, index) in addForm.timeRanges" :key="index" :label="'Time '+(1+index)">
                        <el-time-picker
                                is-range value-format="HH:mm:ss"
                                v-model="item.range"
                                range-separator="-"
                                start-placeholder="Start"
                                end-placeholder="End"
                                placeholder="Time Range">
                        </el-time-picker>
                        <el-button v-if="index === addForm.timeRanges.length - 1" @click.prevent="addTimeRange(index)">
                            <i class="el-icon-circle-plus"></i>
                        </el-button>
                        <el-button v-else @click.prevent="removeTimeRange(index)">
                            <i class="el-icon-minus"></i>
                        </el-button>
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
            <el-table-column prop="id" label="Id" ></el-table-column>
            <el-table-column prop="productId" label="Product Id"></el-table-column>
            <el-table-column prop="name" label="Product Name"></el-table-column>
            <el-table-column prop="startTime" label="Start Time"></el-table-column>
            <el-table-column prop="endTime" label="End Time"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "DailyLimit",
        data() {
            return {
                tableData: [],
                products: [''],
                productMap: {},
                showAddDialog: false,
                addForm: {
                    product: '',
                    timeRanges: []
                }
            }
        },
        methods: {
            submit() {
                const request = {
                    product: this.addForm.product,
                    startTimes: [],
                    endTimes: [],
                    encodeType: 'products/encode-daily-limit'
                };
                this.addForm.timeRanges.forEach(pair=>{
                    request.startTimes.push(pair.range[0]);
                    request.endTimes.push(pair.range[1]);
                });
                // console.info('request is ', request);
                this.doCommand(request, 'products/dailyLimit', ()=>{
                    this.$message.info("Executed");
                    this.showAddDialog = false;
                    this.loadList();
                });
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
                this.rpc('products/list-daily-limit').then(data=>{
                    this.tableData = data;
                    this.fillProductName();
                })
            },
            loadProducts() {
                this.getRpc('products?offset=0&limit=20').then(data=>{
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