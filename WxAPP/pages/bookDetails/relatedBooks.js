// pages/bookDetails/relatedBooks.js
var app = getApp();
Page({
  data: {
    // loading
    hidden: false,
    // 图书列表
    bookList: {},
    //是否隐藏网络异常
    errHidden: true,
    //屏幕高度
    winHeight: app.globalData.winHeight,
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: function (query) {
    this.getBooksList(query);
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        hidden: true
      })
    }, 1000);
  },



  /**
   * 获取图书信息
   */
  getBooksList: function (query) {
    var table = query.table
    var tag = query.tag
    var that = this
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "gdou_book",
        table: table,
        typeName: "inquire",
        field: { title: '', author: '', isbn13: '', images: '', total_type: '' },
        factor: { respect_type:tag },
        limit: "0,30"
      },
      //请求头
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        var obj = res.data.result
        // for (var i = 0; i < obj.length; i++) {
        //   if (obj[i].title.length > 10) {
        //     obj[i].title = obj[i].title.substr(0, 8) + "..."
        //   }
        //   if (obj[i].author.length > 10) {
        //     obj[i].author = obj[i].author.substr(0, 8) + "..."
        //   }
        // }
        // that.setData({
        //   commendItems: res.data.result
        // })
        wx.request({
          url: 'https://www.hqinfo.xyz/Server_Java/CloseConn'
        })
      },
      fail: function (res) {
        that.setData({
          errHidden: false
        })
      }
    })
  }

})