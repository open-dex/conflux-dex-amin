//
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import {getRpc, rpc, handler, doCommand} from './router/lib.js'
import {store} from './router/store'
import {hexToBytes} from "./router/lib";

Vue.config.productionTip = false;
Vue.prototype.getRpc = getRpc;
Vue.prototype.rpc = rpc;
Vue.prototype.store = store;
Vue.prototype.SimpleEvent = new Vue();
Vue.prototype.doCommand = doCommand;
Vue.prototype.hexToBytes = hexToBytes;
Vue.prototype.fmtDate = (row, column, dt)=>new Date(dt).Format('yyyy-MM-dd hh:mm:ss');

Vue.config.errorHandler = function(err, vm, info) {
  console.log(`Error: ${err.toString()}\nInfo: ${info}`);
}

const app = new Vue({
  router,
  render: h => h(App)
});
app.$mount('#app');

handler.onError = (msg) => {
  app.$message.error(msg)
}
