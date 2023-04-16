<template>
	<div class="stockDetailWrapper">
		<div class="stockBaseInfo">
			<h2 id="stockName">{{ stockName }}({{ stockNum }})</h2>
			<el-button @click="updateSingleStock()" icon="el-icon-magic-stick" circle alt="更新当前单股数据" id="updateButton"></el-button>
			<div>
				<el-form id="single-form" :inline="true" :model="searchForm" @keyup.enter.native="updateInfo()">
<!-- 					<el-form-item>
						<el-input v-model="searchForm.stockNum" placeholder="请输入股票名称或者编号" size="medium" clearable></el-input>
					</el-form-item> -->
					<el-form-item label="股票编号">
						<el-input v-model="searchForm.stockNum"size="medium" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" icon="el-icon-search" @click="updateInfo()">搜索</el-button>
					</el-form-item>
				</el-form>
			</div>
			<ul class="pure-g">
				<li id="nowopenBox" :class="upDownPrices >= 0 ? 'red' : 'green'">
					<strong id="price">{{close}}</strong>
					<i :class="upDownPrices >= 0 ? 'el-icon-top' : 'el-icon-bottom'" style="margin-left: 12px;"></i>

					<span id="upDown">{{(upDownPrices * 1).toFixed(2)}}({{ (upDownRange * 100).toFixed(2) }}%)</span>
				</li>
			</ul>
			<table style="width: 100%; font-size: 16px;line-height: 30px;">
				<tr>
					<td>{{ amount }}</td>
					<td>{{ amplitude }}</td>
					<td>{{ turnOverrate }}</td>
					<td>{{ preClose }}</td>
				</tr>
				<tr>
					<td>{{ comparison }}</td>
					<td>{{ high }}</td>
					<td>{{ low }}</td>
					<td>{{ open }}</td>
				</tr>
				<tr>
					<td>{{ volume }}</td>
					<td>{{ totalMarketValue }}</td>
					<td>{{ flowMarketValue }}</td>
					<td>{{ totalFlowShares }}</td>
				</tr>
			</table>
		</div>
		<div class="main-show">
			<template>
				<el-tabs v-model="activeName" @tab-click="tabClick">
					<el-tab-pane label="分时线" name="first"> </el-tab-pane>
					<el-tab-pane label="日线" name="second"> </el-tab-pane>
					<el-tab-pane label="周线" name="third"> </el-tab-pane>
					<el-tab-pane label="月线" name="fourth"> </el-tab-pane>
				</el-tabs>
				<div class="main-chart">
					<div id="k-chart"></div>
					<div id="handicap">
						<div class="tabs" id="fiveRangeId" style="border: 1px solid #d1dbe5;">
							<table class="five-range" cellspacing="15">
								<tbody>
									<tr>
										<td style="text-align: left">卖5</td>
										<td class="green" style="text-align: right">
											{{ sellPrice5 }}
										</td>
										<td style="text-align: right">
											{{ sellCount5 }}
										</td>
									</tr>
									<tr>
										<td style="text-align: left">卖4</td>
										<td class="green" style="text-align: right">
											{{ sellPrice4 }}
										</td>
										<td style="text-align: right">
											{{ sellCount4 }}
										</td>
									</tr>
									<tr>
										<td style="text-align: left">卖3</td>
										<td class="green" width="30%" style="text-align: right">
											{{ sellPrice3 }}
										</td>
										<td style="text-align: right">
											{{ sellCount3 }}
										</td>
									</tr>
									<tr>
										<td style="text-align: left">卖2</td>
										<td class="green" style="text-align: right">
											{{ sellPrice2 }}
										</td>
										<td style="text-align: right">
											{{ sellCount2 }}
										</td>
									</tr>
									<tr>
										<td style="text-align: left">卖1</td>
										<td class="green" style="text-align: right">
											{{ sellPrice1 }}
										</td>
										<td style="text-align: right">
											{{ sellCount1 }}
										</td>
									</tr>
									<tr style="font-weight: 700;    color: blue;">
										<td style="text-align: left">当前价</td>
										<td class="green" style="text-align: right">
											{{ boughtPrice1 }}
										</td>
										<td style="text-align: right">
											委托(手)
										</td>
									</tr>
									<tr>
										<td style="text-align: left">买1</td>
										<td class="red" style="text-align: right">
											{{ boughtPrice1 }}
										</td>
										<td style="text-align: right">
											{{ boughtCount1 }}
										</td>
									</tr>
									<tr>
										<td style="text-align: left">买2</td>
										<td class="red" style="text-align: right">
											{{ boughtPrice2 }}
										</td>
										<td style="text-align: right">
		 								{{ boughtCount2 }}
										</td>
									</tr>
									<tr>
										<td style="text-align: left">买3</td>
										<td class="red" style="text-align: right">
											{{ boughtPrice3 }}
										</td>
										<td style="text-align: right">
											{{ boughtCount3 }}
										</td>
									</tr>
									<tr>
										<td style="text-align: left">买4</td>
										<td class="red" style="text-align: right">
											{{ boughtPrice4 }}
										</td>
										<td style="text-align: right">
											{{ boughtCount4 }}
										</td>
									</tr>
									<tr>
										<td style="text-align: left">买5</td>
										<td class="red" style="text-align: right">
											{{ boughtPrice5 }}
										</td>
										<td style="text-align: right">
											{{ boughtCount5 }}
										</td>
		 						</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>

			</template>
		</div>
		<div v-if="isShowZB" id="changeOptionId" style="padding-left: 40px">
			<el-button-group>
				<el-button :autofocus=true @click="changeOptionType(1)" size="small">成交量</el-button>
				<el-button @click="changeOptionType(2)" size="small">macd</el-button>
				<el-button @click="changeOptionType(3)" size="small">kdj</el-button>
				<el-button @click="changeOptionType(4)" size="small">rsi </el-button>
			</el-button-group>
		</div>
	</div>
