// pages/bookDetails/bookDetails.js 
var app = getApp();
// 功能栏信息
var option = require('../../utils/infor.js');
// 通用的图书信息
var bookNeedInfo = [];
// 图书类型
var total_type;
var query;
//图书进一步类型
var respect_type;

// 展开或收起
function initSubMenuDisplay() {
  return 'hidden';
}
const date = new Date()
Page({
  data: {
  // 是否隐藏加载情况
  hidden:false,
  winWidth: app.globalData.width,
  winHeight: app.globalData.winHeight,
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
  sum_isDescripte: false,
  // 是否显示作者简介
  intro_isDescripte: false,
  // 在馆图书索书号
  bookId:'',
  // 保存图书馆藏情况
  bookOfLib:[],
  // 推荐内容
  bookThumbs: ['http://www.hqinfo.xyz:8080/photo/girl.jpg'],
  // 浏览记录
  browsingHistory: app.cache.browsingHistory||[]
  },

  onLoad: function (options) {
    var that = this;
    query = options
    this.getTime()
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "gdou_book",
        table: "all_books",
        typeName: "inquire",
        field: { title: '', author: '', isbn13: '', images: '', total_type: '', pubdate: '', publisher: '', price: '', ebook_price: '', summary: '', respect_type: '', pre_price: '' },
        factor: { isbn13:options.isbn },
        limit:"0,1"
      },
      //请求头
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        total_type = res.data.result[0].total_type
        respect_type = res.data.result[0].respect_type
        bookNeedInfo = {
          "book_photo": res.data.result[0].images,
          "book_isbn": res.data.result[0].isbn13,
          "book_name": res.data.result[0].title.substr(0, 16) + "...",
          "book_author": res.data.result[0].author,
          "collectStatus": "dislike"
        };
        res.data.result[0].title = res.data.result[0].title.substr(0, 10) + "..."
        console.log("图书信息")
        console.log(res.data.result[0])
        that.setData({
          bookInfo: res.data.result[0]
        })
        that.setData({
          transData:res.data
        })
 
        wx.request({
          url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
          data:
          {
            dbName: "gdou_book",
            table: total_type,
            typeName: "inquire",
            field: { isbn13: '', images: ''},
            factor: { respect_type: respect_type },
            limit:"10,6"
          },
          //请求头
          header: {
            'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
          },
          method: 'GET',
          success: function (res) {
            console.log(res.data)
            console.log(res.data.result[0])
            that.setData({
              sameBook: res.data.result
            })
          }
        });
        that.browsHistroy();   
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
    // this.toQualify();
    // this.libraryBook(options.isbn);
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
   this.setData({
     loginFlag: app.cache.loginFlag || false
   })
   this.toQualify();
   this.libraryBook(query.isbn);
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
    var card = app.cache.bookCard || [];
      for (var i = 0; i < card.length; i++) {
        console.log(card[i].library)
        // if (card[i].library == app.globalData.G_selectLibrary) {
        if (card[i].library == '广东海洋大学图书馆') {         
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
   * 保存浏览记录
   */
  browsHistroy:function(){
    // 浏览记录
    var obj = this.data.browsingHistory;
    // 浏览次数
    if (obj.length == 0){
      bookNeedInfo.brows_time = 1
      obj.push(bookNeedInfo)
      app.saveCache("browsingHistory", obj);
      return false;
    }
    for (var i = 0; i < obj.length; i++) {
      if (obj[i].book_isbn == bookNeedInfo.book_isbn) {
        obj[i].brows_time = obj[i].brows_time + 1;
        app.saveCache("browsingHistory", obj);
        return false;
      }
   }
    bookNeedInfo.brows_time = 1
    obj.push(bookNeedInfo)
    app.saveCache("browsingHistory", obj);

},

  /**
   * 查看图书馆馆藏情况
   */
  libraryBook:function(isbn){
    var that = this;
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data: {
        dbName: "Library",
        table: "INFORMATION_BOOK",
        typeName: "inquire",
        field: { BookId: '', BooklistISBN: '', BookAddress: '', BookStatus: ''},
        factor: { BooklistISBN: isbn},
        limit:"10"
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        console.log("馆藏情况：")
        console.log(res.data)
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
        wx.request({
          url: 'https://www.hqinfo.xyz/Server_Java/CloseConn'
        })
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
  intro_showDesc: function () {
    this.setData({
      intro_isDescripte: true
    })
  },

  /**
   * 隐藏作者简介 
   */
  intro_hideDesc: function () {
    this.setData({
      intro_isDescripte: false
    })
  },

  /**
 * 显示内容简介 
 */
  sum_showDesc: function () {
    this.setData({
      sum_isDescripte: true
    })
  },

  /**
   * 隐藏内容简介 
   */
  sum_hideDesc: function () {
    this.setData({
      sum_isDescripte: false
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
    wx.navigateTo({
      url: 'relatedBooks?tag=' + respect_type + '&table=' + total_type +'&way=relate'
    })
  },


  /**
   * 收藏图书
   */
  addBookToShelf: function () {
    var obj = app.cache.bookShelf;//收藏记录
    var len = obj[0].shelf_bookList.length
    if (len == 0){
      console.log("没有书")
      bookNeedInfo.collectStatus = "like"
      obj[0].shelf_bookList.push(bookNeedInfo)
      wx.showToast({
        title: '收藏成功',
        icon: 'success'
      })
      app.saveCache('bookShelf', obj);
      return false;
    }else{
      for (var i = 0; i <len; i++) {
        if (obj[0].shelf_bookList[i].book_isbn == bookNeedInfo.book_isbn ) {
          wx.showToast({
            title: '已有收藏',
            image: '../../img/icon/warn.png'
          })
          return false;
        }
      } 
    }
      bookNeedInfo.book_name = bookNeedInfo.book_name.substr(0, 16) + "..."
      bookNeedInfo.collectStatus= "like"
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

    if (this.data.isBookIn){
      wx.showToast({
        title: '请选择取书时间',
        icon: 'success'
      })
    }else{
      wx.showToast({
        title: '图书馆已无在馆图书，若需借阅，请留意',
        image: '../../img/icon/warn.png'
      })
    }
  },


  //获取预约时间并保存
  bindDateChange: function (e) {
    var that = this;
    var obj = app.cache.reserveBook || [];
    bookNeedInfo.book_name = bookNeedInfo.book_name.substr(0,10);
    bookNeedInfo.bookId = that.data.bookId;
    bookNeedInfo.bookAddress = app.globalData.G_selectLibrary;
    bookNeedInfo.reserveTime = e.detail.value;
    bookNeedInfo.reserveTime = e.detail.value;
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName:"Library",
        table:"RECORD_RESERVATION",
        typeName:"insert",
        field: {UserId: app.cache.userInfo.phone, ReservationGiveTime: e.detail.value, BookId: that.data.bookId, BooklistISBN:bookNeedInfo.book_isbn},
        factor:{}
      }, 
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success:function(res){
         console.log(res.data)
         obj.push(bookNeedInfo);
         app.saveCache('reserveBook',obj);
         wx.showToast({
          title: '预约成功',
          icon: 'success'
        })
      },
      fail: function (res) {
        wx.showToast({
          title: "网络异常",
          image: "../../img/icon/warn.png"
        })
      }
    })
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "WxApp",
        table: "booking_record",
        typeName: "insert",
        field: { idx_phone: app.cache.userInfo.phone, 
        book_takeTime: e.detail.value, 
        book_id: that.data.bookId, 
        book_isbn: bookNeedInfo.book_isbn,
        book_photo: bookNeedInfo.book_photo,
        book_name: bookNeedInfo.book_name,
        book_author: bookNeedInfo.book_author,
        book_library: app.globalData.G_selectLibrary
        },
        factor: {}
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        obj.push(bookNeedInfo);
        app.saveCache('reserveBook', obj);
        wx.showToast({
          title: '预约成功',
          icon: 'success'
        })
      },
      fail: function (res) {
        wx.showToast({
          title: "网络异常",
          image: "../../img/icon/warn.png"
        })
      }
    })

  },

  /**
   * 凑单买书
   */
  bookBuy:function(){
    var info = this.data.bookInfo
    if (info.ebook_price<5){
      wx.showToast({
        title: "低于5元的电子书不参与活动",
        image: "../../img/icon/warn.png"
      })
    }else{
      wx.navigateTo({
        url: 'bookBuy?isbn=' + info.isbn13 + '&table=' + total_type
      })
    }
  },

  onReachBottom: function () {
    // Do something when page reach bottom.
  },

  /**
  * 获取时间
  */
  getTime: function () {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    this.setData({
      today: year + '-' + month + '-' + day
    })
  }

})