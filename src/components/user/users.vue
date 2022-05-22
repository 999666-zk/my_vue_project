<template>
    <div>
        <!-- <h2>这里是users</h2> -->
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区 -->
        <el-card class="box-card">
            <!-- 搜索和添加区 -->
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-input placeholder="请输入内容" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="1">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>

            <el-table :data="userlist" style="width: 100%" border stripe>
                <!-- 在这里可以尝试加一些checkbox -->
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                <el-table-column prop="username" label="姓名">
                </el-table-column>
                <el-table-column prop="email" label="邮箱">
                </el-table-column>
                <el-table-column prop="mobile" label="电话">
                </el-table-column>
                <el-table-column prop="role_name" label="角色">
                </el-table-column>
                <el-table-column label="状态">
                    <!-- <template slot-scope="scope"> -->
                    <template v-slot="{ row }">
                        <!-- 作用域插槽 -->
                        <!-- {{ scope.row }} -->
                        <!-- {{ row }} -->
                        <el-switch v-model="row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template>
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        <el-tooltip effect="dark" content="分配角色" placement="top">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 5, 10, 20]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total" background>
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            // 获取用户列表的参数对象
            queryInfo: {
                query: '',
                // 当前页数
                pagenum: 1,
                // 每页记录的条数
                pagesize: 5,
            },
            userlist: [],
            total: 0,
        };
    },
    methods: {
        getUserList: function () {
            this.axios.get('users', { params: this.queryInfo }).then(res => {
                let { data } = res;
                if (data.meta.status !== 200) {
                    this.$message({
                        message: data.meta.msg,
                        type: 'error',
                        duration: 2000,
                    })
                } else {
                    this.userlist = data.data.users;
                    this.total = data.data.total;
                }
            })
        },
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.queryInfo.pagesize = val;
            this.getUserList();

        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.queryInfo.pagenum = val;
            this.getUserList();
        }
    },
    components: {

    },
    created() {
        this.getUserList();
    }
};
</script>

<style scoped lang="scss">
</style>
