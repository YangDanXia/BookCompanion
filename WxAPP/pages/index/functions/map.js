// pages/index/functions/library.js
var map = require('../../../libs/bmap-wx.min.js');
var wxMarkerData = [];
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ak: "qYrgL0YUKKmtx2zej6zG33iOdMIoQUGE",//百度API的密钥
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

  //  获取当前位置
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
      }
    })
  // 获取附近图书馆
    var BMap = new map.BMapWX({
      ak: that.data.ak
    });
    var fail = function (data) {
      console.log(data);
    };
    var success = function (data) {
      wxMarkerData = data.wxMarkerData;
      console.log(wxMarkerData)
      for(var i=0;i<wxMarkerData.length;i++){
        wxMarkerData[i].iconPath ='../../../img/icon/location1.png';
        wxMarkerData[i].height =50;
        wxMarkerData[i].width = 50;
      }
      that.setData({ 
        markers: wxMarkerData
      });
    }
    //找到附近地点
    BMap.search({
      "query": '图书馆',
      fail: fail,
      success: success
    });
  },

  choosed: function (e) {
    var index = e.currentTarget.dataset.index;
    app.saveCache('selectLibrary', wxMarkerData[index].title)
    wx.switchTab({
      url: '../index'
    })
  }
})