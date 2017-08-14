// pages/index/functions/library.js
var map = require('../../../libs/bmap-wx.min.js');
var wxMarkerData = [];
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxMarkerData: [],
    ak: "qYrgL0YUKKmtx2zej6zG33iOdMIoQUGE",//百度API的密钥
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var BMap = new map.BMapWX({
      ak: that.data.ak
    });
    var fail = function (data) {
      console.log(data);
    };
    var success = function (data) {
      wxMarkerData = data.wxMarkerData;
      console.log(wxMarkerData)
      that.setData({ 
        wxMarkerData: wxMarkerData
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