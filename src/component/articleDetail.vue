<template>
    <div class="article-detail">
        <input type="text" v-model="articleTitle" class="input-article-title">
        <textarea v-model="articleCtx" cols="150" rows="500" class="input-article-ctx">

        </textarea>
        <form action="http://127.0.0.1:3000/blogData/image" id="form">
            <input type="file" name="image" class="input-article-image" @change="onFileChange">
        </form>
        <button class="input-article-submit" @click="submitArticle($route.params.articleId)">提交</button>

    </div>
</template>
<style>
    .article-detail {
        height: 100%;
        padding: 20px;
    }

    .input-article-title {
        width: 80%;
        height: 40px;
        line-height: 40px;
        font-size: 20px;
        padding-left: 10px;
        border-radius: 5px;
    }

    .input-article-ctx {
        width: 80%;
        height: 500px;
        line-height: 1.5em;
        margin: 30px auto;
        font-size: 18px;
        padding: 10px;
        border-radius: 5px;
    }

    .input-article-image {

    }

    .input-article-submit {
        display: block;
        width: 60px;
        height: 30px;
        border-radius: 5px;
        border: none;
        background-color: #00b3ee;
        color: #fff;
    }
</style>
<script>
    import vueFileUpload from 'vue-file-upload'
    export default{
        data(){
            return{
                articleTitle: '',
                articleCtx: '',
                image: '',
                images: []
            }
        },
        mounted: function () {
            /*document.querySelector('input[type="file"]').addEventListener('change', function(e) {
                var blob = this.files[0];
                console.log(blob);
            })*/
        },
        methods: {
            submitArticle: function (articleId) {
                var articleUpdateUrl = "http://127.0.0.1:3000/blogData/articleDetail/" + articleId;
                var articleUpdateData = {
                    title: this.$data.articleTitle,
                    articleCtx: this.$data.articleCtx
                };
                this.$http.post(articleUpdateUrl, articleUpdateData, {emulateJSON: true})
                    .then(
                        function (res) {
                            var articleUpdateStatus = res.data.updateStatus
                            if (articleUpdateStatus == 'success') {
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
            onFileChange: function (e) {
                var files = e.target.files || e.dataTransfer.files;
                this.articleCtx += e.target.files[0].name;
                console.log(e.target.files[0].name)
                if (!files.length)return;
                this.createImage(files);
            },
            createImage: function (file) {
                if(typeof FileReader==='undefined'){
                    alert('您的浏览器不支持图片上传，请升级您的浏览器');
                    return false;
                }
                var vm = this;
                var reader = new FileReader();
                reader.readAsDataURL(file[0]);
                reader.onload =function(e){
                    vm.images.push(e.target.result);
                };
                vm.uploadImage();
            },
            uploadImage: function (e) {
                var vm = this;
                var imageAddUrl = "http://127.0.0.1:3000/blogData/image";
                var imageAddData = {
                    imageData: this.images
                };
                setTimeout(function () {
                    console.log(imageAddData.imageData[0]);
                    vm.$http.post(imageAddUrl, imageAddData, {emulateJSON: true})
                        .then(
                            function (res) {
                            console.log(typeof imageAddData.imageData[0]);
                            },
                            function (res) {

                            }
                        )
                }, 1);


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

            }
        }
    }
</script>
