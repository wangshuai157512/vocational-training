import API from '../../utils/server'
import {get, post} from '../../utils/netUtil'
let app = getApp();
Page({

    data: {
        showPage: false,
        query : {},
        userInfo : {},
        materialList : [],
        squadId : null,
        squadState : null,
        isCreate : null,
        isEnter : null,
        isModal : false,
        normalUrl : API.normalUrl,
        downloadProgress : null
    },
    onLoad: function (options) {
        this.setData({
            query : options,
            userInfo :app.globalData.userInfo
        })
        this.getMaterial()
    },

    onShow () {
        this.getSquadState()
        this.isGroup()
    },

    // 资料列表
    getMaterial() {
        wx.showLoading({
            title: '加载中',
            mask: true,
        })
        get(`${API.getMaterialList}?classId=${this.data.query.classId}`)
        .then(res => {
            // console.log(res)
            this.setData({
                materialList : res.data.data
            })
            wx.hideLoading()
        })
        .catch(err => {
            console.log(err)
            wx.hideLoading()
        })
    },

    // 下载打印
    put(e) {
        console.log(e)
        let putUrl = e.currentTarget.dataset.materialurl
        let copyUrl = `${this.data.normalUrl}${putUrl}`
        wx.showModal({
            // title: '提示',
            content: '点击确定复制文档地址，可粘贴到浏览器打开',
            success (res) {
              if (res.confirm) {
                wx.setClipboardData({
                    //去找上面的数据
                    data: copyUrl,
                    success: function (res) {
                      wx.showToast({
                        title: '复制成功',
                      });
                    }
                  });
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          
    },
   
    // 查看资料 直接打开
    lookMaterial(e) {
        let materialUrl = e.currentTarget.dataset.materialurl
        let _this = this
        // @ts-ignore
        const downloadTask= wx.downloadFile({
            url: `${_this.data.normalUrl}${materialUrl}`,
            success: (res) => {
                const filePath= res.tempFilePath
                wx.openDocument({
                    filePath: filePath,
                    fileType: 'pdf',
                    success: (data) => {
                        console.log(data)
                    },
                    fail: (err) => {
                        console.log(err)
                    }
                })
            }
        })
        downloadTask.onProgressUpdate((res) => {
            let progress= res.progress
            _this.setData({
                downloadProgress: progress
            })
            wx.showLoading({
                title: `正在打开${_this.data.downloadProgress}%`
            })
            if (progress === 100) {
                wx.hideLoading({})
            }
        })
    },

    // 是否拼团成功
    getSquadState() {
        wx.showLoading({
            title: '加载中',
            mask: true,
        })
        get(`${API.squadState}?userId=${app.globalData.userInfo.id}&classId=${this.data.query.classId}`)
        .then(res => {
            console.log(res)
            this.setData({
                squadState : res.data.data.squadState,
                showPage : true
            })
            wx.hideLoading({})
        })
        .catch(err => {
            console.log(err)
            wx.hideLoading({})
        })
    },

    //  是否开团
     isGroup() {
        let _this = this 
        post(API.isGroup,{ userId : app.globalData.userInfo.id,classId : this.data.query.classId})
        .then(res => {
            if(res.data.data) {
                _this.setData({
                    squadId : res.data.data.squadId,
                    isCreate : res.data.data.isCreate,
                    isEnter : res.data.data.isEnter
                })
            }else {
                console.log('未加入团也没创建团')
            }
        })
        .catch(err => {
            console.log(err)
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
                    this.setData({
                        isModal : true
                    })
                    wx.hideLoading()
                } else {
                    setTimeout(()=>{
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
                setTimeout(()=>{
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
                                _this.shareBtn()
                                wx.hideLoading()
                            }else {
                                setTimeout(()=> {
                                    wx.showToast({
                                        title:"授权后免费领备考资料~",
                                        icon: "none",
                                        duration: 2000
                                    })
                                },500)
                                wx.hideLoading()
                            }
                           
                        }).catch(err => {
                            setTimeout(()=> {
                                wx.showToast({
                                    title:"授权失败",
                                    icon: "none",
                                    duration: 2000
                                })
                            },500)
                            console.log(err)
                            wx.hideLoading()
                        })
                    }else {
                        console.log('登录失败！' + res.errMsg)
                        wx.hideLoading()
                    }
                }
            })
        }else {
            setTimeout(()=> {
                wx.showToast({
                    title:"授权后免费领备考资料~",
                    icon: "none",
                    duration: 2000
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

    

     // 领取资料 开新团
     shareBtn() {
        if(this.data.isCreate || this.data.isEnter) {
            wx.navigateTo({
                url:`../group/group?squadId=${this.data.squadId}&classId=${this.data.query.classId}&isPage=true`
            })
            return
        }
        post(API.createGroup,{ userId : app.globalData.userInfo.id,classId :this.data.query.classId})
        .then(res => {
            if(res.data.squadUserList) {
                wx.navigateTo({
                    url:`../group/group?squadId=${res.data.squadUserList.id}&classId=${this.data.query.classId}&isPage=true`
                })
            }
        })
        .catch(err => {
            console.log(err)
        })
    },
})
