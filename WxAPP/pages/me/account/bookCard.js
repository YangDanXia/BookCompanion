// pages/me/account/bookCard.js
var app = getApp();

Page({
  data: {
    //是否隐藏弹窗
    modalHidden: true,
    bookCard:app.cache.bookCard||[],
    phone:app.cache.userInfo.phone
  },

  onLoad: function(options) {
    var length = this.data.bookCard.length;
    var that = this;
    // 若本地有缓存则在本地获取数据，若无则从数据库获取数据
    if(length){
      this.setData({
        bookCard: app.cache.bookCard
      })
    }else{
      wx.request({
        url: 'http://localhost:8080/Server_Java/DbOperations',
        data:
        {
          table: "bookcard_record",
          typeName: "inquire",
          field: { uk_bookCardId: '', library: '', current_borrow:'',history_borrow:''},
          factor: { idx_phone: that.data.phone}
        },
        //请求头
        header: {
          'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        method: 'GET',
        success:function(res){
          console.log(res.data)
          console.log(res.data.result)
          that.setData({
            bookCard:res.data.result
          })
          app.saveCache("bookCard",res.data.result)
        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      bookCard: app.cache.bookCard 
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