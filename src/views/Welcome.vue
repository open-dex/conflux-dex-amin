<template>
    <div>
        Welcome to conflux-dex-admin!
        <p>
            Shortcuts:
            <el-tag>
                <el-link :underline="false" type="primary" href="#/layout/system">Pause/Resume System, Cancel Order</el-link>
            </el-tag>
            <el-tag style="margin-left: 10px">
                <el-link :underline="false" type="primary" href="#/layout/product">Product, Daily Limit</el-link>
            </el-tag>
            <el-tag style="margin-left: 10px">
                <el-link :underline="false" type="primary" href="#/layout/currencies">Currencies</el-link>
            </el-tag>
            <el-tag style="margin-left: 10px">
                <el-link :underline="false" type="primary" href="#/layout/system-config">System configuration</el-link>
            </el-tag>
        </p>
        <p>
            Conflux-Portal (Chrome Plugin) is needed to play around at this site. Find it <a target="_blank" href="https://github.com/Conflux-Chain/conflux-portal/releases">here</a>.
        </p>
        <p>
            Request flow:
            <el-row :gutter="24">
                <el-col :span="4">01 Browser</el-col>
                <el-col :span="10">----- Request data --------></el-col>
                <el-col :span="8">DEX backend server</el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="4">02 Browser</el-col>
                <el-col :span="10">&lt;--- RLP encode data -----</el-col>
                <el-col :span="8">DEX backend server</el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="4">03 Browser</el-col>
                <el-col :span="10">----- RLP encode data ---></el-col>
                <el-col :span="8">Conflux Portal</el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="4">04 Browser</el-col>
                <el-col :span="10">&lt;--- Signature ---------------</el-col>
                <el-col :span="8">Conflux Portal</el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="4">05 Browser</el-col>
                <el-col :span="10">----- Request data with signature ---></el-col>
                <el-col :span="8">DEX backend server</el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="4">06 Browser</el-col>
                <el-col :span="10">&lt;--- Server response ---</el-col>
                <el-col :span="8">DEX backend server</el-col>
            </el-row>
        </p>
    </div>
</template>

<script>
    export default {
        name: "Welcome",
        components: {},
        methods: {

        }
    }
</script>

<style scoped>

</style>