//node中的path模块，用来获取文件路径
const path = require('path')

function resolve(dir) {
	return path.join(__dirname, dir)
}

module.exports = {
	// 用来区分生产环境，设置路径位置
	publicPath: process.env.NODE_ENV == 'production' ? "././" : "./",
	// 是否在开发环境下通过eslint
	lintOnSave: false,
	css: {
	    loaderOptions: {
	      sass: { // 加载全局scss文件
	        additionalData: `@import "@/assets/scss/index.scss";`
	      }
	    }
	  },  
	// 图片引用过svg的话需要配置plugins  svg-sprite-loader
	chainWebpack(config) {
		config.module
			.rule('svg')
			.exclude.add(resolve('src/icons'))
			.end()
		config.module
			.rule('icons')
			.test(/\.svg$/)
			.include.add(resolve('src/icons'))
			.end()
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.options({
				symbolId: '[name]'
			})
			.end()
	},
	runtimeCompiler: true,
	devServer: {
		hot: true, // 开启热更新
		port: 8082, // 指定端口号
		https: false, // 是否开启https模式
		host: "localhost", // 主机名
		open: true, // 启动服务自动开启浏览器
		// 解决跨域问题
		proxy: { 
			"/api": {
				target: 'http://localhost:8001', //代理目标地址，一般指的是后端服务器地址
				changeOrigin: true, // 是否跨域
				// secure: false, // 如果是http接口，需要配置该参数
				pathRewrite: { // 在发出请求后将/api替换为''空值，这样不影响接口请求
					'^/api': ''
				}
			}
		}
	},
	// 修改别名
	// config.resolve.alias.set('@',resolve('src'))
	configureWebpack: {
		resolve: {
			alias: {
				// 给 @/assets 这个路径取别名 assets。
				// 以后当使用 v-bind 语法时使用 assets 就是调用 src/assets 这个路径，如<img :src="assets/">，其实就是<img :src="src/assets/">
				// 如果不使用 v-bind 语法时使用 assets 则需要在前面加 ~ ，如<img src="~assets/">，其实就是<img src="src/assets/">
				// 因为不使用 v-bind 语法只有加 ~ 才会认为是别名，否则会认为是字符串。
		 	'@': resolve('src') // @ 就是src(vue语法)
			}
		}
	}
}
