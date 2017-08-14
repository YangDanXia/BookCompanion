// pages/index/functions/bookOrder.js
var app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   // tab切换
    currentTab: 0,
   //屏幕高度
    winHeight: app.globalData.winHeight,
   //登录状态
    login: app.cache.loginFlag || false,
   //成功借了的书
    borrowBook: app.cache.borrowBook || [],
   //借书二维码内容
    borrowCode: app.cache.borrowCode || [],
   //预约图书,扫码的书和网上预约的都在这里
    reserveBook: app.cache.reservation || [],
   //借书历史
    borrowedBook: app.cache.borrowedBook || [],
    //收藏记录
    bookShelf: app.cache.bookShelf || []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.setData({
      login: app.cache.loginFlag || false,
      borrowBook: app.cache.borrowBook || [],
      reserveBook: app.cache.reservation || [],
      borrowedBook: app.cache.borrowedBook || []
    })
  },



  /**
   * 查看二维码
   */
  ViewQRcode: function (e) {
    var _type = e.currentTarget.dataset.id;
    if (_type == 'borrow') {
      var num = this.data.borrowCode.length;
      var content = this.data.borrowCode;
    } else if (_type == 'back') {
      var num = this.data.reserveBook.length;
      var content = this.data.reserveBook;
    }
    if (num == 0) {
      wx.showToast({
        title: '您还没有流通记录',
        image: '../../../img/icon/warn.png'
      })
      return;
    }
    wx.navigateTo({
      url: 'borrowProcess/QRcode?content=' +content
    })
  },




    /**
   * 滑动切换Tab
   */
  bindChange: function(e){
    this.setData({ 
      currentTab: e.detail.current 
    });
  },
    
  
  /**
   * 点击Tab切换
   */
  swichNav:function(e){
    if( this.data.currentTab === e.target.dataset.current ){  
      return false;
    }else{
      this.setData( {
         currentTab: e.target.dataset.current
      })
    }  
  },

  /**
 * 长按删除记录
 */
  delReserveBook: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    console.log(this.data.reserveBook)
    this.data.reserveBook.splice(index, 1);
    console.log(this.data.reserveBook)
    app.saveCache('reservation', this.data.reserveBook);
    wx.showToast({
      title: "删除成功",
      icon: 'success'
    });
    this.onShow()
  },


  /**
   * 收藏预约的图书
   */
  doReserveColllect:function(e){
   var index = e.currentTarget.dataset.index;
   var obj = this.data.bookShelf
   console.log(obj)
   var value = this.data.reserveBook[index].collectStatus
   if(value == "like"){
     this.data.reserveBook[index].collectStatus = "dislike"
   }else if(value == "dislike"){
     this.data.reserveBook[index].collectStatus = "like"
   }
   obj[0].detail.push(this.data.reserveBook[index])
   app.saveCache('bookShelf', this.data.bookShelf);
   app.saveCache('reservation', this.data.reserveBook);
   this.setData({
     reserveBook:this.data.reserveBook
   })
  },

 /**
  * 删除借阅记录
  */
  delBorrowBook: function (e) {
    var index = e.currentTarget.dataset.index; 
    this.data.borrowBook.splice(index, 1);
    console.log(this.data.borrowBook)
    app.saveCache('borrowBook', this.data.borrowBook);
    wx.showToast({
      title: "删除成功",
      icon: 'success'
    });
    this.onShow()
  },


  /**
 * 收藏在借的图书
 */
  doBorrowColllect: function (e) {
    var index = e.currentTarget.dataset.index;
    var obj = this.data.bookShelf
    var value = this.data.borrowBook[index].collectStatus
    if (value == "like") {
      this.data.borrowBook[index].collectStatus = "dislike"
    } else if (value == "dislike") {
      this.data.borrowBook[index].collectStatus = "like"
    }
    obj[0].detail.push(this.data.borrowBook[index])
    app.saveCache('bookShelf', this.data.bookShelf);
    app.saveCache('borrowBook', this.data.borrowBook);
    this.setData({
      borrowBook: this.data.borrowBook
    })
  },



  /**
   * 登录
   */
  doLogin:function(){
    wx.navigateTo({
      url: '../../me/account/login'
    })
  }

})