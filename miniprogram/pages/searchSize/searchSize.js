const hideLoadView = true
Page({

  /**
   * 页面的初始数据
   */
  data: {
		category:"1",
		page:0,
		currentTab:0,
		photoSizeList:[],
		allRecords:[]
	},
	//滑动切换
  swiperTab: function(e) {
    this.setData({ currentTab: e.detail.current });
  },
 //点击切换 
  clickTab: function(e) {
    if (this.data.currentTab === e.target.dataset.current) return false;
    this.setData({
      category: ['1', '2', '3', '4', null][e.target.dataset.current],
      page:0,
      currentTab: e.target.dataset.current,
      photoSizeList:[]
    })
    this.requestdata()
  },

  // 跳转到下一页
	goNextPage (e) {
		wx.navigateTo({
			url: '/pages/preEdit/preEdit?index=' + e.currentTarget.dataset.index + '&data='+JSON.stringify(this.data.photoSizeList[e.currentTarget.dataset.index])
		})
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.requestdata();
    const {index} = options;
    this.clickTab({ target: { dataset: { current: index || '1' } } })
		wx.setNavigationBarTitle({ title: '免冠照/证件照尺寸' })
	},
  // 跳转到搜索页面
	inputPush(){
		wx.navigateTo({ url: './searchView/searchView' })
	},
	//获取数据
	requestdata (){
		wx.showLoading({
      title: '加载中...', // 显示加载提示框，提示用户“加载中”
    });
  
    const db = wx.cloud.database(); // 初始化数据库
    const MAX_LIMIT = 20; // 定义每次查询最大返回数据条数
    const num = this.data.page * MAX_LIMIT; // 计算跳过的数据条数，实现分页效果

    // 执行数据库查询操作
    db.collection('photo_size') // 指定查询的集合为 'photo_size'
      .where({ category_id: this.data.category }) // 查询条件，这里是根据 category_id 过滤
      .skip(num) // 跳过 num 条记录，实现分页
      .limit(MAX_LIMIT) // 限制返回的数据条数为 MAX_LIMIT
      .get({
        success: res => {
          //console.log(res); // 打印查询结果到控制台
          let arrNum = res.data.length; // 获取查询结果的数据条数
          //console.log(arrNum); // 打印数据条数到控制台
          wx.hideLoading(); // 隐藏加载提示框
  
          // 更新页面数据，将查询到的新数据追加到 photoSizeList 数组
          this.setData({
            photoSizeList: this.data.photoSizeList.concat(res.data),
          });
  
          // 判断本次查询的数据条数是否达到了最大限制，以决定是否还有更多数据
          // 这里的 hideLoadView 并没有在后续使用，可能需要进一步处理
          hideLoadView = arrNum !== 20;
        }
      });
	},
	//加载更多
	moreclick(){
    // 已经全部加载出来了
		if (hideLoadView==true) return
		this.setData({ page: this.data.page+=1 })
    this.requestdata();
	},

  // 触底加载
	onReachBottom:function(){
		this.moreclick();
	},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
		return {
			title: '证件照、免冠照、一寸照片、二寸照片、证件照换背景，免费生成、下载。',
			path: '/pages/index/index',
			imageUrl: '/shareShow.jpg'
		}
	},
	
  onShareTimeline: function () {
		return {
			title: '证件照、免冠照、一寸照片、二寸照片、证件照换背景，免费生成、下载。',
			// path: '/pages/index/index',
			imageUrl: '/shareShow.jpg'
		}
	},
	
})