<template>
	<el-form :model="registerForm" :rules="registerFormRules" ref="registerForm" @keyup.enter.native="dataFormSubmit()"
		status-icon>
		<el-form-item prop="username">
			<el-input prefix-icon="el-icon-user" v-model="registerForm.username" placeholder="用户名"></el-input>
		</el-form-item>
		<el-form-item prop="telephone">
			<el-input prefix-icon="el-icon-mobile-phone" v-model="registerForm.telephone" placeholder="手机号"></el-input>
		</el-form-item>
		<el-form-item prop="password">
			<el-input prefix-icon="el-icon-lock" v-model="registerForm.password" placeholder="密码" show-password>
			</el-input>
		</el-form-item>
		<el-form-item>
			<el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">注册</el-button>
			<!--                  <el-button class="registerButton" type="primary" :disabled="submitDisabled" @click="submitForm('registerForm')">注册</el-button>-->
		</el-form-item>
		<el-form-item>
			<el-button class="login-btn-submit" type="primary" @click="goLogin()">返回</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	export default {
		data() {
			return {
				registerForm: {
					telephone: '',
					username: '',
					password: ''
				},
				// 注册表单校验规则
				registerFormRules: {
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 5,
							max: 20,
							message: '长度在 5 到 20 个字符',
							trigger: 'blur'
						}
					],
					telephone: [{
							required: true,
							message: '请输入手机号',
							trigger: 'blur'
						},
						{
							min: 11,
							max: 11,
							message: '请输入11位手机号',
							trigger: 'blur'
						}
					]
				},
			}
		},
		created() {},
		methods: {
			goLogin() {
				this.$router.replace('login')
			},
			// 提交表单
			dataFormSubmit() {
				this.$refs['registerForm'].validate((valid) => {
					if (valid) {
						this.$http({
							url: this.$http.adornUrl('/sys/register'),
							method: 'post',
							data: this.$http.adornData({
								'username': this.registerForm.username,
								'password': this.registerForm.password,
								'telephone': this.registerForm.telephone,
							})
						}).then(({
							data
						}) => {
							if (data && data.code === 200) {
								this.$message({
									message: data.msg,
									type: 'success'
								});
								this.$cookie.set('token', data.token, {
									expires: data.expire + 's',
								})
								this.$router.replace({
									name: 'home'
								})
							}
							else {
							    this.$message.error(data.msg)
							}
						})
					}
				})
			},
		}
	}
</script>
