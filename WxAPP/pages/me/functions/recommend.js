// pages/me/functions/recommend.js
//获取应用实例
var app = getApp();
var title ='';
var publish = '';
var author ='';
var reason = '';
var library;
var phone ='';
Page({
  data: {
    array: ["广东海洋大学图书馆", "湛江市图书馆", "南京信息职业技术学院-图书馆", "南京工业职业技术学院-图书馆分馆", "建邺区图书馆"],
    index: 0
  },

  onShow:function(){    
  },

  /**
 * 获取图书馆的输入
 */
  bindPickerChange: function (e) {
    library = this.data.array[e.detail.value]
    this.setData({
      index: e.detail.value
    })
  },

  titleInput:function(e){
    title = e.detail.value
  },

  authorInput:function(e){
    author = e.detail.value
  },

  publishInput:function(e){
    publish = e.detail.value
  },

  reasonInput:function(e){
    reason = e.detail.value
  },

  phoneInput: function (e) {
    phone = e.detail.value
  },

  submit:function(e){
    var that = this
    if(title =='' || author ==''){
      wx.showToast({
        title: "书名和作者必填~",
        image: "../../../img/icon/warn.png"
      })
    }else{
      wx.request({
        url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
        data: {
          dbName: "Library",
          table: "RECORD_RECOMMENDATION",
          typeName: "insert",
          field: { ReaderId: phone, RecommTitle: title, RecommAuthor: author, RecommPublish: publish, RecommReason:reason },
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
              title: '荐购成功',
              icon: 'success'
            })
          }
          wx.request({
            url: 'https://www.hqinfo.xyz/Server_Java/CloseConn'
          })
        }
      })
      that.onShow()
    }
  }
});