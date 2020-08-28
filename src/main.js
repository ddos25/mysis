import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import './assets/global.css'


import axios from 'axios'
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http=axios
//把token添加到请求头，保证拥有获取数据的权限
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
  }
)



Vue.config.productionTip = false



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
