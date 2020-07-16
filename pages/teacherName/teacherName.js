import API from '../../utils/server'
import {get, post} from '../../utils/netUtil'
let app = getApp();
Page({

    data: {
        teacherName : '',
        teacherCity : '',
        teaSubscribe :true
    },
    onLoad: function () {
        this.setData({
            userInfo : app.globalData.userInfo
        })
        this.getNameList()
    },

    onShow() {
        this.collect()
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
                                title: '授权失败，请重新授权',
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
                        title: '授权失败，请重新授权',
                        duration: 2000
                    })
                },500)
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
                            wx.showToast({
                                title:"授权成功",
                                icon: "none"
                            })
                            app.globalData.userInfo=res.data.data
                            _this.setData({
                                userInfo: res.data.data
                            })
                            wx.hideLoading()
                        }).catch(err => {
                            setTimeout(()=>{
                                wx.showToast({
                                    title: '授权失败，请重新授权',
                                    duration: 2000
                                })  
                            },500)
                            console.log(err)
                            wx.hideLoading()
                        })
                    }else {
                        setTimeout(()=>{
                            wx.showToast({
                                title: '授权失败，请重新授权',
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
                    icon: "none",
                    duration: 2000
                })
            },500)
           
            wx.hideLoading()
        }
    },

    getNameList() {
        post(API.getTeacherName,{userId:app.globalData.userInfo.id})
        .then(res => {
            this.setData({
                teacherName : res.data.data.teacherName,
                teacherCity : res.data.data.teacherCity
            })
        })
        .catch(err => {
            console.log(err)
        })
    },

    collect () {
        let value = wx.getStorageSync('teaSubscribe')
        if (value) {
            this.setData({
                teaSubscribe : false
            })
        }
    },
    // 订阅消息
    msg () {
        // if(this.data.teaSubscribe) {
            let _this = this 
            wx.requestSubscribeMessage({
                tmplIds: ['mYgdiiOxgQDUmpfhpzhmWKPo1sGDaQCjyUB-RqvRSrw'],
                success (res) { 
                    if(res.errMsg === 'requestSubscribeMessage:ok') {
                        wx.setStorageSync('teaSubscribe', 'hide')
                        _this.setData({
                            teaSubscribe : false
                        })
                    }
                },
                fail (err) {
                console.log(111)
                console.log(err)
                }
            })
        // }
    },

    formSubmit: function(e) {
        // console.log(e)
        var _this = this
        if(e.detail.value.username.length==0){
            wx.showToast({
                title: '请输入联系人姓名',
                icon: 'none',
                duration: 1500
            })
            setTimeout(function(){
                wx.hideToast()
            },2000)
        }else if(e.detail.value.city.length==0){
            wx.showToast({
                title: '请输入所在城市',
                icon: 'none',
                duration: 1500
            })
            setTimeout(function(){
                wx.hideToast()
            },2000)
        }else{
            post(API.addTeacherName,{userId:app.globalData.userInfo.id,name:e.detail.value.username,city:e.detail.value.city})
            .then(res => {
                // 登录  更改老师状态
                app.login()
                if(res) {
                    wx.navigateTo({
                        url:'../userCode/userCode'
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    },

    myShare () {
        wx.switchTab({
          url: '../my/my'
        })
    },


})
