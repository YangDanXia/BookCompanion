// pages/find/find.js
var app = getApp()
const date = new Date()
var content='';
var price='';
var uploadPhoto=[]
var photoShow;
var ex_price='';
var tag='';
Page({
  data: {
    img:"../../img/icon/camera.png",
    // loading
    loadhidden: true
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
        var tempFilePaths = res.tempFilePaths
        that.setData({
          img: tempFilePaths[0],
        })
      }
    })
  },

  /**
   * 文字描述
   */
  contentInput:function(e){
    content = e.detail.value
  },

  /**
   * 标签描述
   */
  tagInput:function(e){
   tag = e.detail.value
  },


 /**
  * 新价格
  */
  newPrice:function(e){
    price = e.detail.value
  },

  /**
   * 旧价格
   */
  oldPrice:function(e){
    ex_price = e.detail.value
  },




  /**
   * 发布
   */
  publishTo:function(){
    var userInfo = app.cache.userInfo
    var that = this
    var num = userInfo.bookTicket || 0
    if (!content || !price || !ex_price || !uploadPhoto.length||!tag) {
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
    that.setData({
      loadhidden:false
    })

    wx.uploadFile({
      url: 'https://www.hqinfo.xyz/Server_Java/UploadImage',
      filePath: that.data.img,
      name: 'file',
      success: function (res) {
        photoShow = "http://www.hqinfo.xyz/Server_Java/upload/" + res.data
        var time = that.getTime()
        that.setData({
          loadhidden: true
        })
        wx.request({
          url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
          data:
          {
            dbName: "WxApp",
            table: "tem_sellBook_record",
            typeName: "insert",
            field: {
              idx_phone: userInfo.userPhone,
              nickName: userInfo.nickName,
              avatarUrl: userInfo.avatarUrl,
              picture: photoShow,
              content: content,
              tag: tag,
              price: price,
              ex_price: ex_price,
              publish_time: time
            },
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
              icon: "success",
              duration: 800
            })
            num--
            wx.showToast({
              title: "书卷-1",
              icon: "success",
              duration: 500
            })
            userInfo.bookTicket = num
            app.saveCache('userInfo', userInfo)
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

  },

  /**
* 获取时间
*/
  getTime: function () {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return year + '-' + month + '-' + day;
  }
})