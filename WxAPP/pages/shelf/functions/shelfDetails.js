// pages/shelf/functions/shelfDetails.js
var app = getApp();
//书单序列号
var shelfIndex;
Page({

  /**
   * 页面的初始数据
   */
  data: {
   //是否隐藏加载显示
    loadHidden:false,
   //屏幕高度
    winHeight: app.globalData.winHeight,
    bookShelf: app.cache.bookShelf || []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.bookShelf)
    shelfIndex=options.index,
     this.setData({
       //书单内容
       bookShelfValue:app.cache.bookShelf[options.index]
     }) 
  },


  onShow:function(){
    this.setData({
      //书单内容
      bookShelfValue: app.cache.bookShelf[shelfIndex]
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
     console.log(index)
     var obj = this.data.bookShelf
     obj[shelfIndex].shelf_bookList.splice(index, 1);
     app.saveCache('bookShelf', obj);
     this.onShow()
   },

  /**
   *    添加图书到另外的书单
   */
  bindPickerChange:function(e){
    var index = e.currentTarget.dataset.index;
    var shelf_index = e.detail.value
    if (shelfIndex == shelf_index){
      wx.showToast({
        title: '当前书单已有藏书',
        image: "../../../img/icon/warn.png",
        duration: 1000
      })
      return false;
    }
    var currentShelf = this.data.bookShelf[shelfIndex]
    var selectShelf = this.data.bookShelf[shelf_index]
    selectShelf.shelf_bookList.push(currentShelf.shelf_bookList[index])
    app.saveCache('bookShelf', this.data.bookShelf);
    wx.showToast({
      title: '添加成功',
      icon:"success"
    })
  }


   
})