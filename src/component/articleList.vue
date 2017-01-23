<template>
    <div class="article-list">
        <div class="home-aside col-md-2">
            <h3 class="home-aside-title">目录</h3>
            <div v-for="(article, index) in articles" >
                <router-link
                    v-if="article.type == 'type1'"
                    :to="{ path: '/classify/' + classifyId + '/' + article.articleId + '?page=' + index}"
                    class="home-aside-tt home-aside-t1" >
                    {{article.title}}
                </router-link>
                <router-link
                    v-if="article.type == 'type2'"
                    :to="{ path: '/classify/' + classifyId + '/' + article.articleId + '?page=' + index}"
                    class="home-aside-tt home-aside-t2" >
                    {{article.title}}
                </router-link>
                <router-link
                    v-if="article.type == 'type3'"
                    :to="{ path: '/classify/' + classifyId + '/' + article.articleId + '?page=' + index}"
                    class="home-aside-tt home-aside-t3" >
                    {{article.title}}
                </router-link>
            </div>
            <div class="home-aside-add-article" v-if="edit">
                <span class="ion-ios-plus-empty home-aside-add-icon" @click="showAddArticle()"></span>
            </div>
        </div>
        <router-view class="col-md-10"
                     :articleId="this.$route.params.articleId"
                     :edit="edit"
                     :articles.sync="articles">
        </router-view>
        <!--添加文章-->
        <div class="home-header-add-article" v-show="addingArticle">
            <h3 class="home-header-add-title">添加文章</h3>
            <div class="home-header-article-title">
                <input type="text" class="home-header-article-input" v-model="articleAddTitle">
            </div>
            <div class="home-header-type">
                <span class="home-header-add-title">文章级别</span>
                <label class="radio-inline">
                    <span class="home-header-radio-name">1</span>
                    <input type="radio" value="type1" class="home-header-radio" name="type" v-model="articleType">
                </label>
                <label class="radio-inline">
                    <span class="home-header-radio-name">2</span>
                    <input type="radio" value="type2" class="home-header-radio" name="type" v-model="articleType">
                </label>
                <label class="radio-inline">
                    <span class="home-header-radio-name">3</span>
                    <input type="radio" value="type3" class="home-header-radio" name="type" v-model="articleType">
                </label>
            </div>
            <div class="home-header-add-btn">
                <a @click="addArticleTitle($route.params.classify)" class="btn btn-primary home-header-btn-add">添加</a>
                <a @click="addArticleCancel()" class="btn btn-danger home-header-btn-cancel">取消</a>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        props:['classifyId', 'edit'],
        data(){
            return{
                addingArticle: false,
                articles: [],
                articleType: 'type1',
                articleAddTitle: ''
            }
        },
        mounted: function () {
            this.initArticleLidt();
        },
        watch: {
            //监听路由改变
            classifyId: function () {
                this.initArticleLidt();
            }
        },
        methods: {
            initArticleLidt: function () {
                var articleListUrl = 'http://127.0.0.1:3000/blogData/articleList/' + this.classifyId;
                this.$http.get(articleListUrl, {}, {emulateJSON: true})
                    .then(
                        function (res) {
                            var classifyData = res.data;
                            this.$data.articles = classifyData[0].articleList;
                            console.log(this.$data.articles)
                        },
                        function (res) {
                            console.error('get classify error');
                        }
                    )
            },
            showAddArticle: function () {
                this.addingArticle = true;
            },
            // 添加文章名称
            addArticleTitle: function (classify) {
                var articleAddUrl = "http://127.0.0.1:3000/blogData/articleList/" + classify;
                var articleAddData = {
                    title: this.articleAddTitle,
                    author: Cookie.get('username'),
                    type: this.articleType,
                    classify: classify
                };
                this.$http.post(articleAddUrl, articleAddData, {emulateJSON: true})
                    .then(
                        function (res) {
                            var articleAddStatus = res.data;
                            if (articleAddStatus.result == 'success') {
                                console.log(articleAddStatus);
                                this.articles.push(
                                    {
                                        articleId: articleAddStatus.articleId,
                                        type: articleAddStatus.articleType,
                                        title: articleAddStatus.articleTitle
                                    }
                                );
                                this.addingArticle = false;
                                console.log(this.articles);

                            } else {
                                alert('插入分类失败1');
                            }
                        },
                        function (res) {
                            alert('插入分类失败2');
                        }
                    )
            },
            addArticleCancel: function () {
                this.addingArticle = false;
            }
        }
    }
</script>

<style>
    .article-list {
        padding-top: 50px;
        width: 100%;
        height: 100%;
    }

    .home-aside{
        overflow-y: scroll;
        padding-left: 30px;
        color: #aaa;
        border-right: 1px solid #ddd;
        height: 100%;
    }

    .home-aside-tt{
        display: block;
        width: 100%;
        height: 26px;
        line-height: 26px;
        text-decoration: none;
        cursor: pointer ;
        color: #6d6d6d;
        font-size: 18px;
    }

    .home-aside-t1 {
        padding-left: 10px;
    }

    .home-aside-t2 {
        padding-left: 20px;
    }

    .home-aside-t3 {
        padding-left: 30px;
    }

    .home-aside-tt:hover{
        text-decoration: none;
        color: #259ffe;
    }

    .home-aside-tt.router-link-active {
        color: #259ffe;
        background: #eee;
    }

    .home-aside-add-icon {
        width: 90%;
        height: 30px;
        font-size: 30px;
        color: #9d9d9d;
        text-align: center;
        display: block;
        background-color: #eee;
        line-height: 30px;
    }

    .home-header-add-article{
        width: 300px;
        height: 260px;
        position: absolute;
        z-index: 9002;
        top: 50%;
        left: 50%;
        margin-top: -130px;
        margin-left: -150px;
        background-color: #fff;
        border-radius: 5px;
        padding: 15px;
        border:1px solid #ddd;
    }

    .home-header-add-title{
        text-align: center;
        color: #259ffe;
    }

    .home-header-add-btn{
        text-align: center;
        margin-top: 20px;
    }

    .home-header-btn-add{
        margin: 10px;
    }

    .home-header-btn-cancel{
        margin: 10px;
    }

    .home-header-type{
        margin-top: 20px;
        overflow: hidden;
        text-align: center;
    }

    .home-header-radio-name{
        float: left;
    }

    .radio-inline input{
        float: left;
        margin: 3px 0 0 0 !important;
        position: static;
    }

    .home-header-article-title {
        height: 50px;
        line-height: 50px;
    }

    .home-header-article-input {
        height: 30px;
        width: 100%;
        line-height: 30px;
        font-size: 18px;
        padding-left: 5px;
    }

    .home-aside-add-article {
        margin-top: 15px;
    }


</style>

