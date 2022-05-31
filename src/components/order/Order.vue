<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <div>
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              clearable
            >
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="{ row }">
            <el-tag type="success" v-if="row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot="{ row }">
            {{ row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 操作 -->
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox"
              >编辑</el-button
            >
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressBox"
              >位置</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
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

    <!-- 展示地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressruleForm"
        :rules="addressrules"
        ref="addressruleForm"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <!-- <el-input v-model="addressruleForm.address1"></el-input> -->
          <!--  级联选择器-->
          <el-cascader
            :options="cityData"
            clearable
            v-model="addressruleForm.address1"
            :props="myProps"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详情地址" prop="address2">
          <el-input v-model="addressruleForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 展示物流信息的对话框 -->

    <el-dialog
      title="物流进度"
      :visible.sync="ProgressdialogVisible"
      width="80%"
    >
      <!-- <span>这是一段信息</span> -->
      <!-- 时间线组件 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
          width="100%"
          height="100%"
          :color="activity.color"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata.js";
export default {
  props: {},
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      orderList: [],
      //   隐藏对话框
      dialogVisible: false,

      addressruleForm: {
        address1: [],
        address2: "",
      },

      addressrules: {
        address1: [
          {
            required: true,
            message: "请选择省市区县",
            trigger: "blur",
          },
        ],
        address2: [
          {
            required: true,
            message: "请选填写详细地址",
            trigger: "blur",
          },
        ],
      },
      cityData,

      //   级联选择配置
      myProps: {
        expandTrigger: "hover",
        value: "value",
        label: "label",
        children: "children",
      },

      //
      ProgressdialogVisible: false,
      // 物流信息
      progressInfo: [],
    };
  },
  methods: {
    getOrderList: async function () {
      const { data } = await this.axios.get("orders", {
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
        // console.log(data.data);
        this.total = data.data.total;
        this.orderList = data.data.goods;
      }
    },
    handleSizeChange: function (newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange: function (newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    // 展示修改地址的对话框
    showBox: function () {
      this.dialogVisible = true;
    },

    // 关闭对话框
    addressDialogClosed: function () {
      this.$refs.addressruleForm.resetFields();
    },
    // 物流相关信息
    showProgressBox: async function () {
      const { data } = await this.axios.get(`/kuaidi/1106975712662`);
      if (data.meta.status !== 200) {
        return this.$message({
          message: data.meta.msg,
          type: "error",
          duration: 2000,
        });
      } else {
        this.$message({
          message: "获取成功",
          type: "success",
          duration: 2000,
        });
        this.progressInfo = data.data;
        this.ProgressdialogVisible = true;
        // console.log(data.data);
      }
    },
  },
  components: {},
  created() {
    this.getOrderList();
  },
};
</script>

<style scoped lang="scss">
</style>
