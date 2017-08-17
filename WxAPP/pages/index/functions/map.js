// pages/index/functions/library.js
var wxMarkerData = [];
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

  //  获取当前位置及附近图书馆
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
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
            wxMarkerData = res.data.results;

            for (var i = 0; i < wxMarkerData.length; i++) {
              wxMarkerData[i].latitude = wxMarkerData[i].location.lat
              wxMarkerData[i].longitude = wxMarkerData[i].location.lng
              wxMarkerData[i].title = wxMarkerData[i].name;
              wxMarkerData[i].iconPath = '../../../img/icon/location1.png';
              wxMarkerData[i].height = 30;
              wxMarkerData[i].width = 30;
            }
            console.log(wxMarkerData)
            that.setData({
              markers: wxMarkerData
            });
          }
        })
      }
    })
  }
})