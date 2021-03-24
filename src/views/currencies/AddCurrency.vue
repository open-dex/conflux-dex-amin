<template>
    <el-form ref="form" :model="form" label-width="280px" class="left">
        <el-form-item label="Name"><el-input v-model="form.name"></el-input></el-form-item>
        <el-form-item label="Contract Address"><el-input v-model="form.contractAddress"></el-input></el-form-item>
        <el-form-item label="Token Address"><el-input v-model="form.tokenAddress"></el-input></el-form-item>
        <el-form-item label="Decimal Digits"><el-input v-model="form.decimalDigits"></el-input></el-form-item>
        <el-form-item label="Cross Chain"><el-switch v-model="form.crossChain"></el-switch></el-form-item>
        <el-form-item label="Minimum Withdraw Amount"><el-input v-model="form.minimumWithdrawAmount"></el-input></el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="!canSubmit">Add</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    export default {
        name: "AddCurrency",
        data() {
            const holder = {
                form: {
                    id: 0,
                    name: '',
                    contractAddress: '',
                    tokenAddress: '',
                    decimalDigits: 18,
                    crossChain: false,
                    minimumWithdrawAmount: 0,
                }
            };
            //fill test data
            holder.form.contractAddress = '0x8acf09aa9d1b9783bb17f97fca6bfedb79f395b7';
            holder.form.name = 'Test';
            holder.form.tokenAddress = '0x89801508937274f45a921a2fe1bcfb86e1c278b7';
            return holder;
        },
        computed: {
            canSubmit: function (){
                return this.form.name.length > 0 && this.form.contractAddress.length > 0 && this.form.tokenAddress.length > 0;
            }
        },
        methods: {
            async onSubmit() {
                console.log('submit!');
                const request = {
                    timestamp: new Date().getTime(),
                    signature: '',
                    currency: this.form,
                    encodeType: 'currencies/encode-add-currency'
                };
                this.doCommand(request, 'currencies', ()=>{
                    this.$message('Added successfully')
                });
            }
        }
    }
</script>

<style scoped>
.left{
    text-align: left;
}
</style>