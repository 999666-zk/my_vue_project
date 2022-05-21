import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 导入element-ui
// import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
// Vue.use(ElementUI);
import { Button, Form, Input, FormItem, Message } from "element-ui";
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.prototype.$message = Message;
// 导入全局样式表
import "./assets/css/global.css";

// 导入字体图标
import "./assets/fonts/iconfont.css";

// 导入axios

import axios from "axios";
import VueAxios from "vue-axios";
// 配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
