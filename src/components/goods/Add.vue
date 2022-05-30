<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 提示信息 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closeable="false"
      >
      </el-alert>

      <!-- 步骤条 -->
      <!-- 这里的activeIndex只接收 number类型的数组 -->
      <el-steps
        :space="300"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab 栏 区域 -->
      <!-- form 表单 -->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addruleForm"
        class="demo-ruleForm"
        lable-position="top"
      >
        <!-- <el-form-item label="活动名称" prop="name">
          <el-input v-model="addFormrules.name"></el-input>
        </el-form-item> -->

        <!-- 这里的activeIndex只接收 string类型的数组 -->
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>

            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="el"
                  v-for="(el, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 后台api地址 -->
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- <div slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce" ref="myQuillEditor">
              <!-- :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)" -->
            </quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button
              type="primary"
              class="btn"
              @click="addGoods('addruleForm')"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <img :src="previewPath" alt="" class="priviewimg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  props: {},
  data() {
    return {
      activeIndex: "0",
      //   添加商品的表单数据对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: "",
        // tab各项
        attrs: [],
      },
      addFormrules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur",
          },
        ],
        goods_cat: [
          {
            required: true,
            message: "请选择商品分类",
            trigger: "blur",
          },
        ],
      },

      //   商品分类列表
      cateList: [],
      cateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      // 动态参数列表
      manyTableData: [],
      //   静态属性列表
      onlyTableData: [],
      //  上传url地址
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      //   图片上传图片的请求头  (必须手动设置)
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      //   图片完整路径
      previewPath: "",
      //   预览对话框
      dialogVisible: false,
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
        console.log(data.data);
        // 商品列表
        this.cateList = data.data;
      }
    },
    //级联选择器选中变化  触发该函数
    handleChange: function () {
      //   console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },

    // tab 离开之前的钩子函数
    beforeTabLeave: function (activeName, oldActiveName) {
      //   console.log("即将离开的标签页" + oldActiveName);
      //   console.log("即将进入的标签页" + activeName);
      if (this.addForm.goods_cat.length !== 3 && oldActiveName == 0) {
        this.$message({
          message: "请选择商品分类",
          type: "error",
        });
        return false;
      }
    },
    // tab 切换
    tabClicked: async function () {
      // 选中的是哪一个tab
      //   console.log(this.activeIndex);

      // 是否进入第二个tab、 如果进入 就进行相关地址的请求
      if (this.activeIndex === "1") {
        const { data } = await this.axios.get(
          `categories/${this.catID}/attributes`,
          {
            params: { sel: "many" },
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
          //   console.log(data.data);
          data.data.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          });
          this.manyTableData = data.data;
        }
        // 是否进入第三个tab、 如果进入 就进行相关地址的请求
      } else if (this.activeIndex === "2") {
        const { data } = await this.axios.get(
          `categories/${this.catID}/attributes`,
          {
            params: { sel: "only" },
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
          //   console.log(data.data);
          this.onlyTableData = data.data;
        }
      }
    },

    //上传成功的钩子
    handleSuccess: function (response) {
      // console.log(response);
      //   1.拼接得到一个图片信息对象
      // 2.将图片信息对象，push到pics数组中

      const info = { pic: response.data.tmp_path };
      this.addForm.pics.push(info);
      //   console.log(this.addForm.pics);
    },
    // 移除图片
    handleRemove: function (file) {
      //  1.获取讲要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      //  2.从 pics 数组中找到这个图片所对应的索引值
      const index = this.addForm.pics.findIndex((x) => {
        x.pic === filePath;
      });
      //  3.移除对应的项
      this.addForm.pics.splice(index, 1);
    },
    // 图片预览
    handlePreview: function (file) {
      this.dialogVisible = true;
      //   console.log(file);
      this.previewPath = file.response.data.url;
      //   console.log(file.response.data.url);
    },
    // 关闭对话框
    handleClose: function () {
      this.dialogVisible = false;
    },
    // 添加商品
    addGoods: function (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 发起请求

          //   如果都合法 进行以下操作
          //   深拷贝    lodash(包名)

          //  cloneDeep(obj)
          //   ----------------------------------------------
          const form = _.cloneDeep(this.addForm);
          form.goods_cat = form.goods_cat.join(",");
          //-------------------------------------------
          //   最终向服务器发送的数据
          //   console.log(form);
          //   处理动态属性
          this.manyTableData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(" "),
            };
            this.addForm.attrs.push(newInfo);
          });
          //   处理静态属性
          this.onlyTableData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals,
            };
            this.addForm.attrs.push(newInfo);
          });

          form.attrs = this.addForm.attrs;
          console.log(form);
          //   商品的名称必须是唯一的
          const { data } = await this.axios.post("goods", form);
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
            this.$router.push("/goods");
          }
        }
      });
    },
  },
  computed: {
    catID: function () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      } else {
        return null;
      }
    },
  },
  components: {},
  created() {
    this.getCateList();
  },
};
</script>

<style scoped lang="scss">
// 修改深层样式
::v-deep {
  .el-form-item__label {
    float: none !important;
  }
  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }
}
.priviewimg {
  width: 100%;
}
.btn {
  margin-top: 20px;
}
</style>
