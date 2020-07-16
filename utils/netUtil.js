// 参数检测
function paramsToParam (params) {
    if(!params) {
        return {}
    }
    return params
}

// post请求，返回promise
export function post (url,data) {
    let promise = new Promise ((resolve,reject)=> {
        data = paramsToParam(data);
        let postData = data 
        wx.request({
            url: url,
            data: postData,
            method: 'post',
            success: function(res) {
                resolve (res)
            },
            fail: function(e) {
                reject(e)
                wx.showToast({
                    title: '网络未连接',
                    icon: 'none',
                    duration: 2000,
                });
            }
        }) 
    })
    return promise
}

// get 请求， 返回promise
export function get (url) {
    let promise = new Promise ((resolve,reject)=> {
        wx.request({
            url: url,
            success: function (res) {
                resolve (res)
            },
            fail: function(e) {
                reject ('网络出错')
            }
        })
    })
    return promise
}