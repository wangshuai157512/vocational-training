import API from '../../utils/server'
import {get, post} from '../../utils/netUtil'
let app = getApp();
Page({

    data: {
      userInfo : {}
    },
    onLoad: function () {
      //   if (app.globalData.userInfo.nickname) {
      //     this.setData({
      //         userInfo : app.globalData.userInfo
      //     })
      // }else {
      //     app.getData = (data)=> {
      //         this.setData({
      //             userInfo : app.globalData.userInfo,
      //         })
      //     }
      // }
    },
    onShow() {
      if (app.globalData.userInfo.nickname) {
          this.setData({
              userInfo : app.globalData.userInfo
          })
      }else {
          app.getData = (data)=> {
              this.setData({
                  userInfo : app.globalData.userInfo,
              })
          }
      }
      console.log(app.globalData.userInfo,'我的')
    },

       // 授权登录
    getUserInfo (e) {
        wx.showLoading({
          title: '授权中',
          mask: true,
        })
        if(e.detail.rawData) {
          let encryptedData = e.detail.encryptedData
          let iv = e.detail.iv
          wx.login({
              success: (res)=>{
              let code = res.code
              if(res.code) {
                  post(`${API.authUser}`,{encryptedData,iv,code}).then ((res)=>{
                  //console.log(res);
                  if (res.data.code === 1) {
                      this.setData({
                      userInfo: res.data.data,
                      })
                      app.globalData.userInfo = res.data.data
                      wx.showToast({
                        title: '授权成功',
                        duration: 2000
                      })
                      wx.hideLoading()
                  } else {
                    setTimeout(()=> {
                      wx.showToast({
                        title: '授权失败',
                        duration: 2000
                      })
                    },500)
                    wx.hideLoading()
                  }
                  })
              }
              },
              fail:()=> {
                //console.log(e)
                setTimeout(()=> {
                  wx.showToast({
                    title: '授权失败',
                    duration: 2000
                  })
                },500)
                
                wx.hideLoading()
              }
          })
        }else {
          setTimeout(()=>{
            wx.showToast({
              title: '需要授权才可以查看详细信息',
              icon: 'none',
              duration: 2000
            })
          },500)
          
          wx.hideLoading()
        }
    },

    myMaterials () {
        wx.navigateTo({
          url: '../myMaterials/myMaterials'
        })
    },

    myGroup () {
        wx.navigateTo({
          url: '../myGroup/myGroup'
        })
    },

    myShare () {
        wx.navigateTo({
          url: '../myShare/myShare'
        })
    },

})
