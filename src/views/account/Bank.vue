<template>
    <div>
        <el-row>
            <el-col :span="6">
                <el-radio-group v-model="currency" size="mini">
                    <el-radio-button value="FC" label="FC"></el-radio-button>
                    <el-radio-button value="BTC" label="BTC"></el-radio-button>
                    <el-radio-button value="ETH" label="ETH"></el-radio-button>
                    <el-radio-button value="CNY" label="CNY"></el-radio-button>
                    <el-radio-button value="USDT" label="USDT"></el-radio-button>
                </el-radio-group>
            </el-col>
            <el-col :span="6">
                Amount:<el-input type="number" size="small"   class="inputShort" v-model="amount"></el-input>
            </el-col>

            <el-col :span="6">
                Fee:<el-input type="number" size="small"  class="inputShort"  v-model="fee"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6">
                <div style="line-height: 2">Burn/Cross:
                <el-switch class="inputShort"  v-model="burn"></el-switch>
                </div>
            </el-col>
            <el-col :span="16">
                Relay contract:<el-input size="small" class="inputLong"  v-model="relayContract" :disabled="!burn"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                recipient: <el-input size="small"  class="inputLong"  v-model="recipient"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                Bit coin address example: <el-tag @click="setAddress(bitCoinAddress)">{{bitCoinAddress}}</el-tag>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                recipient example: <el-tag @click="setAddress(store.account)">{{store.account}}</el-tag>
            </el-col>
        </el-row>
        <el-button @click="test" size="small" type="primary">Withdraw</el-button>
    </div>
</template>

<script>
    import {withdraw} from "../../lib/dex_sdk_use";
    export default {
        name: "Bank",
        data() {
            return {
                currency: 'ETH',
                amount: 1,
                burn: false,
                recipient: this.store.account,
                relayContract: '0x0000000000000000000000000000000000000000',
                fee: 0.05,
                bitCoinAddress: 'n4VQ5YdHf7hLQ2gWQYYrcxoE5B7nWuDFNF'
            }
        },
        methods:{
            test() {
                let request = {currency: this.currency, fee: this.fee, burn: this.burn
                    , amount: this.amount
                    , relayContract: this.relayContract, cross: this.cross, recipient: this.recipient
                };
                withdraw(this.store.host, request).then(data=>{
                    console.info('At page', data);
                    if (data.success) {
                        this.$message("Success!");
                        return;
                    }
                    this.$message(data.message)
                }).catch(err=>{
                    this.$message(err.message)
                });
            },
            setAddress(v) {
                this.recipient = v;
            }
        }
    }
</script>

<style scoped>
    .inputShort{
        width: 140px;
    }
    .inputLong{
        width: 340px;
    }
    .el-row{
        margin-top: 6px;
    }
</style>