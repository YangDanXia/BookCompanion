// pages/find/find.js
var app = getApp()
var content='';
var price='';
var photoShow;
var ex_price='';
var tag='';
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
        wx.saveFile({
          tempFilePath: res.tempFilePaths[0],
          success: function (res) {
              that.setData({
                img: res.savedFilePath,
                isContinue:true
              })
              photoShow = res.savedFilePath
          }
        })
      }
    })
    console.log(photoShow)
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
        wx.saveFile({
          tempFilePath: res.tempFilePaths[0],
          success: function (res) {
            that.setData({
              img1: res.savedFilePath
            })
            photoShow =photoShow+";"+res.savedFilePath
          }
        })
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
   * 标签描述
   */
  tagInput:function(e){
   tag = e.detail.value
   console.log(tag)
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
    var that = this
    var picture=''; 
    var num = app.cache.bookTicket || 0
    if (!content || !price || !ex_price || !photoShow||!tag) {
      wx.showToast({
        title: '请输入完整信息',
        image: '../../img/icon/warn.png'
      })
      return false;
    } 
    if(num<1){
      wx.showToast({
        title: '先赚够书卷再发布消息吧~',
        image: '../../img/icon/warn.png'
      })
      return false;
    }
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "WxApp",
        table: "sellBook_record",
        typeName: "insert",
        field: { idx_phone: userInfo.phone, name: userInfo.name, photo: userInfo.photo, picture: photoShow,content:content,tag:tag,price:price,ex_price:ex_price},
        factor: {},
        limit: "1"
      },
      //请求头
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        wx.showToast({
          title: '发布成功',
          icon:"success",
          duration:1000
        })
        num--
        wx.showToast({
          title: "书卷-1",
          icon: "success",
          duration: 1000
        })
        app.saveCache('bookTicket', num)
        wx.request({
          url: 'https://www.hqinfo.xyz/Server_Java/CloseConn'
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1000);  
        
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