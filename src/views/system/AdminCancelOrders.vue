<template>
  <div>
    <el-form v-model="cancelOrderForm" class="left" label-width="120px" >
      <el-form-item label="User Address">
        <el-input v-model="cancelOrderForm.userAddress" style="width: 400px"/>
      </el-form-item>
      <el-form-item label="Product">
        <el-select v-model="cancelOrderForm.product">
          <el-option v-for="item in products"
                     :value="item"
                     :label="item === '' ? 'ALL' : item"
                     :key="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancelOrder" type="primary">Cancel Order</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "AdminCancelOrders",
  data() {
    return {
      products: [''],
      cancelOrderForm: {
        userAddress: '',
        product: ''
      }
    }
  },
  methods:{
    cancelOrder() {
      const request = {
        userAddress: this.cancelOrderForm.userAddress,
        product: this.cancelOrderForm.product,
        encodeType: 'system/orders/encode-cancel'
      }
      this.doCommand(request, 'system/orders/cancel', (ret)=>{
        if ( typeof ret !== 'undefined'){
          this.$message("Executed!")
        }
      });
    },
    loadProducts() {
      this.getRpc('products?offset=0&limit=20').then(data=>{
        this.products = data.items.map(p=>p.name);
        this.products.unshift('')
      });
    }
  },
  mounted() {
    this.loadProducts();
  }
}
</script>

<style scoped>

</style>