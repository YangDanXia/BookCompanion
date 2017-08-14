// pages/me/functions/set.js
var option = require("../../../utils/infor.js")
var app = getApp();
Page({
  data: {
    //是否隐藏弹窗
    modalHidden: true,
    radioValue: [
      { value: 'everyDay', name: '每日一推' },
      { value: 'everyWeek', name: '每周一推' },
      { value: 'everyMonth', name: '每月一推' }
    ],
    // 默认频率为每日一推
    frequency: app.cache.frequency || 'everyDay',
    //功能列表
    functionList: option.ReminderFunction,
    //功能设置情况
    remindFlag: app.cache.remindFlag || ['0', '0', '0', '0']
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onshow: function () {
    this.setData({
      setState: app.cache.remindFlag || ['0', '0', '0', '0']
    })
  },


  /**
   * 设置提醒功能
   */
  setting: function (e) {
    var formId = e.detail.formId;
    console.log(formId)
    var index = e.currentTarget.dataset.index;
    var newSetState = this.data.remindFlag;
    if (this.data.remindFlag[index] == '0') {//选择打开
      newSetState[index] = '1';
      //把formId传到数据库
      if (index == 0) {//推荐书籍的设置
        this.setData({
          modalHidden: false
        })
      }
    } else {//选择关闭
      newSetState[index] = '0';
    }
    this.setData({
      remindFlag: newSetState
    })
    app.saveCache('remindFlag', this.data.remindFlag)//更新本地缓存
  },


  /**
   * 获取单选按钮的值
   */
  radioVal: function (e) {
    this.setData({
      frequency: e.detail.value
    })
  },


  /**
   * 设置推荐图书频率
   */
  AgreeRecommend: function () {
    app.saveCache('frequency', this.data.frequency)//更新本地缓存
    this.setData({
      modalHidden: true
    })
  },


  /**
   * 隐藏弹窗
   */
  modalHide: function () {
    this.setData({
      modalHidden: true
    })
  }


})