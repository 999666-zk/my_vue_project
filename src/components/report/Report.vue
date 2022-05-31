<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 2. -->
      <div id="main" style="width: 800px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 1.
import * as echarts from "echarts";
// 使用loadsh 合并对象
import _ from "lodash";
export default {
  props: {},
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  methods: {},
  components: {},
  async mounted() {
    //   3.
    //   初始化时机比较重要
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));
    const { data } = await this.axios.get(`reports/type/1`);
    if (data.meta.status !== 200) {
      return this.$message({
        message: data.meta.msg,
        type: "error",
        duration: 2000,
      });
    } else {
      this.$message({
        message: data.meta.msg,
        type: "success",
        duration: 2000,
      });
      //   准备数据配置项
      const newOption = _.merge(data.data, this.options);
      myChart.setOption(newOption);
    }
  },
};
</script>

<style scoped lang="scss">
</style>
