// pages/shelf/shelf.js
var app = getApp();
function initSubMenuDisplay() {
  return ['show', 'show'];
}
function initImage() {
  return ["../../img/icon/down.png", "../../img/icon/down.png"]
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
    //下拉菜单显示
    subMenuDisplay: initSubMenuDisplay(),
    //下拉菜单的显示图标
    img: initImage(),
    //收藏的图书
    bookShelf: app.cache.bookShelf || []
  },



  /**
   * 加载数据,通过接收的ISBN请求链接获取图书信息
   */
  onLoad: function (query) {
    this.setData({
      bookShelf: app.cache.bookShelf || []
    })
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
   * 下拉显示，上拉隐藏
   */
  tapMainMenu: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var newSubMenuDisplay = this.data.subMenuDisplay;
    var newImage = this.data.img;
    if (this.data.subMenuDisplay[index] == 'hidden') {
      newImage[index] = "../../img/icon/down.png";
      newSubMenuDisplay[index] = 'show';
    } else {
      newImage[index] = "../../img/icon/enter.png";
      newSubMenuDisplay[index] = 'hidden';
    }
    this.setData({
      subMenuDisplay: newSubMenuDisplay,
      img: newImage
    })
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
  }

})