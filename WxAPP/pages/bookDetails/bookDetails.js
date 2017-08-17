// pages/bookDetails/bookDetails.js 
var app = getApp();
var option = require('../../utils/infor.js');
function initSubMenuDisplay() {
  return 'hidden';
}

Page({
  data: {
    // loading
    hidden: false,
    // 页面配置
    winWidth: app.globalData.width,
    winHeight: app.globalData.winHeight,
    // tab切换
    currentTab: 0,
    //显示内容简介
    descripte: false,
    //显示的图书的信息：ISBN、书名等
    bookInfor: [],
    //若用户收藏或预约，则保存该数组内的图书信息:
    bookNeed:[],
    //是否有馆藏图书
    ownBook:true,
    // 是否有该馆借书证
    haveCard:true,
    // 是否可以继续借书
    isContinue:true,
    //馆藏图书在馆状态,无在馆则为空，在馆则显示索书号
    bookStatus:'',
    //馆藏图书
    bookOfLib: [],
    //下拉菜单显示
    subMenuDisplay: initSubMenuDisplay(),
    //登录状态
    loginFlag: app.cache.loginFlag || false,
    //预约图书
    reserveBook: app.cache.reserveBook || [],
    //自建书单
    bookShelf: app.cache.bookShelf || [],
    //功能栏
    funItem: option.BookAction,
    //评论区
    viewItem: []
  },



  /**
   * 加载数据,通过接收的ISBN请求链接获取图书信息
   */
  onLoad: function (query) {
    var that = this;
    //从豆瓣API获取图书的详细信息
    wx.request({
      url: 'http://localhost:8080/Server_Java/GetBooksInfo',
      data: {
        request: "isbn",
        ISBN: query.isbn
      },
      success: function (res) { 
        var newBookInfo = {
          "book_photo": res.data.images.large,
          "book_isbn": res.data.isbn13,
          "book_name": res.data.title,
          "book_author": res.data.author[0],
          "collectStatus":"dislike"
        }; 
        that.setData({
          bookInfo: res.data,
          bookNeed:newBookInfo
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
    // 判断是否超额预约
    this.isContinue();
    // 查询是否有借书资格
    this.isBookCard();
    //从图书馆获取图书馆藏情况
    this.collections(query.isbn)
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      loginFlag: app.cache.loginFlag,
      reserveBook: app.cache.reserveBook || [],
      bookShelf: app.cache.bookShelf || []
    })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    // 数据加载完成后 延迟隐藏loading
    setTimeout(function () {
      that.setData({
        hidden: true
      })
    }, 500);
  },


  /**
   * 相关书籍推荐
   */
  relevant: function () {
    var tags = this.data.bookInfo.tags;
    var index = app.getRandom(tags.length);//获取随机数
    var tag = tags[index].title;
    wx.navigateTo({
      url: 'relatedBooks?tag=' + tag
    })
  },


  /**
   * 获取馆藏情况
   */
  collections: function (isbn) {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/Server_Java/DbOperations',
      data: {
        dbName:"Library",
        table:"INFORMATION_BOOK",
        typeName:"inquire",
        field:{BookId:'',BooklistISBN:'',BookAddress:'',BookStatus:''},
        factor:{BooklistISBN:isbn}
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        var newBooks = res.data.result;
        if (newBooks.length == 0) {//当数组长度为0即无藏书时，显示无藏书
          that.setData({
            ownBook: false
          })
        } else {
          for (var i = 0; i < newBooks.length; i++) {
            var status =newBooks[i].BookStatus;
            if (status == "在馆") {
              that.setData({
                bookStatus: newBooks[i].BookId
              })
            }
          }
          that.setData({
            bookOfLib: res.data.result
          })
        }
      }
    })
  },


  /**
   * 查询借书资格
   */
  isBookCard:function(){
     var card = app.cache.BookCard || [];
     if(card.length){
        this.setData({
          haveCard:true
        })
     }else{
       for(var i=0;i<card.length;i++){
         if(card[i].library == app.globalData.G_selectLibrary){
          this.setData({
            haveCard:true
          })
         }
       }
     }
  },

  /**
   * 是否可以继续借书
   */
  isContinueTo:function (){
    var len = this.data.reserveBook.length;
    if(len>=2){
      this.setData({
        isContinue:false
      })
    }
  },



  /**
   * 查看馆藏情况
   */
  bookOfLibrary: function (e) {
    var newSubMenuDisplay = initSubMenuDisplay();
    if (this.data.subMenuDisplay == 'hidden') {
      newSubMenuDisplay = 'show';
    } else {
      newSubMenuDisplay = 'hidden';
    }
    this.setData({
      subMenuDisplay: newSubMenuDisplay
    })
  },



  /**
   * 收藏图书
   */
  addShelf: function () {
    var obj = this.data.bookShelf;//收藏记录
    this.data.bookNeed.collectStatus="like";
    obj[0].shelf_bookList.push(this.data.bookNeed)
    wx.showToast({
      title: '收藏成功',
      icon: 'success'
    })
    app.saveCache('bookShelf', this.data.bookShelf);
  },


  /**
  * 预约图书，登录后才能预定图书
  * 预约图书的时候需要选择取书时间
  */
  booking: function () {
    var that = this;

    var bookId = this.data.bookStatus;
    if (!this.data.loginFlag) {
      wx.showModal({
        title: '提示',
        content: '您还没有登录，无法使用此功能',
        cancelText: "拒绝",
        confirmText: '前往登录',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../me/account/login'
            })
          } else if (res.cancel) {
            return;
          }
        }
      })
    }else if(!this.data.haveCard){
      wx.showModal({
        title: '提示',
        content: '您没有该馆借书证，请在首页更换图书馆或者到该馆办理借书证',
        showCancel:false
      })
    }else if(!this.data.ownBook){
       wx.showToast({
         title: '该馆无此藏书',
         image: '../../img/icon/warn.png'
      })
    } else if (!this.data.isContinue){
        wx.showToast({
          title: '您预约的图书已超上限',
          image: '../../img/icon/warn.png'
        })
    }else if(bookId == ''){
      wx.showModal({
        title: '提示',
        content: '馆中已无藏书,若需继续预约请点击确定，我们将会在有藏书时通知您',
        success: function (res) {
          if (res.confirm) {
            var obj = that.data.reserveBook;
            that.data.bookNeed.bookId = bookId;
            that.data.bookNeed.bookAddress = app.globalData.G_selectLibrary;
            obj.push(that.data.bookNeed);
            wx.showToast({
              title: '预约完成，请注意查收推送信息',
              icon: 'success'
            })
            app.saveCache('reserveBook', that.data.reserveBook);
          } else if (res.cancel) {
            wx.showToast({
              title: '感谢您的支持！'
            })
          }
        }
      })
    }else{            
      var obj = that.data.reserveBook;
      that.data.bookNeed.bookId = bookId;
      that.data.bookNeed.bookAddress = app.globalData.G_selectLibrary;
      obj.push(that.data.bookNeed);
      wx.showToast({
        title: '请选择取书时间',
        icon:'success'
      })
      app.saveCache('reserveBook', that.data.reserveBook);
    }
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

//获取预约时间并保存
  bindDateChange:function(e){
    var obj = this.data.reserveBook;
    this.data.bookNeed.reserveTime = e.detail.value;
    obj.push(this.data.bookNeed);
    app.saveCache('reserveBook', this.data.reserveBook);
  },



  /**
   * 显示作者简介 
   */
  showDesc: function () {
    this.setData({
      descript: true
    })
  },

  /**
   * 隐藏作者简介 
   */
  hideDesc: function () {
    this.setData({
      descript: false
    })
  },


  /**
   * 进入图书订单界面
   */
  bookOrder: function () {
    wx.navigateTo({
      url: '../index/functions/bookOrder'
    })
  }



})