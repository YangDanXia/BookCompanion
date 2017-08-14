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
    //书的信息：ISBN、书名等
    bookInfor: [],
    //需要保持的图书信息:
    bookNeed:[],
    //馆藏图书状态
    ownBook: true,
    //馆藏图书在馆状态
    bookStatus:'',
    //馆藏图书
    bookOfLib: [],
    //下拉菜单显示
    subMenuDisplay: initSubMenuDisplay(),
    //登录状态
    login: app.cache.loginFlag || false,
    //预约记录
    reserveBook: app.cache.reservation || [],
    //收藏记录
    bookShelf: app.cache.bookShelf || [],
    //功能栏
    funItem: option.BookAction,
    //评论区
    viewItem: [],
    //是否隐藏预约确认弹窗
    confirmHidden:true,
    //选择时间
    timeSelect:true
  },



  /**
   * 加载数据,通过接收的ISBN请求链接获取图书信息
   */
  onLoad: function (query) {
    var that = this;
    //从豆瓣API获取图书的详细信息
    wx.request({
      url: 'http://localhost:8080/Library_WxApp/GetBooksInfo',
      data: {
        request: "isbn",
        ISBN: query.isbn
      },
      success: function (res) { 
        var newBookInfo = {
          "img": res.data.images.large,
          "isbn": res.data.isbn13,
          "title": res.data.title,
          "author": res.data.author[0],
          "publisher": res.data.publisher,
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
    //从图书馆获取图书馆藏情况
    this.collections(query.isbn)
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      login: app.cache.loginFlag,
      reserveBook: app.cache.reservation || [],
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
    console.log(isbn)
    wx.request({
      url: 'http://localhost:8080/Library_WxApp/DBOperations',
      data: {
        request: "get_bookmsg_1",
        BooklistISBN: isbn
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'POST',
      success: function (res) {
        var newBooks = res.data.books;
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
            bookOfLib: res.data.books
          })
        }
      }
    })
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
    console.log(obj)
    obj[0].detail.push(this.data.bookNeed)
    wx.showToast({
      title: '收藏成功',
      icon: 'success'
    })
    app.saveCache('bookShelf', this.data.bookShelf);
  },


  /**
  * 预约图书，登录后才能预定图书
  */
  booking: function () {
    var that = this;
    var res_len = this.data.reserveBook.length;
    var bookId = this.data.bookStatus;
    if (!this.data.login) {
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
    }else if(!this.data.ownBook){
       wx.showToast({
         title: '该馆无此藏书',
         image: '../../img/icon/warn.png'
      })
    } else if (res_len == 2){
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
            that.data.bookNeed.bookAddress = app.cache.selectLibrary;
            obj.push(that.data.bookNeed);
            wx.showToast({
              title: '预约完成，请注意查收推送信息',
              icon: 'success'
            })

            app.saveCache('reservation', that.data.reserveBook);
          } else if (res.cancel) {
            wx.showToast({
              title: '感谢您的支持！'
            })
          }
        }
      })
    }else{

      that.setData({
        timeSelect: false,
        confirmHidden: false
      })

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

//获取时间
  bindDateChange:function(e){
    var obj = this.data.reserveBook;
    this.data.bookNeed.bookId = this.data.bookStatus;
    this.data.bookNeed.bookAddress = app.cache.selectLibrary;
    this.data.bookNeed.reserveTime = e.detail.value;
    obj.push(this.data.bookNeed);
    app.saveCache('reservation', this.data.reserveBook);
  },


  /**
   *选择预约时间
   */
  timeSelect: function (e) {
    this.setData({
      timeSelect: true,
      confirmHidden: true
    })
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