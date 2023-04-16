<template>
	<div>
		<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
			<el-form-item label="股票编号">
				<el-input v-model="searchForm.stockNum" size="medium" clearable></el-input>
			</el-form-item>
			<el-form-item label="股票名称">
				<el-input v-model="searchForm.stockName" size="medium" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="selectGetDataList()">搜索</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="success" @click="updateshStock()">更新上证指数</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="success" @click="beforeupdateStockList()">更新股票列表</el-button>
				<el-dialog
				  title="更新股票列表"
				  :visible.sync="dialogTableVisible"
				  width="30%"
				 >
				  <span>请输入更新后的总栏目：<el-input-number v-model="updateSize"></el-input-number></span>
				  <span slot="footer" class="dialog-footer">
				    <el-button @click="dialogTableVisible = false">取 消</el-button>
				    <el-button type="primary" @click="afterupdateStockList()">确 定</el-button>
				  </span>
				</el-dialog>
			</el-form-item>
		</el-form>
		<!-- 指数看板 -->
		<ul class="board-list">
			<li class="board-item" v-for="(item, index) in stockBoardData" :key="index"
				:class="item.range >= 0 ? 'red' : 'green'">
				<div class="name">{{ item.name }}</div>
				<div class="value">{{ item.value }}</div>
				<div class="price">
					<!-- 均价：{{ item.avgprice}} -->
				</div>
				<div class="bottom">
					更新时间：{{item.updateTime}}
				</div>
			</li>
		</ul>
		<el-table class="stock-table" :data="dataList" v-loading="loading" stripe>
			<el-table-column header-align="center" align="center" label="股票编号">
				<template slot-scope="scope">
					<router-link class="stock-name blue" tag="a" :to="{
					  name: 'stock-single-analysis',
					  params: { stockNum: scope.row.fields.stockNum }
					}">{{scope.row.fields.stockNum}}</router-link>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="center" label="股票名称">
				<template slot-scope="scope">
					<router-link class="stock-name blue" tag="a" :to="{
					  name: 'stock-single-analysis',
					  params: { stockNum: scope.row.fields.stockNum }
					}">{{scope.row.fields.stockName}}</router-link>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="center" label="最新价">
				<template slot-scope="scope">
					<span
						:class="scope.row.fields.upDownRange.includes('-') ? 'green' : 'red'">{{scope.row.fields.close}}</span>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="center" label="单日涨跌幅">
				<template slot-scope="scope">
					<span
						:class="scope.row.fields.upDownRange.includes('-') ? 'green' : 'red'">{{scope.row.fields.upDownRange}}</span>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="center" label="3日涨跌幅">
				<template slot-scope="scope">
					<span
						:class="scope.row.fields.upDownRange3.includes('-') ? 'green' : 'red'">{{scope.row.fields.upDownRange3}}</span>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="center" label="5日涨跌幅">
				<template slot-scope="scope">
					<span
						:class="scope.row.fields.upDownRange5.includes('-') ? 'green' : 'red'">{{scope.row.fields.upDownRange5}}</span>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="center" label="涨跌额">
				<template slot-scope="scope">
					<span
						:class="scope.row.fields.upDownPrices.includes('-') ? 'green' : 'red'">{{scope.row.fields.upDownPrices}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="fields.turnOverrate" header-align="center" align="center" label="换手率">
			</el-table-column>
			<el-table-column prop="fields.amplitude" header-align="center" align="center" label="振幅"></el-table-column>
			<el-table-column prop="fields.listingDate" header-align="center" align="center" label="上市日期">
			</el-table-column>
			<el-table-column prop="fields.totalFlowShares" header-align="center" align="center" label="流通股本">
			</el-table-column>
			<el-table-column prop="fields.totalShares" header-align="center" align="center" label="总股本">
			</el-table-column>
		</el-table>
		<el-pagination :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
			:total="totalPage" layout="sizes, total, prev, pager, next" @current-change="currentChangeHandle"
			@size-change="sizeChangeHandle"></el-pagination>
	</div>
</template>

<script>
	import {
		doubleToPercent,
		formatNum
	} from '@/utils'
	export default {
		data() {
			return {
				stockBoardData: [], //  指数看板数据
				searchForm: {
					stockNum: '',
					stockName: '',

				},
				dataForm: {
					stockNum: '',
					stockName: '',
				},
				dataList: [],
				loading: false,
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dialogTableVisible:false,
				updateSize:0,
			}
		},
		created() {
			this.getStockBoardData()
			this.getDataList()
		},
		methods: {
			// 获取数据列表
			getDataList() {
				this.loading = true
				this.$http({
					url: this.$http.adornUrl('/stock/getstocklist'),
					method: 'get',
					params: this.$http.adornParams({
						'stockNum': this.searchForm.stockNum,
						'stockName': this.searchForm.stockName,
						'page': this.pageIndex,
						'limit': this.pageSize,
					})
				}).then(({
					data
				}) => {
					if (data && data.code === 200) {
						this.dataList = data.page.list.map((item) => {
							return {
								...item,
								fields: {
									...item.fields,
									upDownRange: doubleToPercent(item.fields.upDownRange),
									upDownRange3: doubleToPercent(item.fields.upDownRange3),
									upDownRange5: doubleToPercent(item.fields.upDownRange5),
									upDownPrices: item.fields.upDownPrices.toFixed(2),
									turnOverrate: doubleToPercent(item.fields.turnOverrate),
									amplitude: doubleToPercent(item.fields.amplitude),
									totalFlowShares: formatNum(item.fields.totalFlowShares),
									totalShares: formatNum(item.fields.totalShares)
								}
							}
						})
						this.totalPage = data.page.totalCount
					} else {
						this.dataList = []
						this.totalPage = 0
					}
					this.loading = false

				})
			},
			// 获取指数看板数据
			getStockBoardData() {
				this.$http({
					url: this.$http.adornUrl('/stock/getshstock'),
					method: 'get',
					params: this.$http.adornParams()
				}).then(({
					data
				}) => {
					if (data && data.code === 200) {
						this.stockBoardData = data.list.map((item) => {
							return {
								name: item.fields.INDEX_ABBR,
								value: item.fields.CLOSE_POINT,
								avgprice: item.fields.AVG_PRICE,
								updateTime: item.fields.TRADE_DATE.replace(/(\d{4})(\d{2})(\d{2})/ig,
									"$1-$2-$3"),
							}
						})
					} else {
						this.$message.error(data.msg)
					}
				})
			},
			// 更新上证指数
			updateshStock() {
				this.$http({
					url: this.$http.adornUrl('/stock/updateshstock'),
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
						this.getStockBoardData()
					} else {
						this.$message.error(data.msg)
					}
				})
			},
			//打开更新股票列表窗口
			beforeupdateStockList(){
				this.updateSize=10;
				this.dialogTableVisible=true;
			},
			//窗口点击确定触发更新操作
			afterupdateStockList(){
				this.dialogTableVisible=false;
				this.updateStockList(this.updateSize);
			},
			//更新股票列表
			updateStockList(size) {
				this.$http({
					url: this.$http.adornUrl('/stock/updatestocklist'),
					method: 'get',
					params: this.$http.adornParams({"size":size})
				}).then(({
					data
				}) => {
					if (data && data.code === 200) {
						this.$message({
							message: data.msg,
							type: 'success'
						});
						this.getDataList()
					} else {
						this.$message.error(data.msg)
					}
				})
			},			
			// 当前页
			currentChangeHandle(val) {
				this.pageIndex = val
				this.getDataList()
			},
			// 每页数
			sizeChangeHandle(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.getDataList()
			},
			// 搜索查询
			selectGetDataList() {
				this.pageIndex = 1
				this.getDataList()
			},
		}
	}
</script>

<style scoped>
	.el-form-item {
		margin-left: 30px;
	}

	ul,
	ol,
	li {
		list-style: none;
	}

	.board-list {
		margin-bottom: 16px;
		background: #194e83;
		padding: 48px 0;
		display: flex;
		justify-content: space-between;
	}

	.board-list .board-item {
		width: 25%;
		text-align: center;
	}

	.board-list .name {
		margin-bottom: 8px;
		height: 24px;
		line-height: 24px;
		font-size: 18px;
		color: #fff;
		font-weight: 300;
	}

	.board-list .value {
		margin-bottom: 8px;
		height: 48px;
		line-height: 48px;
		font-size: 36px;
		color: #67c23a;
	}

	.board-list .bottom,
	.price {
		font-size: 14px;
		color: #67c23a;
	}

	.stock-table .green {
		z-index: 1400;
		color: #67c23a;
		cursor: pointer;
	}

	.stock-table .red {
		z-index: 1400;
		color: #f56c6c;
		cursor: pointer;
	}

	/* 	.stock-table .blue {
		z-index: 1400;
		color: #f56c6c;
		cursor: pointer;
	} */
</style>
