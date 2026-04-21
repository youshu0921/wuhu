const { USER_KEY, read, write } = require("../../utils/storage")

function maskIdCard(idCard = "") {
  if (!idCard || idCard.length < 8) return idCard
  return `${idCard.slice(0, 4)}********${idCard.slice(-4)}`
}

Page({
  data: {
    realName: "",
    idCard: "",
    submitting: false,
    verified: false,
    verifyTime: "",
    idCardMasked: ""
  },

  onLoad() {
    const userInfo = read(USER_KEY, {})
    this.setData({
      realName: userInfo.realName || "",
      verified: !!userInfo.realNameVerified,
      verifyTime: userInfo.verifyTime || "",
      idCardMasked: userInfo.idCardMasked || ""
    })
  },

  onNameInput(e) {
    this.setData({ realName: e.detail.value })
  },

  onIdCardInput(e) {
    this.setData({ idCard: e.detail.value })
  },

  submitVerify() {
    if (this.data.submitting) return

    const realName = (this.data.realName || "").trim()
    const idCard = (this.data.idCard || "").trim()
    if (!realName) {
      wx.showToast({ title: "请输入真实姓名", icon: "none" })
      return
    }

    if (!/(^\d{15}$)|(^\d{17}[\dXx]$)/.test(idCard)) {
      wx.showToast({ title: "请输入正确身份证号", icon: "none" })
      return
    }

    if (!wx.cloud || typeof wx.cloud.callFunction !== "function") {
      wx.showModal({
        title: "认证失败",
        content: "当前环境不支持云调用，请在微信开发者工具开启云开发后重试。",
        showCancel: false
      })
      return
    }

    this.setData({ submitting: true })
    wx.cloud
      .callFunction({
        name: "realnameVerify",
        data: {
          name: realName,
          idcard: idCard
        }
      })
      .then((res) => {
        const result = (res && res.result) || {}
        if (!result.ok) {
          throw new Error(result.message || "实名认证未通过")
        }

        const userInfo = read(USER_KEY, {})
        const verifyTime = new Date().toLocaleString("zh-CN")
        const nextUserInfo = {
          ...userInfo,
          realName,
          idCardMasked: maskIdCard(idCard),
          realNameVerified: true,
          verifyTime,
          realNameVerifyMsg: result.message || "实名认证通过"
        }
        write(USER_KEY, nextUserInfo)

        this.setData({
          verified: true,
          verifyTime,
          idCardMasked: nextUserInfo.idCardMasked
        })
        wx.showToast({ title: "实名认证成功", icon: "success" })
      })
      .catch((err) => {
        wx.showModal({
          title: "实名认证失败",
          content: err.message || "请稍后重试",
          showCancel: false
        })
      })
      .finally(() => {
        this.setData({ submitting: false })
      })
  }
})
