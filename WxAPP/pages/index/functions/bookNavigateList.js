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
    this.getBooksList(query.tag)
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
    }, 2000);
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
          subMenuDisplay: 'hidden',
          loadhidden:false
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
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "gdou_book",
        table: tag,
        typeName: "inquire",
        field: { title: '', author: '', isbn13: '', images: '', total_type: '',publisher:'',summary:'' },
        factor: { total_type: tag },
        limit: "20,100"
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
          booksList: res.data.result
        })
        setTimeout(function () {
          that.setData({
            loadhidden: true
          })
        }, 1000);
        console.log(res.data.result)
        wx.request({
          url: 'https://www.hqinfo.xyz/Server_Java/CloseConn'
        })
      },
      fail: function (res) {
        that.setData({
          errHidden: true
        })
      }
    })
  }

})
