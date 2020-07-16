import API from '../../utils/server'
import {get, post} from '../../utils/netUtil'
let app = getApp();
Page({

    data: {
        isIpx: app.globalData.isIpx ? true : false, //底部按钮适配Iphone X
        pickerHidden: true,
        chosen: '',
        id : null,
        projectDetail: {},
        normalUrl : API.normalUrl
    },
    onLoad: function (options) {
        //console.log(this.data)
        this.setData({
            id : options.couseid
        })
        this.getProjectDetail()


    },
    getProjectDetail () {
        get(`${API.projectDetail}?id=${this.data.id}`).then(res => {
            if (res.data.code === 1) {
                this.setData({
                    projectDetail : res.data.data
                })
                wx.setNavigationBarTitle({
                    title: this.data.projectDetail.name
                })
            }
        })
    },
    onShareAppMessage: function () {
        return {
            //title:this.data.projectDetail.name + '-职业培训课',
            title:'还在为考证烦恼？让名师助你一次通关！',
            imageUrl:this.data.normalUrl + this.data.projectDetail.shareImg,
            path:`/pages/projectDetail/projectDetail?couseid=${this.data.id}&?shareUserId=${app.globalData.shareUserId}`,
            success: function(res) {
                //console.log(res)
                //console.log(title,imageUrl,path);
            },
            fail: function(res) {
                console.log(res)
            }
        }
    }
})