</template>

<script>
	import {
		formatNum
	} from '@/utils'
	import {
		initMOption
	} from "@/assets/js/timeline.js";
	import {
		makeOption,
		getOption
	} from "@/assets/js/dayline.js";
	export default {
		data() {
			return {
				searchForm: {
					stockNum: '',
				},
				stockNum: '',
				stockName: "",
				upDownPrices: "",
				close: "",
				upDownRange: "",
				amount: "",
				amplitude: "",
				turnOverrate: "",
				preClose: "",
				comparison: "",
				high: "",
				low: "",
				open: "",
				volume: "",
				totalMarketValue: "",
				flowMarketValue: "",
				totalFlowShares: "",

				sellPrice5: "",
				sellPrice4: "",
				sellPrice3: "",
				sellPrice2: "",
				sellPrice1: "",
				boughtPrice1: "",
				boughtPrice2: "",
				boughtPrice3: "",
				boughtPrice4: "",
				boughtPrice5: "",
				sellCount5: "",
				sellCount4: "",
				sellCount3: "",
				sellCount2: "",
				sellCount1: "",
				boughtCount1: "",
				boughtCount2: "",
				boughtCount3: "",
				boughtCount4: "",
				boughtCount5: "",

				activeName: "first",
				isShowZB: false
			}
		},
		created() {
			this.echarts = require("echarts");
			if (typeof(this.$route.params.stockNum) == 'undefined') {
				if (this.stockNum === '') {
					this.stockNum = '600007';
				}
			} else {
				this.stockNum = this.$route.params.stockNum;
			}
			this.getStockInfoById(this.stockNum);
			this.getStockBid(this.stockNum);
			// this.getEchnicalaspect(this.stockNum);
		},
		mounted() {
			var dom = document.getElementById("k-chart");
			this.kChart = this.echarts.init(dom);
			this.getStocktimebar(this.stockNum);
		},
		methods: {
			// 更新新闻列表
			updateSingleStock() {
				this.$http({
					url: this.$http.adornUrl('/stock/updatesinglestock'),
					method: 'get',
					params: this.$http.adornParams({
						'stockNum': this.stockNum
					})
				}).then(({
					data
				}) => {
					if (data && data.code === 200) {
						this.$message({
							message: data.msg,
							type: 'success'
						});
						this.getStockInfoById(this.stockNum);
						this.getStockBid(this.stockNum);
					} else {
						this.$message.error(data.msg)
					}
				})
			},
			changeOptionType(indicatorType) {
				this.kChart.setOption(
					getOption(this.kChart, this.stockDayDataSave, indicatorType),
					true
				);
			},
			updateInfo() {
				this.getStockInfoById(this.searchForm.stockNum);
				this.getStockBid(this.searchForm.stockNum);
			},
			tabClick(tab) {
				if (tab.name == "first") {
					this.getStocktimebar(this.stockNum);
					this.isShowZB = false;
				} else if (tab.name == "second") {
					this.getStockdaybar(this.stockNum);
					this.isShowZB = true;
				} else if (tab.name == "third") {
					this.getStockweekbar(this.stockNum);
					this.isShowZB = true;
				} else {
					this.getStockmonthbar(this.stockNum);
					this.isShowZB = true;
				}
			},
			getStocktimebar(stockNum) {
				this.$http({
					url: this.$http.adornUrl('/stock/getstocktimebar'),
					method: 'get',
					params: this.$http.adornParams({
						'stockNum': stockNum
					})
				}).then(({
					data
				}) => {
					if (data && data.code === 200) {
						this.kChart.setOption(initMOption(data.data.reverse(), "hs"), true);
					} else {
						this.$message.error(data.msg)
					}
				})
			},
			getStockdaybar(stockNum) {
				let _this = this;
				this.$http({
					url: this.$http.adornUrl('/stock/getstockdaybar'),
					method: 'get',
					params: this.$http.adornParams({
						'stockNum': stockNum
					})
				}).then(({
					data
				}) => {
					if (data && data.code === 200) {
						_this.stockDayDataSave = data.data.reverse();
						var VOLUMN_TYPE = 1;
						this.kChart.setOption(makeOption(data.data, VOLUMN_TYPE), true);
					} else {
						this.$message.error(data.msg)
					}
				})
			},
			getStockweekbar(stockNum) {
				let _this = this;
				this.$http({
					url: this.$http.adornUrl('/stock/getstockweekbar'),
					method: 'get',
					params: this.$http.adornParams({
						'stockNum': stockNum
					})
				}).then(({
					data
				}) => {
					if (data && data.code === 200) {
						_this.stockWeekDataSave = data.data.reverse();

						var VOLUMN_TYPE = 1;
						this.kChart.setOption(makeOption(data.data, VOLUMN_TYPE), true);
					} else {
						this.$message.error(data.msg)
					}
				})
			},
			getStockmonthbar(stockNum) {
				let _this = this;
				this.$http({
					url: this.$http.adornUrl('/stock/getstockmonthbar'),
					method: 'get',
					params: this.$http.adornParams({
						'stockNum': stockNum
					})
				}).then(({
					data
				}) => {
					if (data && data.code === 200) {
						_this.stockMonthDataSave = data.data.reverse();

						var VOLUMN_TYPE = 1;
						this.kChart.setOption(
							makeOption(this.stockMonthDataSave, VOLUMN_TYPE),
							true
						);
					} else {
						this.$message.error(data.msg)
					}
				})
			},
			getStockInfoById(stockid) {
				let _this = this;
				this.$http({
					url: this.$http.adornUrl('/stock/getstockinfobyid'),
					method: 'get',
					params: this.$http.adornParams({
						'stockId': stockid
					})
				}).then(({
					data
				}) => {
					if (data && data.code === 200) {
						var rawData = data.data[0].fields;
						_this.stockInfo = rawData;
						_this.amount = "成交额：" + rawData.amount;
						_this.amplitude = "振幅：" + (rawData.amplitude * 100).toFixed(2) + "%";
						_this.close = rawData.close;
						_this.high = "最高：" + rawData.high;
						_this.low = "最低：" + rawData.low;
						_this.open = "今开：" + rawData.open;
						_this.preClose = "昨收：" + rawData.preClose;
						_this.stockNum = rawData.stockNum;
						_this.stockName = rawData.stockName;
						_this.turnOverrate =
							"换手率：" + (rawData.turnOverrate * 100).toFixed(2) + "%";
						_this.upDownPrices = rawData.upDownPrices;
						_this.upDownRange = rawData.upDownRange;
						_this.volume = "成交量：" + formatNum(rawData.volume) + "手";
						_this.totalMarketValue =
							"总市值：" + formatNum(rawData.totalMarketValue)
						_this.flowMarketValue =
							"流通市值：" +
							formatNum(rawData.flowMarketValue);
						_this.totalFlowShares =
							"流通股本：" +
							formatNum(rawData.totalFlowShares);
					} else {
						this.$message.error(data.msg)
					}
				})
			},
			getStockBid(stockNum) {
				let _this = this;
				this.$http({
					url: this.$http.adornUrl('/stock/getstockbid'),
					method: 'get',
					params: this.$http.adornParams({
						'stockNum': stockNum
					})
				}).then(({
					data
				}) => {
					if (data && data.code === 200) {
						var rawData = data.data[0].fields;
						_this.sellPrice5 = rawData.sellPrice5;
						_this.sellPrice4 = rawData.sellPrice4;
						_this.sellPrice3 = rawData.sellPrice3;
						_this.sellPrice2 = rawData.sellPrice2;
						_this.sellPrice1 = rawData.sellPrice1;
						_this.boughtPrice1 = rawData.boughtPrice1;
						_this.boughtPrice2 = rawData.boughtPrice2;
						_this.boughtPrice3 = rawData.boughtPrice3;
						_this.boughtPrice4 = rawData.boughtPrice4;
						_this.boughtPrice5 = rawData.boughtPrice5;
						_this.sellCount5 = rawData.sellCount5;
						_this.sellCount4 = rawData.sellCount4;
						_this.sellCount3 = rawData.sellCount3;
						_this.sellCount2 = rawData.sellCount2;
						_this.sellCount1 = rawData.sellCount1;
						_this.boughtCount1 = rawData.boughtCount1;
						_this.boughtCount2 = rawData.boughtCount2;
						_this.boughtCount3 = rawData.boughtCount3;
						_this.boughtCount4 = rawData.boughtCount4;
						_this.boughtCount5 = rawData.boughtCount5;
						var totalBought =
							rawData.boughtCount1 +
							rawData.boughtCount2 +
							rawData.boughtCount3 +
							rawData.boughtCount4 +
							rawData.boughtCount5;
						var totalSell =
							rawData.sellCount1 +
							rawData.sellCount2 +
							rawData.sellCount3 +
							rawData.sellCount4 +
							rawData.sellCount5;
						if (isNaN(totalSell)) {
							totalSell = 0
						}
						_this.comparison =
							"委比：" +
							(
								((totalBought - totalSell) / (totalBought + totalSell)) *
								100
							).toFixed(2) +
							"%";
					} else {
						this.$message.error(data.msg)
					}
				})
			}
		},
		watch: {
			'$route'(to, from) {
				// to 指的是跳转后当前的路由，from 是从哪里来的
				if (JSON.stringify(to.params) !== "{}") {
					this.getStockInfoById(to.params.stockNum);
					this.getStockBid(to.params.stockNum);
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	#updateButton{
		float:right;
	}
	ul,
	ol,
	li {
		list-style: none;
		padding-left: 0;
	}

	.stockDetailWrapper {

		display: block !important;
		padding: 20px 0;
		width: 1200px !important;
		font-size: 12px;

		#single-form {
			float: right;
		}

		#stockName {
			font-size: 22px;
		}

		ul {
			border-bottom: solid 1px #eee;
			margin-bottom: 20px;

			li {
				font-size: 20px;
			}

			.red {
				color: #ff5c5c;
			}

			.green {
				color: #4f9f3f;
			}
		}

		#nowopenBox {
			width: 40%;
		}

		strong {
			font-size: 48px;
			font-family: Arial;
		}

		#k-chart {
			width: 80%;
			height: 400px;
		}

		.main-show {
			// display: flex;
			width: 100%;
			// height: 400px;
		}

		.main-chart {
			display: flex;
			height: 400px;

			#k-chart {
				width: 75%;
			}

			#handicap {
				width: 25%;
			}
		}

	}



	/* .stockDetailWrapper .main-chart {
		display: flex;
		height: 500px;
	}

	.stockDetailWrapper .main-chart #k-chart {
		width: 75%;
	}

	.stockDetailWrapper .main-chart #handicap {
		width: 25%;
	}

	.stockDetailWrapper .main-show {
		width: 100%;
		display: flex;
	} */
</style>
