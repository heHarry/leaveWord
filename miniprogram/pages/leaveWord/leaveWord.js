// miniprogram/pages/leaveWord/leaveWord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {


    leaveWord: "",
    userName: "",
    city: "",
    userImg: "",
    allComment: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                city: res.userInfo.city,
                userName: res.userInfo.nickName,
                userImg: res.userInfo.avatarUrl
              })
              console.log(res)

            }
          })
        }
      }
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("22222")
    this.onQuery()
  },
  getWord(e) {
    this.setData({
      leaveWord: e.detail.value
    })
  },
  publish: function () {
    var _this = this
    var status = this.tipMessage(_this.data.leaveWord)
    if (!status) {
      _this.onAdd()
    }
  },

  onAdd: function () {
    var _this = this
    const db = wx.cloud.database()

    db.collection('leaveWord').add({
      data: {
        city: _this.data.city,
        userName: _this.data.userName,
        word: _this.data.leaveWord,
        userImg: _this.data.userImg,
        likeNum:0
      }
      ,
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        // this.setData({
        //   counterId: res._id,
        //   count: 1
        // })
        _this.onQuery()
        wx.showToast({
          icon: 'none',
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  onQuery: function () {
    var _this = this
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('leaveWord').get({
      success: res => {
        console.log('3212')
        this.setData({
          allComment: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', this.data.allComment)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  del:function(e){
    var _this = this
    const db = wx.cloud.database()
    console.log(e.currentTarget.dataset.info)
    var id = e.currentTarget.dataset.info
    db.collection('leaveWord').doc(id).remove({
      success: function (res) {
        wx.showToast({
          icon: 'none',
          title: '删除成功'
        })
        _this.onQuery()
      }
    })

  },
  tipMessage(val) {
    console.log(val)
    if (val.length > 0) {

      return false
    } else {
      wx.showToast({
        icon: 'none',
        title: '不要调皮,填写内容'
      })
      return true
    }
  }


})