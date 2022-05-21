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
