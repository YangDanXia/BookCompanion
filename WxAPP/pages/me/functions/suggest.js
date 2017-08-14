// pages/me/functions/suggest.js
//获取应用实例
var app = getApp();
Page({
  data: {
    array: ['广东海洋大学图书馆', '中国', '巴西', '日本'],
    index: 0
  },
  
  /**
 * 获取图书馆的输入
 */
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  }
});