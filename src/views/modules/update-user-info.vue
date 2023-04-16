<template>
	<el-dialog title="修改个人信息" :visible.sync="visible" :append-to-body="true">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
			label-width="80px">
			<el-form-item label="用户名">
				<el-input type="text" v-model="dataForm.username"></el-input>
			</el-form-item>
			<el-form-item label="性别" prop="gender">
				<el-radio-group v-model="dataForm.gender">
                  <el-radio label="男"></el-radio>
                  <el-radio label="女"></el-radio>
                </el-radio-group>
			</el-form-item>
            <el-form-item label="居住地" prop="address">
				<el-input type="text" v-model="dataForm.address"></el-input>
			</el-form-item>
            <el-form-item label="邮箱" prop="email">
				<el-input type="text" v-model="dataForm.email"></el-input>
			</el-form-item>
            <el-form-item label="联系方式" prop="mobile">
				<el-input type="text" v-model="dataForm.mobile"></el-input>
			</el-form-item>
            <el-form-item label="创建时间" prop="create_time">
				<el-date-picker readonly v-model="dataForm.create_time"  type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
			</el-form-item>
            <el-form-item label="个人简介" prop="info">
				<el-input type="textarea" v-model="dataForm.info"></el-input>
			</el-form-item>
			
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="dataFormSubmit()">确定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	export default {
        data() {
            return {
                visible: false,
                dataForm: {
                    username:"",
                    gender:"",
                    address:"",
                    email:"",
                    mobile:"",
                    create_time:"",
                    info:"",
                },
                dataRule: {
                    name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                }
            }
        },
        methods: {
            // 初始化
            init() {
                this.visible = true
                this.getUserInfo()
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                })
            },
            // 获取信息
            getUserInfo() {
                this.$http({
                    url: this.$http.adornUrl('/user/info'),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({
                    data
                }) => {
                    if (data && data.code === 200) {
                        this.dataForm.username=data.data.username
                        this.dataForm.gender=data.data.gender
                        this.dataForm.address=data.data.address
                        this.dataForm.email=data.data.email
                        this.dataForm.mobile=data.data.mobile
                        this.dataForm.create_time=data.data.create_time
                        this.dataForm.info=data.data.info
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            // 表单提交
            dataFormSubmit() {
                this.$refs['dataForm'].validate((valid)=>{
                    if (valid){
                        this.$http({
                            url: this.$http.adornUrl('/user/save'),
                            method: 'post',
                            data: this.$http.adornData({
                                'username':this.dataForm.username,
                                'gender':this.dataForm.gender,
                                'address':this.dataForm.address,
                                'email':this.dataForm.email,
                                'mobile':this.dataForm.mobile,
                                'info':this.dataForm.info,
                            })
                        }).then(({data}) => {
                            if (data && data.code === 200) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1500,
                                    onClose: () => {
                                        this.visible = false
                                        this.$nextTick(() => {
                                            this.visible = false
                                            this.$emit('refreshDataList')
                                        })
                                    }
                                })
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })
                
//                this.$refs['dataForm'].validate((valid) => {
//                    if (valid) {
//                        this.$http({
//                            url: this.$http.adornUrl('/sys/user/password'),
//                            method: 'post',
//                            data: this.$http.adornData({
//                                'password': this.dataForm.password,
//                                'newPassword': this.dataForm.newPassword
//                            })
//                        }).then(({data}) => {
//                            if (data && data.code === 200) {
//                                this.$message({
//                                    message: '操作成功',
//                                    type: 'success',
//                                    duration: 1500,
//                                    onClose: () => {
//                                        this.visible = false
//                                        this.$nextTick(() => {
//                                            this.mainTabs = []
//                                            clearLoginInfo()
//                                            this.$router.replace({
//                                                name: 'login'
//                                            })
//                                        })
//                                    }
//                                })
//                            } else {
//                                this.$message.error(data.msg)
//                            }
//                        })
//                    }
//                })
            }
        }
    }
</script>
