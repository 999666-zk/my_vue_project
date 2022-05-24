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
                    <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable
                        @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="1">
                    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
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
                <!-- <el-table-column prop="mg_time" label="添加时间">
                </el-table-column> -->
                <el-table-column label="状态">
                    <!-- <template slot-scope="scope"> -->
                    <template v-slot="{ row }">
                        <!-- 作用域插槽 -->
                        <!-- {{ scope.row }} -->
                        <!-- {{ row }} -->
                        <el-switch v-model="row.mg_state" active-color="#13ce66" inactive-color="#ff4949"
                            @change="userStateChanged(row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template v-slot="{ row }">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editShow(row.id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUsers(row.id)">
                        </el-button>
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


        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
            <!-- 内容主题区域 -->
            <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser('addFormRef')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户的对话框 -->

        <el-dialog title="修改用户" :visible.sync="editVisible" width="50%" @close="editClose">
            <el-form :model="editFormList" :rules="editFormrules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editFormList.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editFormList.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editFormList.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser('editFormRef')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        // 自定义验证规则
        var checkEmail = (rule, value, callback) => {
            const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            if (!regEmail.test(value)) {
                callback(new Error('邮箱非法'));
            } else {
                callback();
            }
        };

        var checkPhone = (rule, value, callback) => {
            const regPhone = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
            if (!regPhone.test(value)) {
                callback(new Error('手机号非法'));
            } else {
                callback();
            }
        };
        return {
            // 获取用户列表的参数对象
            queryInfo: {
                // 搜索项
                query: '',
                // 当前页数
                pagenum: 1,
                // 每页记录的条数
                pagesize: 5,
            },
            userlist: [],
            total: 0,
            // 控制添加对话框的隐藏
            dialogVisible: false,
            // 控制修改对话框的隐藏
            editVisible: false,
            // 添加用户的数据
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: '',
            },
            // 表单验证规则
            addFormrules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 8, message: '长度在 6 到 8 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkPhone, trigger: 'blur' }
                ],
            },
            editFormrules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkPhone, trigger: 'blur' }
                ],
            },
            // 获取要修改的数据
            editFormList: {},
        };
    },
    methods: {
        // 添加用户提交
        addUser: function (formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    // 发起请求
                    const { data } = await this.axios.post('users', this.addForm);
                    console.log(data);
                    if (data.meta.status !== 201) {
                        return this.$message({
                            message: data.meta.msg,
                            type: 'error',
                            duration: 2000,
                        })
                    } else {
                        this.$message({
                            message: data.meta.msg,
                            type: 'success',
                            duration: 2000,
                        })
                        // 隐藏添加对话框
                        this.dialogVisible = false;
                        // 重新获取用户列表
                        this.getUserList();
                    }
                }
            })
        },
        // 编辑用户确定提交
        editUser: function (formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    // 发起请求
                    const { data } = await this.axios.put(`users/${this.editFormList.id}`, { email: this.editFormList.email, mobile: this.editFormList.mobile });
                    console.log(data);
                    if (data.meta.status !== 200) {
                        return this.$message({
                            message: data.meta.msg,
                            type: 'error',
                            duration: 2000,
                        })
                    } else {
                        this.$message({
                            message: data.meta.msg,
                            type: 'success',
                            duration: 2000,
                        })
                        // 隐藏添加对话框
                        this.editVisible = false;
                        // 重新获取用户列表
                        this.getUserList();
                    }
                }
            })
        },
        // 获取用户列表
        getUserList: function () {
            this.axios.get('users', { params: this.queryInfo }).then(res => {
                let { data } = res;
                if (data.meta.status !== 200) {
                    return this.$message({
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
        // 每页记录条数
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.queryInfo.pagesize = val;
            this.getUserList();

        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.queryInfo.pagenum = val;
            this.getUserList();
        },
        // 监听switch 状态
        userStateChanged: function (val) {
            // console.log(val);
            this.axios.put(`users/${val.id}/state/${val.mg_state}`).then(res => {
                let { data } = res;
                console.log(data);
                if (data.meta.status !== 200) {
                    // 没有更改成功，恢复原来的状态
                    val.mg_state = !val.mg_state;
                    return this.$message({
                        message: data.meta.msg,
                        type: 'error',
                        duration: 2000,
                    })
                } else {
                    this.$message({
                        message: data.meta.msg,
                        type: 'success',
                        duration: 2000,
                    })
                }
            })
        },
        // 重置添加对话框
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
        },
        // 重置编辑对话框
        editClose() {
            this.$refs.editFormRef.resetFields();
        },
        // 编辑展示
        editShow: async function (id) {
            this.editVisible = true;
            const { data } = await this.axios.get(`users/${id}`);
            // console.log(data);
            if (data.meta.status !== 200) {
                return this.$message({
                    message: data.meta.msg,
                    type: 'error',
                    duration: 2000,
                })
            } else {
                this.$message({
                    message: data.meta.msg,
                    type: 'success',
                    duration: 2000,
                })
                this.editFormList = data.data;
            }
        },
        deleteUsers: function (id) {
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data } = await this.axios.delete(`users/${id}`)
                if (data.meta.status !== 200) {
                    return this.$message({
                        message: data.meta.msg,
                        type: 'error',
                        duration: 2000,
                    })
                } else {
                    this.$message({
                        message: data.meta.msg,
                        type: 'success',
                        duration: 2000,
                    });
                    this.getUserList();
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
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
