<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 头部警告区域 -->
      <el-alert
        :closable="false"
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
      >
      </el-alert>

      <!-- 内容 -->
      <el-row class="cat_out">
        <el-col>
          <!-- 级联选择框  选择商品分裂的选择框 -->
          <div class="block">
            <span>选择商品分类：</span>
            <el-cascader
              v-model="selectedCateKeys"
              :options="cateList"
              :props="cateGories"
              @change="handleChange"
            ></el-cascader>
          </div>
        </el-col>
      </el-row>

      <!-- tab 切换 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
        <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // 应用列表
      cateList: [],
      cateGories: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      // 级联选择框选定的数组
      selectedCateKeys: [],
      // 被激活的页签的名称
      activeName: "first",
    };
  },
  methods: {
    getCateList: async function () {
      const { data } = await this.axios.get("categories");
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
        // console.log(data.data);
        // 商品列表
        this.cateList = data.data;
      }
    },
    //级联选择器选项框变化 会触发这个函数
    handleChange: function () {
      // console.log(this.selectedCateKeys);
      //判断是不是 三级菜单❤❤❤❤❤❤❤-----------可能默认就是不能选择 一级 和 二级 菜单
      if (this.selectedCateKeys.length != 3) {
        this.selectedCateKeys = [];
        return;
      }

      // 是三级菜单
      console.log(this.selectedCateKeys);
    },
    // tab 点击事件的处理函数
    handleTabClick: function () {
      console.log(this.activeName);
    },
  },
  components: {},
  created() {
    this.getCateList();
  },
};
</script>

<style scoped lang="scss">
.cat_out {
  margin: 10px 5px;
  text-align: left;
}
</style>
