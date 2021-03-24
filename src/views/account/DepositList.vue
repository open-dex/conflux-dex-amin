<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px" :inline="true">
            <el-form-item label="Currency">
                <el-select v-model="form.productId" size="mini">
                    <el-option v-for="item in allCurrencies"
                               :value="item.id"
                               :label="item === '' ? 'Select' : `${item.name}(${item.id})`"
                               :key="item.id">
                    </el-option>
                </el-select>
                <span size="mini" @click="loadCurrencies"><i class="el-icon-refresh"></i> </span>
            </el-form-item>
            <el-form-item label="Address">
                <el-input v-model="form.address" @change="loadList" clearable  size="mini"
                          class="address" placeholder="0x"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="loadList"  size="mini">Search</el-button>
                {{ msg }}
            </el-form-item>
        </el-form>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="form.page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="form.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="form.total"
        ></el-pagination>
        <el-table :data="tableData">
            <el-table-column property="id" label="..." type="expand">
                <template slot-scope="d">
                    <template  v-for="key in Object.keys(d.row).sort((a,b)=>a.length-b.length)">
                        <div v-if="d.row[key].length > 30" :key="key"><B>{{ key }}:</B>{{ d.row[key] }}</div>
                        <span :key="key" v-else><B :key="key">{{ key }}:</B>
                            <span style="margin-right: 6px">{{ d.row[key] }}</span>
                        </span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column property="id" label="ID" width="120px"></el-table-column>
            <el-table-column property="currency"  width="120px"
                             :filters="currencies"
                             :filter-method="filterCurrency"
                             label="Currency"></el-table-column>
            <el-table-column property="amount" label="amount"></el-table-column>
            <el-table-column property="userAddress" label="userAddress"></el-table-column>
            <el-table-column property="createTime" label="createTime"  width="160px" :formatter='fmtDate'></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: "DepositList",
    data() {
        return {
            tableData: [],
            currencies: [],
            msg: '',
            allCurrencies: [],
            form: {
                address: '',
                page: 1,
                limit: 10,
                total: 0,
                productId: 0,
                offset: 0,
            }
        }
    },
    methods: {
        handleSizeChange(val) {
            this.form.limit = val;
            this.loadList();
        },
        handleCurrentChange(val) {
            this.form.page = val;
            this.form.offset = (this.form.page - 1) * this.form.limit;
            this.loadList();
        },

        loadCurrencies() {
            this.getRpc('currencies?offset=0&limit=20').then(data => {
                data.items.unshift({id: 0, name: 'ALL'})
                this.allCurrencies = data.items;
            })
        },
        filterCurrency(value, row) {
            return row.currency === value;
        },
        loadList() {
            this.tableData = [];
            this.msg = "Loading..."
            const pageStr = `offset=${this.form.offset}&limit=${this.form.limit}`;
            const pid = this.form.productId;
            let selC = this.allCurrencies.filter(p => p.id == pid)[0];
            const currency = selC.name;
            const currencyPath = pid === 0 ? "" : `/${currency}`
            let url = `accounts/deposit/${this.form.address}${currencyPath}?${pageStr}`;
            console.info(`pid ${pid}, c ${currency}, cp ${currencyPath}, url ${url}`, selC)
            if (this.form.address.length === 0) {
                this.rpc(`system/list-deposit?currency=${pid === 0 ? '' : currency}&${pageStr}`).then(data => {
                    this.fillData(data);
                })
                return;
            }
            this.getRpc(url)
                .then(this.fillData)
        },
        fillData: function (data) {
            this.tableData = data.items;
            this.form.total = data.total;
            this.currencies = [...new Set(data.items.map(row => row.currency))]
                .map(row => {
                    return {text: row, value: row}
                });
            this.msg = '';
        },
    },
    mounted() {
        this.loadCurrencies();
    },
}
</script>

<style scoped>
.address {
    width: 350px;
}
</style>