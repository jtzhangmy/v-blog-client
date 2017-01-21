<template>
  <div id="app">

    <div class="home-header">
      <h2 class="home-header-title">博客</h2>
      <div class="home-header-col">
        <div class="home-header-classify-outer" v-for="classify, index in classifies">
          <router-link :to="{name:'articleList', params:{classify: classify.classifyId}}" class="home-header-classify home-header-classify-hover">{{classify.title}}</router-link>
          <span class="home-header-classify-close ion-ios-close-outline" v-if="editing" @click="removeClassify(index, classify.classifyId)"></span>
        </div>

        <div class="home-header-add col-md-1">
          <span @click="addClassify()" class="home-header-add-inner ion-ios-plus-outline" v-if="editing"></span>
        </div>
      </div>
      <div class="home-header-operate">
        <router-link to="/login" class="home-header-login" v-if="!userLogin">登录</router-link>
        <router-link to="/reg" class="home-header-reg" v-if="!userLogin">注册</router-link>
        <div class="home-header-exit" v-if="userLogin" @click="exit()">退出</div>
        <div class="home-header-edit" v-if="userLogin" @click="edit()">{{editName}}</div>
        <div class="home-header-user" v-if="userLogin">您好:{{username}}</div>
      </div>
    </div>

    <div class="home-header-add-classify" v-show="addingClassify">
      <h3 class="home-header-add-title">添加分类</h3>
      <input class="home-header-input" v-model="classifyAddTitle">
      <div class="home-header-add-btn">
        <a @click="addClassifyConfirm()" class="btn btn-primary home-header-btn-add">添加</a>
        <a @click="addClassifyCancel()" class="btn btn-danger home-header-btn-cancel">取消</a>
      </div>
    </div>

    <router-view :classifyId="$route.params.classify" :edit="editing"></router-view>

  </div>
</template>

<script>
  function cookie() {
    this.set = function(key, value) {

      var dates=new Date();

      dates.setDate(dates.getDate()+1); //按天数设置

      document.cookie = key + "=" + value + ";expires="+dates;

    };
    this.get = function(key) {

      var arr = document.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));

      if (arr != null) {
        return (arr[2]);
      } else {
        return "";
      }
    };
    this.remove = function(key) {

      var exp = new Date();
      exp.setTime(exp.getTime() + (-1 * 24 * 60 * 60 * 1000));
      var cval = this.set(key);
      document.cookie = key + "=" + cval + "; expires=" + exp.toGMTString();
    };

  }

  var Cookie = new cookie();

export default {
  name: 'app',
  data () {
    return {
      classifies: [],
      userLogin: false,
      username: Cookie.get('username'),
      editing: false,
      editName: '编辑',
      addingClassify: false,
      classifyAddTitle: ''
    }
  },
  mounted: function () {

    this.$http.get('http://localhost:3000/blogData/classify', {}, {emulateJSON: true})
        .then(
            function (res) {
              var classifyData = res.data;
              this.classifies = classifyData;
//              console.log(classifyData)
            },
            function (res) {
              console.error('get classify error');
            }
        );

    if(Cookie.get('username')) {
      this.userLogin = true;
    }
  },
  methods: {
    edit: function () {
      if(this.editing) {
        this.editing = false;
        this.editName = '编辑';
      } else {
        this.editing = true;
        this.editName = '确认';
      }
    },
    //退出登录
    exit: function () {
      Cookie.remove('username');
      Cookie.remove('userId');
      this.userLogin = false;
      this.editing = false;
    },
    //插入分类
    addClassify: function () {
      this.addingClassify = true;
    },
    //插入分类标题
    addClassifyConfirm: function () {
      var classifyAddUrl = "http://localhost:3000/blogData/classify";
      var classifyAddData = {
        type: 'add',
        title: this.classifyAddTitle,
        author: Cookie.get('username'),
        authorId: Cookie.get('userId')
      };
      this.$http.post(classifyAddUrl, classifyAddData, {emulateJSON: true})
          .then(
              function (res) {
                var classifyAddStatus = res.data;
                if (classifyAddStatus.result == 'success') {
                  this.classifies.push(
                      {
                        classifyId: classifyAddStatus.classifyId,
                        title: this.classifyAddTitle
                      }
                  );
                  this.addingClassify = false;

                } else {
                  alert('插入分类失败1');
                }
              },
              function (res) {
                alert('插入分类失败2');
              }
          )
    },
    // 插入标题关闭
    addClassifyCancel: function () {
      this.addingClassify = false;
    },
    // 删除分类
    removeClassify: function (index, classifyId) {
      var classifyAddUrl = "http://localhost:3000/blogData/classify";
      var classifyAddData = {
        type: 'remove',
        classifyId: classifyId
      };
      this.$http.post(classifyAddUrl, classifyAddData, {emulateJSON: true})
          .then(
              function (res) {
                var classifyAddStatus = res.data;
                if (classifyAddStatus.result == 'success') {
                  this.classifies.splice(index, 1);
                } else {
                  alert('删除分类失败1');
                }
              },
              function (res) {
                alert('删除分类失败2');
              }
          )
    }

  }
}
</script>

