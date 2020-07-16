const app = getApp()
import API from '../../utils/server'
import {get, post} from '../../utils/netUtil'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      userInfo : {},
      isModal : false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
      if(app.globalData.userInfo.nickname) {
        this.setData({
          userInfo : app.globalData.userInfo
        })
        if(app.globalData.userInfo.nickname && app.globalData.userInfo.phone) {
            this.teacherName ()
        }
      }else {
        app.getData = (data)=> {
            this.setData({
                userInfo : app.globalData.userInfo
            })
        }
        if(app.globalData.userInfo.nickname && app.globalData.userInfo.phone) {
            this.teacherName ()
        }
      } 
    },

      // 授权登录
      getUserInfo (e) {
        wx.showLoading({
            title: '授权中',
            mask: true,
        })
        if(e.detail.rawData) {
            console.log(e.detail,'授权成功了么')
        let encryptedData = e.detail.encryptedData
        let iv = e.detail.iv
        wx.login({
            success: (res)=>{
            let code = res.code
            if(res.code) {
                post(`${API.authUser}`,{encryptedData,iv,code}).then ((res)=>{
                console.log(res,'授权数据');
                    if (res.data.code === 1) {
                        console.log('进来了没')
                        this.setData({
                        userInfo: res.data.data,
                        })
                        app.globalData.userInfo = res.data.data
                        wx.showToast({
                        title: '授权成功',
                        duration: 2000
                        })
                       
                        this.setData({
                            isModal : true
                        })
                        wx.hideLoading()
                    } else {
                        setTimeout(()=> {
                            wx.showToast({
                                title: '需要授权才可以查看详细信息',
                                icon: 'none',
                                duration: 2000
                            })
                        },500)
                        wx.hideLoading()
                    }
                
                })
            }
            },
            fail:()=> {
                setTimeout(()=> {
                    wx.showToast({
                        title: '需要授权才可以查看详细信息',
                        icon: 'none',
                        duration: 2000
                    })
                },500)
                console.log(e)
                wx.hideLoading()
            }
        })
        }else {
            setTimeout(()=> {
                wx.showToast({
                    title: '需要授权才可以查看详细信息',
                    icon: 'none',
                    duration: 2000
                })
            },500)
            
            wx.hideLoading()
        }
    },

      // 获取手机号
      getPhoneNumber (e) {
        wx.showLoading({
            title: '授权中',
            mask: true,
        })
      let _this = this
      let {encryptedData,iv} = e.detail
      if(e.detail.errMsg==="getPhoneNumber:ok") {
          wx.login({
              success(res) {
                  if(res.code) {
                      post(`${API.authPhone}`,{
                          code:res.code,
                          encryptedData,
                          iv
                      }).then((res)=> {
                          if(res.data.code) {
                              wx.showToast({
                                  title:"授权成功",
                                  icon: "none"
                              })
                              app.globalData.userInfo=res.data.data
                              _this.setData({
                                  userInfo: res.data.data
                              })
                              _this.teacherName ()
                              wx.hideLoading()
                          }else {
                              setTimeout(()=>{
                                wx.showToast({
                                    title:"授权失败，请重新授权",
                                    icon: "none",
                                    duration: 2000
                                })
                              },500)
                              wx.hideLoading()
                          }
                          
                      }).catch(err => {
                        setTimeout(()=>{
                            wx.showToast({
                                title:"授权失败，请重新授权",
                                icon: "none",
                                duration: 2000
                            })
                          },500)
                          console.log(err)
                          wx.hideLoading()
                      })
                  }else {
                    setTimeout(()=>{
                        wx.showToast({
                            title:"授权失败，请重新授权",
                            icon: "none",
                            duration: 2000
                        })
                    },500)
                      console.log('登录失败！' + res.errMsg)
                      wx.hideLoading()
                  }
              }
          })
      }else {
          setTimeout(()=> {
            wx.showToast({
                title:"请先授权手机号",
                icon: "none"
            })
          },500)
          wx.hideLoading()
      }
  },

  closeModal() {
      this.setData({
          isModal : false
      })
  },

    teacherName () {
      wx.navigateTo({
        url: '../teacherName/teacherName'
      })
    },
})
