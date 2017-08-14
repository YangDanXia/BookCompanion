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
    var that = this
    wx.request({
      url: 'http://localhost:8080/Library_WxApp/GetBooksInfo',
      data: {
        request: "tag",
        tag: query.tag,
        start: 0,
        count: "25"
      },
      success: function (res) {
        var books = res.data.books;
        that.setData({
          bookList: books
        })
      },
      fail: function (res) {
        that.setData({
          hidden: true,
          errHidden: false
        })
      }
    });
  }

})