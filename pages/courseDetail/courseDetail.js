import API from '../../utils/server'
import {get, post} from '../../utils/netUtil'
let app = getApp();
Page({

    data: {
        isIpx: app.globalData.isIpx ? true : false, //底部按钮适配Iphone X
        pickerHidden: true,
        chosen: '',
        id : null,
        courseDetail : null,
        normalUrl : API.normalUrl,
    },
    onLoad: function (options) {
        this.setData({
            id : options.couseid
        })
        this.collect()
        this.getHotDetail();
    },
    collect () {
        let value = wx.getStorageSync('isWealModal')
        if (!value) {
            setTimeout(()=>{
                this.setData({
                    isWealModal : true
                })
            },3000)
        }
    },
    handClose(){
        wx.setStorageSync('isWealModal', 'yes')
        this.setData({
            isWealModal : false
        })
    },
    getHotDetail () {
        get(`${API.hotClassDetail}?id=${this.data.id}`).then(res => {
            if (res.data.code === 1) {
                this.setData({
                    courseDetail : res.data.data
                })
                wx.setNavigationBarTitle({
                  title: this.data.courseDetail.name
                })
            }
        })
    },

    getInformation() {
        wx.navigateTo({
            url: `../wealMaterial/wealMaterial?classId=${this.data.id}`
        });
    },

    

    onShareAppMessage: function () {
        return {
            title:'这里有' + this.data.courseDetail.name + '名师精讲课，免费试听！',
            imageUrl:this.data.normalUrl + this.data.courseDetail.shareImg,
            path:`/pages/courseDetail/courseDetail?couseid=${this.data.id}&?shareUserId=${app.globalData.shareUserId}`,
            success: function(res) {
                // console.log(res)
            },
            fail: function(res) {
                // console.log(res)
            }
        }
    }
})
