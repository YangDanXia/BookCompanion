// pages/find/find.js
var app = getApp()
const date = new Date()
var content = '';
var isbn;
Page({
  data: {

  },


  onLoad: function (options) {
     isbn = options.isbn

  },


  /**
   * 文字描述
   */
  contentInput: function (e) {
    content = e.detail.value
  },


  /**
   * 发布
   */
  publishTo: function () {
    var userInfo = app.cache.userInfo || ''
    var that = this
    var num = app.cache.bookTicket || 0
    if (!content) {
      wx.showToast({
        title: '请输入完整信息',
        image: '../../img/icon/warn.png'
      })
      return false;
    }

    var time = this.getTime()
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "WxApp",
        table: "book_view",
        typeName: "insert",
        field: {
          book_isbn:isbn,
          phone: userInfo.phone||'',
          name: userInfo.name||'游客',
          photo: userInfo.photo||'../../img/icon/user.png',
          content: content,
          view_time:time
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
        console.log(res.data)
        wx.showToast({
          title: '发布成功',
          icon: "success",
          duration: 1000
        })
        num++
        wx.showToast({
          title: "书卷+1",
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