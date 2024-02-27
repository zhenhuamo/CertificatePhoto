// miniprogram/pages/editPhoto/imageStyle/imageStyle.js
// 在页面中定义激励视频广告
let videoAd = null
// 在页面中定义插屏广告
let interstitialAd = null
let imgUrl = ''
const allHair = {}
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		TabCur: 0,
		videoLoaded: false,
		imgList: {
			na: [],
			nv: []
		}
	},

  // 切换男女
	tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
	},
  
  // 选择发型，开始看视频
	selectImg (e) {
    imgUrl = e.currentTarget.dataset.url
    this.back()

		// 用户触发广告后，显示激励视频广告
		// if (videoAd) {
		// 	videoAd.show().catch(() => {
		// 		// 失败重试
		// 		videoAd.load()
		// 			.then(() => videoAd.show())
		// 			.catch(err => {
    //         this.back()
		// 				console.log('激励视频 广告显示失败')
		// 			})
		// 	})
		// } else {
		// 	back()
		// }
	},

  // 返回页面，传递图片地址
	back () {
		const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('selectHair', {imgUrl});
		wx.navigateBack({})
	},

  // 获取发型列表
	async getData () {
		wx.showLoading({ title: '稍等片刻...', })
		const { result } = await wx.cloud.callFunction({
			name: 'getHairs',
    })
    Object.assign(allHair, result.hairs)
		this.setData({
			imgList: {
        na: allHair.na.slice(0, 6),
        nv: allHair.nv.slice(0, 6),
      }
		})
		wx.hideLoading()
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({ title: '免冠照发型' })
		this.getData()

		// 在页面onLoad回调事件中创建激励视频广告实例
		if (wx.createRewardedVideoAd) {
			videoAd = wx.createRewardedVideoAd({
				adUnitId: 'adunit-240d1c7fb731d343'
			})
			videoAd.onLoad(() => {
				this.setData({
					videoLoaded: true
				})
			})
			videoAd.onError((err) => {
				this.setData({
					videoLoaded: false
				})
			})
			videoAd.onClose((res) => {
				console.log(res)
				if (res && res.isEnded) {
					if(imgUrl) this.back()
				} else {
					wx.showToast({
						title: '看完才可以使用哦',
						icon: 'none'
					})
				}
			})
		}

		// 在页面onLoad回调事件中创建插屏广告实例
		if (wx.createInterstitialAd) {
			interstitialAd = wx.createInterstitialAd({
				adUnitId: 'adunit-71fe77c8c4d0e3ca'
			})
			interstitialAd.onLoad(() => {})
			interstitialAd.onError((err) => {})
			interstitialAd.onClose(() => {})
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		// 在适合的场景显示插屏广告
		if (interstitialAd) {
			interstitialAd.show().catch((err) => {
				console.error(err)
			})
		}
  },
  
  // 触底加载
  onReachBottom() {
    const key = ['nv', 'na'][this.data.TabCur]
    if (this.data.imgList[key].length === allHair[key].length) return
    this.setData({
      imgList: {
        ...this.data.imgList,
        [key]: allHair[key].slice(0, this.data.imgList[key].length + 6)
      }
    })
  }
})