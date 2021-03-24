<template>
  <div>
    <div>Trade {{symbol}} depth: <span @click="getDepth"><el-icon class="el-icon-refresh"></el-icon> </span></div>
    <el-row>
<!--    depth-->
      <el-col :span="8">
        <div>
          <div>Sell</div>
          <el-table :data="depth.Sell" :border="true" :cell-style="{color:'red', background: '#222'}" :show-header="false">
            <el-table-column prop="price" label="Price"></el-table-column>
            <el-table-column prop="amount" label="amount"></el-table-column>
          </el-table>
          <div>Buy</div>
          <el-table :data="depth.Buy" :border="true" :cell-style="{color:'green', background:'#222'}" :show-header="false">
            <el-table-column prop="price" label="Price"></el-table-column>
            <el-table-column prop="amount" label="amount"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="12">
        <el-row>
<!--          Sell-->
          <el-col :span="12">
            <el-form label-width="120px">
              <el-form-item label="Sell Price">
                <el-input-number size="mini" v-model="sellPrice" :step="0.1" :precision="1"></el-input-number>
              </el-form-item>
              <el-form-item :label="`Available ${symbol.substr(0, symbol.indexOf('-'))}`">
                {{baseBalance}}
                <span @click="getBalance"><el-icon class="el-icon-refresh"></el-icon> </span>
              </el-form-item>
              <el-form-item label="Sell Amount">
                <el-input-number size="mini" v-model="sellAmount"></el-input-number>
              </el-form-item>
              <el-form-item label="">
                <el-button size="mini" type="" @click="sell">Sell</el-button>
              </el-form-item>
            </el-form>
          </el-col>
<!--          buy-->
          <el-col :span="12">
            <el-form label-width="120px">
              <el-form-item label="Buy Price">
                <el-input-number size="mini" v-model="buyPrice" :step="0.1" :precision="1"></el-input-number>
              </el-form-item>
              <el-form-item :label="`Available ${symbol.substr(symbol.indexOf('-')+1)}`">
                {{quoteBalance}}
                <span @click="getBalance"><el-icon class="el-icon-refresh"></el-icon> </span>
              </el-form-item>
              <el-form-item label="Buy Amount">
                <el-input-number size="mini" v-model="buyAmount"></el-input-number>
              </el-form-item>
              <el-form-item label="">
                <el-button size="mini" type="" @click="buy">Buy</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <Funds ref="baseCurrency" v-bind:currency-id="product.baseCurrencyId"></Funds>
      </el-col>
      <el-col :span="12">
        <Funds ref="quoteCurrency" v-bind:currency-id="product.quoteCurrencyId"></Funds>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Funds from "@/views/dex/Funds";
import {init_domain, placeOrder as libPlaceOrder} from './dex_lib'
import {signV4} from "@/views/dex/portal";
import BigNumber from "bignumber.js";
export default {
  name: "Trade",
  components: {Funds},
  props:{
    symbol:{
      type: String
    }
  },
  data() {
    return {
      product:{
        baseCurrencyId: 0,
        quoteCurrencyId: 0,
      },
      depth:{
        Buy:[{price:2,amount:0}],
        Sell:[{price:1,amount:0}]
      },
      sellPrice:3, buyPrice:2.1,
      sellAmount:3.1, buyAmount:2.2,
      baseBalance:0,
      quoteBalance:0,
    }
  },
  methods:{
    async checkTokenAddress() {
      let child = this.$refs['baseCurrency'];
      let base = child.crclAddr
      let quote = this.$refs['quoteCurrency'].crclAddr;
      if (base === '-' || quote === '-') {
        child.loadCurrency()
        this.$refs['quoteCurrency'].loadCurrency()
        this.$message('token address not ready.')
        return Promise.reject('')
      }
      return Promise.resolve({base:base, quote: quote})
    },
    async placeOrder(order, signRet) {
      console.log(`sign ret:`, signRet)
      order.signature = signRet.result
      let url = `orders/place`;
      // url = `orders/place/test` // test api to check signature problem.
      this.rpc(url, order).then(data=>{
        this.$message(`place order OK, ${JSON.stringify(data)}`)
        this.getDepth()
      })
    },
    buildOrder(price, amount, side, accountHex) {
      let order = {
        address: accountHex,
        product: this.symbol,
        amount: new BigNumber(amount),
        price: new BigNumber(price),
        type: 'Limit',
        side: side, //Buy, Sell
        feeAddress: accountHex,
        feeRateMaker: new BigNumber(0),
        feeRateTaker: new BigNumber(0)
      }
      return order
    },
    async sell() {
      await this.orderProcess(this.sellPrice, this.sellAmount, 'Sell')
    },
    async orderProcess(price, amount, side) {
      const accounts = await window.conflux.send({method: 'cfx_accounts'})
      let accountHex = window.ConfluxJSSDK.format.hexAddress(accounts[0])
      let networkId = parseInt(window.conflux.networkId || window.conflux.chainId);
      let boomAddrRpc = (await this.getRpc(`common/boomflow`))
      init_domain(boomAddrRpc, networkId)
      this.checkTokenAddress().then(({base, quote})=>{
        let rawOrder = this.buildOrder(price, amount, side, accountHex);
        let dexOrder = libPlaceOrder(rawOrder, base, quote, networkId)
        rawOrder.timestamp = dexOrder.message.salt
        signV4(dexOrder, signRet=>this.placeOrder(rawOrder, signRet))
      }).catch(err=>{
        console.log(`sell fail:`, err)
      })
    },
    async buy() {
      await this.orderProcess(this.buyPrice, this.buyAmount, 'Buy')
    },
    async getBalance() {
      await window.conflux.enable()
      const accounts = await window.conflux.send({method: 'cfx_accounts'})
      let addr = accounts[0]
      this.getRpc(`accounts/${addr}/${this.symbol.substr(0, this.symbol.indexOf('-'))}`).then(data=>{
        this.baseBalance = data.available
      })
      this.getRpc(`accounts/${addr}/${this.symbol.substr(this.symbol.indexOf('-')+1)}`).then(data=>{
        this.quoteBalance = data.available
      })
    },
    getDepth() {
      this.getRpc(`/market/depth?product=${this.symbol}&depth=20&step=0`,).then(data=>{
        data.Sell.reverse()
        this.depth = data
      })
    }
  },
  mounted() {
    this.getRpc(`products/${this.symbol}`).then(data=>{
      this.product = data
    })
    this.getDepth()
  }
}
</script>

<style scoped>

</style>