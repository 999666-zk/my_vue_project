<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像 -->
      <div class="avatar-box">
        <img src="../assets/logo.jpg" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item prop="username">
          <el-input
            v-model="ruleForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >登录</el-button
          >
          <el-button type="info" @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      ruleForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');

          // 在这里进行axios请求
          this.axios.post("login", this.ruleForm).then((res) => {
            // console.log(res);
            let { data } = res;
            // console.log(data);
            if (data.meta.status !== 200) {
              // 登录失败
              // 路由重定向
              this.$message({
                message: "登录失败,请再次核对相关信息",
                type: "error",
                duration: 2000,
              });
            } else {
              this.$message({
                message: "登录成功",
                type: "success",
                duration: 2000,
                onClose: () => {
                  window.sessionStorage.setItem("token", data.data.token);
                  this.$router.push("home");
                },
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  components: {},
};
</script>

<style lang="scss">
.login-container {
  height: 100%;
  background: #2b4b6b;

  .login-box {
    width: 450px;
    height: 300px;
    background: white;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .avatar-box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #eee;
      }
    }

    .demo-ruleForm {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 90px;

      .el-form-item__content {
        width: 380px;
        margin: 0px !important;
      }
    }
  }
}
</style>
