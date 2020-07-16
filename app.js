import API from './utils/server'
import {get, post} from './utils/netUtil'
//app.js
App({
  onLaunch: function () {
    let _this = this
    let sceneData = wx.getLaunchOptionsSync()
    console.log(sceneData,"appja")
    if (sceneData.scene === 1047 || sceneData.scene === 1048 || sceneData.scene === 1049) {
      let params = decodeURIComponent(sceneData.query.scene)
      this.globalData.shareUserId = params.split('=')[1]
    }
    if(sceneData.scene === 1007) {
      let params = sceneData.query
      this.globalData.shareUserId = params.shareUserId
    }
    /*const getStatusHeight = () => {
      let systemInfo = wx.getSystemInfoSync();
      let rect = wx.getMenuButtonBoundingClientRect();
      let navHeight = systemInfo.statusBarHeight;
        systemInfo.navBarHeight = navHeight + rect.height + (rect.top - navHeight)*2;
        systemInfo.rect = rect;
      return systemInfo;
    }*/
    //this.globalData.systemInfo = getStatusHeight()

    // 获取屏幕高度
    wx.getSystemInfo({
      success (res) {
        console.log(res)
        _this.globalData.systemInfo = res
      }
    })


    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 版本更新代码
    if (wx.getUpdateManager) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {

      })

      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })

      updateManager.onUpdateFailed(function () {
        // 新版本下载失败
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用自动更新版本功能，请升级到最新微信版本或手动更新。'
      })
    }


    this.login.bind(this)()
    

    wx.getSystemInfo({
      success: (res) => {
        let modelmes = res.model; //手机品牌
        //console.log('手机品牌', modelmes)
        //其实后面关于XS、XR、XS MAX的判断都可以去掉,因为他们里面都包含了'iPhone X'这个字符;
        if (modelmes.indexOf('iPhone X') != -1) {
          this.globalData.isIpx = true
        } else if (modelmes.indexOf('iPhone XS') != -1) {
          this.globalData.isIpx = true
        } else if (modelmes.indexOf('iPhone XR') != -1) {
          this.globalData.isIpx = true
        } else if (modelmes.indexOf('iPhone XS Max') != -1) {
          this.globalData.isIpx = true
        } else if (modelmes.indexOf('iPhone 11') != -1) {
          this.globalData.isIpx = true
        } else if (modelmes.indexOf('iPhone 11 Pro') != -1) {
          this.globalData.isIpx = true
        } else if (modelmes.indexOf('iPhone 11 Pro Max') != -1) {
          this.globalData.isIpx = true
        }
      },
    })


  },

  login () {
    // 登录
    wx.login({
      success: res => {
        console.log(this.globalData.shareUserId,'shareUserId')
        wx.request({
          url: `${API.login}`,
          method : 'POST',
          data : {
            code : res.code,
            shareUserId: this.globalData.shareUserId? this.globalData.shareUserId : ''
          },
          success : res => {

            console.log(res.data.data,'这里是登录')
            if(res.data.data) {
              this.globalData.userInfo = res.data.data
              this.globalData.shareUserId = res.data.data.shareUserId
            }

            if (this.getData) {
                this.getData(res.data.data)
            }

          }
        })

  }
})
  },

  onShow() {
    post(`${API.showContent}`,{name:"itedu"}).then((res)=> {
     this.globalData.showContent = res.data.data
    })
  },
  globalData: {
    userInfo: {},
    systemInfo: {},
    isIpx: false,   //适配IPhoneX
    shareUserId : null,
    isWealModal : true,
    systemInfo : {},
    showContent: {}
  }
})


