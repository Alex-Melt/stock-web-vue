<template>
	<div class="newsList">
		<el-button @click="updateNewsList()" icon="el-icon-magic-stick" circle alt="更新新闻列表" id="updateButton"></el-button>
		<div class="index_title">
			<h4>热门文章</h4>
		</div>
		<ul style="overflow:auto">
				<li class="news-stream-newsStream-news-item-has-image clearfix news_item" v-for="news_item in news_list" lazy>
					<a class="news-stream-newsStream-image-link" :href="news_item.fields.pcUrl"
						:title="news_item.fields.title" target="_blank">
						<img :src="news_item.fields.thumbnail"
							:alt="news_item.fields.title" width="144px" height="80px">
					</a>
					<div class="news-stream-newsStream-news-item-infor">
						<h2
							class="news-stream-newsStream-mr13 news-stream-newsStream-news-item-title news-stream-newsStream-news-item-title-height">
							<a :href="news_item.fields.pcUrl" :title="news_item.fields.title"
								target="_blank">{{news_item.fields.title}}</a>
						</h2>
						<div class="clearfix">
							<time class="news-stream-newsStream-text">{{news_item.fields.createTime}}</time>
						</div>
					</div>
				</li>
		</ul>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				news_list:[],
			}
		},
		created() {
			this.getNewsList()
		},
		methods: {
			// 获取新闻列表
			getNewsList() {
				this.$http({
					url: this.$http.adornUrl('/stock/getnewslist'),
					method: 'get',
					params: this.$http.adornParams()
				}).then(({
					data
				}) => {
					if (data && data.code === 200) {
						this.news_list=data.data;
					} else {
						this.$message.error(data.msg)
					}
				})
			},
			// 更新新闻列表
			updateNewsList() {
				this.$http({
					url: this.$http.adornUrl('/stock/updatenewslist'),
					method: 'get',
					params: this.$http.adornParams()
				}).then(({
					data
				}) => {
					if (data && data.code === 200) {
						this.$message({
							message: data.msg,
							type: 'success'
						});
						this.getNewsList()
					} else {
						this.$message.error(data.msg)
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.index_title {
		padding-left:40px;
	}
	#updateButton{
		float:right;
	}
	ul {
		.news-stream-newsStream-news-item-has-image {
    		padding: 20px 0 20px 40px;
		    border-bottom: 1px solid #e7e7e7;
    		font-family: 微软雅黑;
		}
		.clearfix {
    		zoom: 1;
		}
		.news-stream-newsStream-image-link {
		    height: 80px;
			margin-right: 30px;
		    width: 144px;
			display: block;
		    overflow: hidden;
		    position: relative;
		    float: left;
		}
		a.news-stream-newsStream-ly {
		    color: #999;
		    font: 12px 微软雅黑;
		}
	}
</style>
