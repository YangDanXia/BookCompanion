// pages/index/functions/bookOrder.js
var app =getApp()
// 二维码中图书内容
var codeValue = [];
// 二维码类型
var codeType;

Page({

  /**
   * 页面的初始数据
   */
  data: {
   // tab切换
    currentTab: 0,
   // 屏幕高度
    winHeight: app.globalData.winHeight,
   // 登录状态
   loginFlag: app.cache.loginFlag || false,
   // 待借图书
   waitToBorrow: app.cache.waitToBorrow || [],
   // 预约图书
   reserveBook: app.cache.reserveBook || [],
   // 待还图书
   waitToReturn:app.cache.waitToReturn|| [],
   // 收藏图书
   bookShelf:app.cache.bookShelf || [],
   //  是否能进行借还书
   isBookCard:false,
   // 借书证
   bookCard:app.cache.bookCard|| [],
  //  借书证选择器下标
   card_index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var array = [];
    var newBookCard = this.data.bookCard
    for (var i = 0; i < newBookCard.length;i++){
      array.push(newBookCard[i].library + "：" + newBookCard[i].uk_bookCardId)
    }
    this.setData({
      arrayCard:array
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      loginFlag: app.cache.loginFlag || false,
      waitToBorrow: app.cache.waitToBorrow || [],
      reserveBook: app.cache.reserveBook || [],
      waitToReturn: app.cache.waitToReturn || []
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
   * 选择要借/还的书
   */
  checkboxChange: function(e) {
    console.log("图书选择情况:" + e.detail.value)
    codeValue =  e.detail.value;
    if (codeValue.length == 0) {
      wx.showToast({
        title: '请至少选择一本书',
        image: '../../../img/icon/warn.png'
      })
      return false;
    };
    if (codeValue.length > 2) {
      wx.showToast({
        title: '每次只能选择两本图书',
        image: '../../../img/icon/warn.png'
      })
      return false;
    };
    this.setData({
      isBookCard: true
    })

  },

  // 选择借书证,在点击确认时跳转至二维码界面
  bindPickerChange: function (e) {
    var index = e.detail.value
    this.setData({
      card_index:index
    })

    var cardNum = this.data.bookCard[index].uk_bookCardId
    var content = [codeValue.length, cardNum];
    if (codeType == 'borrow') {
      console.log("类型为借书")
      content.push(codeValue)
    } else if (codeType == 'back') {
    }
    console.log("二维码内容："+content)
    wx.navigateTo({
      url: 'borrowProcess/QRcode?content=' +content
    })

  },


  /**
   * 查看二维码
   */
  viewQRcode:function(e){
    codeType = e.currentTarget.dataset.id;
    if (codeValue.length == 0) {
      wx.showToast({
        title: '请至少选择一本书',
        image: '../../../img/icon/warn.png'
      })
      return false;
    };

    var card = app.cache.bookCard || [];
    if (card.length == 0) {
      wx.showToast({
        title: '目前没有借书证可以使用，请前往前台办理借书证',
        image: '../../../img/icon/warn.png'
      })
    }
  },


  /**
   * 收藏预约的图书
   */
  reserveCollect:function(e){
   var index = e.currentTarget.dataset.index;
  //  书单
   var obj = this.data.bookShelf
  //  预约的图书
   var rese = this.data.reserveBook
  //  收藏状态
   var value = this.data.reserveBook[index].collectStatus
   if(value == "like"){
     rese[index].collectStatus = "dislike"
   }else if(value == "dislike"){
     rese[index].collectStatus = "like"
   }
   obj[0].shelf_bookList.push(rese[index])
   app.saveCache('bookShelf', this.data.bookShelf);
   app.saveCache('reserveBook', rese);
   this.setData({
     reserveBook:rese
   })
  },


  /**
 * 收藏待借的图书
 */
  borrowCollect: function (e) {
      // 待借栏中第几本书
      var index = e.currentTarget.dataset.index;
      var obj = this.data.bookShelf
      var bor = this.data.waitToBorrow
      var bookList = obj[0].shelf_bookList
      // 书单内容中第几本书
      var location;
      for (var i = 0;i < bookList.length;i++){
        if (bookList[i].BooklistISBN == bor[index].BooklistISBN ){
           location = i;
        }
      }
      var value = bor[index].collectStatus
      if (value == "like") {
        bor[index].collectStatus = "dislike"
        bookList.splice(location, 1);
      } else if (value == "dislike") {
        bor[index].collectStatus = "like"
        bookList.push(bor[index])
      }
      // obj[0].shelf_bookList.push(bor[index])
      app.saveCache('bookShelf',obj);
      app.saveCache('waitToBorrow', bor);
      this.setData({
        waitToBorrow: bor
      })
    },

  /**
   * 收藏待还的图书
   */
  returnCollect:function(e){
      var index = e.currentTarget.dataset.index;
      var obj = this.data.bookShelf
      var ret = this.data.waitToReturn
      var value = this.data.waitToReturn[index].collectStatus
      if (value == "like") {
        ret[index].collectStatus = "dislike"
      } else if (value == "dislike") {
        ret[index].collectStatus = "like"
      }
      obj[0].shelf_bookList.push(ret[index])
      app.saveCache('bookShelf', this.data.bookShelf);
      app.saveCache('waitToReturn', ret);
      this.setData({
        waitToReturn: ret
      })
    },


 /**
  * 删除待借图书
  */
  borrowDelete: function (e) {
    var index = e.currentTarget.dataset.index; 
    var obj = this.data.waitToBorrow
    obj.splice(index, 1);
    app.saveCache('waitToBorrow',obj);
    wx.showToast({
      title: "删除成功",
      icon: 'success'
    });
    this.onShow()
  },

  /**
   * 删除预约图书
   */
  reserveDelete: function (e) {
    var index = e.currentTarget.dataset.index;
    var obj = this.data.reserveBook
    obj.splice(index, 1);
    app.saveCache('reserveBook', obj);
    wx.showToast({
      title: "删除成功",
      icon: 'success'
    });
    this.onShow()
  },


  /**
   * 获取时间
   */
  getTime: function () {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return year + '-' + month + '-' + day;
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