// pages/shelf/functions/pay.js
var app = getApp()
var isbn
var email
var passwd
Page({
  data: {
    userInfo: app.cache.userInfo ||''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    isbn = options.isbn
    email = options.email
    this.setData({
      average:options.average
    })
      
  },


  /**
   * 确认转账
   */
  doPay: function () {
    var that = this
    if(!passwd){
      wx.showToast({
        title: '请输入密码',
        image: '../../../img/icon/warn.png'
      })
      return;
    }
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "WxApp",
        table: "ebook_record",
        typeName: "insert",
        field: { idx_isbn:isbn, buyer:email },
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
          title: '购买成功！',
          icon: 'success',
          duration: 1000
        })
        var num = app.cache.bookTicket||0
        num++;
        wx.showToast({
          title: "书卷+1",
          icon: "success",
          duration: 1000
        })
        app.saveCache('bookTicket', num)
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '无法连接数据库!请检查网络是否连接',
          showCancel: false,
          success: function (res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    });

    setTimeout(function () {
      wx.navigateBack({
        delta: 2
      })
    }, 1500);  
  },

 /**
  * 输入密码
  */
  passwdInput:function(e){
   passwd = e.detail.value
  }





})