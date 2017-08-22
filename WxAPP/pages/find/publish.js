// pages/find/find.js
var app = getApp()
var content;
var price;
var ex_price;
var img1;
var img2;
Page({
  data: {
    img:"../../img/icon/camera.png",
    // 是否继续添加照片
    isContinue:false,
    imgs:"../../img/icon/addImg.png"
  },


  onLoad: function () {
 
  },


  /**
   * 上传本地照片1
   */
  chooseImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: 'compressed', // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          img: res.tempFilePaths,
          isContinue:true
        })
        img1 = res.tempFilePaths
      }
    })
  },

  /**
 * 上传本地照片2
 */
  chooseImgs: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: 'compressed', // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          imgs: res.tempFilePaths
        })
        img2 = res.tempFilePaths
      }

    })
  },

  /**
   * 文字描述
   */
  contentInput:function(e){
    content = e.detail.value
    console.log(content)
  },


 /**
  * 新价格
  */
  newPrice:function(e){
    price = e.detail.value
    console.log(price)
  },

  /**
   * 旧价格
   */
  oldPrice:function(e){
    ex_price = e.detail.value
    console.log(ex_price)
  },

  /**
   * 发布
   */
  publishTo:function(){
    var userInfo = app.cache.userInfo
    var picture =img1+";"+img2
    var that = this
    if(!content||!price||!ex_price){
      wx.showToast({
        title: '请输入完整信息',
        image: '../../img/icon/warn.png'
      })
      return;
    }
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "WxApp",
        table: "sellBook_record",
        typeName: "insert",
        field: { idx_phone: userInfo.phone, name: userInfo.name, photo: userInfo.photo,picture:picture,content:content,price:price,ex_price:ex_price},
        factor: {},
        limit: "1"
      },
      //请求头
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        wx.showToast({
          title: '发布成功',
          icon:"success",
          duration:0
        })
        wx.navigateBack({
          delta:1
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常',
          image: '../../img/icon/warn.png'
        })
      }
    });
  }
})