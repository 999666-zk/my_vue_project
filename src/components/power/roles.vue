<template>
    <div>
        <!-- 角色列表 -->
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row>
                <el-col :span="1">
                    <el-button type="primary" @click="rolesdialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

            <el-table :data="rolesList" style="width: 100%" border stripe>
                <!-- 在这里可以尝试加一些checkbox -->
                <!-- 展开列 -->
                <el-table-column type="expand" width="60">
                    <template v-slot="{ row }">
                        <!-- <pre>
                        {{ row }}
                    </pre> -->
                        <!-- 使用三层for循环拿到对应的权限 -->
                        <!-- 渲染一级 -->
                        <el-row :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']"
                            v-for="(item1, index1) in row.children" :key="item1.id">
                            <el-col :span="4" :class="['vcenter']">
                                <el-tag closable @close="removeRightById(row, item1.id)"> {{ item1.authName }}</el-tag>
                                <i class="el-icon-arrow-right"></i>
                            </el-col>
                            <!-- 渲染二级、三级 -->
                            <el-col :span="20">
                                <!-- 渲染二级权限 -->
                                <el-row :class="[index2 === 0 ? '' : 'bdtop']" v-for="(item2, index2) in item1.children"
                                    :key="item2.id">
                                    <!-- 二级 -->
                                    <el-col :span="6" :class="['vcenter']">
                                        <el-tag type="success" closable @close="removeRightById(row, item2.id)"> {{
                                                item2.authName
                                        }}</el-tag>
                                        <i class="el-icon-arrow-right"></i>
                                    </el-col>
                                    <el-col :span="8" :class="['sp-san']">
                                        <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id"
                                            closable @close="removeRightById(row, item3.id)">
                                            {{ item3.authName }}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>

                    </template>
                </el-table-column>
                <!-- 序号列 -->
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                <el-table-column prop="roleName" label="角色名称">
                </el-table-column>
                <el-table-column prop="roleDesc" label="角色描述">
                </el-table-column>
                <el-table-column label="操作" width="max-content">
                    <template v-slot="{ row }">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRolesShow(row.id)">编辑
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRight(row.id)">删除
                        </el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(row)">
                            分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加角色的对话框 -->
        <el-dialog title="添加角色" :visible.sync="rolesdialogVisible" width="50%" @close="rolesDialogClosed">
            <!-- 内容主题区域 -->
            <el-form :model="addFormRoles" :rules="addRolesFormrules" ref="addFormRolesRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addFormRoles.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addFormRoles.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="rolesdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRoles('addFormRolesRef')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑角色的对话框 -->
        <el-dialog title="编辑角色" :visible.sync="editrolesdialogVisible" width="50%" @close="editRolesDialogClosed">
            <!-- 内容主题区域 -->
            <el-form :model="editFormRoles" :rules="editRolesFormrules" ref="editFormRolesRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editFormRoles.roleName" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editFormRoles.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editrolesdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRoles('editFormRolesRef')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配权限的对话框 -->
        <el-dialog title="分配权限" :visible.sync="SetRightDialogVisible" @close="setRightsClosed">
            <!--  树形控件-->
            <el-tree show-checkbox :data="setRightFormList" :props="treeProps" :default-expand-all="true" node-key="id"
                :default-checked-keys="defkeys" ref="treeRef">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="SetRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            rolesList: [],
            // 显示对话框的显示和隐藏
            SetRightDialogVisible: false,
            //所有的权限列表
            setRightFormList: [],
            // 树形控件的属性绑定 对象
            treeProps: {
                children: 'children',
                label: 'authName'
            },
            // 默认选中的权限的id值数组
            defkeys: [],
            // 当前角色的id值
            roleId: '',
            // 添加角色对话框的显现
            rolesdialogVisible: false,
            // 编辑角色的对话框显示
            editrolesdialogVisible: false,
            // 添加角色对话框的规则
            addRolesFormrules: {
                roleName: [{
                    required: true, message: '请输入角色名', trigger: 'blur'
                }, {
                    min: 3, max: 12, message: '长度在3 到 12个字符串', trigger: 'blur'
                }],
                roleDesc: [
                    {
                        required: false, message: '请输入角色名', trigger: 'blur'
                    }, {
                        min: 0, max: 20, message: '最多10个字', trigger: 'blur'
                    }
                ]
            },
            editRolesFormrules: {
                roleDesc: [
                    {
                        required: false, message: '请输入角色名', trigger: 'blur'
                    }, {
                        min: 0, max: 20, message: '最多10个字', trigger: 'blur'
                    }
                ]
            },
            // 添加角色的信息
            addFormRoles: {
                roleName: '',
                roleDesc: '',
            },
            // 编辑角色的信息
            editFormRoles: {},
        };
    },
    methods: {
        getRolesList: async function () {
            const { data } = await this.axios.get('roles');
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
                this.rolesList = data.data;
            }

        },
        removeRightById: function (roles, id) {
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data } = await this.axios.delete(`roles/${roles.id}/rights/${id}`);
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

                    // console.log(data);
                    roles.children = data.data;
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 展示分配权限的对话框
        showSetRightDialog: async function (role) {

            this.roleId = role.id;
            // 获取所有权限的列表
            const { data } = await this.axios.get(`rights/tree`);
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
                this.setRightFormList = data.data;
            }

            // 递归获取三级节点的id
            this.getListKeys(role, this.defkeys);

            this.SetRightDialogVisible = true;
        },
        // 通过递归的形式获取角色  ⭐⭐⭐⭐
        getListKeys: function (node, arr) {
            if (!node.children) {
                return arr.push(node.id);
            }
            node.children.forEach(item => {
                this.getListKeys(item, arr);
            })
        },
        // 监听关闭后重置 defkeys数组  数组溢出
        setRightsClosed: function () {
            this.defkeys = [];
        },
        // 为角色分配权限
        allotRights: async function () {
            const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()];
            // console.log(keys);
            const idStr = keys.join(',');
            const { data } = await this.axios.post(`roles/${this.roleId}/rights`, { rids: idStr })

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
                this.getRolesList();
                this.SetRightDialogVisible = false;
            }
        },
        // 删除指定的角色
        deleteRight: function (id) {
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data } = await this.axios.delete(`roles/${id}`)
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
                    this.getRolesList();
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 添加指定角色
        addRoles: function (formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    // 发起请求
                    const { data } = await this.axios.post('roles', this.addFormRoles);
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
                        this.rolesdialogVisible = false;
                        // 重新获取用户列表
                        this.getRolesList();
                    }
                }
            })
        },
        // 关闭对话框
        rolesDialogClosed: function () {
            this.$refs.addFormRolesRef.resetFields();
        },
        // 关闭编辑对话框
        editRolesDialogClosed: function () {
            this.$refs.editFormRolesRef.resetFields();
        },
        // 展示要修改的角色
        editRolesShow: async function (id) {
            this.editrolesdialogVisible = true;
            const { data } = await this.axios.get(`roles/${id}`);
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
                this.editFormRoles = data.data;
            }
        },
        editRoles: function (formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    // 发起请求
                    const { data } = await this.axios.put(`roles/${this.editFormRoles.roleId}`, { roleName: this.editFormRoles.roleName, roleDesc: this.editFormRoles.roleDesc });
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
                        // 隐藏添加对话框
                        this.editrolesdialogVisible = false;
                        // 重新获取用户列表
                        this.getRolesList();
                    }
                }
            })
        }
    },
    components: {

    },
    created() {
        this.getRolesList();
    },
};
</script>

<style scoped lang="scss">
.el-tag {
    margin: 10px;
}

.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}
</style>
