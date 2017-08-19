// pages/shelf/functions/shelfDetails.js
var app = getApp();
//书单序列号
var shelfIndex;
Page({

  /**
   * 页面的初始数据
   */
  data: {
   //是否隐藏加载显示
    loadHidden:false,
   //屏幕高度
    winHeight: app.globalData.winHeight,
    bookShelf: app.cache.bookShelf || [],
    // 收藏书单
    bookShelfLike: app.cache.bookShelfLike||[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    shelfIndex=options.index,
     this.setData({
       //书单内容
       bookShelfValue:app.cache.bookShelf[options.index]
     }) 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    // 数据加载完成后 延迟隐藏loading
    setTimeout(function () {
      that.setData({
        loadHidden: true
      })
    }, 500);
  },


  /**
   * 是否收藏图书
   */
   collectOrNot:function(e){
     var index = e.currentTarget.dataset.index;
     console.log("图书位置:"+index)
     console.log("书单"+this.data.bookShelf)
     var obj = this.data.bookShelf[shelfIndex].shelf_bookList
     console.log("书单内容："+obj)
     obj.splice(index, 1);
     console.log("修改后的书单"+this.data.bookShelf)
     app.saveCache('bookShelf', this.data.bookShelf);
     this.setData({
       bookShelfValue: obj
     })
   },

  /**
   *    添加图书到另外的书单
   */
  bindPickerChange:function(e){
    var index = e.currentTarget.dataset.index;
    var shelf_index = e.detail.value
    var currentShelf = this.data.bookShelf[shelfIndex]
    var selectShelf = this.data.bookShelf[shelf_index]
    selectShelf.shelf_bookList.push(currentShelf.shelf_bookList[index])
    app.saveCache('bookShelf', this.data.bookShelf);
  },

  /**
   * 收藏书单
   */
  collectShelf:function(){
    var currentShelf = this.data.bookShelf[shelfIndex]
    var obj = this.data.bookShelfLike
    console.log(currentShelf)
    obj.push(currentShelf)
    // wx.request({
    //   url: 'http://localhost:8080/Server_Java/DbOperations',
    //   data:
    //   {
    //     dbName: "WxApp",
    //     table: "user_collectShelf",
    //     typeName: "insert",
    //     field: { info_password: that.data.passwd },
    //     factor: { uk_phone: that.data.userPhone }
    //   },
    //   //请求头
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
    //   },
    //   method: 'GET',
    //   success: function (res) {
    //     console.log(res.data.result)
    //     result = res.data.result[0].info_password;
    //   }, fail: function () {
    //     wx.showToast({
    //       title: '网络异常',
    //       image: '../../../img/icon/warn.png'
    //     })
    //   }
    // })
    app.saveCache('bookShelfLike', this.data.bookShelfLike);
    wx.showToast({
      title: '收藏成功',
      icon:'success'
    })
  },



  /**
   * 评论书单
   */

  /**
   * 分享书单
   */
  shareShelf:function(){
    var currentShelf = this.data.bookShelf[shelfIndex]
    currentShelf.idx_shelfId = "0"
    currentShelf.shelf_tag = "0"
    currentShelf.bookNum = "0"
    currentShelf.idx_phone = app.cache.userInfo.phone
    console.log(app.globalData.userInfo)
    currentShelf.info_photo = app.globalData.userInfo.avatarUrl
    currentShelf.info_name = app.globalData.userInfo.nickName
    currentShelf.shelf_bookList = ''
    console.log("分享书单的内容："+currentShelf)
    wx.request({
      url: 'http://localhost:8080/Server_Java/DbOperations',
      data:
      {
        dbName: "WxApp",
        table: "shelf_share",
        typeName: "insert",
        field: currentShelf,
        factor: {}
      },
      //请求头
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)

      }, fail: function () {
        wx.showToast({
          title: '网络异常',
          image: '../../../img/icon/warn.png'
        })
      }
    })

  }


   
})