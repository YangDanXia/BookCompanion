// pages/me/account/information.js
var app = getApp();
Page({
  data: {
    //是否隐藏弹窗
    modalHidden: true
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onshow: function () {
    this.setData({
      information: app.cache.information
    })
  },

// 选择添加借书证的类型
  addCardType:function(){
    this.setData({
      modalHidden: false
    })
  },

// 扫码添加借书证
  addByScan:function(){
    wx.scanCode({
      success: (res) => {
        console.log(res)
      }
    })
    this.setData({
      modalHidden: true
    })
  },

// 手动添加借书证
  addByManual:function(){
    wx.navigateTo({
      url: 'addCard'
    })
    this.setData({
      modalHidden: true
    })
  }

})