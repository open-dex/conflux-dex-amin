<template>
    <div>
        <el-button size="mini" @click="load"><i class="el-icon-refresh"></i> </el-button>
        <div>
            <el-row>
                <el-col :span="5">TimezoneId: </el-col>
                <el-col :span="12">{{timezone}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="5">BoomFlow:  </el-col>
                <el-col :span="12">{{boomflow}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="5">tradeAdminAddress:  </el-col>
                <el-col :span="12">{{tradeAdminAddress}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="5">uiAdminAddress:  </el-col>
                <el-col :span="12">{{uiAdminAddress}}</el-col>
            </el-row>
            <el-row v-for="item of Object.keys(fee)" :key="item">
                <el-col :span="5">{{item}}:</el-col>
                <span>{{fee[item]}}</span>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TimezoneId",
        data() {
            return {
                timezone: '--',
                boomflow: '',
                tradeAdminAddress: '',
                uiAdminAddress: '',
                fee: {

                }
            }
        },
        methods:{
            load() {
                this.timezone = this.boomflow = this.tradeAdminAddress = this.uiAdminAddress = ''
                this.getRpc('common/timezone').then(data=>{
                    this.timezone = data;
                })
                this.getRpc('common/boomflow').then(data=>{
                    this.boomflow = data;
                })
                this.getRpc('common/fee').then(data=>{
                    this.fee = data;
                })
                this.getRpc('system/admin-addresses').then(data=>{
                    this.tradeAdminAddress = data.tradeAdminAddress;
                    this.uiAdminAddress = data.uiAdminAddress;
                })
            }
        },
        mounted() {
        },
        activated() {
            this.load();
        }
    }
</script>

<style scoped>

</style>