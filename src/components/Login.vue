<template>
  <div class="login">
    <div class="box">
      <div class="icon">
        <img src="../assets/logo.png">
      </div>
      <div class="form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item  prop="name" label-width="0">
        <el-input prefix-icon="iconfont icon-user" v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item  prop="psd" label-width="0">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="ruleForm.password"   type="password"> </el-input>
        </el-form-item >
        <el-form-item  class="btns">
            <el-button type="primary" @click="loginHandle"> 登录</el-button>
            <el-button type="info" @click="clearHandle"> 重置</el-button>
        </el-form-item>
        </el-form>
      </div>
    </div>


  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
export default {
  name: 'Login',

  components: {

  },
  data() {
    return {
      ruleForm: {
        username: '',
        password: ''
        // 'admin/123456'
      },
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 5, message: '3 到 5个字符', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur',},
          {min: 3, max: 10, message: '3 到 10个字符', trigger: 'blur'}]
      }
    }
  },
  methods:{
  loginHandle(){
    /*
    this.$refs.ruleForm.validate(vali=>{
        if (vali){
        this.$http.post('login',this.ruleForm).then(res=>{
          console.log('登录成功');
        }).catch(err=>{
          console.log('请求错误');
        })
      }
    })
  */
    this.$refs.ruleForm.validate(async vali=>{
      if (!vali) return
      const {data:res}=await this.$http.post('login',this.ruleForm)

      console.log(res);
      if (res.meta.status!==200)
        this.$message({
        message: '登录失败',
        type: 'warning',
        duration:1000
      });

      else {
        this.$message({
          message: '登录成功',
          type: 'success',
          duration:1000
        });
        // console.log('登录成功');

        window.sessionStorage.setItem('token',res.data.token)

        this.$router.push('/home')


            }

    })


  },
    clearHandle(){
    this.$refs.ruleForm.resetFields()
    }

}


}
</script>
<!--<link rel="stylesheet" type="text/css" href="../assets/fonts/iconfont.css">-->
<style scoped lang="less">
  html,body,.login{
    width: 100%;height: 100%;
    background-color: #34516e;
    display: flex;flex-direction: column;
    justify-content: center;
    align-items: center;
/*overflow: hidden;*/

  }
  .box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    position: relative;
    /*margin: 100px auto;*/
    .icon{
      width: 130px;
      height: 130px;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      overflow: hidden;
      border:10px solid #fff ;
      border-radius: 50%;

      background-color: rgb(237, 237, 237);
      box-shadow:0 0 5px #d0d0d0;
      img{
        width: 100%;
        height: 100%;


      }
    }
    .form{
      left: 20px;
      right: 20px;
      top: 35%;
      position: absolute;
      /*box-sizing: border-box;*/
    }
    .el-input{
      /*width: 120%;*/
    }
    .btns{
      text-align: right;
    }

  }
</style>
