// pages/shelf/functions/shelfDetails.js
var app = getApp();
var option = require('../../../utils/infor.js');
//书单序列号
var shelfIndex;
Page({

  /**
   * 页面的初始数据
   */
  data: {
   //是否隐藏加载显示
    loadHidden:false,
   //功能栏
    funItem: option.BookAction,
   //屏幕高度
    winHeight: app.globalData.winHeight,
    bookShelf: app.cache.bookShelf || []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    shelfIndex=options.index,
     this.setData({
       //书单内容
       bookShelfValue:app.cache.bookShelf[options.index]
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
        loadHidden: true
      })
    }, 500);
  },


  /**
   * 是否收藏图书
   */
   collectOrNot:function(e){
     var index = e.currentTarget.dataset.index;
     console.log("图书位置:"+index)
     console.log("书单"+this.data.bookShelf)
     var obj = this.data.bookShelf[shelfIndex].shelf_bookList
     console.log("书单内容："+obj)
     obj.splice(index, 1);
     console.log("修改后的书单"+this.data.bookShelf)
     app.saveCache('bookShelf', this.data.bookShelf);
     this.setData({
       bookShelfValue: obj
     })
   },

  /**
   *    添加图书到另外的书单
   */
  bindPickerChange:function(e){
    var index = e.currentTarget.dataset.index;
    var shelf_index = e.detail.value
    var currentShelf = this.data.bookShelf[shelfIndex]
    var selectShelf = this.data.bookShelf[shelf_index]
    selectShelf.shelf_bookList.push(currentShelf.shelf_bookList[index])
    app.saveCache('bookShelf', this.data.bookShelf);
  }


   
})