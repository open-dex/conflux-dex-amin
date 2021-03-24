<template>
    <div>
        <el-tabs v-model="activeName" >
            <el-tab-pane name="list" label="User List">
                <AccountList></AccountList>
            </el-tab-pane>
            <el-tab-pane name="info" label="AccountInfo">
                <Account></Account>
            </el-tab-pane>
            <el-tab-pane name="withdraw" label="Withdraw">
                <Bank></Bank>
            </el-tab-pane>
          <el-tab-pane name="withdrawList" label="Withdraw History">
            <WithdrawList></WithdrawList>
          </el-tab-pane>
          <el-tab-pane name="depositList" label="Deposit History">
            <deposit-list></deposit-list>
          </el-tab-pane>
            <el-tab-pane name="orderList" label="Order History">
                <AccountOrderList></AccountOrderList>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import Account from "./Account";
    import AccountList from "./AccountList";
    import Bank from "./Bank";
    import WithdrawList from "@/views/account/WithdrawList";
    import DepositList from "@/views/account/DepositList";
    import AccountOrderList from "@/views/account/AccountOrderList";
    export default {
        name: "AccountIndex",
        components: {AccountOrderList, DepositList, WithdrawList, Bank, AccountList, Account},
        data() {
            return {
                activeName: 'list'
            }
        },
        mounted() {
          this.SimpleEvent.$on('showOrders', ()=>{
            this.activeName = 'orderList'
          })
          this.SimpleEvent.$on('showAccounts', ()=>{
            this.activeName = 'info'
          })
        }
    }
</script>

<style scoped>

</style>