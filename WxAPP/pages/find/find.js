// pages/find/find.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 提示错误图片
    errHidden:true,
   //登录状态
    loginFlag: app.cache.loginFlag || false,
    // 提示没有发布过
    warnHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      loginFlag: app.cache.loginFlag || false
    })
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
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      loginFlag: app.cache.loginFlag || false
    })
    this.refresh()
  },

  /**
   * 刷新界面
   */
  refresh:function(){
    var that = this
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "WxApp",
        table: "sellBook_record",
        typeName: "inquireOrder",
        field: { idx_phone: '', name: '', photo: '', picture: '', content: '', tag: '', price: '', ex_price: '',publish_time:'' },
        factor: {},
        limit: "1"
      },
      //请求头
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        var obj = res.data.result
        if(res.data == "error"){
          that.setData({
            errHidden: false
          })
          return false;
        }
        if (obj.length == 0) {
          that.setData({
            warnHidden: true
          })
        } else {
          for (var i = 0; i < obj.length; i++) {
            obj[i].tag = obj[i].tag.split(",");
            obj[i].picture = obj[i].picture.split(";")
          }
          that.setData({
            warnHidden: false,
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
   * 发布文章
   */
  publish:function(){
    if (!this.data.loginFlag) {
      this.login()
    } else {
      wx.navigateTo({
        url: 'publish'
      })
    }
  },

  /**
 * 发起聊天
 */
  talkTo: function (e) {
    var photo = e.currentTarget.dataset.photo;
    var name = e.currentTarget.dataset.name;
    var phone = e.currentTarget.dataset.id;
    if (!this.data.loginFlag) {
      this.login()
    } else {
      wx.navigateTo({
        url: 'talkTo?phone='+phone+'&photo='+photo+'&name='+name
      })
    }
  },

  /**
 * 进入登录界面
 */
  login: function () {
    wx.navigateTo({
      url: '../me/account/login'
    })
  }
})