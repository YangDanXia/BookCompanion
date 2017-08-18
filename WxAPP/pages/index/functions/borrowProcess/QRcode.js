// pages/index/functions/borrowProcess/QRcode.js
var codeContent;
var countdown = 60;
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
     wx.getImageInfo({
       src: "http://localhost:8080/Server_Java/EnQRcode?code=" + codeContent,
       success:function(res){
         that.setData({
           path:res.path
         })
       }
     })
  },

  refresh:function(){
    var that = this
    //生成二维码
    wx.getImageInfo({
      src: "http://localhost:8080/Server_Java/EnQRcode?code=" + codeContent,
      success: function (res) {
        that.setData({
          path: res.path
        })
      }
    })
    settime(that)
  }

})