const app = getApp()
import API from '../../utils/server'
import {get, post} from '../../utils/netUtil'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      userInfo : {},
      shareList : []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let that = this
      this.setData({
          userInfo : app.globalData.userInfo
      },
      () => {
          that.getShareList()
      }
      )

    },
    getShareList () {
      let userInfo = this.data.userInfo
      get(`${API.getShareList}?id=${userInfo.id}`)
          .then(res => {
            console.log(res)
            this.setData({
                shareList : res.data.data
            })
          })
          .catch(err => {
            console.log(err)
          })
    }
})
