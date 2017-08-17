// pages/index/functions/bookNavigateList.js
var app = getApp();
var option = require("../../../utils/infor.js");
function initSubMenuDisplay() {
  return 'hidden';
}


Page({
  data: {
    //是否隐藏正在加载
    loadhidden: false,
    //下拉菜单的显示
    subMenuDisplay: initSubMenuDisplay(),
    //下拉菜单的选择
    subMenuLight: option.OptionShow,
    //是否显示蒙层
    showTab: false,
    //下拉菜单的内容
    subMenuList: option.BookType,
    //是否隐藏网络异常
    errHidden: true,
    //可使用窗口高度
    winHeight: app.globalData.winHeight
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    //一开始进入页面，先从0位置开始
    this.getBooksList(query.tag, "0")
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
    }, 2500);
  },




  /**
   * 显示下拉菜单
   */
  tapMainMenu: function (e) {
    if (this.data.subMenuDisplay == 'hidden') {
      this.setData({
        showTab: true,
        subMenuDisplay: 'show'
      })
    } else {
      this.setData({
        showTab: false,
        subMenuDisplay: 'hidden'
      })
    }
  },



  /**
   * 选择图书分类
   */
  selectBookCatagory: function (e) {
    var index = e.currentTarget.dataset.index;
    var tag = e.currentTarget.dataset.tag;
    var newSubMenuLight = option.OptionShow;
    for (var i = 0; i < newSubMenuLight.length; i++) {
      if (i == index) {
        newSubMenuLight[index] = 'agree';
        this.setData({
          showTab: false,
          subMenuDisplay: 'hidden'
        })
        this.getBooksList(tag)
      } else {
        newSubMenuLight[i] = 'disagree';
      }
    }
    this.setData({
      subMenuLight: newSubMenuLight
    })
  },



  /**
   * 获取该类型下的图书列表
   */
  getBooksList: function (tag) {
    var that = this
    wx.request({ 
      url: 'http://localhost:8080/Server_Java/GetBooksInfo',
      data: {
        request: "tag",
        tag: tag,
        count: "100",
        start:"29"
      },
      success: function (res) {
        var books = res.data.books;
        that.setData({
          booksList: books
        })
      },
      fail: function (res) {
        that.setData({
          loadhidden: true,
          errHidden: false
        })
      }
    });
  }

})
