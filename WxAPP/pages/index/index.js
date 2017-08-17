//index.js
// const声明的变量不能被改变
const date = new Date()
const util = require('../../utils/util.js');
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
    //待借图书
    waitToBorrow: app.cache.waitToBorrow || [],

    //搜索历史，用于图书推荐
     historicalSearch: app.cache.historicalSearch || [],
    //图书导航栏内容
     bookTypeUp: option.BookNavigationUp,
     bookTypeDown: option.BookNavigationDown,
    //附近图书馆名称
     library: app.globalData.G_selectLibrary || ''
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    //所在图书馆
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.request({
          url: 'http://localhost:8080/Server_Java/GetMap',
          data:{
            latitude: res.latitude,
            longitude: res.longitude
          }, 
          header: {
            'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
          },
          method: 'GET',
          success: function (res) {
            console.log(res.data)
            that.setData({
              library:res.data.results[0].name
            })
            app.globalData.G_selectLibrary = res.data.results[0].name
          }


        })
      }
    })

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
      library:app.globalData.G_selectLibrary||'',
      waitToBorrow: app.cache.waitToBorrow || []
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
        url: 'http://localhost:8080/Server_Java/GetBooksInfo',
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
        url: 'http://localhost:8080/Server_Java/GetBooksInfo',
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
      url: 'http://localhost:8080/Server_Java/GetBooksInfo',
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
    wx.scanCode({
      success: (res) => {
        bookId = res.result;
        // 为防止重复借同一本书，在扫码后先检索此书是否已存在
        for(var i=0;i<that.data.waitToBorrow.length;i++){
          if(that.data.waitToBorrow[i].BookId == bookId){
            wx.showToast({
              title: "此书已在待借栏中",
              image: "../../img/icon/warn.png"
            })
            return false;
          }
        }
        wx.showModal({
            title: '提示',
            content: '确认要借此书吗？',
            success: function (res) {
            //  确认借书,从图书馆数据库获取本书的图书信息
              if (res.confirm) {
                wx.request({
                  url: 'http://localhost:8080/Server_Java/DbOperations',
                  data: {
                    dbName:"Library",
                    table:"V_INFORMATION_BOOKDETAIL",
                    typeName:"inquire",
                    field:{BookId:'',BooklistISBN:'',BooklistTitle:'',BooklistAuthor:'',BooklistPublish:'',BooklistImage:''},
                    factor:{BookId:bookId}
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
                  },
                  method: 'GET',
                  success:function(res){
                    if(res.data){
                      res.data.result[0].bookAddress = app.globalData.G_selectLibrary
                      res.data.result[0].collectStatus ="dislike"
                      that.data.waitToBorrow.push(res.data.result[0]);
                      app.saveCache('waitToBorrow', that.data.waitToBorrow);
                      wx.showToast({
                        title: '录入成功',
                        icon: 'success'
                      }) 
                    }
                  }
                })
              } else if (res.cancel) {
                return false;
              }
            }
          })

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
  }


})