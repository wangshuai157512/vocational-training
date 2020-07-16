import API from '../../utils/server'
import {get, post} from '../../utils/netUtil'
let app = getApp();
Page({

    data: {
        materialList : [],
        normalUrl : API.normalUrl,
    },
    onLoad: function () {
        this.getMaterials()
    },

    onShow () {
        
    },

    getMaterials() {
        get(API.materials)
        .then(res => {
            this.setData({
                materialList : res.data.data
            })
        })
        .catch(err => {
            console.log(err)
        })
    },

    handleMaterials(e) {
        // console.log(e)
        let classId = e.currentTarget.dataset.classid
        wx.navigateTo({
            url: `../wealMaterial/wealMaterial?classId=${classId}`
        });
    }

     
})
