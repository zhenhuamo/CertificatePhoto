const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 近期热门列表
		photoSizeList: app.globalData.photoSizeList
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '免冠照/证件照' })
    // 来自邀请，签到时使用
    if (options.shareOpenid) {
      wx.setStorage({
        key: "fromShare",
        data: options.shareOpenid
      })
    }
  },
  
  //跳转分类页面
  goClassPage(e) {
    wx.navigateTo({
        url: '/pages/searchSize/searchSize?index=' + e.currentTarget.dataset.index,
    })
  },

	// 去选择照片页面
	goNextPage (e) {
		wx.navigateTo({
			url: '/pages/preEdit/preEdit?index=' + e.currentTarget.dataset.index,
		})
	},

  // 页面跳转
	navigateTo(e) {
		wx.navigateTo({ url: e.currentTarget.dataset.url, })
  },
  

  saveFileToDatabase(fileID) {
    const db = wx.cloud.database();
    console.log("add db")
    db.collection('resource-images').add({
      data: {
        src: fileID, // 将 fileID 存储在 src 字段
        type: 'hairs', // 设置 type 为 'clothes'
        tag: 'nv', // 设置 tag 为 'na'
        uploadTime: db.serverDate(), // 使用服务器时间作为上传时间
      },
      success: res => {
        console.log('图片信息保存成功', res);
      },
      fail: console.error
    });
  },
//选择照片
choosePhoto(){
  wx.chooseMedia({
    count:9,
    mediaType:"image",
    sourceType:"album",
    success:(res)=>{  
      //console.log("图片：",res.tempFiles)
      for(var i = 0; i<res.tempFiles.length; i++){
        
        var po = res.tempFiles[i].tempFilePath.lastIndexOf(".")
        var ext = res.tempFiles[i].tempFilePath.slice(po);       
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + ext,
          filePath: res.tempFiles[i].tempFilePath,
          success: res => {
            this.saveFileToDatabase(res.fileID)
            // get resource ID
            console.log(res.fileID)
          },
          fail: err => {
            console.log("上传失败")
            // handle error
          }
        })

      }
    },
    fail:(res)=>{
      console.log("选择图片失败！")
    }
  })
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
			imageUrl: '/shareShow.jpg'
		}
	},
	
})

