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
    bookList: app.cache.browsingHistory|| []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    var obj = app.cache.browsingHistory|| []
    if (obj.length == 0) {
      this.setData({
        errHidden: false
      })
    }
    for(var i=0;i<obj.length;i++){
      if (obj[i].book_name>24){
        obj[i].book_name = obj[i].book_name.substr(0, 24) + "..."
      }
      if (obj[i].book_author.length>24){
        obj[i].book_author = obj[i].book_author.substr(0, 24) + "..."
      }
      
    }
    this.setData({
      bookList:obj
    })
  },

  bookDetail:function(e){
    var isbn = e.currentTarget.dataset.isbn
    wx.redirectTo({
      url: '../../bookDetails/bookDetails?isbn=' + isbn
    })
  }
})