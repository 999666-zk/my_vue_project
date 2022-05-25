<template>
    <div>
        <!-- <h3>权限列表</h3> -->
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-table :data="rightsList" style="width: 100%" border stripe>
                <!-- 在这里可以尝试加一些checkbox -->
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                <el-table-column prop="authName" label="权限名称">
                </el-table-column>
                <el-table-column prop="path" label="路径">
                </el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template v-slot="{ row }">
                        <el-tag v-if="row.level === '0'">一级</el-tag>
                        <el-tag type="success" v-else-if="row.level === '1'">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {

            // 所有的权限列表
            rightsList: [],
        };
    },
    methods: {
        getRightsList: async function () {
            const { data } = await this.axios.get('rights/list');
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
                this.rightsList = data.data;
            }
        }
    },
    components: {

    },
    created() {
        this.getRightsList();
    },
};
</script>

<style scoped lang="scss">
</style>
