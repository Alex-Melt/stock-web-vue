<template>
	<div class="site-wrapper" :class="{ 'site-sidebar--fold': sidebarFold }" v-loading.fullscreen.lock="loading"
		element-loading-text="拼命加载中">
		<!-- 如果是false则显示主页面信息 -->
		<template v-if="!loading">
			<main-navbar />
			<main-sidebar />
			<div class="site-content__wrapper" :style="{ 'min-height': documentClientHeight + 'px' }">
				<!-- 如果刷新为false，进行显示 -->
				<main-content v-if="!$store.state.common.contentIsNeedRefresh" />
			</div>
		</template>
	</div>
</template>

<script>
	// 分别引入导航栏、侧边栏、以及主页面
	import MainNavbar from './main-navbar'
	import MainSidebar from './main-sidebar'
	import MainContent from './main-content'
	import { clearLoginInfo } from '@/utils'
	export default {
		// 解决多层嵌套通信问题，provide中指定要传输子孙的数据，inject用来接收祖父的数据
		provide() {
			return {
				//刷新
				refresh() {
					// 设置刷新为true
					this.$store.commit('common/updateContentIsNeedRefresh', true)
					this.$nextTick(() => {
						// 在下次更新dom之后设置刷新为false
						this.$store.commit('common/updateContentIsNeedRefresh', false)
					})
				}
			}
		},
		data() {
			return {
				loading: true
			}
		},
		components: {
			MainNavbar,
			MainSidebar,
			MainContent
		},
		computed: {
			documentClientHeight: {
				get() {
					return this.$store.state.common.documentClientHeight
				},
				set(val) {
					this.$store.commit('common/updateDocumentClientHeight', val)
				}
			},
			sidebarFold: {
				get() {
					return this.$store.state.common.sidebarFold
				}
			},
			userId: {
				get() {
					return this.$store.state.user.id
				},
				set(val) {
					this.$store.commit('user/updateId', val)
				}
			},
			userName: {
				get() {
					return this.$store.state.user.name
				},
				set(val) {
					this.$store.commit('user/updateName', val)
				}
			}
		},
		// 此时可以通过new Vue的对象访问到data的属性，以及methods方法
		created() {
			this.getUserInfo()
		},
		// 经过编译的dom
		mounted() {
			this.resetDocumentClientHeight()
		},
		methods: {
			// 重置窗口可视高度
			resetDocumentClientHeight() {
				this.documentClientHeight = document.documentElement['clientHeight']
				window.onresize = () => {
					this.documentClientHeight = document.documentElement['clientHeight']
				}
			},
			// 获取当前管理员信息
			getUserInfo() {
				this.$http({
				  url: this.$http.adornUrl('/sys/user/info'),
				  method: 'get',
				  params: this.$http.adornParams()
				}).then(({data}) => {
				  if (data && data.code === 200) {
				    this.loading = false
				    this.userId = data.user.user_id
				    this.userName = data.user.username
				  }else{
					this.$message.error(data.msg)
					clearLoginInfo()
					this.$router.replace({ name: 'before' })
				  }
				})
			}
		},
	}
</script>

<style></style>