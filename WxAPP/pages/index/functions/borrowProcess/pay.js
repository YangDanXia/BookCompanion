// pages/shelf/functions/pay.js
var app = getApp()
Page({
  data: {
    userInfo: app.globalData.userInfo,
    address:app.cache.selectLibrary||'',
    selectLibrary: app.cache.selectLibrary||'图书馆'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
  },


  /**
   * 确认转账
   */
  doPay: function () {
    var that = this;
    wx.request({
      url: 'http://119.29.104.141:8088/ServerForCommunicate/Get',
      data: {
        request: "doPay",
        CirculationId: "20176241952"
      },
      header: { 'content-type': 'application/x-www-form-urlencoded; charset=utf-8' }
    })

    wx.showToast({
      title: '借阅成功！',
      icon: 'success',
      duration: 2000,
      complete: function () {
        wx.switchTab({
          url: '../../index/index'
        })
      }
    })
  }
})