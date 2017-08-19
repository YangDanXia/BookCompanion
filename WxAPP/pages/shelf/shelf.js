// pages/shelf/shelf.js
var app = getApp();

Page({
  data: {
    // loading
    hidden: false,
    // 页面配置
    winWidth: app.globalData.width,
    winHeight: app.globalData.winHeight,
    // tab切换
    currentTab: 0,
    imgUrls:
    [
      "http://www.hqinfo.xyz:8080/photo/book1.jpg",
      "http://www.hqinfo.xyz:8080/photo/book2.jpg",
      "http://www.hqinfo.xyz:8080/photo/book3.jpg",
      "http://www.hqinfo.xyz:8080/photo/book4.png"
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    //收藏的图书
    bookShelf: app.cache.bookShelf || []
  },



  /**
   * 加载数据,通过接收的ISBN请求链接获取图书信息
   */
  onLoad: function (query) {
    this.bookNum()
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      bookShelf: app.cache.bookShelf || []
    })
    this.bookNum()

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
   * 计算图书数量
   */
  bookNum:function(){
    var obj = this.data.bookShelf;
    for(var i=0;i<obj.length;i++){
      obj[i].bookNum = this.data.bookShelf[i].shelf_bookList.length
    }
    app.saveCache('bookShelf',obj )
    this.setData({
      bookShelf:obj
    })
  },

  /**
   * 删除书单
   */
   delBookShelf: function (e) {
    var index = e.currentTarget.dataset.index;
    if (index == 0) {
      wx.showToast({
        title: '请勿删除此书单',
        image: '../../img/icon/warn.png'
      })
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确认删除此书单吗？',
      success: function (res) {
        if (res.confirm) {
          this.data.bookShelf.splice(index, 1);
          var newBookShelf = this.data.bookShelf;
          app.saveCache('bookShelf', newBookShelf);
          wx.showToast({
            title: "删除成功",
            icon: 'success'
          });
          this.setData({
            bookShelf: newBookShelf
          })
        } else if (res.cancel) {
          return;
        }
      }
    })

  },

  /**
   * 查看图书详情
   */
   shelfDetail:function(e){
     var index = e.currentTarget.dataset.index;
     wx.navigateTo({
       url: 'functions/shelfDetails?index='+index,
     })
   }

})