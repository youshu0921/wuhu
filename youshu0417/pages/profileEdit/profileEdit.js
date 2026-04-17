const { USER_KEY, read, write } = require("../../utils/storage")

const EDUCATION_OPTIONS = ["高中/以下", "大专", "本科", "硕士", "博士"]
const INCOME_OPTIONS = ["1000-5000", "5000-10000", "10000-20000", "20000以上"]
const BOOLEAN_OPTIONS = ["未填写", "是", "否"]

function toNumber(value, fallback) {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

function boolToIndex(value) {
  if (value === true) return 1
  if (value === false) return 2
  return 0
}

function indexToBool(index) {
  if (index === 1) return true
  if (index === 2) return false
  return ""
}

function getOptionIndex(list, value) {
  const idx = list.indexOf(value)
  return idx >= 0 ? idx : 0
}

Page({
  data: {
    userInfo: {},
    genderIndex: 0,
    educationOptions: EDUCATION_OPTIONS,
    incomeOptions: INCOME_OPTIONS,
    boolOptions: BOOLEAN_OPTIONS,
    educationIndex: 0,
    incomeIndex: 0,
    hasCarIndex: 0,
    hasHouseIndex: 0
  },

  onLoad() {
    this.loadUserInfo()
  },

  loadUserInfo() {
    const userInfo = read(USER_KEY, {})
    this.setData({
      userInfo,
      genderIndex: userInfo.gender === "女" ? 1 : 0,
      educationIndex: getOptionIndex(EDUCATION_OPTIONS, userInfo.education || EDUCATION_OPTIONS[0]),
      incomeIndex: getOptionIndex(INCOME_OPTIONS, userInfo.incomeRange || INCOME_OPTIONS[0]),
      hasCarIndex: boolToIndex(userInfo.hasCar),
      hasHouseIndex: boolToIndex(userInfo.hasHouse)
    })
  },

  chooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.setData({ "userInfo.avatar": tempFilePath })
      }
    })
  },

  inputNickname(e) {
    this.setData({ "userInfo.nickname": e.detail.value })
  },

  inputCity(e) {
    this.setData({ "userInfo.city": e.detail.value })
  },

  inputHeight(e) {
    this.setData({ "userInfo.height": e.detail.value })
  },

  inputWeight(e) {
    this.setData({ "userInfo.weight": e.detail.value })
  },

  inputAge(e) {
    this.setData({ "userInfo.age": e.detail.value })
  },

  inputJob(e) {
    this.setData({ "userInfo.job": e.detail.value })
  },

  inputBio(e) {
    this.setData({ "userInfo.bio": e.detail.value })
  },

  inputPartnerRequirement(e) {
    this.setData({ "userInfo.partnerRequirement": e.detail.value })
  },

  changeGender(e) {
    const val = Number(e.detail.value)
    this.setData({
      genderIndex: val,
      "userInfo.gender": val === 0 ? "男" : "女"
    })
  },

  changeEducation(e) {
    const idx = Number(e.detail.value)
    this.setData({
      educationIndex: idx,
      "userInfo.education": EDUCATION_OPTIONS[idx]
    })
  },

  changeIncome(e) {
    const idx = Number(e.detail.value)
    this.setData({
      incomeIndex: idx,
      "userInfo.incomeRange": INCOME_OPTIONS[idx]
    })
  },

  changeHasCar(e) {
    const idx = Number(e.detail.value)
    this.setData({
      hasCarIndex: idx,
      "userInfo.hasCar": indexToBool(idx)
    })
  },

  changeHasHouse(e) {
    const idx = Number(e.detail.value)
    this.setData({
      hasHouseIndex: idx,
      "userInfo.hasHouse": indexToBool(idx)
    })
  },

  saveProfile() {
    const userInfo = this.data.userInfo || {}

    if (!userInfo.nickname) {
      wx.showToast({ title: "请先填写昵称", icon: "none" })
      return
    }

    if (!userInfo.city) {
      wx.showToast({ title: "请填写所在城市", icon: "none" })
      return
    }

    userInfo.height = toNumber(userInfo.height, 172)
    userInfo.weight = toNumber(userInfo.weight, 66)
    userInfo.education = userInfo.education || EDUCATION_OPTIONS[this.data.educationIndex]
    userInfo.incomeRange = userInfo.incomeRange || INCOME_OPTIONS[this.data.incomeIndex]

    if (!userInfo.id) {
      userInfo.id = `USER${Date.now().toString().slice(-6)}`
    }

    write(USER_KEY, userInfo)
    wx.showToast({ title: "保存成功", icon: "success" })

    setTimeout(() => {
      wx.navigateBack()
    }, 350)
  }
})