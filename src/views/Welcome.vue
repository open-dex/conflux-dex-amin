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