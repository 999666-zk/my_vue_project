<template>
    <div>
        <h1>这里是首页</h1>
        <el-button type="info" @click="loginout">
            退出
        </el-button>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {

        };
    },
    methods: {
        loginout: function () {
            window.sessionStorage.clear();
            this.$router.push('/login');
        }
    },
    components: {

    },
};
</script>

<style scoped lang="scss">
</style>
