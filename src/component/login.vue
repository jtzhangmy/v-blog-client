<template>
    <div class="login-content">
      <div class="login">
        <h2 class="login-title success">博客登录</h2>
        <!--<div class="login-exist ion-ios-close-empty" onclick='loginExist()'></div>-->
        <form role='form' method='post' action='/user'>
          <div class="form-group">
            <label for="username" class="input-label">用户名:</label>
            <input type="text" id="username" class="form-control" placeholder='请输入用户名' name='username' v-model="username">
          </div>
          <div class="form-group">
            <label for="password" class="input-label">密码:</label>
            <input type="password" id="password" class="form-control" placeholder='请输入密码' name='password' v-model="password">
          </div>
          <div class="btn-row">
            <span href="" class="btn btn-success" @click = 'login()'>登录</span>
            <router-link to="/reg" class="btn btn-info">注册</router-link>
          </div>
        </form>
      </div>
    </div>
</template>
<style>
  .login-content{
    width: 100%;
    height: 600px;
    position: relative;
  }

  .login{
    overflow: hidden;
    background: #fff;
    width: 400px;
    height: 300px;
    border: 1px solid #ddd;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -150px;
    margin-left: -200px;
    padding: 15px;
    z-index: 9002;
  }

  .login-exist{
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 24px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    color: #bbb;
    text-align: center;
    line-height: 24px;
  }

  .login-exist:before{
    font-weight: 700;
  }

  .login-title{
    text-align: center;
  }

  .input-label{
    font-size: 16px;
  }

  .btn-row{
    text-align: center;
    margin-top: 30px;
  }

  .btn-row .btn{
    margin: 0 20px;
  }
</style>
<script>
    export default{
        data(){
            return{
                username: "",
                password: ""
            }
        },
        methods: {
            login: function () {
                var loginUrl = 'http://127.0.0.1:3000/blogData/userLogin';
                var loginData = {
                    username: this.username,
                    password: this.password
                };
                this.$http.post(loginUrl, loginData, {emulateJSON: true})
                    .then(
                        function (res) {
                            var loginStatus = res.data.loginStatus;
                            var userId = res.data.userId;
                            console.log(res.data);
                            if(loginStatus == 'success') {
                                Cookie.set('username', this.username);
                                this.$router.push({path: '/'});
                            }
                        },
                        function (res) {
                            console.error('login error');
                        }
                    )
            }
        },
    }
</script>
