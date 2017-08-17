// pages/bookDetails/bookDetails.js 
var app = getApp();
// 功能栏信息
var option = require('../../utils/infor.js');
// 需要保存的图书信息
var bookNeedInfo = [];
// 展开或收起
function initSubMenuDisplay() {
  return 'hidden';
}

Page({
  data: {
  // 是否隐藏加载情况
  hidden:false,
  // 登录状态
  loginFlag: app.cache.loginFlag || false,
  // 页面配置
  winWidth: app.globalData.width,
  winHeight: app.globalData.winHeight,
  // 显示的菜单栏下标
  currentTab:0,
  // 显示的图书信息
  bookInfo:[],
  // 功能栏按钮
  funItem: option.BookAction,
  // 馆藏情况显示
  subMenuDisplay: initSubMenuDisplay(),
  // 是否有该馆借书证
  isBookCard:false,
  // 图书馆是否有藏书
  isHaveBook:false,
  // 是否有图书在馆
  isBookIn:false,
  // 是否可以借书
  isReserve:true,
  // 是否显示内容简介
  isDescripte: false,
  // 在馆图书索书号
  bookId:'',
  // 保存图书馆藏情况
  bookOfLib:[]
  },

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/Server_Java/GetBooksInfo',
      data: {
        request: "isbn",
        // ISBN: options.isbn
        ISBN: "9787121221248"
      },
      success: function (res) {
        bookNeedInfo = {
          "book_photo": res.data.images.large,
          "book_isbn": res.data.isbn13,
          "book_name": res.data.title,
          "book_author": res.data.author[0],
          "collectStatus": "dislike"
        };
        that.setData({
          bookInfo: res.data
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
    this.toQualify();
    this.libraryBook();
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

  onShow: function () {
    // Do something when page show.
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
   * 预约图书资格判断
   */
  toQualify:function(){
    var card = app.cache.BookCard || [];
      for (var i = 0; i < card.length; i++) {
        if (card[i].library == app.globalData.G_selectLibrary) {
          this.setData({
            isBookCard: true
          })
        }
      }

      var reserve = app.cache.reserveBook ||[];
      if (reserve.length>=2){
        this.setData({
          isReserve:false
        })
      }
  },

  /**
   * 查看图书馆馆藏情况
   */
  libraryBook:function(){
    var that = this;
    wx.request({
      url: 'http://localhost:8080/Server_Java/DbOperations',
      data: {
        dbName: "Library",
        table: "INFORMATION_BOOK",
        typeName: "inquire",
        field: { BookId: '', BooklistISBN: '', BookAddress: '', BookStatus: ''},
        factor: { BooklistISBN: "9787121221248"}
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        var bookDetails = res.data.result;
        that.setData({
          bookOfLib: res.data.result
        })
        for (var i = 0; i < bookDetails.length; i++) {
          var status = bookDetails[i].BookStatus;
          that.setData({
            isHaveBook: true
          })
          if (status == "在馆") {
            that.setData({
              isBookIn:true,
               bookId: bookDetails[i].BookId //在馆图书的索书号
            })
          }
        }
      }
    })
  },

  /**
   * 进入图书订单界面
   */
  bookOrder: function () {
    wx.navigateTo({
      url: '../index/functions/bookOrder'
    })
  },

  /**
   * 显示作者简介 
   */
  showDesc: function () {
    this.setData({
      isDescripte: true
    })
  },

  /**
   * 隐藏作者简介 
   */
  hideDesc: function () {
    this.setData({
      isDescripte: false
    })
  },

  /**
   * 显示馆藏情况
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
   * 收藏图书
   */
  addBookToShelf: function () {
    var obj = app.cache.bookShelf;//收藏记录
    bookNeedInfo.collectStatus = "like";
    obj[0].shelf_bookList.push(bookNeedInfo)
    wx.showToast({
      title: '收藏成功',
      icon: 'success'
    })
    app.saveCache('bookShelf', obj);
  },

  /**
   * 预约图书，登录后才能预定图书
   * 预约图书的时候需要选择取书时间
   */
  booking:function(){
    var that = this;
    if(!this.data.loginFlag){
      wx.navigateTo({
        url: '../me/account/login'
      })
      return false;
    };
    if(!this.data.isBookCard){
      wx.showModal({
        title: '提示',
        content: '您没有该馆借书证，请在首页更换图书馆或者到该馆办理借书证',
        showCancel: false
      })
      return false;
    };
    if(!this.data.isReserve){
      wx.showToast({
        title: '您的图书数量已超上限',
        image: '../../img/icon/warn.png'
      })
      return false;
    };
    if (!this.data.isHaveBook){
      wx.showToast({
        title: '该馆无此藏书',
        image: '../../img/icon/warn.png'
      })
      return false;
    };
    var obj = app.cache.reserveBook;
    that.data.bookNeedInfo.bookId = that.data.bookId;
    that.data.bookNeedInfo.bookAddress = app.globalData.G_selectLibrary;
    obj.push(that.data.bookNeedInfo);
    if (this.data.isBookIn){
      wx.showToast({
        title: '请选择取书时间',
        icon: 'success'
      })
      app.saveCache('reserveBook', obj);
    }else{
      wx.showModal({
        title: '提示',
        content: '馆中已无藏书,若需继续预约请点击确定，我们将会在有藏书时通知您',
        success: function (res) {
          if (res.confirm) {
            wx.showToast({
              title: '预约完成，请注意查收推送信息',
              icon: 'success'
            })
            app.saveCache('reserveBook',obj);
          } else if (res.cancel) {
            wx.showToast({
              title: '感谢您的支持！'
            })
          }
        }
      })
    }
  },


  //获取预约时间并保存
  bindDateChange: function (e) {
    var obj = app.cache.reserveBook;
    this.data.bookNeedInfo.reserveTime = e.detail.value;
    obj.push(this.data.bookNeedInfo);
    app.saveCache('reserveBook',obj);
  },








})