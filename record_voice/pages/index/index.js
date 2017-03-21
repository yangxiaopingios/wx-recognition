//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    voiceButtonName: '语音识别',
    voicePlayButtonName: '无录音',
    voiceButtonDisable: false,
    tempFilePath: null
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bpPageBtnTap: function () {
    wx.navigateTo({
      url: '../bpPage/bpPage'
    })
  },
  scanBtnTap: function () {
    wx.scanCode({
      success: (res) => {
        var list = res.result.split(',');
        wx.navigateTo({
          url: '../bpPage/bpPage?bpString=' + res.result
        })
      }
    })
  },
  imgBtnTap: function () {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res.tempFilePaths[0])
        wx.showToast({
          title: '图片识别中',
          icon: 'loading',
          duration: 10000,
          mask: true
        })
        wx.uploadFile({
          url: 'https://ihealth-wx.s1.natapp.cc/uploadImage',
          filePath: res.tempFilePaths[0],
          name: 'file',
          // header: {}, // 设置请求的 header
          formData: {
            'msg': 'voice'
          }, // HTTP 请求中其他额外的 form data
          success: function (res) {
            // success
            console.log(res.data)
            var json = JSON.parse(res.data)
            var content = ''
            for (var i = 0; i < json.msg.words_result.length; i++) {
              console.log(json.msg.words_result[i].words);
              content += json.msg.words_result[i].words
              content += '\n'
            }
            wx.hideToast()
            wx.navigateTo({
              url: '../voicePage/voicePage?voiceData=' + content
            })
          },
          fail: function (err) {
            // fail
            console.log(err)
          },
          complete: function () {
            // complete
          }
        })
      }
    })
  },
  tapVoicePlayButton: function (event) {
    var that = this
    var voicePlayButtonName = '无录音'
    var voiceButtonDisable = false
    switch (this.data.voicePlayButtonName) {
      case '无录音': {
        wx.showModal({
          title: '无录音',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
        break
      }
      case '开始播放': {
        voicePlayButtonName = '结束播放'
        voiceButtonDisable = true
        wx.playVoice({
          filePath: this.data.tempFilePath,
          complete: function () {
            that.setData({
              voicePlayButtonName: '开始播放',
              voiceButtonDisable: false
            })
          }
        })
        break
      }
      case '结束播放': {
        voicePlayButtonName = '开始播放'
        wx.stopVoice()
        break
      }
    }
    this.setData({
      voicePlayButtonName: voicePlayButtonName,
      voiceButtonDisable: voiceButtonDisable
    })
  },
  tapVoiceButton: function (event) {
    var that = this
    var start = this.data.voiceButtonName == '语音识别';
    this.setData({
      voiceButtonName: start ? '结束录音' : '语音识别'
    })
    if (start) {
      wx.startRecord({
        success: function (res) {
          console.log('录音成功' + JSON.stringify(res));
          that.setData({
            voiceButtonName: '语音识别',
            voicePlayButtonName: '开始播放',
            tempFilePath: res.tempFilePath
          })
          wx.showToast({
            title: '语音识别中',
            icon: 'loading',
            duration: 10000,
            mask: true
          })
          wx.uploadFile({
            url: 'https://ihealth-wx.s1.natapp.cc/upload',
            filePath: res.tempFilePath,
            name: 'file',
            // header: {}, // 设置请求的 header
            formData: {
              'msg': 'voice'
            }, // HTTP 请求中其他额外的 form data
            success: function (res) {
              // success
              console.log('begin');
              console.log(res.data);
              var json = JSON.parse(res.data);
              console.log(json.msg);
              var jsonMsg = JSON.parse(json.msg);
              console.log(jsonMsg.result);
              wx.hideToast()
              wx.navigateTo({
                url: '../voicePage/voicePage?voiceData=' + jsonMsg.result.join('')
              })
            },
            fail: function (err) {
              // fail
              console.log(err);
            },
            complete: function () {
              // complete
            }
          })
        },
        fail: function (res) {
          //录音失败
          that.setData({
            voiceButtonName: '语音识别'
          })
          console.log('录音失败' + JSON.stringify(res));
        }
      })
      setTimeout(function () {
        //结束录音  
        wx.stopRecord()
      }, 60000)
    } else {
      wx.stopRecord()
    }
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  }
})
