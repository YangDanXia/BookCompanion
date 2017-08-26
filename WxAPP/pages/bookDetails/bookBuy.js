// pages/bookDetails/bookBuy.js
var app = getApp()
var email;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 显示提示
    warnShow:true,
    // 页面配置
    winWidth: app.globalData.width,
    winHeight: app.globalData.winHeight,
    // 是否隐藏弹出框
    modalHidden:true,
    // 登录状态
    loginFlag: app.cache.loginFlag || false,
    // 显示的图书
    bookInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "gdou_book",
        table: options.table,
        typeName: "inquire",
        field: { title: '', author: '', isbn13: '', images: '', ebook_price: ''},
        factor: { isbn13:options.isbn },
        limit:"0,1"
      },
      //请求头
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        // res.data.result[0].title = res.data.result[0].title.substr(0, 10) + "..."
        res.data.result[0].average =Math.ceil(res.data.result[0].ebook_price / 4)
        that.setData({
          bookInfo: res.data.result[0]
        })

        wx.request({
          url: 'https://www.hqinfo.xyz/Server_Java/CloseConn'
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '无法连接数据库!请检查网络是否连接',
          showCancel: false,
          success: function (res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    });
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      modalHidden: true
    })
  },

 
/**
 * 购买电子书
 */
  wantBuy:function(){
    if(!this.data.loginFlag){
      wx.navigateTo({
        url: '../me/account/login'
      })
    }else{
      this.setData({
        modalHidden: false
      })
    }

  },

  /**
   * 获取输入
   */
  bindInput:function(e){
    email= e.detail.value
  },

  /**
   * 关闭弹出框
   */
  modalHide:function(){
    this.setData({
      modalHidden:true
    })
  },

  /**
   * 提交订单
   */
  submit:function(){
    var that = this
    var patt = /([\w\-]+\@[\w\-]+\.[\w\-]+)/;
    if(patt.test(email)){
      wx.navigateTo({
        url: 'function/pay?isbn=' + that.data.bookInfo.isbn13 + '&email=' + email + '&average=' + that.data.bookInfo.average
      })
    }else{
      wx.showToast({
        title: '请输入正确的邮箱格式',
        image: '../../img/icon/warn.png'
      })
      return;
    }
  },



  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 关闭提示
   */
  closeWarn:function(){
    this.setData({
      warnShow:false
    })
  }
})