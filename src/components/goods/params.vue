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
        <el-col :span="5">
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
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="adddialogVisible = true"
            >添加参数</el-button
          >

          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="{ row }">
                <el-tag
                  v-for="(item, index) in row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(row, index)"
                  >{{ item }}</el-tag
                >

                <!-- 循环渲染 tag 标签 -->
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              lable="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column lable="操作">
              <template v-slot="{ row }">
                <!-- {{ row }} -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="adddialogVisible = true"
            >添加属性</el-button
          >

          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="{ row }">
                <el-tag
                  v-for="(item, index) in row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(row, index)"
                  >{{ item }}</el-tag
                >

                <!-- 循环渲染 tag 标签 -->
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              lable="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column lable="操作">
              <template v-slot="{ row }">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加对话框 -->

    <el-dialog
      :title="titleText"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addruleForm"
        :rules="addFormrules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addruleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams('addFormRef')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      :title="titleText"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editruleForm"
        :rules="editFormrules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editruleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtParams('editFormRef')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
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
      activeName: "many",
      // 动态参数数组
      manyTableData: [],
      // 静态属性数组
      onlyTableData: [],
      // 控制对话框的显示和隐藏
      adddialogVisible: false,
      // 添加参数的表单数据对象
      addruleForm: {
        attr_name: "",
      },
      // 添加数据的验证规则
      addFormrules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      editdialogVisible: false,
      // 修改的表单
      editruleForm: {},
      // 修改表单验证对象
      editFormrules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
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
      // 是三级菜单
      // console.log(this.selectedCateKeys);
      this.getParamsData();
    },
    // tab 点击事件的处理函数
    handleTabClick: function () {
      this.getParamsData();
      // console.log(this.activeName);
    },

    // 解决选择项 请求数据  以及 tab切换的时候  请求数据
    getParamsData: async function () {
      // console.log(this.selectedCateKeys);
      //判断是不是 三级菜单❤❤❤❤❤❤❤-----------可能默认就是不能选择 一级 和 二级 菜单
      if (this.selectedCateKeys.length != 3) {
        this.selectedCateKeys = [];

        // -------------------------------------
        this.onlyTableData = [];
        this.manyTableData = [];
        // -------------------------------------
        this.return;
      }
      // 根据获取的分类的id 和当前所处的面板
      const { data } = await this.axios.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      );
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

        // 将拿到的attr_vals赋值变成非字符串类型  数组
        data.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          // 添加boolean 值控制文本的显示和隐藏
          item.inputVisible = false;
          item.inputVisible = "";
        });
        console.log(data.data);

        // 判断数据是哪一个表格的数据？
        if (this.activeName === "many") {
          this.manyTableData = data.data;
        } else {
          this.onlyTableData = data.data;
        }
      }
    },
    // 监听添加对话框的关闭事件
    addDialogClosed: function () {
      this.$refs.addFormRef.resetFields();
    },
    // 添加指定参数
    addParams: function (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 发起请求
          const { data } = await this.axios.post(
            `categories/${this.cateId}/attributes`,
            {
              attr_name: this.addruleForm.attr_name,
              //选择添加到哪一个 tab分类下
              attr_sel: this.activeName,
            }
          );
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
          }
          this.adddialogVisible = false;
          this.getParamsData();
        }
      });
    },
    // 编辑 显示所选中的那一项
    showEditDialog: async function (attr_id) {
      // 显示编辑框
      this.editdialogVisible = true;

      // 在这里进行参数的展示
      const { data } = await this.axios.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName },
        }
      );
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
        this.editruleForm = data.data;
      }
    },

    // 关闭对话框 重置表单
    editDialogClosed: function () {
      this.$refs.editFormRef.resetFields();
    },

    // 点击按钮修改参数
    eidtParams: function (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 发起请求
          const { data } = await this.axios.put(
            `categories/${this.cateId}/attributes/${this.editruleForm.attr_id}`,
            {
              attr_name: this.editruleForm.attr_name,
              //选择添加到哪一个 tab分类下
              attr_sel: this.activeName,
            }
          );
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
          }
          this.editdialogVisible = false;
          this.getParamsData();
        }
      });
    },
    // 删除指定的选项
    deleteParams: async function (attr_id) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data } = await this.axios.delete(
            `categories/${this.cateId}/attributes/${attr_id}`
          );
          if (data.meta.status !== 200) {
            return this.$message({
              message: data.meta.msg,
              type: "error",
              duration: 2000,
            });
          } else {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getParamsData();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 失去焦点  或 回车 都会触发该函数

    handleInputConfirm: async function (row) {
      // console.log("ok");
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      } else {
        //如果没有return  则用户输入有效内容 做后续处理
        row.attr_vals.push(row.inputValue.trim());

        // 需要发起请求 保存指定参数
        this.saveAttrVals(row);
        row.inputValue = "";
        row.inputVisible = false;
      }
    },

    // 将对 attr_vals 的操作，保存到数据库中

    saveAttrVals: async function (row) {
      const { data } = await this.axios.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
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
      }
    },
    // 点击按钮实现 input 和 button之间的切换
    showInput: function (row) {
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    // 删除(这里并不是真正意义上的删除操作，而是对数据进行了更新)对应的参数可选项
    handleClose(row, index) {
      row.attr_vals.splice(index, 1);
      this.saveAttrVals(row);
    },
  },
  components: {},
  created() {
    this.getCateList();
  },
  computed: {
    // 如果按钮需要被禁用 则返回true 否则返回 false
    isBtnDisabled: function () {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      } else {
        return false;
      }
    },

    // 选中的三级分类的id的值
    cateId: function () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      } else {
        return null;
      }
    },
    // 动态计算标题的文本
    titleText: function () {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
};
</script>

<style scoped lang="scss">
.cat_out {
  margin: 10px 5px;
}
.el-tab-pane > .el-button {
  display: flex;
}
.el-tag {
  margin: 10px;
}
.el-input {
  width: 120px;
}
</style>
