
import { createRouter, createWebHistory } from "vue-router";
import accountList from "@/views/accountList.vue";
import create from "@/views/create.vue";

const routes = [
  {
    path: "/",
    redirect: "/account", // 重定向到账单列表页
  },
  {
    path: "/account",
    name: "Home",
    component: accountList, // 首页：账单列表
  },
  {
    path: "/account/create",
    name: "AddRecord",
    component: create, // 添加记录页
  },
  {
    path: "/account/:id",
    name: "DeleteOrDetail",
    component: accountList, // 可替换成详情/删除页
  },
  {
    path: '/account/edit/:id',
    name: 'EditRecord',
    component: create, // 复用 create.vue 页面
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
