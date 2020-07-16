import API from '../../utils/server'
import {get, post} from '../../utils/netUtil'
let app = getApp();
Page({

    data: {
       indexTop : null,
       query:{},
       userInfo:{},
       materialDetail:[],  //资料详情
       squadId : null,   //团ID
       squadList:[],   //团列表
       squadState : null,   //团状态 0 失败 1成功 2 进行中
       createTime : '',   //创团时间
       hour : '',
       minute : '',
       second : '',
       isCreate:null,  //是否创建过团
       isEnter:null,  //是否加入过团
       isRule : false, //活动规则弹窗
       isSubscribe : true, // 订阅消息是否拉起
       isModal : false, //手机号弹窗
       shareImg : '' // 分享图
    },
    onLoad: function (options) {
        console.log(options,'接受参数')
        console.log(app.globalData.userInfo,'666')
        console.log(app.globalData)
        let menuButton=wx.getMenuButtonBoundingClientRect()
        this.setData({
            indexTop : menuButton.top
        })

        if (app.globalData.userInfo.nickname) {
            console.log(app.globalData.userInfo,'888')
            this.setData({
                query : options,
                userInfo : app.globalData.userInfo
            })
            this.getMaterialDetail()
            this.isGroup()


        }else {
            app.getData = (data)=> {
                this.setData({
                    query : options,
                    userInfo : app.globalData.userInfo,
                    squad : null,
                })
                this.getMaterialDetail()
                this.isGroup()
            }
        }
        // 分享图
        let {classId} = options
        if(classId == 5) {
            this.setData({
                shareImg : 'https://xxzx.chinaedu.net/wx/img/1594197698829.png'
            })
        }else if(classId == 6) {
            this.setData({
                shareImg : 'https://xxzx.chinaedu.net/wx/img/1594198357375.png'
            })
        }else if(classId == 3) {
            this.setData({
                shareImg : 'https://xxzx.chinaedu.net/wx/img/1594197335127.png'
            })
        }else {
            this.setData({
                shareImg : 'https://xxzx.chinaedu.net/wx/img/1594197866711.png'
            })
        }

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
                        this.setData({
                            isModal : true
                        })
                        wx.hideLoading()
                    } else {
                        setTimeout(()=> {
                            wx.showToast({
                                title: '授权失败',
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
                //console.log(e)
                setTimeout(()=> {
                    wx.showToast({
                        title: '授权失败',
                        icon: 'none',
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
                            console.log(_this.data.userInfo,'手机号完成')
                            if(_this.data.squadList.length < 2 && _this.data.squadState === 2 && (_this.data.isCreate || _this.data.isEnter)) {
                                console.log('立即邀请好友')
                            }
                            if(!_this.data.isCreate && !_this.data.isEnter && _this.data.squadList.length < 2 && _this.data.squadList.squadState !== 0) {
                                _this.addGroup()
                            }
                            if(_this.data.squadList.length === 2 && ( _this.data.isCreate ||  _this.data.isEnter)) {
                                _this.lookMaterial()
                            }
                            if(_this.data.squadState === 0) {
                                _this.createGroup()
                            }
                            if(!_this.data.isCreate && !_this.data.isEnter && _this.data.squadList.length === 2) {
                                _this.createGroup()
                            }
                            wx.hideLoading()
                        }).catch(err => {
                            console.log(err)
                            wx.hideLoading()
                        })
                    }else {
                        console.log('登录失败!' + res.errMsg)
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
  

    getMaterialDetail(){
        wx.showLoading({
            title: '加载中',
            mask: true,
        })
        get(`${API.getMaterialPackageDetail}?id=${this.data.query.classId}`)
        .then((res)=>{
            this.setData({
                materialDetail : res.data.data
            })
            wx.hideLoading()
        })
        .catch(err=> {
            console.log(err)
            wx.hideLoading()
        })
    },
    // 团员列表
    getSquadList(id,isUpdate) {
       let squadId = id || this.data.squadId   //没开团使用options带进来的squadId  开过或者创建过就使用自己的squadId 
        post(API.getSquadUser,{squadId})
        .then(res=> {
            // console.log(res.data.data.createTime,'9999')
            res.data.squadUserList.createTime = res.data.squadUserList.createTime.replace(/-/g,"/")
            this.setData({
                squadList : res.data.squadUserList.userList,
                createTime : res.data.squadUserList.createTime,
                squadState : res.data.squadUserList.squadState
            })
            if(res.data.squadUserList.squadState === 2) {
                this.endTime()
            }
            if(isUpdate) {
                this.isGroup()  // 加入团之后再次获取是否加入
            }
            
        })
        .catch(err=> {
            console.log(err)
        })
    },

    endTime() {
        this.timer = setInterval(() => {
            let createTime = this.data.createTime
            createTime = new Date(createTime).getTime() + 24*60*60*1000
            let newTime = new Date().getTime()
            let endTime = createTime - newTime
            let hour =parseInt(endTime/1000/60/60)
            hour=hour<10?'0'+hour:hour
            let minute =parseInt(endTime/1000/60%60)
            minute=minute<10?'0'+minute:minute
            let second =parseInt(endTime/1000%60)
            second=second<10?'0'+second:second
            this.setData({
                hour : hour,
                minute : minute,
                second : second,
            })
            if(endTime<0) {
                console.log("进来了么")
                clearInterval(this.timer)
                this.isGroup()
                
            }
        }, 1000);

    },

    // 加入队伍
    addGroup() {
        var {squadId,classId} = this.data.query
        console.log(squadId)
        post(API.addSquad,{squadId,userId:app.globalData.userInfo.id,classId})
        .then(res => {
            console.log(res,'加入队伍')
            if(res.data.code) {
                wx.showToast({
                    title: '组团成功',
                    icon: 'success',
                    duration: 2000
                })
                this.getSquadList(squadId,true)
                // this.isGroup()  
                
            }
        })
        .catch(err => {
            console.log(err)
        })
    },

    // 查看资料
    lookMaterial() {
        wx.navigateTo({
            url: `../wealMaterial/wealMaterial?classId=${this.data.query.classId}`
        });
    },

    // 创建队伍 开新团
    createGroup() {
        console.log(666)
        post(API.createGroup,{ userId : app.globalData.userInfo.id,classId :this.data.query.classId})
        .then(res => {
            console.log(res,666666666666)
            if(res.data.squadUserList) {
                this.isGroup()
                // this.getSquadList(res.data.squadUserList.id)
            }
        })
        .catch(err => {
            console.log(err)
        })
    },

    isGroup() {
        // 判断是否开团
        post(API.isGroup,{classId : this.data.query.classId,userId : app.globalData.userInfo.id})
        .then(res => {
            console.log(this.data.query.classId,app.globalData.userInfo.id)
            console.log(res,'是否开团')
            if(res.data.data) {
                this.setData({
                    isCreate : res.data.data.isCreate,
                    isEnter : res.data.data.isEnter,
                    squadId : res.data.data.squadId
                })
                this.getSquadList()
            }else {
                console.log('没加入团，也没创建团')
                this.getSquadList(this.data.query.squadId)
                console.log(this.data.query.squadId,96325)
            }
        })
        .catch(err => {
            console.log(err)
        })
      },

    collect () {
    let value = wx.getStorageSync('isSubscribe')
    if (value) {
        this.setData({
            isSubscribe : false
        })
    }
    },
    // 订阅消息
    msg () {
        let _this = this
        // if(_this.data.isSubscribe) {
            wx.requestSubscribeMessage({
                tmplIds: ['ghNxgfgBjhH7SL8i6w75BZauADub3ukGUG38sdcixKc','0q6BvftM_yKS_sXd-4K4UYHcig5CWv0AjNMMsrYlJYQ'],
                success (res) {
                    console.log(res)
                    if(res.errMsg === 'requestSubscribeMessage:ok') {
                        wx.setStorageSync('isSubscribe', 'hide')
                        _this.setData({
                            isSubscribe : false
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

    // 分享
    onShareAppMessage: function () {
        console.log(`/pages/group/group?shareUserId=${app.globalData.shareUserId}&classId=${this.data.query.classId}&squadId=${this.data.squadId}&isShare=true`)
        console.log(app.globalData.shareUserId)
        return {
            title:`免费送你一份${this.data.materialDetail[0].materialName}，过期失效>>`,
            imageUrl:`${this.data.shareImg}`,
            path:`/pages/group/group?shareUserId=${app.globalData.shareUserId}&classId=${this.data.query.classId}&squadId=${this.data.squadId}&isShare=true`,
            success: function(res) {
                // console.log(res)
            },
            fail: function(res) {
                // console.log(res)
            }
        }
    },

    // 回首页
    goIndex() {
        wx.switchTab({
            url: `../index/index`
        });
    },

    // 打开活动
    openRule() {
        this.setData({
            isRule : true
        }) 
    },
    
    // 关闭活动
    closeRule() {
        this.setData({
            isRule : false
        })
    },

     // 页面卸载
     onUnload() {
         clearInterval(this.timer)
        //  timer=null
     }

})
