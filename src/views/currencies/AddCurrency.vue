<template>
    <el-form :style="{maxWidth:'620px'}" ref="form" :model="form" label-width="280px" class="left" size="mini">
        <el-form-item label="Original Token Address"><el-input v-model="form.tokenAddress"></el-input></el-form-item>
        <el-form-item label="Name">
            <el-row>
                <el-col :span="12">
                    <el-input v-model="form.name"></el-input>
                </el-col>
                <el-col :span="12">
                    <el-button :style="{marginLeft:'6px'}" @click="getTokenInfo" size="mini">Get name on chain</el-button>
                </el-col>
            </el-row>
        </el-form-item>
        <el-form-item label="CRCL Contract Address"><el-input v-model="form.contractAddress"></el-input></el-form-item>
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
            return {
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
        },
        computed: {
            canSubmit: function (){
                return this.form.name.length > 0 && this.form.tokenAddress.length > 0;
            }
        },
        methods: {
            getTokenInfo() {
                this.getRpc(`currencies/get-token-info?hex=${this.form.tokenAddress}`).then(res=>{
                    this.form.name = res.name;
                    this.form.decimalDigits = parseInt(res.decimals || '18')
                })
            },
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