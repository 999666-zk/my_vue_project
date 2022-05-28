// 统一 axios 请求入口,方便管理项目的axios

import axios from "axios";
export default function (config) {
  const instance = axios.create({
    baseURL: "http://127.0.0.1:8888/api/private/v1/",
    timeout: 1000,
    headers: { "X-Custom-Header": "foobar" },
  });

  // 添加请求拦截器
  axios.interceptors.request.use(
    function (config) {
      // 在发送请求之前做些什么
      //为请求头对象，添加Token 验证的Authorization 字段
      config.headers.Authorization = window.sessionStorage.getItem("token");
      return config;
    },
    function (error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    }
  );

  // 添加响应拦截器
  axios.interceptors.response.use(
    function (response) {
      // 对响应数据做点什么
      return response.data;
    },
    function (error) {
      // 对响应错误做点什么
      return Promise.reject(error);
    }
  );

  return instance(config);
}
