<template>
    <div class="article-detail">
        <div v-show="!editArticle" class="article-content">
            <h2>{{articleTitle}}</h2>
            <div>
                <span>作者:{{articleData.author}}</span>
            </div>
            <div v-html="articleCtx"></div>
            <button class="article-edit" v-if='edit' @click="editTheArticle()">编辑文章</button>
        </div>
        
        <div v-show="editArticle" class="editor">
            <input type="text" v-model="articleTitle" class="input-article-title">
            <textarea v-model="articleCtxMd" cols="150" rows="500" class="input-article-ctx"></textarea>
            <input type="file" name="image" id="input-article-image" class="input-article-image" @change="onFileChange">
            <div class="input-article-btn">
                <button class="input-article-img" @click="addImg()">添加图片</button>
                <button class="input-article-submit" @click="submitArticle($route.params.articleId)">提交</button>
                <button class="input-article-cancel" @click="cancel()">取消</button>
            </div>
        </div>


    </div>
</template>

<script>
    import vueFileUpload from 'vue-file-upload'
    export default{
        props:['articleId', 'edit'],
        data(){
            return{
                articleTitle: '',
                articleCtxMd:'',
                articleCtx: '',
                image: '',
                imageName: '',
                articleData: '',
                editArticle: false
            }
        },
        mounted: function () {
            this.initArticle();
        },
        watch:{
            articleId: function () {
                this.initArticle();
            }
        },
        methods: {
            initArticle: function () {
                var getArticleUrl = 'http://127.0.0.1:3000/blogData/articleDetail/' + this.$route.params.articleId;
                this.$http.get(getArticleUrl, {emulateJSON: true})
                    .then(
                        function (res) {
                            this.articleData = res.data;
                            this.articleTitle = this.articleData.title;
                            this.articleCtxMd = this.articleData.articleCtx;
                            this.articleCtx = markdown.toHTML(this.articleCtxMd);
                        },
                        function (res) {

                        }
                    )
            },
            submitArticle: function (articleId) {
                var vm = this;
                var articleUpdateUrl = "http://127.0.0.1:3000/blogData/articleDetail/" + articleId;
                var articleUpdateData = {
                    title: this.$data.articleTitle,
                    articleCtx: this.$data.articleCtxMd
                };
                this.$http.post(articleUpdateUrl, articleUpdateData, {emulateJSON: true})
                    .then(
                        function (res) {
                            var articleUpdateStatus = res.data.updateStatus;
                            if (articleUpdateStatus == 'success') {
                                vm.getArticleData();
                                vm.editArticle = false;
                                alert('修改文章成功');
                            } else{
                                alert('修改文章失败1');
                            }
                        },
                        function (res) {
                            alert('修改文章失败2');
                        }
                    )
            },
            // 当文件改变时
            onFileChange: function (e) {
                var files = e.target.files || e.dataTransfer.files;
//                this.articleCtx += e.target.files[0].name;
                console.log(e.target.files[0].name);
                this.imageName = e.target.files[0].name;
                if (!files.length)return;
                this.createImage(files);
            },
            // 将图片转为base64
            createImage: function (file) {
                if(typeof FileReader==='undefined'){
                    alert('您的浏览器不支持图片上传，请升级您的浏览器');
                    return false;
                }
                var vm = this; //作用域
                var reader = new FileReader();
                reader.readAsDataURL(file[0]);
                reader.onload =function(e){
                    vm.image = e.target.result;
                    vm.uploadImage();
                };
            },
            // 上传图片
            uploadImage: function () {
                var vm = this;
                var imageAddUrl = "http://127.0.0.1:3000/blogData/image";
                var imageAddData = {
                    imageData: this.image
                };
                console.log(imageAddData);
                vm.$http.post(imageAddUrl, imageAddData, {emulateJSON: true})
                    .then(
                        function (res) {
                            var resImgData = res.data;
                            var imgPath = resImgData.imgPath;
                            var imageName = vm.imageName;
                            console.log(imgPath);
                            vm.articleCtxMd += `![${imageName}](http://127.0.0.1:3000/${imgPath})`;
                        },
                        function (res) {

                        }
                    );


                /*var form = document.getElementById('form');
                 form.submit();*/
                /*console.log(e.target.files[0]);//图片信息
                 var imageData = e.target.files[0];
                 var reader = new FileReader();
                 var imageDataReader;
                 reader.readAsBinaryString(imageData);
                 reader.onload = function(e){
                 console.log(e.target.result);
                 imageDataReader = e.target.result
                 };
                 */

            },
            getArticleData: function () {
                var getArticleUrl = 'http://127.0.0.1:3000/blogData/articleDetail/' + this.$route.params.articleId;
                this.$http.get(getArticleUrl, {emulateJSON: true})
                    .then(
                        function (res) {
                            this.articleData = res.data;
                            this.articleTitle = this.articleData.title;
                            var articleCtx = this.articleData.articleCtx;
                            this.articleCtx = markdown.toHTML(articleCtx);
                        },
                        function (res) {

                        }
                    )
            },
            editTheArticle: function () {
                this.editArticle = true;
            },
            addImg: function () {
                var fileBtn = document.getElementById('input-article-image');
                fileBtn.click();
            },
            cancel: function () {
                this.editArticle = false;
            }
        }
    }
