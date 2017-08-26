// pages/bookDetails/relatedBooks.js
var app = getApp();
Page({
  data: {
    // loading
    hidden: false,
    // 图书列表
    bookList: {},
    //是否隐藏网络异常
    errHidden: true,
    //屏幕高度
    winHeight: app.globalData.winHeight,
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: function (query) {
    console.log(query.way)
    if(query.way == 'relate'){
      this.getBooksList(query);
    }else if(query.way == 'find'){
      this.findBooksList(query);
    }

  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        hidden: true
      })
    }, 1000);
  },



  /**
   * 获取图书信息
   */
  getBooksList: function (query) {
    var table = query.table
    var tag = query.tag
    var that = this
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "gdou_book",
        table: table,
        typeName: "inquire",
        field: { title: '', author: '', isbn13: '', images: '', total_type: '', publisher: '', summary: '' },
        factor: { respect_type:tag },
        limit: "20,50"
      },
      //请求头
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        var obj = res.data.result
        for (var i = 0; i < obj.length; i++) {
          if (obj[i].title.length > 10) {
            obj[i].title = obj[i].title.substr(0, 16) + "..."
          }
        }
        that.setData({
          bookList: res.data.result
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
   * 通过搜索查找图书
   */
  findBooksList:function(query){
    // 查找的类型：作者、书名、出版社
    var table = query.table
    // 查找的内容
    var tag = query.tag
    var factorType;
    var that = this
    switch (table) {
      case "title":
        factorType = { title:tag};
        break;
      case "author":
        factorType = { author: tag };
        break;
      case "publisher":
        factorType = { publisher:tag };
        break;
      default:break;
    }
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "gdou_book",
        table: "all_books",
        typeName: "inquireLike",
        field: { title: '', author: '', isbn13: '', images: '', total_type: '', publisher: '', summary: '' },
        factor: factorType,
        limit: "0,50"
      },
      //请求头
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        var obj = res.data.result
        if(obj.length == 0){
          that.setData({
            errHidden: false
          })
          return false;
        }
        for (var i = 0; i < obj.length; i++) {
          if (obj[i].title.length > 10) {
            obj[i].title = obj[i].title.substr(0, 16) + "..."
          }
        }
        that.setData({
          bookList: res.data.result
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
   * 跳转页面
   */
  bookDetail:function(e){
    var isbn = e.target.dataset.isbn
    wx.redirectTo({
      url: 'bookDetails?isbn='+ isbn
    })
  }

})