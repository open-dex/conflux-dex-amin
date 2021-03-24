<template>
  <div>
      Orders:
    <el-form ref="form" :model="form" label-width="80px" :inline="true">
        <el-form-item label="Product">
            <el-select v-model="form.productId"  size="mini">
                <el-option v-for="item in products"
                           :value="item.id"
                           :label="item === '' ? 'Select' : `${item.name}(${item.id})`"
                           :key="item.id">
                </el-option>
            </el-select>
            <span @click="loadProducts"><i class="el-icon-refresh"></i></span>
        </el-form-item>
      <el-form-item label="Address">
        <el-input v-model="form.address" @change="loadList" size="mini"
                  class="address" placeholder="0x"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="loadList" :disabled="form.address.length === 0" type="primary" size="mini">Search</el-button>
        {{msg}}
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
    <el-table :data="tableData" @expand-change="expandOrder">
      <el-table-column property="hash" label="..." type="expand">
        <template slot-scope="d" >
          <div style="background-color: #ffffff">
            <B>Hash</B>:{{ d.row.hash }} <B>filled_funds</B>:{{ d.row.filled_funds }} {{ d.row.side }}
            <span style="margin-left: 6px" @click="showOrderTrades(d.row)">Trades</span>
            <el-table :data="d.row.trades" border>
              <el-table-column property="id" label="Trade ID"></el-table-column>
              <el-table-column property="makerOrderId" label="makerOrderId"></el-table-column>
              <el-table-column property="takerOrderId" label="takerOrderId"></el-table-column>
              <el-table-column property="amount" label="amount"></el-table-column>
              <el-table-column property="txHash" label="txHash" type="expand" width="80">
                <template slot-scope="d2">
                  <B>Hash</B>:{{ d2.row.txHash }}
                </template>
              </el-table-column>
              <el-table-column property="txNonce" label="txNonce"></el-table-column>
              <el-table-column property="status" label="status"></el-table-column>
              <el-table-column property="createTime" label="createTime" :formatter='fmtDate'></el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="id" label="Order ID"></el-table-column>
      <el-table-column property="product_id" label="product_id"></el-table-column>
      <el-table-column property="status" label="status"></el-table-column>
      <el-table-column property="price" label="price"></el-table-column>
      <el-table-column property="amount" label="amount"></el-table-column>
      <el-table-column property="filled_amount" label="filled_amount"></el-table-column>
      <el-table-column property="type" label="type">
        <template slot-scope="d">
          {{d.row.type}} {{d.row.side}}
        </template>
      </el-table-column>
      <el-table-column property="create_time" label="createTime" :formatter='fmtDate'></el-table-column>
      <el-table-column property="update_time" label="updateTime" :formatter='fmtDate'></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "AccountOrderList",
  data() {
    return {
      tableData: [],
      msg: '',
      currencies: [],
        products: [],
      form: {
        address: '',
          offset: 0,
          limit: 10,
        page: 1,
        total: 0,
        productId: 1,
      }
    }
  },
  methods: {
    expandOrder(row) {
      this.showOrderTrades(row);
    },
    showOrderTrades(row) {
      this.getRpc(`orders/${row.id}/matches?limit=100`).then(data=>{
        row.trades = data;
      })
    },
    handleSizeChange(val) {
      this.form.limit = val;
      this.loadList();
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.form.offset = (this.form.page - 1) * this.form.limit;
      this.loadList();
    },

    filterCurrency(value, row) {
      return row.currency === value;
    },
    async loadList() {
      this.tableData = [];
      this.msg = "Loading..."
      const accounts = await this.getRpc(`accounts/${this.form.address}`)
      const uid = accounts.items[0].userId;
        this.rpc(`system/list-user-orders?userId=${uid}&productId=${this.form.productId}&skip=${this.form.offset}`
            +`&size=${this.form.limit}&startTimestamp=0&endTimestamp=${new Date().getTime()}`)
          .then(data=>{
            data.items.forEach(row=>row.trades = []);
            this.tableData = data.items;
            this.form.total = data.total;
            this.msg = '';
          })
    },
      loadProducts() {
          this.getRpc('products?offset=0&limit=20').then(data=>{
            console.info(`products`, data.items)
            data.items.sort((a,b)=>a.id-b.id)
              this.products = data.items;
              this.products.unshift('')
          });
      },
    // eslint-disable-next-line no-unused-vars
    fmtBool(row, column, cellValue, index) {
      // row, column, cellValue, index
      return `${cellValue}`
    },
  },
  mounted() {
    console.info(`mounted, account order list`)
    this.loadProducts();
    this.SimpleEvent.$on('showOrders', addr=>{
      console.info(`showOrders, account order list ${addr}`)
      this.form.address = addr;
      this.loadList();
    })
  },
  activated() {
  },
}
</script>

<style scoped>
.address{
  width: 600px;
}
</style>