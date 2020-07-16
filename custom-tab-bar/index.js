const app = getApp()

import api from '../utils/server'
import { post } from "../utils/netUtil";

Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    borderStyle: "black",
    selectedColor: "#3cc51f",
    isIpx: app.globalData.isIpx ? true : false, //底部按钮适配Iphone X
    list: [{
      "selectedIconPath": "/public/images/home_active.png",
      "iconPath": "/public/images/home_normal.png",
      "pagePath": "/pages/apply/apply",
      "text": "免费体验1"
    }, {
      "selectedIconPath": "/public/images/my_active.png",
      "iconPath": "/public/images/my_normal.png",
      "pagePath": "/pages/multidimensionalUser/multidimensionalUser",
      "text": "免费体验2"
    }],
    userInfo : null
  },
  attached() {
    let _this = this
    let userInfo = app.globalData.userInfo
    if (!userInfo.phone) {
      app.getUser = (data) => {
        //console.log(data)
        _this.setData({
          userInfo : data
        })
      }
    }else {
      _this.setData({
        userInfo : userInfo
      })
    }
  },
  methods: {
    switchTab(e) {
      wx.navigateTo({url:'/pages/apply/apply'})
    },
    getPhoneNumber (e) {
      let _this = this
      let {encryptedData,iv} = e.detail
      if(e.detail.errMsg==="getPhoneNumber:ok") {
        wx.login({
          success(res) {
            if(res.code) {
              post(`${api.authPhone}`,{
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
                // console.log(_this.data.userInfo)
              })
            }else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      }else {
        wx.showToast({
          title:"请先授权手机号",
          icon: "none"
        })
      }
    }
  }
})