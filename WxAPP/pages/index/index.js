//index.js
// const声明的变量不能被改变
const date = new Date()
const util = require('../../utils/util.js');
var map = require('../../libs/bmap-wx.min.js');
var option = require('../../utils/infor.js')
var wxMarkerData = [];
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // loading
     loadhidden: false,
    //是否隐藏网络异常：
     errHidden: true,
    //借书栏内的书
     borrowBook: app.cache.borrowBook || [],
    //借书二维码的内容
     borrowCode:app.cache.borrowCode||[],
    //预约栏内的书
     reserveBook: app.cache.reservation || [],
    //搜索历史
     historicalSearch: app.cache.historicalSearch || [],
    //图书导航栏
     bookTypeUp: option.BookNavigationUp,
     bookTypeDown: option.BookNavigationDown,
    //附近图书馆名称
     library: app.cache.selectLibrary || '',
    //百度API的密钥
     ak: "qYrgL0YUKKmtx2zej6zG33iOdMIoQUGE"
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    //获附近图书馆 
    var BMap = new map.BMapWX({
      ak: that.data.ak
    });
    var success = function (data) {
      wxMarkerData = data.wxMarkerData;
      that.setData({
        library: wxMarkerData[0].title
      });
      //保存图书馆的选择
      app.saveCache('selectLibrary', that.data.library);
    }
    //找到附近地点
      BMap.search({
        "query": '图书馆',
        success: success
     });

    //每日推荐
    that.DailyRecommend();
    //最近更新
    that.newBooks();
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    // 数据加载完成后 延迟隐藏loading
    setTimeout(function () {
      that.setData({
        loadhidden: true
      })
    }, 500);
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.setData({
      library:app.cache.selectLibrary||'',
      borrowBook: app.cache.borrowBook || []
    })
  },


  /**
   * 每日推荐模块
   */
  DailyRecommend: function () {
    var that = this
    //获取随机数
    var index = app.getRandom(20);
    //历史搜索记录
    var history_length = this.data.historicalSearch.length;
    if (history_length == 0) {
      wx.request({
        url: 'http://localhost:8080/Library_WxApp/GetBooksInfo',
        data: {
          request: "tag",
          tag: "计算机",
          start: '11',
          count: "6"
        },
        success: function (res) {
          that.setData({
            recommendItems: res.data.books 
          })
        },
        fail: function (res) {
          that.setData({
            errHidden: false
          })
        }
      });
    } else {
      //随机抽取历史记录
      var re_index = app.getRandom(history_length);
      var re_tag = this.data.historicalSearch[re_index];

      wx.request({
        url: 'http://localhost:8080/Library_WxApp/GetBooksInfo',
        data: {
          request: "tag",
          tag: re_tag,
          start: re_index,
          count: "6"
        },
        success: function (res) {
          that.setData({
            recommendItems: res.data.books,//推荐图书列表
          })
        },
        fail: function (res) {
          that.setData({
            errHidden: false
          })
        }
      });
    }
  },


  /**
   * 新书推荐模块
   */
  newBooks: function () {
    var that = this
    var index = app.getRandom(20);
    wx.request({
      url: 'http://localhost:8080/Library_WxApp/GetBooksInfo',
      data: {
        request: "tag",
        tag: "语言",
        start: index,
        count: "6"
      },
      success: function (res) {
        that.setData({
          commendItems: res.data.books
        })
      },
      fail: function (res) {
        that.setData({
          errHidden: false
        })
      }
    });
  },



  /**
   * 条形码扫描
   */
  ScanCode: function (e) {
    var that = this;
    var bookId;
    var qualify =true; 
    if (that.data.borrowBook.length >= 2) {
        qualify= false
    }
    console.log(qualify)
    console.log(that.data.borrowBook.length)
    wx.scanCode({
      success: (res) => {
        console.log(res)
        bookId = res.result;
        if (!qualify) {
          wx.showToast({
            title: '每人每次只允许借两本书，您可选择删除借书栏内的图书或者下次再借',
            image: '../../img/icon/warn.png'
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '确认要借此书吗？',
            success: function (res) {
              if (res.confirm) {
                wx.request({
                  url: 'http://localhost:8080/Library_WxApp/DBOperations',
                  data: {
                    request: "get_bookmsg_2",
                    bookId:bookId
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
                  },
                  method: 'POST',
                  success:function(res){
                    res.data.book[0].bookAddress = app.cache.selectLibrary
                    res.data.book[0].collectStatus ="dislike"
                    res.data.book[0].borrowTime = that.getTime()
                    console.log(res.data.book[0].borrowTime)
                    that.data.borrowBook.push(res.data.book[0]);
                    app.saveCache('borrowBook', that.data.borrowBook)
                  }
                })
                that.data.borrowCode.push(bookId);
                wx.showToast({
                  title: '录入成功',
                  icon: 'success'
                }) 

                app.saveCache('borrowCode', that.data.borrowCode)
                
              } else if (res.cancel) {
                return false;
              }
            }
          })
        }
      }
    })

  },


  /**
   * 进入搜索界面
   */
  search: function () {
    wx.navigateTo({
      url: 'functions/search'
    })
  },



  /**
  * 查看附近图书馆
  */
  chooseLibrary: function () {
    wx.navigateTo({
      url: 'functions/library'
    })
  },


  /**
   * 进入图书订单界面
   */
  bookOrder:function(){ 
    wx.navigateTo({
      url: 'functions/bookOrder'
    })
  },

  /**
   * 获取时间
   */
  getTime:function(){
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      return year+'-'+month+'-'+day;
  }



})