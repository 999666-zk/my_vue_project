import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 导入插件zktable
import ZkTable from "vue-table-with-tree-grid";

Vue.component(ZkTable.name, ZkTable);

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
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  CheckboxGroup,
  Checkbox,
  Upload,
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
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Select);
Vue.use(Option);
Vue.use(Cascader);
Vue.use(Alert);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Steps);
Vue.use(Step);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Upload);

Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;
// 导入全局样式表
import "./assets/css/global.css";

// 导入字体图标
import "./assets/fonts/iconfont.css";

// 富文本框--------------------------------------
import VueQuillEditor from "vue-quill-editor";

// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
Vue.use(VueQuillEditor /* { default global options } */);
//-------------------------------------------------

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

// 时间过滤器
Vue.filter("dataFormat", function (originVal) {
  const dt = new Date(originVal);
  const y = dt.getFullYear();
  // padStart 不足2位以 0 来填充
  const m = (dt.getMonth() + 1 + "").padStart(2, "0");
  const d = (dt.getDate() + "").padStart(2, "0");

  const hh = (dt.getHours() + "").padStart(2, "0");
  const mm = (dt.getMinutes() + "").padStart(2, "0");
  const ss = (dt.getSeconds() + "").padStart(2, "0");

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
