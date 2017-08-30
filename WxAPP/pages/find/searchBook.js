// pages/find/find.js
var app=getApp()
var searchContent;

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
    warnHidden: false,
    // 是否需要放大图片
    photoShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    searchContent = options.book
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
    var that = this;
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/DbOperations',
      data:
      {
        dbName: "WxApp",
        table: "sellBook_record",
        typeName: "inquireLike",
        field: { idx_phone: '', nickName: '', avatarUrl: '', bookName: '', picture: '', content: '', tag: '', price: '', ex_price: '', publish_time: '' },
        factor: { bookName: searchContent },
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
        if (obj.length == 0) {
          that.setData({
            warnHidden: true,
            list: []
          })
        } else {
          that.setData({
            list: res.data.result
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
   * 点击放大图片
   */
  largePicture:function(e){
     var src = e.currentTarget.dataset.src
     this.setData({
       photoShow: true,
       needSrc: src
     })
  },

  /**
   * 放小图片
   */
  closePhoto:function(){
    this.setData({
      photoShow: false
    })
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
        url: 'talkTo?phone='+phone+'&photo='+photo+'&name='+name+'&way=write'
      })
    }
  } 
})