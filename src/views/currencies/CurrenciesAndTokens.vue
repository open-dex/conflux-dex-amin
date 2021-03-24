<template>
    <div>
        <el-tabs v-model="activeName">
            <el-tab-pane name="currencies" label="Currencies">
                <Currencies></Currencies>
            </el-tab-pane>
            <el-tab-pane name="tokens" label="Cross-chain Tokens">
                <Tokens></Tokens>
            </el-tab-pane>
            <el-tab-pane name="addCurrency" label="Add Currency">
                <AddCurrency></AddCurrency>
            </el-tab-pane>
            <el-tab-pane name="ListenedAddress" label="Listened Addresses">
                <ListenedAddress></ListenedAddress>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import Currencies from "./Currencies";
    import Tokens from "./Tokens";
    import AddCurrency from "@/views/currencies/AddCurrency";
    import ListenedAddress from "@/views/currencies/ListenedAddress";
    export default {
        name: "CurrenciesAndTokens",
        data() {
            return {
                activeName: 'currencies'
            }
        },
        components: {ListenedAddress, AddCurrency, Tokens, Currencies}
    }
</script>

<style scoped>

</style>