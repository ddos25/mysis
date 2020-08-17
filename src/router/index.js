import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)
const router = new VueRouter({
  routes : [
    {
      path: '/',
      redirect: '/Login'
    },
    {
      path: '/Login', component: Login

    },
    {
      path:'/home',component: Home
    }
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
