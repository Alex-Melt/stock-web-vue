<template>
	<div class="site-wrapper site-page--login">
		<div class="site-content__wrapper">
			<div class="site-content">
				<div class="brand-info">
					<h2 class="brand-info__text"></h2>

				</div>
				<div class="login-main">
					<h3 class="login-title">{{ projectName }}</h3>
					<router-view></router-view>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				projectName: projectName,
			}
		},
		created() {
			this.$router.push('login')
		}
	}
</script>

<style lang="scss">
	.site-wrapper.site-page--login {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(38, 50, 56, .6);
		overflow: hidden;

		&:before {
			position: fixed;
			top: 0;
			left: 0;
			z-index: -1;
			width: 100%;
			height: 100%;
			content: "";
			background-image: url(~@/assets/img/login_bg1.jpg);
			background-size: cover;
		}

		.site-content__wrapper {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			padding: 0;
			margin: 0;
			overflow-x: hidden;
			overflow-y: auto;
			background-color: transparent;
		}

		.site-content {
			min-height: 100%;
			padding: 30px 500px 30px 30px;
		}

		.brand-info {
			margin: 84px -40px 0 511px;
			color: #fff;
		}

		.brand-info__text {
			margin: 0 0 22px 0;
			font-size: 48px;
			font-weight: 400;
			text-transform: uppercase;
		}

		.brand-info__intro {
			margin: 10px 0;
			font-size: 16px;
			line-height: 1.58;
			opacity: .6;
		}

		.login-main {
			position: absolute;
			top: 0;
			right: 33%;
			padding: 150px 60px 180px;
			width: 470px;
			min-height: 100%;
			/*background-color: #fff;*/

		}

		.login-title {
			font-size: 29px;
			color: #fff;
			text-align: center;
		}

		.login-captcha {
			overflow: hidden;

			>img {
				width: 100%;
				cursor: pointer;
			}
		}

		.login-btn-submit {
			width: 100%;
			/* margin-top: 38px;*/
		}
	}
</style>
