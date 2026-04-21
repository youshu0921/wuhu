const { LIKED_USERS_KEY, read, write } = require("../../utils/storage")

Page({
  data: {
    messages: []
  },

  onShow() {
    this.loadMessages()
  },

  loadMessages() {
    let likedUsers = read(LIKED_USERS_KEY, [])
    if (!likedUsers.length) {
      likedUsers = [
        {
          id: "177",
          nickname: "小晴",
          avatar: "https://picsum.photos/seed/177/200",
          lastMsg: "你好呀，很高兴认识你",
          time: "10:30"
        }
      ]
      write(LIKED_USERS_KEY, likedUsers)
    }

    const messages = likedUsers.map((user) => ({
      id: user.id,
      name: user.nickname,
      avatar: user.avatar,
      lastMsg: user.lastMsg || "心动成功，开始聊天吧",
      time: user.time || "刚刚",
      unread: user.unread || 0
    }))

    this.setData({ messages })
  },

  goChat(e) {
    const { id, name, avatar } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/chatRoom/chatRoom?id=${id}&name=${name}&avatar=${encodeURIComponent(avatar)}`
    })
  }
})