<style>
  body {
    font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;
  }
  *{
    margin: 0;
    padding: 0;
  }

  a,a:link,a:hover,a:active,a:visited {
    text-decoration: none;
  }

  #app {
    width: 100%;
    height: 100%;
  }

  .home-header{
    height: 50px;
    width: 100%;
    background: #259ffe;
    color: #fff;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 9000;
  }

  .home-header-title{
    margin: 0;
    padding-left: 30px;
    height: 50px;
    line-height: 50px;
    display: inline-block;
    width: 16.666666667%;
    float: left;
  }

  .home-header-col{
    display: inline-block;
    width: 60%;
    height: 50px;
    line-height: 50px;
    float: left;
  }

  .home-header-add{
    font-size: 24px;
    cursor: pointer;
    margin-top: 13px;
    line-height: 18px;
    text-align: center;
    display: inline-block;
  }

  .home-header-add-inner{
    width: 24px;
    height: 24px;
    border-radius: 12px;
    font-weight: 700;
  }

  .home-header-add-inner:before{
    font-weight: 700;
  }

  .home-header-operate{
    display: inline-block;
    width: 20%;
    height: 50px;
    line-height: 50px;
  }

  .home-header-user{
    float: left;
    width: 50%;
    text-align: center;
    /*display: none;*/
  }

  .home-header-confirm{
    width: 25%;
    float: left;
    cursor: pointer;
    text-align: center;
    display: none;
  }

  .home-header-exit{
    width: 25%;
    float: right;
    cursor: pointer;
    text-align: center;
    /*display: none;*/
  }

  .home-header-login{
    width: 25%;
    float: right;
    cursor: pointer;
    text-align: center;
    color: #fff;
  }

  .home-header-login:visited {
    color: #fff;
  }

  .home-header-reg {
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    width: 25%;
    float: right;
    text-align: center;
  }

  .home-header-reg:visited {
    color: #fff;
  }

  .home-header-edit{
    width: 25%;
    float: right;
    cursor: pointer;
    text-align: center;
  }

  .home-header-reg:hover{
    text-decoration: none;
    color: #fff;
  }

  .home-header-classify-outer{
    width: auto;
    float: left;
    position: relative;
    height: 50px;
  }

  .home-header-classify{
    color: #fff;
    font-weight: 700;
    font-size: 18px;
    text-align: center;
    text-decoration: none;
    padding: 0 20px;
    height: 50px;
    display: block;
    cursor: default;
  }

  .home-header-classify.router-link-active {
    background-color: #0482ba;
  }

  .home-header-classify:visited {
    color: #fff;
  }

  .home-header-classify-hover{
    cursor: pointer;
  }

  .home-header-classify-hover:hover{
    color: #fff;
    text-decoration: none;
    background-color: #0482ba;
  }

  .home-header-classify:link{
    color: #fff;
    text-decoration: none;
  }

  .home-header-classify-close{
    position: absolute;
    z-index: 9005;
    top: -10px;
    right: 0;
    cursor: pointer;
  }

  .home-header-add-classify{
    width: 300px;
    height: 220px;
    position: absolute;
    z-index: 9002;
    top: 50%;
    left: 50%;
    margin-top: -110px;
    margin-left: -150px;
    background-color: #fff;
    border-radius: 5px;
    padding: 15px;
    border: 1px solid #ddd;
  }

</style>
