// pages/bpPage/bpPage.js
Page({
  data: {
    highBpData: '',
    lowBpData: '',
    heartBpData: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options.bpString);
    var list = options.bpString.split(',')
    this.setData({
      highBpData: list[0],
      lowBpData: list[1],
      heartBpData: list[2]
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})