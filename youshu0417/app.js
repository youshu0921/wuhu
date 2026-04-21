App({
  onLaunch() {
    this.initLocalRuntime()
    this.ensureLocalUserId()
  },

  initLocalRuntime() {
    try {
      if (wx.cloud) {
        wx.cloud.init({ traceUser: true })
      }
    } catch (err) {
      console.warn("Cloud init failed; fallback to local mode.", err)
    }
  },

  ensureLocalUserId() {
    const openid = wx.getStorageSync("openid")
    if (openid) return openid

    const devId = `dev_${Date.now()}`
    wx.setStorageSync("openid", devId)
    return devId
  },

  globalData: {
    userInfo: null
  }
})
