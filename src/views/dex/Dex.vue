<template>
  <div>
    <div>Welcome to Conflux Open DEX</div>
    <el-tabs v-model="active">
      <el-tab-pane :label="item" v-for="item in pairs" :key="item" :name="item">
        <Trade v-if="item === active" v-bind:symbol="item"></Trade>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Trade from "@/views/dex/Trade";

export default {
  name: "Dex",
  components:{Trade},
  data() {
    return {
      active:'CFX-USDT',
      pairs:['CFX-USDT','FC-USDT','EOS-KCoin','BTC-USDT','ETH-USDT'],
    }
  },
  methods:{

  },
  mounted() {

  }
}
</script>

<style scoped>

</style>