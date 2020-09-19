import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Users from '../components/Users.vue'
import Welcome from '../components/Welcome.vue'
import Roles from '../components/Roles.vue'
import Rights from '../components/Rights.vue'
import Cates from '../components/Cates.vue'
import Params from '../components/Params.vue'
import Goods from '../components/Goods.vue'
import newGoods from '../components/newgoods.vue'
Vue.use(VueRouter)

import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor)

Vue.filter('createDate',function (date) {
  var time=new Date(date)
  var year=time.getFullYear()
  var mon=time.getMonth() + 1
  var day=time.getDate()
  var hour=time.getHours()
  var min=time.getMinutes()
  var sec=time.getSeconds()

  return year+'-'+mon+'-'+day +' '+hour+':'+min+':'+sec

})

const router = new VueRouter({
  routes : [
    {
      path: '/',
      redirect: '/Login'
    },
    {
      path: '/Login', component: Login

    },
    {path:'/home',component: Home,
      redirect:'Welcome',
    children:[
      {path:'/welcome',component: Welcome},
      {path:'/users',component: Users},
      {path:'/roles',component: Roles},
      {path:'/rights',component: Rights},
      {path:'/categories',component: Cates},
      {path:'/params',component: Params},
      {path:'/goods',component: Goods},
      {path:'/goods/newgoods',component: newGoods},
    ]},

  ]
})


// 导航守卫，访问home前判断是否有token，否则跳转到login

router.beforeEach((to, from, next) => {
  if (to.path==='/login') return next()
  const tokenStr=window.sessionStorage.getItem('token')
  if (!tokenStr)return next('/login')
  next()//放行

})




export default router
