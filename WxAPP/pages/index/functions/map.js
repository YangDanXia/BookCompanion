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
    // wx.getLocation({
    //   type: 'wgs84',
    //   success: function (res) {
        that.setData({
          longitude: app.globalData.longitude,
          latitude: app.globalData.latitude
        })
        wx.request({
          url: 'https://www.hqinfo.xyz/Server_Java/GetMap',
          data: {
            latitude: app.globalData.latitude,
            longitude: app.globalData.longitude
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
              wxMarkerData[i].iconPath = '../../../img/icon/location1.png';
              wxMarkerData[i].callout = { content: wxMarkerData[i].name, color: "black", borderRadius: "2", bgColor: "#B0B0B0", padding: "3", display: "ALWAYS" }
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
  //   })
  // }
})