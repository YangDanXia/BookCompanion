// pages/find/publish.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 提示错误图片
    errHidden: true,
    // 提示没有发布过
    warnHidden:false,
    //登录状态
    loginFlag: app.cache.loginFlag || false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.refresh()
  },

  /**
   * 刷新界面
   */
  refresh: function () {
    var that = this
    var phone = app.cache.userInfo.userPhone
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "WxApp",
        table: "sellBook_record",
        typeName: "inquire",
        field: {id:'',idx_phone: '', nickName: '', avatarUrl: '', picture: '', content: '', tag: '', price: '', ex_price: '' },
        factor: { idx_phone:phone},
        limit: "0,20"
      },
      //请求头
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        var obj = res.data.result
        if (res.data == "error") {
          that.setData({
            errHidden: false
          })
          return false;
        }
        if (obj.length == 0) {
          that.setData({
            list: obj,
            warnHidden: true
          })
        }else{
          for (var i = 0; i < obj.length; i++) {
            obj[i].tag = obj[i].tag.split(",");
            obj[i].picture = obj[i].picture.split(";")
          }
          that.setData({
            list: obj
          })
        }
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
  * 删除发布的消息
  */
  delMessage:function(e){
    var _id = e.currentTarget.dataset.id
    var that =this
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "WxApp",
        table: "sellBook_record",
        typeName: "delete",
        field: {},
        factor: { idx_phone: app.cache.userInfo.userPhone,id:_id },
        limit: "1"
      },
      //请求头
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        if(res.data){
          wx.showToast({
            title: "删除成功",
            icon: "success",
            duration: 800
          })
        }
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
    setTimeout(function () {
      that.onShow()
    }, 1000);

  }


})