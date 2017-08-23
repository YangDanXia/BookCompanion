// pages/me/functions/help.js
//获取应用实例
var app = getApp();
var title = '';
var content = '';
var library;
var phone;
Page({
  data: {
    // tab切换
    currentTab: 0,
    // 屏幕高度
    winHeight: app.globalData.winHeight
  },

  onLoad:function(){

  },

  /**
   * 滑动切换Tab
   */
  bindChange: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },


  /**
   * 点击Tab切换
   */
  swichNav: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  /**
 * 获取图书馆的输入
 */
  bindPickerChange: function (e) {
    library = array[e.detail.value]
    this.setData({
      index: e.detail.value
    })
  },

  titleInput: function (e) {
    title = e.detail.value
  },

  contentInput: function (e) {
    content = e.detail.value
  },

  phoneInput: function (e) {
    phone = e.detail.value
  },

  submit: function (e) {
    if (content == '') {
      wx.showToast({
        title: "请填写反馈内容~",
        image: "../../../img/icon/warn.png"
      })
    } else {
      wx.request({
        url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
        data: {
          dbName: "WxApp",
          table: "user_suggestion",
          typeName: "insert",
          field: { uk_phone: phone, suggestion: content },
          factor: {}
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data)
          if (res.data) {
            wx.showToast({
              title: '反馈成功',
              icon: 'success'
            })
          }
        }
      })
    }

  }
});