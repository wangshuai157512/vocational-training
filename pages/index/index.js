//index.js
import API from '../../utils/server'
import {get, post} from '../../utils/netUtil'
//获取应用实例
const app = getApp()


Page({
  data: {
    show : '', // 审核
    cancel: false, // 是否点击取消
    isIpx: app.globalData.isIpx ? true : false, //底部按钮适配Iphone X
    userInfo: {},
    normalUrl: '', // 默认图片路径
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    codeImg : '',
    currentSwiper: 0,
  },
  onLoad: function () {
    this.collect ()
    if(app.globalData.userInfo.nickname) {
      this.setData({
        userInfo: app.globalData.userInfo,
        show:app.globalData.showContent
      })
    }else {
      app.getData = (data)=> {
        this.setData({
          userInfo: app.globalData.userInfo,
          show:app.globalData.showContent
        })
      }
    }
    this.setData({
      normalUrl: API.normalUrl
    })
    wx.getSetting({
      success (res) {
        console.log(res,"本地存储")
      }
    })

    this.HotClassList();
    this.OtherProjectList();
  },
  //轮播图的切换事件
  swiperChange() {
    this.setData({
      currentSwiper: e.detail.current
    })
  },

  teacherIndex() {
    wx.navigateTo({
      url: '../teacherIndex/teacherIndex'
    })
  },
  // ghNxgfgBjhH7SL8i6w75BQW0BMauaBkj1SrICSYpfuA
  msg () {
    wx.requestSubscribeMessage({
      tmplIds: ['0q6BvftM_yKS_sXd-4K4UfVwyH5Cmjhgx6E18Ik9Slw','ghNxgfgBjhH7SL8i6w75BQW0BMauaBkj1SrICSYpfuA'],
      success (res) { 
        console.log(res)
      },
      fail (err) {
        console.log(111)
        console.log(err)
      }
    })
  },
  onShow() {
    //this.HotClassList();
    //this.OtherProjectList();
    // if(app.globalData.userInfo.nickname) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo
    //   })
    // }else {
    //   app.getData = (data)=> {
    //     this.setData({
    //       userInfo: app.globalData.userInfo
    //     })
    //   }
    // }
  },

  // 获取热门项目数据
  HotClassList() {
    wx.showLoading({
      title: '加载中',
      mask: 'true'
    })
    get(`${API.HotClass}`).then((res)=> {
      //console.log(this.data.HotClassList);
      //this.data.HotClassList = [{catid: 0, catname: "推荐"}]
      //let data = [...this.data.HotClassList,...res.data.data]
      //console.log(res.data.data);
      this.setData({
        HotClassList:res.data.data
      })
      wx.hideLoading()
    }).catch((e)=> {
      //console.log(e)
      wx.hideLoading()
    })
  },


  // 跳转详情页
  handleHotClass(e) {
    if(app.globalData.showContent) {
      return
    }else {
      let couseid = e.currentTarget.dataset.couseid
      wx.navigateTo({
        url: `../courseDetail/courseDetail?couseid=${couseid}`
      });
    }
    
  },

  // 跳转其他列表页
  handleOtherClass(e) {
    // console.log(e)
    let couseid = e.currentTarget.dataset.couseid
    if(!this.data.userInfo.nickname) {
      return
    }
    wx.navigateTo({
      url: `../projectDetail/projectDetail?couseid=${couseid}`
    });
  },



  // 获取其他项目数据
  OtherProjectList() {
    wx.showLoading({
      title: '加载中',
      mask: 'true'
    })
    get(`${API.OtherProject}`).then((res)=> {
      //console.log(res.data.data);
      this.setData({
        OtherProjectList:res.data.data
      })
      wx.hideLoading()
    }).catch((e)=> {
      //console.log(e)
      wx.hideLoading()
    })
  },


  linkTo(e) {
    wx.navigateTo({
      url: `../apply/apply`
    })
  },


 // 授权登录
  getUserInfo (e) {
    console.log(e)
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
              } else {
              }
            })
          }
        },
        fail:()=> {
          //console.log(e)
        }
      })
    }else {
      wx.showToast({
        title: '需要授权才可以查看详细信息',
        icon: 'none',
        duration: 2000
      })
    }
  },

  collect () {
    let value = wx.getStorageSync('cancel')
    if (!value) {
        this.setData({
          cancel : true
        })
    }
  },
 
  // 添加小程序
  handleCancel(){
    wx.setStorageSync('cancel', 'yes')
    this.setData({
      cancel : false
    })
  },


  onShareAppMessage: function () {
      return {
          title:"还在为考证烦恼？让名师助你一次通关",
          imageUrl:this.data.normalUrl + this.data.courseDetail.shareImg,
          path:`/pages/index/index?shareUserId=${app.globalData.shareUserId}`,
          success: function(res) {
              // console.log(res)
          },
          fail: function(res) {
              // console.log(res)
          }
      }
  }

})
