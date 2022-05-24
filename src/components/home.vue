<template>
    <div class="main-page">
        <el-container class="home-container">
            <!-- 头部 -->
            <el-header>
                <div class="left-login">
                    <img src="../assets/headlogo.png" alt="">
                    <span>电商管理平台</span>
                </div>
                <el-button type="info" @click="loginout">退出</el-button>
            </el-header>
            <!-- 主体 -->
            <el-container>
                <!-- 侧边 -->
                <el-aside :width="isCollapse ? 'max-content' : '200px'">
                    <div class="toggle-button" @click="toggleCollapse"><i class="el-icon-s-operation"></i></div>
                    <el-menu background-color="#24262b" text-color="#fff" active-text-color="rgb(71, 148, 239)"
                        :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true"
                        :default-active="actPath">
                        <!-- 一级菜单 -->
                        <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                            <template slot="title">
                                <i :class="iconsObj[item.id]"></i>
                                <span>{{ item.authName }}</span>
                            </template>

                            <el-menu-item :index="'/' + it.path" v-for="it in item.children" :key="it.id"
                                @click="saveNavState('/' + it.path)">
                                <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span>{{ it.authName }}</span>
                                </template>
                            </el-menu-item>


                        </el-submenu>
                    </el-menu>
                </el-aside>
                <!-- 中间 -->
                <el-main>
                    <!-- 出口 -->
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>



export default {

    props: {

    },
    data() {
        return {
            menulist: [],
            iconsObj: {
                '125': 'iconfont icon-user',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-3702mima',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao'
            },
            // 不折叠
            isCollapse: false,
            // 被激活的链接地址
            actPath: '',
        };
    },
    methods: {
        loginout: function () {
            window.sessionStorage.clear();
            this.$router.push('/login');
        },
        getMenuList: function () {
            this.axios.get('menus').then(res => {
                // console.log(res);
                let { data } = res;
                // console.log(data);
                if (data.meta.status !== 200) {
                    this.$message({
                        message: data.meta.msg,
                        type: 'error',
                        duration: 2000,
                    })
                } else {
                    this.menulist = data.data;
                }
            })

        },
        toggleCollapse: function () {
            this.isCollapse = !this.isCollapse;
        },
        saveNavState: function (activePath) {
            window.sessionStorage.setItem('activePath', activePath);
            this.actPath = activePath;
        }
    },
    components: {

    },
    created() {
        this.getMenuList();
        this.actPath = window.sessionStorage.getItem('activePath');
    },
};
</script>

<style scoped lang="scss">
.main-page {
    height: 100%;

    .home-container {
        height: 100%;

        .el-header {
            background: rgb(54, 61, 64);
            display: flex;
            justify-content: space-between;
            align-items: center;

            .left-login {
                width: 200px;
                height: max-content;
                display: flex;
                justify-content: center;
                align-items: center;

                span {
                    margin-left: 20px;
                    color: #fff;
                    font-size: 18px;
                }

                img {
                    width: 45px;
                }

                .el-button {
                    margin-right: 10px;
                }
            }
        }

        .toggle-button {
            background-color: rgb(71, 81, 99);
            font-size: 22px;
            color: white;
            line-height: 40px;
            cursor: pointer;
        }

        .el-aside {
            background: rgb(36, 38, 43);


            .el-menu {
                border: none;

                .el-menu-item {
                    text-align: right;
                }
            }
        }

        .el-main {
            background: rgb(233, 237, 241);
        }
    }

}
</style>
