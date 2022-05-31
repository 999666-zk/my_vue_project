import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: () => import("../components/login.vue"),
    meta: {
      title: "登录",
    },
  },
  {
    path: "/home",
    component: () => import("../components/home.vue"),
    meta: {
      title: "首页",
    },
    redirect: "/welcome",
    children: [
      {
        path: "/welcome",
        component: () => import("../components/welcome.vue"),
      },
      {
        path: "/users",
        component: () => import("../components/user/users.vue"),
      },
      {
        path: "/rights",
        component: () => import("../components/power/rights.vue"),
      },
      {
        path: "/roles",
        component: () => import("../components/power/roles.vue"),
      },
      {
        path: "/categories",
        component: () => import("../components/goods/cate.vue"),
      },
      {
        path: "/params",
        component: () => import("../components/goods/params.vue"),
      },
      {
        path: "/goods",
        component: () => import("../components/goods/List.vue"),
        // children: [
        //   {
        //     path: "/add",
        //     component: () => import("../components/goods/Add.vue"),
        //   },
        // ],
      },
      {
        path: "/goods/add",
        component: () => import("../components/goods/Add.vue"),
      },
      {
        path: "/orders",
        component: () => import("../components/order/Order.vue"),
      },
      {
        path: "/reports",
        component: () => import("../components/report/Report.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title;
  const tokenStr = window.sessionStorage.getItem("token");
  if (to.path !== "/login" && !tokenStr) {
    next("/login");
  } else {
    next();
  }
});
export default router;
