// pages/me/functions/historyBorrow.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // loading
    loadhidden: false,
    errHidden: true,
    bookList: app.cache.historyBook || []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.bookList)
    var obj = app.cache.historyBook || []
 
    if (obj.length == 0) {
      this.setData({
        errHidden: false
      })
    }
    this.setData({
      bookList: obj
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    // 数据加载完成后 延迟隐藏loading
    setTimeout(function () {
      that.setData({
        loadhidden: true
      })
    }, 500);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var obj = app.cache.historyBook|| []
    console.log(obj)
    if (obj.length == 0) {
      this.setData({
        errHidden: false
      })
    }
    this.setData({
      bookList:obj
    })
  },

  bookDetail: function (e) {
    var isbn = e.currentTarget.dataset.isbn
    wx.redirectTo({
      url: '../../bookDetails/bookDetails?isbn=' + isbn
    })
  }
})