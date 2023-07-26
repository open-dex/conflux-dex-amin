  <template>
    <el-container class="ha">
        <el-header height="36px">
            <Header></Header>
        </el-header>
        <el-container class="fill">
            <el-aside class="aside">
                <el-menu class="menu el-menu-vertical-demo" ref="menu" :default-openeds="openeds" :router="true">
                    <el-submenu index="welcome">
                        <template slot="title"><div>Welcome</div></template>
                        <el-menu-item index="/layout/welcome">
                            Welcome
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="system">
                        <template slot="title"><div>System</div></template>
                            <el-menu-item index="/layout/system">Admin</el-menu-item>
                            <el-menu-item index="/layout/system-config">System Config</el-menu-item>
                            <el-menu-item index="/layout/product">Product/DailyLimit</el-menu-item>
                            <el-menu-item index="/layout/currencies">Currencies/Tokens</el-menu-item>
                            <el-menu-item index="/layout/cache">Cache Monitor</el-menu-item>
                            <el-menu-item index="/layout/metrics">Metrics</el-menu-item>
                            <el-menu-item index="/layout/settlement">Settlement</el-menu-item>
                    </el-submenu>
                    <el-submenu index="market">
                        <template slot="title"><div>Market</div></template>
                        <el-menu-item index="/layout/orders">Orders</el-menu-item>
                        <el-menu-item index="/layout/trades">Trades</el-menu-item>
                        <el-menu-item index="/layout/ticker">Ticker</el-menu-item>
                        <el-menu-item index="/layout/open-dex">OpenDex</el-menu-item>
                    </el-submenu>
                    <el-submenu index="account">
                        <template slot="title"><div>Account</div></template>
                            <el-menu-item index="/layout/account">Account</el-menu-item>
                    </el-submenu>
                    <el-submenu index="common">
                        <template slot="title"><div>Common</div></template>
                        <el-menu-item index="/layout/timestamp">
                            Timestamp
                        </el-menu-item>
                        <el-menu-item index="/layout/timezone-id">
                            Timezone Id/BoomFlow/Fee
                        </el-menu-item>
                    </el-submenu>
                    <el-menu-item>Then End</el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <TagsView></TagsView>
                <el-main class="main">
                    <div>
                        <keep-alive>
                            <router-view></router-view>
                        </keep-alive>
                    </div>
                </el-main>
                <el-footer height="auto" class="footer">
                    <div>Conflux DEX {{year}}</div>
                </el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import Header from "./Header";
    import TagsView from "@/views/TagsView";
    export default {
        name: "Layout",
        components: {TagsView, Header},
        data() {
            return {
                openeds: ['welcome', 'common', 'currencies', 'system', 'account', 'market'],
                year: new Date().getFullYear(),
            }
        },
        methods: {
        },
        mounted() {
        }
    }
</script>

<style scoped>
    li.el-menu-item,.el-menu-item,>>>.el-submenu__title{
        /*color: red;*/
        line-height: 30px;
        height: 30px;
    }
    >>>.el-submenu__title{
        color: darkblue;
        background: #E9EEF3;
    }
/*<!-- 1  -->*/
    .main{
        height: -webkit-calc(100vh - 120px - 20px);
        padding-top: 2px;
    }
    .aside{
        height: -webkit-calc(100vh - 50px - 2px);
        border-right: 1px solid #e6e6e6;
    }

    .fill {
        height: available;
    }

    .menu {
        /*height: 100%;*/
        border-right: 0px;
    }

    .el-aside {
        /*height:90vh;*/
    }

    .ha {
        height: -webkit-fill-available;
    }

    .footer {
        border-top: 1px solid #e6e6e6;
        padding-top: 6px;
        text-align: center;
    }
</style>