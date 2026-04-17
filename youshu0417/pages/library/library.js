const { articleLibrary } = require("../../utils/mockData")

Page({
  data: {
    keyword: "",
    list: articleLibrary,
    filtered: articleLibrary
  },

  onInput(e) {
    const keyword = e.detail.value.trim()
    const filtered = this.data.list.filter((item) => {
      if (!keyword) return true
      return item.title.includes(keyword) || item.category.includes(keyword) || item.summary.includes(keyword)
    })

    this.setData({ keyword, filtered })
  },

  openArticle(e) {
    const id = e.currentTarget.dataset.id
    const article = this.data.list.find((item) => item.id === id)
    if (!article) return

    wx.showModal({
      title: article.title,
      content: article.summary,
      showCancel: false
    })
  }
})
