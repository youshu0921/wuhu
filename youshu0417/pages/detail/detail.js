const { recommendUsers } = require("../../utils/mockData")
const { FAVORITES_KEY, read, write } = require("../../utils/storage")

function formatDateTime(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  const hh = String(date.getHours()).padStart(2, "0")
  const mm = String(date.getMinutes()).padStart(2, "0")
  return `${y}-${m}-${d} ${hh}:${mm}`
}

Page({
  data: {
    user: {}
  },

  onLoad(options) {
    const id = options.id
    const target = recommendUsers.find((item) => item.id === id) || recommendUsers[0]
    this.setData({
      user: {
        ...target,
        carLabel: target.hasCar === true ? "有车" : target.hasCar === false ? "无车" : "车况未知",
        houseLabel: target.hasHouse === true ? "有房" : target.hasHouse === false ? "无房" : "房况未知"
      }
    })
  },

  collect() {
    const user = this.data.user
    const favorites = read(FAVORITES_KEY, [])
    const exists = favorites.find((item) => item.id === user.id)

    if (exists) {
      wx.showToast({ title: "已在收藏中", icon: "none" })
      return
    }

    favorites.unshift({
      ...user,
      favoriteTime: formatDateTime()
    })
    write(FAVORITES_KEY, favorites)

    wx.showToast({ title: "收藏成功", icon: "success" })
  }
})