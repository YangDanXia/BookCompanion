// pages/index/functions/borrowProcess/QRcode.js
var codeContent;
var countdown = 60;
var count =180;
var settime = function (that) {
  if (countdown == 0) {
    that.setData({
      toSend: true
    })
    countdown = 60;
    return;
  } else {
    that.setData({
      toSend: false,
      second: countdown
    })

    countdown--;
  }
  setTimeout(function () {
    settime(that)
  }
    , 1000)
}
var waitResult = function (that) {
  if (count == 0) {
    that.setData({
      path: ''
    })
    count = 180;
    return;
  } else {
    wx.request({
      url: 'https://www.hqinfo.xyz/ServerForCommunicate/Get?request=getReturnState',
      //请求头
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success:function(res){
        if(res.data == 1){
          wx.showToast({
            title: '操作成功',
            icon:" success"
          })
          wx.navigateTo({
            url: '../bookOrder',
          })
          clearTimeout(t)
        }
      }
      ,fail:function(){
        wx.showToast({
          title: '网络异常',
          image: '../../../../img/icon/warn.png'
        })
      }
    })
    count--;
  }
  var t = setTimeout(function () {
    waitResult(that)
  }
    , 1000)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否隐藏网络异常界面
    errHidden: true,
    //判断管理员是否同意
    flag: false,
    //图片地址
    path:'',
    toSend: true,
    second: 60,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var str = options.content;
     //替换所有，为；
     var replace = str.replace(/\,/g, ';')
     codeContent = replace+";"
     console.log("替换后二维码内容："+codeContent)
     var that = this
  //生成二维码
     wx.request({
       url: 'https://www.hqinfo.xyz/Server_Java/EnQRcode',
       data:{
         code: codeContent
       },
      header: {
       'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success:function(res){
         that.setData({
           path: "https://www.hqinfo.xyz/Server_Java/EnQRcode?code=" + codeContent
         })
      }
    })
    waitResult(that)
  },

  
  refresh:function(){
    var that = this
    //生成二维码
    wx.request({
      url: 'https://www.hqinfo.xyz/Server_Java/EnQRcode',
      data: {
        code: codeContent
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          path: "https://www.hqinfo.xyz/Server_Java/EnQRcode?code=" + codeContent
        })
      }
    })
    settime(that)
    waitResult(that)
  }

})