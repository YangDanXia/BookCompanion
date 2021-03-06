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
     winWidth: app.globalData.width,
     winHeight: app.globalData.winHeight,
    //待借图书
    waitToBorrow: app.cache.waitToBorrow || [],
    //搜索历史，用于图书推荐
    historySearch: app.cache.historySearch || [],
    //图书导航栏内容
     bookTypeUp: option.BookNavigationUp,
     bookTypeDown: option.BookNavigationDown,
    //附近图书馆名称
     library: app.globalData.G_selectLibrary || '',
     // 收藏情况
     bookShelf: app.cache.bookShelf || []
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
        app.globalData.latitude = res.latitude
        app.globalData.longitude = res.longitude
        wx.request({
          url: 'https://www.hqinfo.xyz/Server_Java/GetMap',
          data:{
            latitude: res.latitude,
            longitude: res.longitude
          }, 
          header: {
            'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
          },
          method: 'GET',
          success: function (res) {
            app.globalData.G_Libraries = res.data.result
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
    var time = this.getTime()
    var days = app.cache.everyDay ||[]
    if(days != time){
      this.DailyRecommend();
      app.saveCache("everyDay",time)
    }
  },


  /**
   * 每日推荐模块
   */
  DailyRecommend: function () {
    var that = this
    //历史搜索记录
    var search = app.cache.historySearch||[]
    var history_length =search.length;
    if (history_length == 0) {
      wx.request({
        url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
        data:
        {
          dbName: "gdou_book",
          table: "biography",
          typeName: "inquire",
          field: { title: '', author: '', isbn13: '', images: '', total_type: ''},
          factor: { respect_type: "人文-社会学家" },
          limit:"0,6"
        },
        //请求头
        header: {
          'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        method: 'GET',
        success: function (res) {
          var obj = res.data.result
          for (var i = 0; i < obj.length; i++) {
            if(obj[i].title.length>10){
              obj[i].title = obj[i].title.substr(0, 8) + "..."
            }
            if (obj[i].author.length > 10){
              obj[i].author = obj[i].author.substr(0, 8) + "..."
            }
          }
          that.setData({
            recommendItems: res.data.result
          })
        },
        fail: function (res) {
          that.setData({
            errHidden: false
          })
        }
      })
    } else {
      //随机抽取历史记录
      var re_index = app.getRandom(history_length);
      var re_tag = app.cache.historySearch[re_index];
      var factorType;
      switch (re_tag.val_type) {
        case "title":
          factorType = { title: re_tag.input };
          break;
        case "author":
          factorType = { author: re_tag.input };
          break;
        case "publisher":
          factorType = { publisher: re_tag.input};
          break;
        default: break;
      }
      wx.request({
        url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
        data:
        {
          dbName: "gdou_book",
          table: "all_books",
          typeName: "inquireLike",
          field: { title: '', author: '', isbn13: '', images: '', total_type: '' },
          factor: factorType,
          limit: "30,6"
        },
        //请求头
        header: {
          'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        method: 'GET',
        success: function (res) {
          var obj = res.data.result
          for (var i = 0; i < obj.length; i++) {
            if (obj[i].title.length > 10) {
              obj[i].title = obj[i].title.substr(0, 8) + "..."
            }
            if (obj[i].author.length > 10) {
              obj[i].author = obj[i].author.substr(0, 8) + "..."
            }
          }
          that.setData({
            recommendItems: res.data.result
          })
        },
        fail: function (res) {
          that.setData({
            errHidden: false
          })
        }
      })
    }
  },


  /**
   * 新书推荐模块
   */
  newBooks: function () {

    var that = this
    var index = app.getRandom(20);
    wx.request({
      url:'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "gdou_book",
        table: "all_books",
        typeName: "inquire",
        field: { title: '', author: '', isbn13: '', images: '', total_type: '' },
        factor: { pubdate: "2017-01-01", respect_type:"古代言情"},
        limit: "0,6"
      },
      //请求头
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success:function(res){
        var obj = res.data.result
        for (var i = 0; i < obj.length; i++) {
          if (obj[i].title.length > 10) {
            obj[i].title = obj[i].title.substr(0, 8) + "..."
          }
          if (obj[i].author.length > 10) {
            obj[i].author = obj[i].author.substr(0, 8) + "..."
          }
        }
        that.setData({
          commendItems: res.data.result
        })
        wx.request({
          url: 'https://www.hqinfo.xyz/Server_Java/CloseConn'
        })
      },
      fail: function (res) {
        that.setData({
          errHidden: false
        })
      }
    })
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
                  url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
                  data: {
                    dbName:"Library",
                    table:"V_INFORMATION_BOOKDETAIL",
                    typeName:"inquire",
                    field: {BookId:'',BooklistISBN:'',BooklistTitle:'',BooklistAuthor:'',BooklistImage:'',BooklistPublish:''},
                    factor: { BookId:bookId},
                    limit:"10"
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
                  },
                  method: 'GET',
                  success:function(res){
                    if(res.data == "error"){
                      wx.showToast({
                        title: "系统故障，请稍后重试",
                        image: "../../img/icon/warn.png"
                      })
                    }else{
                      res.data.result[0].bookAddress = app.globalData.G_selectLibrary
                      res.data.result[0].collectStatus = "dislike"
                      that.data.waitToBorrow.push(res.data.result[0]);
                      app.saveCache('waitToBorrow', that.data.waitToBorrow);
                      wx.showToast({
                        title: '录入成功',
                        icon: 'success'
                      }) 
                    }
                  }
                })
                wx.request({
                  url: 'https://www.hqinfo.xyz/Server_Java/CloseConn'
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
  },

  /**
 * 获取时间
 */
  getTime: function () {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return year + '-' + month + '-' + day;
  }

})