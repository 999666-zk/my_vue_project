<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
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
              @clear="getGoodsList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="searchGoodlist"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddGoodsPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table 表格 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格（元）"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品重量（kg）"
          prop="goods_weight"
          width="80px"
        ></el-table-column>
        <el-table-column label="商品创建时间" prop="goods_time" width="160px">
          <template v-slot="{ row }">
            {{ row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <!-- 操作 -->

        <el-table-column width="180px" lable="操作">
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
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },

      //   获取到的商品列表
      goodsList: [],
      //   total 总数据条数
      total: 0,
    };
  },
  methods: {
    //   根据分页获取商品的列表
    getGoodsList: async function () {
      const { data } = await this.axios.get("goods", {
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
        // 商品列表
        this.goodsList = data.data.goods;
        this.total = data.data.total;
      }
    },
    handleSizeChange: function (newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange: function (newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },

    // 查询出指定的goods
    searchGoodlist: function () {
      this.getGoodsList();
    },

    // 添加商品跳转到添加商品页面
    goAddGoodsPage: function () {
      this.$router.push("/goods/add");
    },
  },
  components: {},
  created() {
    this.getGoodsList();
  },
};
</script>

<style scoped lang="scss">
</style>
