import API from '../../utils/server'
import {get, post} from '../../utils/netUtil'
import {base64src} from '../../utils/util'
let app = getApp();
let tempFilePath = null
Page({

    data: {
        isShow : false,
        windowW:null,
        windowH:null,
        codeImg:'',
        tem:'',
        bg:'https://xxzx.chinaedu.net/wx/img/1594630384511.png'
    },
    onLoad: function () {
        // console.log(app.globalData.userInfo)
        this.setData({
            tem : app.globalData.userInfo.avatarUrl
        })
        let _this = this
        wx.getSystemInfo({
            success (res) {
                _this.setData({
                    windowW:res.windowWidth,
                    windowH:res.windowHeight
                })
            }
        })
        this.getImg()
    },

    getImg() {
        wx.showLoading({
            title: '正在合成',
            mask: true,
        })
        post(API.createCode,{
            id : app.globalData.userInfo.id
        })
            .then(res => {
                let bufferImg = "data:image/png;base64," + res.data.data;
                // 将base64图片转为本地图片
                base64src(`${bufferImg}`, res => {
                    console.log(res) // 返回图片地址，直接赋值到image标签即可
                    this.setData({
                        codeImg : res
                    })
                    this.drawImg()
                });
                // console.log(bufferImg)

            })
            .catch(err => {
                console.log(err)
            })
    },

    // 合成图片
    drawImg() {
        const ctx = wx.createCanvasContext('myCanvas')
        // 网络背景图
        let _this = this
        wx.downloadFile({
            url:`${_this.data.bg}`,
            success(res) {
                // console.log(res)
            ctx.save()
            ctx.beginPath(); //开始绘制
            let  bgPath = res.tempFilePath
            ctx.drawImage(`${bgPath}`, 0, 0,340, 510)
            ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上文午即状态 还可以继续绘制
            back()
            }
        })

        function back() {
            // 本地二维码
            ctx.save()
            ctx.beginPath(); //开始绘制
            ctx.drawImage(`${_this.data.codeImg}`, 238, 406, 70, 70)
            // ctx.drawImage(`${_this.data.codeImg}`, 150, 150, 120, 120)
            ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下文即状态 还可以继续绘制

            // 网络头像
            wx.downloadFile({
                url:`${app.globalData.userInfo.avatarUrl}`,
                success(res) {
                    console.log(res)
                    let filesPath = res.tempFilePath
                    ctx.save()
                    ctx.beginPath(); //开始绘制
                    ctx.arc(238+18+17,406+18+17,17,0,Math.PI * 2, false)
                    ctx.clip()
                    ctx.drawImage(`${filesPath}`, 238+18,406+18,17*2,17*2)  // X Y 宽高
                    ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下文即状态 还可以继续绘制
                    ctx.draw(false,()=>{
                        _this.setData({
                            isShow:true
                        })
                        setTimeout(function(){
                            wx.canvasToTempFilePath({
                                x: 0,
                                y: 0,
                                width: 680,
                                height: 1020,
                                destWidth: 680,
                                destHeight: 1020,
                                canvasId: 'myCanvas',
                                success(res) {
                                    tempFilePath = res.tempFilePath
                                }
                            })
                        },200)
                    })

                    wx.hideLoading()
                }
            })
        }


      },
    //保存图片
    savePhoto() {
        if(tempFilePath) {
            console.log(tempFilePath)
            wx.saveImageToPhotosAlbum({
                filePath: tempFilePath,
                success(res) {
                    wx.showToast({
                        title:"√保存成功！\r\n转发后可查看潜在客户~",
                        icon: "none",
                        duration: 5000
                    })
                },
                fail (err) {
                    // console.log(err)
                    if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
                        wx.showModal({
                          title: '提示',
                          content: '您还未授权，先去授权吧~',
                          success: res=>{
                            if (res.confirm) {
                                wx.openSetting({
                                    success (res) {}
                                })
                            }
                          }
                        })
                    }
                }
            })
        }else {
            wx.showToast({
            title: '正在合成图片',
            icon: 'loading',
            duration: 2000
            })
        }

    }

})
