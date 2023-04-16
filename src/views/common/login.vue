<template>
	<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
		<el-form-item prop="userName">
			<el-input v-model="dataForm.userName" placeholder="帐号"></el-input>
		</el-form-item>
		<el-form-item prop="password">
			<el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
		</el-form-item>
		<el-form-item>
			<el-button class="login-btn-submit" type="primary" @click="goRegister">注册</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	export default {
		data() {
			return {
				projectName: projectName,
				dataForm: {
					userName: '',
					password: '',
				},
				dataRule: {
					userName: [{
						required: true,
						message: '帐号不能为空',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '密码不能为空',
						trigger: 'blur'
					}],
				},
			}
		},
		created() {},
		methods: {
			goRegister() {
				this.$router.replace('register')
			},
			// 提交表单
			dataFormSubmit() {
				this.$refs['dataForm'].validate((valid) => {
					if (valid) {
						this.$http({
							url: this.$http.adornUrl('/sys/login'),
							method: 'post',
							data: this.$http.adornData({
								'username': this.dataForm.userName,
								'password': this.dataForm.password,
							})
						}).then(({
							data
						}) => {
							if (data && data.code === 200) {
								this.$cookie.set('token', data.token, {
									expires: data.expire + 's',
								})
								this.$router.replace({
									name: 'home'
								})
							}
						})
					}
				})
			},
		}
	}
</script>
