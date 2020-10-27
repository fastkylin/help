const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    no: '',
    name: '',
    phone: '',
    cai: false,
    total_fee: 2,
    address: ''
  },

  navTo(e) {
    app.com.navTo(e)
  },
  chooseFile() {
    wx.navigateTo({
      url: '/pages/dayin/dy/dy',
    })
    // wx.chooseMessageFile({
    //   count: 1,
    //   type: 'all',
    //   success(res) {
    //     const tempFilePaths = res.tempFilePaths
    //     console.log(res)
    //   }
    // })
  },
  phoneInput(e) {
    this.data.phone = e.detail.value
    this.init()
  },
  nameeInput(e) {
    this.data.name = e.detail.value
    this.init()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    this.setData({
      msg: wx.getStorageSync("server")[options.index],
      price: wx.getStorageSync("server")[options.index].price_gui.split(','),
    })
    this.init()
    if (wx.getStorageSync("address")) {
      let add = wx.getStorageSync("address")
      this.setData({
        address: add.address + '-' + add.detail
      })
    }
  },
  onShow() {
    this.getFile()
  },
  getFile() {
    wx.showLoading({
      title: '请稍等',
      task: true
    })
    app.com.post('file/get', {
      sorts: 'create_time desc',
      pageIndex: 1,
      pageSize: 1,
      wheres: 'is_delete=0 and is_temp=1 and wx_id = ' + wx.getStorageSync('user').id
    }, function (res) {
      wx.hideLoading()
      if (res.code == 1) {
        _this.setData({
          file: res.data.list[0] ? res.data.list[0] : ''
        })
      }
    })
  },
  formSubmit(e) {
    let formId = e.detail.formId
    if (this.data.address == '') {
      wx.showToast({
        title: '请选择一个地址',
        icon: 'none'
      })
    } else if (e.detail.value.name == '' || e.detail.value.name == null) {
      wx.showToast({
        title: '请输入取货姓名',
        icon: 'none'
      })
    } else if (e.detail.value.phone == '') {
      wx.showToast({
        title: '请输入联系电话',
        icon: 'none'
      })
    } else if (e.detail.value.phone.length > 11) {
      wx.showToast({
        title: '电话格式不对',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      app.com.post('help/add', {
        openid: wx.getStorageSync("user").openid,
        des: e.detail.value.des,
        wx_id: wx.getStorageSync("user").id,
        total_fee: this.data.total_fee,
        a_id: wx.getStorageSync("area").pk_id,
        title: this.data.msg.server_name,
        mu: this.data.address,
        cai: this.data.cai ? 1 : 0,
        help_name: e.detail.value.name,
        help_phone: e.detail.value.phone,
        form_id: e.detail.formId,
      }, function (res) {
        if (res.code == 1) {
          wx.showToast({
            title: '发布成功',
          })
          _this.wxpay(res)
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }
  },
  wxpay(msg) {
    app.com.wxpay(msg)
  },
  switch1Change(e) {
    this.setData({
      cai: e.detail.value
    })
    this.init()
  },

  init() {


  }
})