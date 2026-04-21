const { CHECK_IN_KEY, USER_KEY, POINTS_KEY, read, write } = require("../../utils/storage")

function formatDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getMonthLabel(date = new Date()) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`
}

function getMonthDays(date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth()
  return new Date(year, month + 1, 0).getDate()
}

function displayValue(value, fallback = "未填写") {
  return value || fallback
}

Page({
  data: {
    userInfo: {},
    profileSummary: [],
    checkInDays: 0,
    points: 0,
    showCalendar: false,
    monthLabel: "",
    calendarDays: [],
    monthCheckedCount: 0,
    realNameStatusText: "未认证",
    realNameStatusClass: "pending"
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const userInfo = read(USER_KEY, {})
    const checkInData = read(CHECK_IN_KEY, { days: 0, lastDate: "", records: [] })
    const pointsData = read(POINTS_KEY, { total: 0 })

    const realNameVerified = !!userInfo.realNameVerified
    const profileSummary = [
      { label: "城市", value: displayValue(userInfo.city) },
      { label: "职业", value: displayValue(userInfo.job) },
      { label: "学历", value: displayValue(userInfo.education) },
      { label: "收入", value: displayValue(userInfo.incomeRange) },
      {
        label: "有车",
        value: userInfo.hasCar === true ? "是" : userInfo.hasCar === false ? "否" : "未填写"
      },
      {
        label: "有房",
        value: userInfo.hasHouse === true ? "是" : userInfo.hasHouse === false ? "否" : "未填写"
      },
      {
        label: "实名",
        value: realNameVerified ? "已认证" : "未认证"
      }
    ]

    this.setData({
      userInfo,
      profileSummary,
      checkInDays: checkInData.days || 0,
      points: pointsData.total || 0,
      realNameStatusText: realNameVerified ? "已认证" : "未认证",
      realNameStatusClass: realNameVerified ? "ok" : "pending"
    })

    this.buildMonthCalendar(checkInData.records || [])
  },

  buildMonthCalendar(records) {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    const monthPrefix = `${year}-${String(month).padStart(2, "0")}-`
    const recordSet = new Set(records || [])
    const daysInMonth = getMonthDays(currentDate)

    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1
      const dateKey = `${monthPrefix}${String(day).padStart(2, "0")}`
      return {
        day,
        checked: recordSet.has(dateKey)
      }
    })

    const monthCheckedCount = calendarDays.filter((item) => item.checked).length

    this.setData({
      monthLabel: getMonthLabel(currentDate),
      calendarDays,
      monthCheckedCount
    })
  },

  goEditProfile() {
    wx.navigateTo({ url: "/pages/profileEdit/profileEdit" })
  },

  goRealName() {
    wx.navigateTo({ url: "/pages/realname/realname" })
  },

  checkIn() {
    const today = formatDateKey(new Date())
    const checkInData = read(CHECK_IN_KEY, { days: 0, lastDate: "", records: [] })
    const pointsData = read(POINTS_KEY, { total: 0 })
    const records = Array.isArray(checkInData.records) ? checkInData.records : []

    if (!records.includes(today)) {
      records.push(today)
      checkInData.days = (checkInData.days || 0) + 1
      checkInData.lastDate = today
      checkInData.records = records
      write(CHECK_IN_KEY, checkInData)

      pointsData.total = (pointsData.total || 0) + 10
      write(POINTS_KEY, pointsData)

      wx.showToast({ title: "打卡成功 +10积分", icon: "success" })
    } else {
      wx.showToast({ title: "今天已经打卡", icon: "none" })
    }

    this.setData({
      checkInDays: checkInData.days || 0,
      points: pointsData.total || 0,
      showCalendar: true
    })

    this.buildMonthCalendar(records)
  },

  closeCalendar() {
    this.setData({ showCalendar: false })
  },

  noop() {},

  goFavorite() {
    wx.navigateTo({ url: "/pages/favorites/favorites" })
  },

  goTreeHole() {
    wx.navigateTo({ url: "/pages/treeHole/treeHole" })
  },

  contactService() {
    wx.showModal({
      title: "联系管理员",
      content: "客服邮箱：免费的还想要客服",
      showCancel: false
    })
  }
})