</script>

<style>
    /*---------------markdown style-----------------*/
    table {
        margin: 10px 0 15px 0;
        border-collapse: collapse;
    }

    td,th {
        border: 1px solid #ddd;
        padding: 3px 10px;
    }

    th {
        padding: 5px 10px;
    }

    a {
        color: #0069d6;
    }

    a:hover {
        color: #0050a3;
        text-decoration: none;
    }

    a img {
        border: none;
    }

    p {
        margin-bottom: 9px;
    }
    
    h1,h2,h3,h4,h5,h6 {
        line-height: 36px;
    }
    
    h1 {
        margin-bottom: 18px;
        font-size: 30px;
    }
    
    h2 {
        font-size: 24px;
    }
    
    h3 {
        font-size: 18px;
    }
    
    h4 {
        font-size: 16px;
    }
    
    h5 {
        font-size: 14px;
    }
    
    h6 {
        font-size: 13px;
    }
    
    hr {
        margin: 0 0 19px;
        border: 0;
        border-bottom: 1px solid #ccc;
    }
    
    blockquote {
        padding: 13px 13px 21px 15px;
        margin-bottom: 18px;
        font-family:georgia,serif;
        font-style: italic;
    }
    
    blockquote:before {
        content:"\201C";
        font-size:40px;
        margin-left:-10px;
        font-family:georgia,serif;
        color:#eee;
    }
    
    blockquote p {
        font-size: 14px;
        font-weight: 300;
        line-height: 18px;
        margin-bottom: 0;
        font-style: italic;
    }
    
    code, pre {
        font-family: Monaco, Andale Mono, Courier New, monospace;
    }
    
    code {
        background-color: #fee9cc;
        color: rgba(0, 0, 0, 0.75);
        padding: 1px 3px;
        font-size: 12px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
    
    }

    pre {
        display: block;
        padding: 14px;
        margin: 0 0 18px;
        line-height: 16px;
        font-size: 11px;
        border: 1px solid #d9d9d9;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
    
    pre code {
        background-color: #fff;
        color:#737373;
        font-size: 11px;
        padding: 0;
    }
    
    sup {
        font-size: 0.83em;
        vertical-align: super;
        line-height: 0;
    }
    
    img {
        max-width: 100%;
        display: block;
        margin: 0 auto;
    }
    
    * {
        -webkit-print-color-adjust: exact;
    }
    
    @media screen and (min-width: 914px) {
        body {
            width: 854px;
            margin:10px auto;
        }
    }
    
    @media print {
        body,code,pre code,h1,h2,h3,h4,h5,h6 {
            color: black;
        }
        table, pre {
            page-break-inside: avoid;
        }
    }

    /*----------------article detail style--------------------*/

    .article-detail {
        height: 100%;
        padding: 20px;
        overflow-y: scroll;
    }
    
    .article-content {
        width: 80%;
        margin: 0 auto;
        overflow: hidden;
    }

    .editor {
        width: 80%;
        margin: 0 auto;
    }

    .input-article-title {
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 20px;
        padding-left: 10px;
        border-radius: 5px;
    }

    .input-article-ctx {
        width: 100%;
        height: 500px;
        line-height: 1.5em;
        margin: 30px auto;
        font-size: 18px;
        padding: 10px;
        border-radius: 5px;
    }

    .input-article-image {
        display: none !important;
    }

    .input-article-btn {
        width: 100%;
        text-align: center;
        margin: 20px 0;
    }

    .input-article-img {
        display: inline-block;
        width: 80px;
        height: 30px;
        border-radius: 5px;
        border: none;
        background-color: #3dd50e;
        color: #fff;
        margin: 0 10px;
    }

    .input-article-submit {
        display: inline-block;
        width: 60px;
        height: 30px;
        border-radius: 5px;
        border: none;
        background-color: #00b3ee;
        color: #fff;
        margin: 0 10px;
    }

    .input-article-cancel {
        display: inline-block;
        width: 60px;
        height: 30px;
        border-radius: 5px;
        border: none;
        background-color: #dca7a7;
        color: #fff;
        margin: 0 10px;
    }

    .article-edit {
        display: inline-block;
        width: 60px;
        height: 30px;
        border-radius: 5px;
        border: none;
        background-color: #00b3ee;
        color: #fff;
        margin: 0 10px;
    }
</style>

