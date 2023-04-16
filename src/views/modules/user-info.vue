<template>
	<div>
		<el-descriptions title="个人信息" direction="vertical" :column="2" border size="medium">
		  <el-descriptions-item label="用户名">{{userList.username}}</el-descriptions-item>
		  <el-descriptions-item label="性别">{{userList.gender ? userList.gender:'暂无'}}</el-descriptions-item>
		  <el-descriptions-item label="居住地">{{userList.address ? userList.address:'暂无'}}</el-descriptions-item>
		  <el-descriptions-item label="邮箱">{{userList.email ? userList.email:'暂无'}}</el-descriptions-item>
		  <el-descriptions-item label="联系方式">{{userList.mobile ? userList.mobile:'暂无'}}</el-descriptions-item>
		  <el-descriptions-item label="创建时间">{{userList.create_time}}</el-descriptions-item>
		  <el-descriptions-item label="个人简介" :span="2">{{userList.info ? userList.info:'暂无'}}</el-descriptions-item>
		</el-descriptions>
		<div id="user_info">
			<el-button @click.native="updatePasswordHandle()"  icon="el-icon-user">修改密码</el-button>
			<el-button @click.native="updateInfoHandle()"  icon="el-icon-user">修改个人信息</el-button>
		</div>
		<update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
		<update-info v-if="updateInfoVisible" ref="updateInfo" @refreshDataList="getUserInfo()"></update-info>
	</div>
</template>

<script>
	import UpdatePassword from '../main-navbar-update-password'
	import UpdateInfo from './update-user-info'
	export default{
		data(){
			return {
				userList:'',
				updatePassowrdVisible: false,
				updateInfoVisible:false,
			}
		},
		components: {
			UpdatePassword,
			UpdateInfo,
		},
		created() {
			this.getUserInfo();
		},
		methods:{
			// 获取用户信息
			getUserInfo() {
				this.$http({
					url: this.$http.adornUrl('/user/info'),
					method: 'get',
					params: this.$http.adornParams()
				}).then(({
					data
				}) => {
					if (data && data.code === 200) {
						this.userList=data.data
					} else {
						this.$message.error(data.msg)
					}
				})
			},
			//修改密码
			updatePasswordHandle () {
				this.updatePassowrdVisible = true
				this.$nextTick(() => {
					this.$refs.updatePassowrd.init()
				})
			},
			//修改用户个人信息
			updateInfoHandle () {
				this.updateInfoVisible = true
				this.$nextTick(() => {
					this.$refs.updateInfo.init()
				})
			},
		}
	}
</script>

<style>
	#user_info {
		margin-top:40px;
		margin-left:2px;
	}
</style>