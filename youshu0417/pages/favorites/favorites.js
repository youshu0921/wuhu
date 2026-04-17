const { FAVORITES_KEY, read, write } = require("../../utils/storage")

Page({
  data: {
    favorites: []
  },

  onShow() {
    this.loadFavorites()
  },

  loadFavorites() {
    const favorites = read(FAVORITES_KEY, [])
    this.setData({ favorites })
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    if (!id) return
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` })
  },

  removeFavorite(e) {
    const id = e.currentTarget.dataset.id
    if (!id) return

    const favorites = read(FAVORITES_KEY, [])
    const nextFavorites = favorites.filter((item) => item.id !== id)
    write(FAVORITES_KEY, nextFavorites)
    this.setData({ favorites: nextFavorites })
    wx.showToast({ title: "已取消收藏", icon: "success" })
  }
})