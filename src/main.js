import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 导入element-ui
// import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
// Vue.use(ElementUI);
import {
  Button,
  Form,
  Input,
  FormItem,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
} from "element-ui";
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(TableColumn);
Vue.use(Table);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);

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

// 必须要进行拦截  加上token
// axios请求拦截器
axios.interceptors.request.use((config) => {
  //为请求头对象，添加Token 验证的Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
