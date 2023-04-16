/**
 * 全局路由配置
 * 代码中的路由统一使用name属性进行跳转
 * 代码中路由统一使用name属性跳转(不使用path属性)
 * 只有next（）是放行，剩下都是中断
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import http from '@/utils/httpRequest'
import {
	isURL
} from '@/utils/validate'
import {
	clearLoginInfo
} from '@/utils'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }
VueRouter.prototype.push = function push(location, onResolve, onReject) {
	if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
	return originalPush.call(this, location).catch(err => err)
}

//开发环境不使用懒加载，否则会造成热更新太慢，生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)


// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [{
		path: '/404',
		component: _import('common/404'),
		name: '404',
		meta: {
			title: '404未找到'
		}
	},
	{
		path: '/before',
		component: _import('common/before'),
		name: 'before',
		meta: {
			title: '注册登录'
		},
		children: [{
			path: '/login',
			component: _import('common/login'),
			name: 'login',
			meta: {
				title: '测试'
			}
		}, {
			path: '/register',
			component: _import('common/register'),
			name: 'register',
			meta: {
				title: '注册'
			}
		}, ]
	},

]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
	path: '/',
	component: _import('main'),
	name: 'main',
	redirect: {
		name: 'home'
	},
	meta: {
		title: '主入口整体布局'
	},
	children: [
		// 通过meta对象设置路由展示方式
		// 1. isTab: 是否通过tab展示内容, true: 是, false: 否
		// 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
		// 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
		{
			path: '/home',
			component: _import('common/home'),
			name: 'home',
			meta: {
				title: '首页'
			}
		},
	],
	beforeEnter(to, from, next) {
		//进入前先判断有无token，若没有则清除登录信息，进入login路由
		let token = Vue.cookie.get('token')
		if (!token || !/\S/.test(token)) {
			clearLoginInfo()
			next({
				name: 'before'
			})
		}
		next()
	}
}

//实例化VueRouter
const router = new VueRouter({
	mode: 'hash',
	scrollBehavior: () => ({
		y: 0
	}), //路由跳转后页面回到顶部
	isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
	routes: globalRoutes.concat(mainRoutes)
})

/**
 * 设置全局路由守卫，每次切换路由都会先实现
 * 添加动态菜单路由
 * 1. 已经添加 or 全局路由，直接访问
 * 2. 获取菜单列表，添加并保存到本地
 */
router.beforeEach((to, from, next) => {
	if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
		next()
	} else {
		http({
			url: http.adornUrl('/sys/menu/nav'),
			method: 'get',
			params: http.adornParams()
		}).then(({
			data
		}) => {
			if (data && data.code === 200) {
				fnAddDynamicMenuRoutes(data.menuList)
				router.options.isAddDynamicMenuRoutes = true
				sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'))
				sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
				// replace: true只是一个设置信息，告诉VUE本次操作后，不能通过浏览器后退按钮，返回前一个路由
				next({
					...to,
					replace: true
				})
			} else {
				sessionStorage.setItem('menuList', '[]')
				sessionStorage.setItem('permissions', '[]')
				next()
			}
		}).catch((e) => {
			console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
			router.push({
				name: 'before'
			})
		})
	}
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType(route, globalRoutes = []) {
	var temp = []
	for (var i = 0; i < globalRoutes.length; i++) {
		if (route.path === globalRoutes[i].path) {
			return 'global'
		} else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
			temp = temp.concat(globalRoutes[i].children)
		}
	}
	return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}


/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes(menuList = [], routes = []) {
	var temp = []
	for (var i = 0; i < menuList.length; i++) {
		if (menuList[i].list && menuList[i].list.length >= 1) {
			temp = temp.concat(menuList[i].list)
		} else if (menuList[i].url && /\S/.test(menuList[i].url)) {
			menuList[i].url = menuList[i].url.replace(/^\//, '')
			var route = {
				path: menuList[i].url.replace('/', '-'),
				component: null,
				name: menuList[i].url.replace('/', '-'),
				meta: {
					menu_id: menuList[i].menu_id,
					title: menuList[i].name,
					isDynamic: true,
					isTab: true,
					iframeUrl: ''
				}
			}
			// url以http[s]://开头, 通过iframe展示
			if (isURL(menuList[i].url)) {
				route['path'] = `i-${menuList[i].menu_id}`
				route['name'] = `i-${menuList[i].menu_id}`
				route['meta']['iframeUrl'] = menuList[i].url
			} else {
				try {
					route['component'] = _import(`modules/${menuList[i].url}`) || null
				} catch (e) {}
			}
			routes.push(route)
		}
	}
	if (temp.length >= 1) {
		fnAddDynamicMenuRoutes(temp, routes)
	} else {
		mainRoutes.name = 'main-dynamic'
		mainRoutes.children = routes
		router.addRoutes([
			mainRoutes,
			{
				path: '*',
				redirect: {
					name: '404'
				}
			}
		])
		sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
	}
}

export default router;
