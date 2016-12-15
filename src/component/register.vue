<template>
    <div class="reg-content">
        <div class="reg col-md-4 col-md-offset-4"><h2 class="reg-title">注册新用户</h2>
            <form role="form" method="POST" action="/user">
                <div class="form-group has-feedback has-success">
                    <label for="username" class="input-label">用户名:</label>
                    <input id="username" type="text" placeholder="请输入用户名" name="username" class="form-control" v-model="username">
                    <span class="glyphicon form-control-feedback glyphicon-ok"></span>
                </div>
                <div class="form-group has-feedback has-success">
                    <label for="password" class="input-label">密码:</label>
                    <input id="password" type="password" placeholder="请输入密码" name="password" class="form-control" v-model="pass">
                    <span class="glyphicon form-control-feedback glyphicon-ok"></span>
                </div>
                <div class="form-group has-feedback has-success">
                    <label for="password" class="input-label">重复密码:</label>
                    <input id="re_password" type="password" placeholder="请重复输入密码" name="re_password" class="form-control" v-model="rePass">
                    <span class="glyphicon form-control-feedback glyphicon-ok"></span>
                </div>
                <div class="form-group has-feedback has-success">
                    <label for="password" class="input-label">邮箱:</label>
                    <input id="email" type="email" placeholder="请输入邮箱" name="email" class="form-control" v-model="email">
                    <span class="glyphicon form-control-feedback glyphicon-ok"></span>
                </div>
                <div class="btn-row">
                    <a @click="register()" class="btn btn-success">注册</a>
                    <a href="/" class="btn btn-info">返回</a>
                </div>
            </form>
        </div>
    </div>
</template>
<style>
    .reg-content{
        width: 100%;
        height: 600px;
        overflow: hidden;
        position: relative;
    }

    .reg{
        border: 1px solid #ddd;
        border-radius: 10px;
        height: 440px;
        position: absolute;
        top: 50%;
        margin-top: -220px;
    }

    .reg-title{
        text-align: center;
    }

</style>
<script>
    export default{
        data(){
            return{
                username: '',
                pass: '',
                rePass: '',
                email: ''
            }
        },
        methods: {
            register: function () {
                if (this.pass == this.rePass) {
                    var useRegSrc = 'http://127.0.0.1:3000/blogData/userReg';
                    var userData = {
                        username: this.username,
                        password: this.pass,
                        email: this.email
                    };
                    this.$http.post(useRegSrc, userData, {emulateJSON: true})
                        .then(
                            function (res) {
                                console.log(res.data);
                                var resData = res.data;
                                if (resData.reg == 'success') {
                                    alert('注册成功');
                                    Cookie.set('username', this.username);
                                    Cookie.set('userId', resData.userId)
                                    this.$router.push({path: '/'});
                                } else if (resData.reg == 'error') {
                                    alert('注册失败');
                                } else if (resData.reg == 'exist') {
                                    alert('用户已存在');
                                }


                            },
                            function (res) {

                            }
                        )
                } else {
                    alert('两次密码输入不一致,请重新输入!');
                }
            }
        }
    }
</script>
