const { anonymousAvatars, treeHoleTags, treeHolePosts: storedPosts } = require("../../utils/mockData")

// 生成随机匿名昵称：匿名用户 + 4位随机编号
function generateAnonymousNickname() {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `匿名用户 ${num}`
}

// 格式化时间
function formatTime(date) {
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 36e5)
  const days = Math.floor(diff / 864e5)
  
  if (minutes < 1) return "刚刚"
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return new Date(date).toLocaleDateString()
}

// 计算删除倒计时
function getDeleteCountdown(deleteOption, createTime) {
  if (deleteOption === 0) return ""
  
  const create = new Date(createTime)
  let deleteTime
  
  if (deleteOption === 1) deleteTime = new Date(create.getTime() + 24 * 60 * 60 * 1000)
  else if (deleteOption === 2) deleteTime = new Date(create.getTime() + 7 * 24 * 60 * 60 * 1000)
  else if (deleteOption === 3) deleteTime = new Date(create.getTime() + 30 * 24 * 60 * 60 * 1000)
  
  const now = new Date()
  const diff = deleteTime - now
  
  if (diff <= 0) return "即将删除"
  
  const days = Math.floor(diff / (24 * 60 * 60 * 1000))
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  
  if (days > 0) return `${days}天${hours}小时`
  if (hours > 0) return `${hours}小时`
  return "即将删除"
}

// 获取用户ID
function getUserId() {
  let userId = wx.getStorageSync("treeHoleUserId")
  if (!userId) {
    userId = "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6)
    wx.setStorageSync("treeHoleUserId", userId)
  }
  return userId
}

Page({
  data: {
    currentTab: 0,
    allPosts: [],
    publicPosts: [],
    myPosts: [],
    userId: ""
  },

  onLoad() {
    this.setData({ userId: getUserId() })
    this.loadPosts()
  },

  onShow() {
    this.loadPosts()
  },

  loadPosts() {
    let localPosts = wx.getStorageSync("treeHolePosts") || []
    const mockPosts = storedPosts.map(p => ({ ...p }))
    const allPosts = [...localPosts, ...mockPosts]
    
    const processedPosts = allPosts.map(post => ({
      ...post,
      timeDisplay: formatTime(post.createTime),
      deleteCountdown: post.deleteOption > 0 ? getDeleteCountdown(post.deleteOption, post.createTime) : ""
    }))
    
    const publicPosts = processedPosts.filter(p => p.permission === 2 || p.permission === 3)
    const userId = this.data.userId
    const myPosts = processedPosts.filter(p => p.userId === userId)
    
    this.setData({
      allPosts: processedPosts,
      publicPosts,
      myPosts
    })
  },

  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    this.setData({ currentTab: index })
  },

  deletePost(e) {
    const id = e.currentTarget.dataset.id
    
    wx.showModal({
      title: "确认删除",
      content: "删除后将彻底清除，无法恢复",
      success: (res) => {
        if (res.confirm) {
          const myPosts = this.data.myPosts.filter(p => p.id !== id)
          const allPosts = this.data.allPosts.filter(p => p.id !== id)
          
          const localPosts = wx.getStorageSync("treeHolePosts") || []
          const newLocalPosts = localPosts.filter(p => p.id !== id)
          wx.setStorageSync("treeHolePosts", newLocalPosts)
          
          this.setData({ myPosts, allPosts })
          wx.showToast({ title: "已删除", icon: "success" })
        }
      }
    })
  },

  goPost() {
    wx.navigateTo({ url: "/pages/treeHolePost/treeHolePost" })
  },

  likePost(e) {
    const id = e.currentTarget.dataset.id
    const allPosts = this.data.allPosts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          liked: !p.liked,
          likeCount: (p.likeCount || 0) + (p.liked ? -1 : 1)
        }
      }
      return p
    })
    
    const publicPosts = allPosts.filter(p => p.permission === 2 || p.permission === 3)
    const myPosts = allPosts.filter(p => p.userId === this.data.userId)
    
    this.setData({ allPosts, publicPosts, myPosts })
    
    const localPosts = wx.getStorageSync("treeHolePosts") || []
    const newLocalPosts = localPosts.map(p => {
      if (p.id === id) {
        return { ...p, liked: !p.liked, likeCount: (p.likeCount || 0) + (p.liked ? -1 : 1) }
      }
      return p
    })
    wx.setStorageSync("treeHolePosts", newLocalPosts)
    
    wx.showToast({ title: "点赞成功", icon: "none" })
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.showToast({ title: "详情功能开发中", icon: "none" })
  }
})