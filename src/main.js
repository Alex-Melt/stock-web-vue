import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import httpRequest from '@/utils/httpRequest'
// import '@/assets/scss/index.scss'
import '@/element-ui-theme'
import '@/icons' 
import { isAuth } from '@/utils'

// 使用vue-cookie
import VueCookie from 'vue-cookie' 
Vue.use(VueCookie)

// 使用第三方js库
import cloneDeep from 'lodash/cloneDeep'

//引入element-ui组件
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// 使用element自定义的css
import './theme/element/index.css'
import '@/element-ui'
Vue.use(ElementUI)

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth     // 权限方法

//阻止显示生产模式信息
Vue.config.productionTip = false

// 保存整站vuex本地储存初始状态
window.SITE_CONFIG = {};
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)


new Vue({
	router,
	store,
	template: '<App/>',
	components: {
		App
	}
}).$mount('#app')




 // 全局引入,一般用于设置定时器
// import VueCron from 'vue-cron'
// Vue.use(VueCron)


// 非生产环境, 适配mockjs模拟数据                 // api: https://github.com/nuysoft/Mock
// if (process.env.NODE_ENV !== 'production') {
//   require('@/mock')
// }
