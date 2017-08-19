// pages/shelf/functions/shelfDetails.js
var app = getApp();
var option = require('../../../utils/infor.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
   //是否隐藏加载显示
    loadHidden:false,
   //功能栏
    funItem: option.BookAction,
   //屏幕高度
    winHeight: app.globalData.winHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
       //书单序列号
       shelfIndex:options.index,
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
  }


  // /**
  //  * 是否收藏图书
  //  * / 
   
})