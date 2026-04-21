Page({
  data: {
    chatList: [],
    inputValue: "",
    otherAvatar: "",
    myAvatar: "https://picsum.photos/seed/me/200",
    scrollTop: 0,
    chatKey: "",
    otherName: ""
  },

  onLoad(options) {
    const id = options.id || "default"
    const avatar = decodeURIComponent(options.avatar || "https://picsum.photos/seed/u1/200")
    const name = options.name || "对方"
    const chatKey = `chat_${id}`

    let chatList = wx.getStorageSync(chatKey) || []
    if (!chatList.length) {
      chatList = [
        { sender: "other", content: `你好，我是${name}` },
        { sender: "me", content: "你好，很高兴认识你" }
      ]
    }

    this.setData({
      otherAvatar: avatar,
      otherName: name,
      chatKey,
      chatList,
      scrollTop: chatList.length * 1000
    })
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value })
  },

  sendMessage() {
    const content = this.data.inputValue.trim()
    if (!content) {
      wx.showToast({ title: "请输入消息", icon: "none" })
      return
    }

    const newList = this.data.chatList.concat([{ sender: "me", content }])
    this.setData({
      chatList: newList,
      inputValue: "",
      scrollTop: newList.length * 1000
    })

    wx.setStorageSync(this.data.chatKey, newList)

    setTimeout(() => {
      const reply = this.data.chatList.concat([
        { sender: "other", content: "收到啦，我们继续聊聊吧" }
      ])
      this.setData({
        chatList: reply,
        scrollTop: reply.length * 1000
      })
      wx.setStorageSync(this.data.chatKey, reply)
    }, 700)
  },

  onUnload() {
    wx.setStorageSync(this.data.chatKey, this.data.chatList)
  }
})
