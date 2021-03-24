<template>
<!--    <div>-->
<!--        <el-container>-->
<!--            <el-header>Header 1</el-header>-->
<!--            <el-main>Main 1</el-main>-->
<!--        </el-container>-->
<!-- - -->
<!--        <el-container>-->
<!--            <el-header>Header 2</el-header>-->
<!--            <el-main>Main 2</el-main>-->
<!--            <el-footer>Footer 2</el-footer>-->
<!--        </el-container>-->
<!-- - -->
<!--        <el-container>-->
<!--            <el-aside width="200px">Aside 3</el-aside>-->
<!--            <el-main>Main 3</el-main>-->
<!--        </el-container>-->
<!-- - -->
<!--        <el-container>-->
<!--            <el-header>Header 4</el-header>-->
<!--            <el-container>-->
<!--                <el-aside width="200px">Aside 4</el-aside>-->
<!--                <el-main>Main 4</el-main>-->
<!--            </el-container>-->
<!--        </el-container>-->
<!-- - -->
        <el-container class="outer">
            <el-header>Header 5</el-header>
            <el-container>
                <el-aside width="200px" class="aside">

                        Aside 53
                        <div style="border: 1px solid darkslategray; height: 1300px"> 3 </div>
                        41
                </el-aside>
                <el-container style="height: available">
                    <el-main class="main">Main 5
                        <div style="border: 1px solid darkslategray; height: 1300px"> 3 </div>
                        main 6
                    </el-main>
                    <el-footer>Footer 5</el-footer>
                </el-container>
            </el-container>
        </el-container>
<!-- - -->
<!--        <el-container>-->
<!--            <el-aside width="200px">Aside 6</el-aside>-->
<!--            <el-container>-->
<!--                <el-header>Header 6</el-header>-->
<!--                <el-main>Main 6</el-main>-->
<!--            </el-container>-->
<!--        </el-container>-->
<!-- - -->
<!--        <el-container>-->
<!--            <el-aside width="200px">Aside 7</el-aside>-->
<!--            <el-container>-->
<!--                <el-header>Header 7</el-header>-->
<!--                <el-main>Main 7</el-main>-->
<!--                <el-footer>Footer 7</el-footer>-->
<!--            </el-container>-->
<!--        </el-container>-->
<!--    </div>-->
</template>

<script>
    export default {
        name: "Test"
    }
</script>

<style scoped>
    .main{
        height: -webkit-calc(100vh - 120px - 20px);
    }
    .aside{
        height: -webkit-calc(100vh - 60px - 20px);
    }
    .outer{
        height: -webkit-fill-available;
    }
    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        /*line-height: 60px;*/
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        /*line-height: 200px;*/
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        /*line-height: 160px;*/
    }

    body > .el-container {
        /*margin-bottom: 40px;*/
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        /*line-height: 260px;*/
    }

    .el-container:nth-child(7) .el-aside {
        /*line-height: 320px;*/
    }
</style>