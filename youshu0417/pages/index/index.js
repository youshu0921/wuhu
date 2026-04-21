const { recommendUsers } = require("../../utils/mockData")
const {
  LIKED_USERS_KEY,
  USER_KEY,
  POINTS_KEY,
  SWAP_USAGE_KEY,
  read,
  write
} = require("../../utils/storage")

const FREE_SWAP_LIMIT = 10
const PAID_SWAP_COST = 5

function toNumber(value, fallback) {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

function getTodayKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function incomeRangeToMinValue(incomeRange) {
  const map = {
    "1000-5000": 1000,
    "5000-10000": 5000,
    "10000-20000": 10000,
    "20000以上": 20000
  }
  return map[incomeRange] || 0
}

function getAssetLabel(flag, trueLabel, falseLabel = "未知") {
  if (flag === true) return trueLabel
  if (flag === false) return falseLabel
  return falseLabel
}

Page({
  data: {
    currentUser: null,
    userIndex: 0,
    recommendQueue: [],
    points: 0,
    freeSwapRemaining: FREE_SWAP_LIMIT,
    myProfile: {
      height: 172,
      weight: 66,
      city: "",
      points: 0,
      incomeValue: 0
    }
  },

  onLoad() {
    this.safeRefreshRecommendQueue()
  },

  onShow() {
    this.safeRefreshRecommendQueue()
  },

  safeRefreshRecommendQueue() {
    try {
      this.refreshRecommendQueue()
    } catch (err) {
      console.error("refreshRecommendQueue failed:", err)
      const fallbackList = Array.isArray(recommendUsers) ? recommendUsers : []
      this.setData({
        recommendQueue: fallbackList,
        currentUser: fallbackList[0] || null,
        points: 0,
        freeSwapRemaining: FREE_SWAP_LIMIT
      })
    }
  },

  getMyProfile() {
    const userInfo = read(USER_KEY, {})
    const pointsData = read(POINTS_KEY, { total: 0 })

    return {
      height: toNumber(userInfo.height, 172),
      weight: toNumber(userInfo.weight, 66),
      city: userInfo.city || "",
      points: pointsData.total || 0,
      incomeValue: incomeRangeToMinValue(userInfo.incomeRange) || toNumber(userInfo.income, 0)
    }
  },

  getSwapState() {
    const today = getTodayKey()
    const swapUsage = read(SWAP_USAGE_KEY, { date: today, count: 0 })

    if (swapUsage.date !== today) {
      const resetData = { date: today, count: 0 }
      write(SWAP_USAGE_KEY, resetData)
      return { date: today, count: 0, freeRemaining: FREE_SWAP_LIMIT }
    }

    return {
      date: today,
      count: swapUsage.count || 0,
      freeRemaining: Math.max(0, FREE_SWAP_LIMIT - (swapUsage.count || 0))
    }
  },

  calcCompatibilityScore(user, myProfile) {
    if (!user || !user.requirements) return 1

    const points = myProfile.points || 0
    const heightTolerance = Math.min(8, Math.floor(points / 100) * 2)
    const weightTolerance = Math.min(8, Math.floor(points / 120) * 2)
    const incomeTolerance = Math.min(6000, Math.floor(points / 100) * 1000)

    const minHeight = (user.requirements.minHeight || 0) - heightTolerance
    const maxWeight = (user.requirements.maxWeight || Number.MAX_SAFE_INTEGER) + weightTolerance
    const minIncome = Math.max(0, (user.requirements.minIncome || 0) - incomeTolerance)

    let score = 0
    if (myProfile.height >= minHeight) score += 1
    if (myProfile.weight <= maxWeight) score += 1
    if ((myProfile.incomeValue || 0) >= minIncome) score += 1

    return score
  },

  isCompatible(user, myProfile) {
    return this.calcCompatibilityScore(user, myProfile) >= 2
  },

  getRecommendScore(user, myProfile) {
    const points = myProfile.points || 0
    const boost = 1 + Math.min(0.6, points / 600)
    const sameCity = myProfile.city && user.city === myProfile.city ? 1 : 0
    const verified = user.verified ? 1 : 0
    const compatibility = this.calcCompatibilityScore(user, myProfile)
    const hasAssets = (user.hasCar ? 1 : 0) + (user.hasHouse ? 1 : 0)

    return sameCity * 20 * boost + verified * 16 * boost + compatibility * 24 * boost + hasAssets * 6
  },

  refreshRecommendQueue() {
    const myProfile = this.getMyProfile()
    const swapState = this.getSwapState()
    const sourceUsers = Array.isArray(recommendUsers) ? recommendUsers : []

    const queue = sourceUsers
      .filter((user) => this.isCompatible(user, myProfile))
      .sort((a, b) => this.getRecommendScore(b, myProfile) - this.getRecommendScore(a, myProfile))

    const recommendQueue = queue.length ? queue : sourceUsers
    if (!recommendQueue.length) {
      this.setData({
        myProfile,
        recommendQueue: [],
        currentUser: null,
        points: myProfile.points,
        freeSwapRemaining: swapState.freeRemaining
      })
      return
    }

    const nextIndex = this.data.userIndex % recommendQueue.length

    this.setData(
      {
        myProfile,
        recommendQueue,
        userIndex: nextIndex,
        points: myProfile.points,
        freeSwapRemaining: swapState.freeRemaining
      },
      () => this.loadRecommendUser()
    )
  },

  loadRecommendUser() {
    const list = this.data.recommendQueue
    if (!list.length) {
      this.setData({ currentUser: null })
      return
    }

    const currentUser = list[this.data.userIndex % list.length]
    this.setData({
      currentUser: {
        ...currentUser,
        jobText: currentUser.job || "职业未填",
        introText: currentUser.intro || "这个人比较低调，还没有填写自我介绍。",
        requirementsTextView:
          currentUser.requirementsText || "希望彼此真诚、有责任感，愿意长期沟通。",
        carLabel: getAssetLabel(currentUser.hasCar, "有车", "无车"),
        houseLabel: getAssetLabel(currentUser.hasHouse, "有房", "无房")
      }
    })
  },

  goDetail() {
    const { currentUser } = this.data
    if (!currentUser) return
    wx.navigateTo({ url: `/pages/detail/detail?id=${currentUser.id}` })
  },

  nextUser() {
    if (!this.data.recommendQueue.length) return

    const swapState = this.getSwapState()
    const usageCount = swapState.count

    if (usageCount < FREE_SWAP_LIMIT) {
      write(SWAP_USAGE_KEY, { date: swapState.date, count: usageCount + 1 })
      this.setData({ freeSwapRemaining: FREE_SWAP_LIMIT - usageCount - 1 })
    } else {
      const pointsData = read(POINTS_KEY, { total: 0 })
      const currentPoints = pointsData.total || 0
      if (currentPoints < PAID_SWAP_COST) {
        wx.showModal({
          title: "积分不足",
          content: `今日免费次数已用完，继续换一个需要${PAID_SWAP_COST}积分。请先去我的页面打卡。`,
          showCancel: false
        })
        return
      }

      pointsData.total = currentPoints - PAID_SWAP_COST
      write(POINTS_KEY, pointsData)
      write(SWAP_USAGE_KEY, { date: swapState.date, count: usageCount + 1 })
      this.setData({ points: pointsData.total, freeSwapRemaining: 0 })
      wx.showToast({ title: `已消耗${PAID_SWAP_COST}积分`, icon: "none" })
    }

    this.setData({ userIndex: this.data.userIndex + 1 }, () => this.loadRecommendUser())
  },

  showContact() {
    const user = this.data.currentUser
    if (!user) return

    const likedUsers = read(LIKED_USERS_KEY, [])
    const exists = likedUsers.find((item) => item.id === user.id)
    if (!exists) {
      likedUsers.unshift({
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        lastMsg: "很高兴认识你",
        time: "刚刚"
      })
      write(LIKED_USERS_KEY, likedUsers)
      wx.showToast({ title: "已加入消息列表", icon: "success" })
    }

    setTimeout(() => {
      wx.switchTab({ url: "/pages/messages/messages" })
    }, 400)
  },

  onShareAppMessage() {
    return { title: "有书相亲 - 帮你找到对的人", path: "/pages/index/index" }
  }
})