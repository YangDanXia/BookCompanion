// pages/me/account/addCard.js
 
var app = getApp();
Page({

  data: {
    array: ["广东海洋大学图书馆", "湛江市图书馆", "南京信息职业技术学院-图书馆", "南京工业职业技术学院-图书馆分馆","建邺区图书馆"],
    index: 0
  },


onLoad:function(){
  var that = this
},

/**
 * 生命周期函数--监听页面显示
 */
onShow: function () {
  var info = app.cache.userInfo || ''
  var phone = info.userPhone || ''

  this.setData({
    phone: phone
  })
},
  /**
   * 获取借书证的输入
   */
  cardNumInput: function (e) {
    this.setData({
      cardNum: e.detail.value
    });
  },

  /**
   * 获取图书馆的输入
   */
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

 

  /**
   * 点击添加
   */
 addCard:function(){
   var that = this;
   wx.request({
     url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
     data:
     {
       dbName: "WxApp",
       table: "bookcard_record",
       typeName: "insert",
       field: {idx_phone: that.data.phone,uk_bookCardId: that.data.cardNum, library: that.data.array[this.data.index]},
       factor: {}
     },
     //请求头
     header: {
       'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
     },
     method: 'GET',
     success: function (res) {
       if(res.data){
         var obj = app.cache.bookCard;
         var newCard = { history_borrow: "0", library: that.data.array[that.data.index], uk_bookCardId: that.data.cardNum, current_borrow:"0"};
         obj.push(newCard);
         app.saveCache('bookCard', obj);
         wx.showToast({
           title: '添加成功',
           icon:'success',
           duration: 1000
         })
         setTimeout(function () {
           wx.navigateBack({
             delta: 1
           })
         }, 1000);  
       }

       wx.request({
         url: 'https://www.hqinfo.xyz/Server_Java/CloseConn'
       })
     },fail: function () {
       wx.showToast({
         title: '网络异常',
         image: '../../../img/icon/warn.png'
       })
     }
   })
 }

});