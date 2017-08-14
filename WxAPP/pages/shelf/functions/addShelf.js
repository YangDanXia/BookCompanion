// pages/shelf/functions/addShelf.js
var app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //封面图片
    img: "../../../img/show/book.png",
    //是否隐藏弹窗
    modalHidden:true,
    //弹窗内容
    content:[],
    //书单内容
    bookShelf:app.cache.bookShelf||[]
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
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  
  /**
   * 上传本地照片
   */
  chooseImg: function(){
    var that = this;
    wx.chooseImage({
      count: 1, 
      sizeType: 'compressed', // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          img:res.tempFilePaths
        })
      }
    })
   },

   /**
    * 设置名称
    */
    doShelfName:function(){
      this.setData({
        modalHidden: false,
        index:0,
        value: this.data.content[0] || ''
      })
    },

    doShelfIntro:function(){
      this.setData({
        modalHidden: false,
        index: 1,
        value:this.data.content[1]||''
      })
    },

    bindInput: function (e) {
      var index = e.currentTarget.dataset.index
      var newContent = this.data.content
      if(index==1&&!newContent[0]){
        newContent[0] =''
      }
      newContent[index] = e.detail.value
      this.setData({
        content: newContent
      })
    },

    /**
  * 保存修改信息
  */
    submit: function (e) {
      var index = e.currentTarget.dataset.index
      if (!this.data.content[index]) {
        wx.showToast({
          title: "请输入信息",
          image: "../../../img/icon/warn.png"
        })
      } else {
        wx.showToast({
          title: '修改成功',
          icon: 'success'
        })

        this.setData({
          modalHidden: true
        }) 
      }

    },


    /**
     * 关闭弹窗
     */
    modalHide: function () {
      this.setData({
        modalHidden: true
      })
    },


    /**
     * 创建书单
     */
    createShelf:function(){
      if (this.data.content.length == 0 || !this.data.content[0]){
          wx.showToast({
            title: '请填写完整信息',
            image:'../../../img/icon/warn.png'
          })
          return false;
        }

      var obj = this.data.bookShelf;
      var newShelf = {"img":this.data.img,"name":this.data.content[0],"intro":this.data.content[1],"detail":[]}
      obj.push(newShelf);
      wx.showToast({
        title: '创建书单成功',
        icon:'success'
      })
      app.saveCache('bookShelf',this.data.bookShelf)
      wx.navigateBack({
        delta:'1'
      })

    }

})