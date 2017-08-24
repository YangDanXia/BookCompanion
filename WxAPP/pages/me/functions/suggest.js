// pages/me/functions/suggest.js
//获取应用实例
var app = getApp();
var title = '';
var content = '';
var library;
var phone;
Page({
  data: {
    array: ['广东海洋大学图书馆', '中国', '巴西', '日本'],
    index: 0
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
    if(content==''){
      wx.showToast({
        title: "请填写反馈内容~",
        image: "../../../img/icon/warn.png"
      })
    }else{
      wx.request({
        url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
        data: {
          dbName: "Library",
          table: "RECORD_SUGGESTION",
          typeName: "insert",
          field: { ReaderId: phone, SuggestionContent: content },
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
      this.onShow()
    }

  }
});