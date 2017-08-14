// pages/me/me.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.globalData.userInfo,
    //登录状态
    loginFlag: app.cache.loginFlag || false
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onshow: function () {
    this.setData({
      loginFlag: app.cache.loginFlag || false
    })
  },


  /**
   * 查看个人信息
   */
  doInfo: function () {
    // if (!this.data.loginFlag) {
    //   this.login()
    // } else {
      wx.navigateTo({
        url: 'account/information'
      })
    // }
  },


  /**
   * 进入登录界面
   */
  login: function () {
    wx.navigateTo({
      url: 'account/login'
    })
  },


  /**
   * 退出登录
   */
  logOut: function () {
    app.saveCache('loginFlag', false)
    wx.showToast({
      title: '注销成功',
      icon: 'success',
      duration: 1000
    })
    this.onshow();
  }
})
