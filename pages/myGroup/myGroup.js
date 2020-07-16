import API from '../../utils/server'
import {get, post} from '../../utils/netUtil'
let app = getApp();
Page({

    data: {
        myGroupList : [],
        normalUrl : API.normalUrl,
        currentTab:0,
        type:'', // 查询接口 0 失败 1 成功 2 进行中
        hour : '', 
        minute : '',
        second : '',
    },
    onLoad: function () {

    },
    onShow() {
        this.getMySquadList()
    },

    // 滑动切换
    swiperTab(e) {
        clearInterval(this.timer)
        this.timer=null
        this.setData({
            currentTab:e.detail.current
        })
        if(e.detail.current == '1') {
            this.setData({
                type : 2
            })
        }else if(e.detail.current == '2')  {
            this.setData({
                type : 1
            })
        }else if(e.detail.current == '3') {
            this.setData({
                type : 0
            })
        }else {
            this.setData({
                type : ''
            })
        }
        this.getMySquadList()
    },

    //点击切换
    clickTab(e) {
        if(this.data.currentTab === e.target.dataset.current) return false
        this.setData( {
            currentTab: e.target.dataset.current
        })
        if(e.target.dataset.current === '1') {
            this.setData({
                type : 2
            })
        }else if(e.target.dataset.current === '2')  {
            this.setData({
                type : 1
            })
        }else if(e.target.dataset.current === '3') {
            this.setData({
                type : 0
            })
        }else {
            this.setData({
                type : ''
            })
        }
        // this.getMySquadList()
    },

    getMySquadList() {
        let _this = this
        get(`${API.getMySquadList}?userId=${app.globalData.userInfo.id}&type=${this.data.type}`)
        .then((res) => {
            res.data.data = res.data.data.sort((a, b) => {
                return b.squadId - a.squadId;
            })
            res.data.data.forEach((item)=> {
                item.createTime = item.createTime.replace(/-/g,"/")
            })
            clearInterval(this.timer)
             // 倒计时
             this.timer = setInterval(() => {
                res.data.data.forEach((item)=> {
                    if(item.squadState === 2) {
                        let createTime = item.createTime
                        createTime = new Date(createTime).getTime() + 24*60*60*1000
                        // console.log(createTime,582)
                        let newTime = new Date().getTime()
                        let endTime = createTime - newTime    
                        let hour =parseInt(endTime/1000/60/60)
                        hour=hour<10?'0'+hour:hour
                        let minute =parseInt(endTime/1000/60%60)
                        minute=minute<10?'0'+minute:minute
                        let second =parseInt(endTime/1000%60)
                        second=second<10?'0'+second:second
                        item.hour = hour
                        item.minute = minute
                        item.second = second
                        if(endTime<0) {
                            this.getMySquadList()
                        }
                        this.setData({
                            myGroupList : res.data.data
                        })
                        // console.log(item) 
                        
                    }
                }) 
            }, 1000);
            this.setData({
                myGroupList : res.data.data
            })
        })
        .catch(err => {
            console.log(err)
        })
    },

    // 邀请好友
    shareFriend(e) {
        var classId = e.currentTarget.dataset.classid
        var squadId = e.currentTarget.dataset.squadid
        wx.navigateTo({
             url: `../group/group?squadId=${squadId}&classId=${classId}`
        })
    },

    lookDetail(e) {
        var classId = e.currentTarget.dataset.classid
        var squadId = e.currentTarget.dataset.squadid

        wx.navigateTo({
             url: `../group/group?squadId=${squadId}&classId=${classId}`
        })

    },
  
    // 页面卸载
    onUnload() {
        clearInterval(this.timer)
    }
})
