import API from '../../utils/server'
import {get, post} from '../../utils/netUtil'
let app = getApp();
Page({
    data: {
        pickerHidden: true,
        chosen: '',
        userInfo : {},
        customName : '',
        customPhone : '',
        customMarks : ''
        
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

    nameInput(e) {
        this.setData({
            customName : e.detail.value
        }) 
        console.log(e)
    },
    namePhone(e) {
        this.setData({
            customPhone : e.detail.value
        }) 
    },
    nameMarks(e) {
        this.setData({
            customMarks : e.detail.value
        }) 
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
                      this.formSubmit()

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
            setTimeout(()=> {
                wx.showToast({
                    title: '需要授权才可以提交信息',
                    icon: 'none',
                    duration: 2000
                })
            },500)
          
          wx.hideLoading()
        }
    },
    // 此处加授权无法使用表单收集，第二版改写
    formSubmit: function() {
        var _this = this
        if(_this.data.customName===''){
            wx.showToast({
                title: '请输入联系人姓名',
                icon: 'none',
                duration: 1500
            })
            setTimeout(function(){
                wx.hideToast()
            },2000)
        }else if(_this.data.customPhone===''){
            wx.showToast({
                title: '请输入联系方式',
                icon: 'none',
                duration: 1500
            })
            setTimeout(function(){
                wx.hideToast()
            },2000)
        } else if (_this.data.customMarks==='') {
          wx.showToast({
            title: '请输入要咨询的项目',
            icon: 'none',
            duration: 1500
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        }else{
            wx.request({
                url: API.addUser,
                data: {
                    name: _this.data.customName,//姓名
                    phone: _this.data.customPhone,//电话
                    marks: _this.data.customMarks,//项目
                    channel:"1",//渠道
                    shareUserId: app.globalData.shareUserId?app.globalData.shareUserId : "" //顶级邀请人ID
                },
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                success: function(res){
                    var code = res.data.code;
                    if(code=='1'){
                        wx.showModal({
                            // title: '提示',
                            content: '你已成功提交，老师会尽快与你电话联络！',
                            showCancel:false,
                            success (res) {
                              console.log(res)
                            }
                          })
                    }else if(code=='2'){
                        wx.showToast({
                            title: '电话已存在',
                            icon: 'none',
                            duration: 1500
                        })
                    }else{
                        wx.showToast({
                            title: '信息提交失败',
                            icon: 'none',
                            duration: 1500
                        })
                    }
                },
                fail: function() {
                    // fail
                },
                complete: function() {
                    // complete
                }
            })

        }


    },

    linkTo() {
        wx.navigateTo({
            url: `../apply/apply`
        })
    },
    // pickerConfirm: function(e) {
    //     this.setData({
    //         pickerHidden: true
    //     })
    //     this.setData({
    //         chosen: e.detail.value
    //     })
    // },
    // pickerCancel: function(e) {
    //     this.setData({
    //         pickerHidden: true
    //     })
    // },
    // pickerShow: function(e) {
    //     this.setData({
    //         pickerHidden: false
    //     })
    // },
    // formSubmit: function(e) {
    //     var _this = this
    //     if(e.detail.value.username.length==0){
    //         wx.showToast({
    //             title: '请输入联系人姓名',
    //             icon: 'none',
    //             duration: 1500
    //         })
    //         setTimeout(function(){
    //             wx.hideToast()
    //         },2000)
    //     }else if(e.detail.value.phone.length==0){
    //         wx.showToast({
    //             title: '请输入联系方式',
    //             icon: 'none',
    //             duration: 1500
    //         })
    //         setTimeout(function(){
    //             wx.hideToast()
    //         },2000)
    //     } else if (e.detail.value.marks.length == 0) {
    //       wx.showToast({
    //         title: '请输入要咨询的项目',
    //         icon: 'none',
    //         duration: 1500
    //       })
    //       setTimeout(function () {
    //         wx.hideToast()
    //       }, 2000)
    //     }else{
    //         //console.log('form发生了Submit事件，携带数据为：', e.detail.value)
    //         wx.request({
    //             url: API.addUser,
    //             data: {
    //                 name: e.detail.value.username,//姓名
    //                 phone: e.detail.value.phone,//电话
    //                 marks: e.detail.value.marks,//项目
    //                 channel:e.detail.value.channel,//渠道
    //                 shareUserId: app.globalData.shareUserId?app.globalData.shareUserId : "" //顶级邀请人ID
    //             },
    //             method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //             header: {
    //                 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    //             },
    //             success: function(res){
    //                 var code = res.data.code;
    //                 if(code=='1'){
    //                     wx.showToast({
    //                         title: '您的信息我们已收到，稍后会有负责人与您联系，请保持联系方式畅通。',
    //                         icon: 'none',
    //                         duration: 1500
    //                     })
    //                 }else if(code=='2'){
    //                     wx.showToast({
    //                         title: '电话已存在',
    //                         icon: 'none',
    //                         duration: 1500
    //                     })
    //                 }else{
    //                     wx.showToast({
    //                         title: '信息提交失败',
    //                         icon: 'none',
    //                         duration: 1500
    //                     })
    //                 }
    //             },
    //             fail: function() {
    //                 // fail
    //             },
    //             complete: function() {
    //                 // complete
    //             }
    //         })

    //     }


    // },
    // formReset: function(e) {
    //     console.log('form发生了reset事件，携带数据为：', e.detail.value)
    //     this.setData({
    //         chosen: ''
    //     })
    // },

    // onLoad: function (options) {
    //     this.setData({
            
    //     });
    // },

    // onShareAppMessage: function () {
    //     return {
    //         title:"我要报名",
    //         imageUrl:"",
    //         path:'/pages/apply/apply',
    //         success: function(res) {
    //             // console.log(res)
    //         },
    //         fail: function(res) {
    //             // console.log(res)
    //         }
    //     }
    // }
})