// pages/index/functions/library.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxMarkerData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.request({
          url: 'http://localhost:8080/Server_Java/GetMap',
          data: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
          },
          method: 'GET',
          success: function (res) {
            console.log(res.data)
            that.setData({
              wxMarkerData: res.data.results
            })
          }
        })
      }
    })
  },

  choosed: function (e) {
    var index = e.currentTarget.dataset.index;
    app.globalData.G_selectLibrary = this.data.wxMarkerData[index].name;
    wx.switchTab({
      url: '../index'
    })
  }
})