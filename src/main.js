import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

Vue.config.debug = true;
Vue.use(VueRouter);
Vue.use(VueResource);

import Register from './component/register.vue'
import Login from './component/login.vue'
import ArticleList from './component/articleList.vue'
import ArticleDetail from './component/articleDetail.vue'


const Article = {
  template: `<h1>Article</h1>`
};


const routes = [
  {
    path: '/',
    component: App,
    name: 'index'
  },
  {
    path: '/reg',
    component: Register,
    name: 'reg'
  },{
    path: '/login',
    component: Login,
    name: 'login'
  },{
    path: '/classify/:classify',
    component: ArticleList,
    name: 'articleList',
    children: [
      {
        path: '',
        component: Article
      },
      {
        path: ':articleId',
        component: ArticleDetail
      }
    ]
  }
];

const router = new VueRouter({
  routes: routes
});


new Vue({
  el: '#app',
  router: router,
  render: h => h(App),
  data: {
    eventHub: new Vue()
  }
});


