import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Layout from '../views/Layout.vue'
import Welcome from "../views/Welcome";
import Timestamp from "../views/common/Timestamp";
import TimezoneId from "../views/common/TimezoneId";
import AddCurrency from "../views/currencies/AddCurrency";
import SystemAdmin from "../views/system/SystemAdmin";
import SysConfig from "../views/system/SysConfig";
import AccountIndex from "../views/account/AccountIndex";
import Product from "../views/products/Product";
import CacheViewer from "../views/system/CacheViewer";
import Metrics from "../views/system/Metrics";
import Trade from "../views/market/Trade";
import SettlementMonitor from "../views/system/SettlementMonitor";
import Tick from "../views/market/Tick";
import CurrenciesAndTokens from "../views/currencies/CurrenciesAndTokens";
import OrderList from "@/views/market/OrderList";
import Dex from "@/views/dex/Dex";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    }, {
        path: '/dex', name: 'dex', component: Dex,
    }, {
        path: '/layout', name: 'Layout', component: Layout,
        children:[
            {path: '', name: 'Root', component: Welcome},
            {path: 'welcome', name: 'Welcome', component: Welcome},
            {path: 'timestamp', name: 'Timestamp',
                // component: ()=> import('../views/common/Timestamp.vue')
                component: Timestamp
            }, {
                path: 'timezone-id', name: 'TimezoneId', component: TimezoneId
            },
            {path: 'currencies', name: 'Currencies', component: CurrenciesAndTokens},
            {path: 'add-currency', name: 'AddCurrencies', component: AddCurrency},
            {path: 'system', name: 'Admin', component: SystemAdmin},
            {path: 'system-config', name: 'SystemConfig', component: SysConfig},
            {path: 'product', name: 'Product', component: Product},
            {path: 'account', name: 'Account', component: AccountIndex},
            {path: 'cache', name: 'Cache', component: CacheViewer},
            {path: 'metrics', name: 'Metrics', component: Metrics},
            {path: 'trades', name: 'Trades', component: Trade},
            {path: 'settlement', name: 'Settlement', component: SettlementMonitor},
            {path: 'ticker', name: 'Ticker', component: Tick},
            {path: 'orders', name: 'Orders', component: OrderList},
            {path: 'open-dex', name: 'open-dex', component: Dex},
        ]
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
        path: '/hello',name: 'Hello',
        component: () => import(/* webpackChunkName: "about" */ '../components/HelloWorld.vue')
    },
    {
        path: '/test',name: 'Test',
        component: () => import(/* webpackChunkName: "about" */ '../components/Test.vue')
    }
];

const router = new VueRouter({
    routes
});

export default router
