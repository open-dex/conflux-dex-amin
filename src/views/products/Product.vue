<template>
    <div>
        <el-tabs v-model="activeName">
            <el-tab-pane name="productList" label="Product List">
                <ProductList></ProductList>
            </el-tab-pane>
            <el-tab-pane name="dailyLimit" label="Daily Limit Time">
                <DailyLimit></DailyLimit>
            </el-tab-pane>
            <el-tab-pane name="dailyLimitRate" label="Daily Limit Rate">
                <DailyLimitRate></DailyLimitRate>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import DailyLimit from "./DailyLimit";
    import ProductList from "./ProductList";
    import DailyLimitRate from "./DailyLimitRate";
    export default {
        name: "Product",
        components: {DailyLimitRate, ProductList, DailyLimit},
        data() {
            return {
                activeName: 'productList'
            }
        }
    }
</script>

<style scoped>

</style>