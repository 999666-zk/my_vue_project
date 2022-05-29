<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 视图卡片区域 -->
    <el-card class="addkinds">
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCate">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <zk-table
        :data="cateList"
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
        :show-index="true"
        index-text="#"
        border
        :show-row-hover="false"
        class="zktable"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="res">
          <i
            class="el-icon-success"
            v-if="res.row.cat_deleted === false"
            style="color: rgb(103, 194, 58)"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>

        <!-- 等级渲染 -->
        <template slot="order" slot-scope="res">
          <el-tag v-if="res.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="res.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>

        <!-- 操作渲染 -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </zk-table>

      <!-- 分页区域 -->

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="editCatedialogVisible"
      width="50%"
      @close="addCateClosed"
    >
      <!-- 内容主题区域 -->
      <el-form
        :model="addCateForm"
        :rules="addCaterules"
        ref="addCateruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择器 -->
          <!-- options 用来存储数据源 -->
          <el-cascader
            clearable
            v-model="selectedKeys"
            :options="parentCateList"
            :props="myProps"
            @change="parentCateChange"
            ref="cateLevel"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate('addCateruleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  watch: {
    // 监听数据 selectedKeys 发生变化的时候 收起下拉框
    selectedKeys: function () {
      if (this.$refs.cateLevel) {
        this.$refs.cateLevel.dropDownVisible = false;
      }
    },
  },
  data() {
    return {
      // 商品分类的数据列表 默认为空
      cateList: [],
      // 查询条件
      queryInfo: {
        type: 5,
        pagenum: 1,
        pagesize: 5,
      },
      // 记录总条数
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 表示当前列定义为模板列
          type: "template",
          // 当前列使用的模板名称
          template: "isok",
        },
        {
          label: "排序",
          // 表示当前列定义为模板列
          type: "template",
          // 当前列使用的模板名称
          template: "order",
        },
        {
          label: "操作",
          // 表示当前列定义为模板列
          type: "template",
          // 当前列使用的模板名称
          template: "opt",
        },
      ],
      // 控制添加分类对话框的显示和隐藏
      editCatedialogVisible: false,

      // 添加分类的数据对象
      addCateForm: {
        cat_name: "",
        // 父级
        cat_pid: 0,
        // 分类的等级默认一级分类
        cat_level: 0,
      },
      // 添加分类表单验证
      addCaterules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 父级分类的列表
      parentCateList: [],
      // 配置级联
      myProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true,
      },
      // 级联选中父级的id数组
      selectedKeys: [],
    };
  },
  methods: {
    // 获取分类的列表
    getCateList: async function () {
      const { data } = await this.axios.get("categories", {
        params: this.queryInfo,
      });
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
        console.log(data.data);
        // 商品列表
        this.cateList = data.data.result;
        // 商品总数
        this.total = data.data.total;
      }
    },
    // 监听pagesize发生变化
    handleSizeChange: function (val) {
      this.queryInfo.pagesize = val;
      this.getCateList();
    },
    // 监听pagenum的改变
    handleCurrentChange: function (val) {
      this.queryInfo.pagenum = val;
      this.getCateList();
    },
    // 添加分类对话框
    showAddCate: function () {
      // 先获取父级数据列表
      this.getParentCateList();
      // 再展示对话框
      this.editCatedialogVisible = true;
    },
    // 需要使用级联
    // 获取所有的父级
    getParentCateList: async function () {
      const { data } = await this.axios.get("categories", {
        params: { type: 2 },
      });
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
        this.parentCateList = data.data;
      }
    },

    // 选择项改变触发
    parentCateChange: function () {
      // console.log(this.selectedKeys);

      if (this.selectedKeys.length > 0) {
        // 选中了父级分类
        //取最后一项
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    // 添加分类
    addCate: function (formName) {
      // console.log(this.addCateForm);
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 发起请求
          const { data } = await this.axios.post(
            `categories`,
            this.addCateForm
          );
          // console.log(data);
          if (data.meta.status !== 201) {
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
            // 隐藏添加对话框
            this.editCatedialogVisible = false;
            // 重新获取用户列表
            this.getCateList();
          }
        }
      });
    },

    // 关闭重置 对话框
    addCateClosed: function () {
      this.$refs.addCateruleForm.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
  },
  components: {},
  created() {
    this.getCateList();
  },
};
</script>

<style scoped lang="scss">
.addkinds {
  text-align: left;
}

.zktable {
  margin-top: 20px;
}
</style>
