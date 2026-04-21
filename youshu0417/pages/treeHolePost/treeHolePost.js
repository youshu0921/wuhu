const { anonymousAvatars, treeHoleTags } = require("../../utils/mockData")
const { encryptContent, generateKey, ENCRYPTION_Key } = require("../../utils/encryption")

const ENCRYPTION_KEY = "treeHole_encryption_key"

// 生成随机ID
function generateId() {
  return "th_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
}

// 生成随机匿名昵称
function generateAnonymousNickname() {
  const num = Math.floor(1e3 + Math.random() * 9e3)
  return `匿名用户 ${num}`
}

// 生成随机匿名信息
function generateAnonymous() {
  const avatar = anonymousAvatars[Math.floor(Math.random() * anonymousAvatars.length)]
  const nickname = generateAnonymousNickname()
  return { avatar, nickname }
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

// 权限选项
const PERMISSIONS = [
  { value: 1, label: "仅自己可见", desc: "仅自己可见" },
  { value: 2, label: "公开(不可评论)", desc: "所有人可见， 但不能评论" },
  { value: 3, label: "公开(可评论)", desc: "所有人可见并可评论" }
]

// 定时删除选项
const DELETE_OPTIONS = [
  { value: 0, label: "永久保留", desc: "永不过期" },
  { value: 1, label: "24小时", desc: "24小时后自动删除" },
  { value: 2, label: "7天", desc: "7天后自动删除" },
  { value: 3, label: "30天", desc: "30天后自动删除" }
]

Page({
  data: {
    content: "",
    images: [],
    videos: [],
    tags: treeHoleTags,
    selectedTags: [],
    permissions: PERMISSIONS,
    deleteOptions: DELETE_OPTIONS,
    permission: 3,
    deleteOption: 0,
    isSubmitting: false
  },

  onLoad() {
    // 生成或获取加密密钥
    let key = wx.getStorageSync(ENCRYPTION_KEY)
    if (!key) {
      key = generateKey()
      wx.setStorageSync(ENCRYPTION_KEY, key)
    }
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value })
  },

  chooseImage() {
    const maxCount = 9 - this.data.images.length
    if (maxCount <= 0) {
      wx.showToast({ title: "最多9张图片", icon: "none" })
      return
    }
    wx.chooseMedia({
      count: maxCount,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const newImages = res.tempFiles.map(f => f.tempFilePath)
        this.setData({ images: [...this.data.images, ...newImages] })
      }
    })
  },

  removeImage(e) {
    const index = e.currentTarget.dataset.index
    const images = [...this.data.images]
    images.splice(index, 1)
    this.setData({ images })
  },

  chooseVideo() {
    if (this.data.videos.length >= 1) {
      wx.showToast({ title: "最多1个视频", icon: "none" })
      return
    }
    wx.chooseMedia({
      count: 1,
      mediaType: ["video"],
      sourceType: ["album", "camera"],
      success: (res) => {
        this.setData({ videos: [res.tempFiles[0].tempFilePath] })
      }
    })
  },

  removeVideo() {
    this.setData({ videos: [] })
  },

  toggleTag(e) {
    const tag = e.currentTarget.dataset.tag
    const selectedTags = [...this.data.selectedTags]
    const index = selectedTags.indexOf(tag)
    if (index === -1) {
      if (selectedTags.length >= 3) {
        wx.showToast({ title: "最多选择3个标签", icon: "none" })
        return
      }
      selectedTags.push(tag)
    } else {
      selectedTags.splice(index, 1)
    }
    this.setData({ selectedTags })
  },

  selectPermission(e) {
    const permission = parseInt(e.currentTarget.dataset.value)
    this.setData({ permission })
  },

  selectDeleteOption(e) {
    const deleteOption = parseInt(e.currentTarget.dataset.value)
    this.setData({ deleteOption })
  },

  previewImage(e) {
    const index = e.currentTarget.dataset.index
    wx.previewImage({
      current: this.data.images[index],
      urls: this.data.images
    })
  },

  submit() {
    if (!this.data.content.trim() && this.data.images.length === 0 && this.data.videos.length === 0) {
      wx.showToast({ title: "请输入内容或添加媒体", icon: "none" })
      return
    }
    if (this.data.isSubmitting) return
    
    this.setData({ isSubmitting: true })
    
    // 生成匿名信息
    const anonymous = generateAnonymous()
    const userId = getUserId()
    
    // 构建树洞数据
    const post = {
      id: generateId(),
      userId: userId,  // 记录发布者ID，用于"我的树洞"筛选
      content: this.data.content,
      images: this.data.images,
      videos: this.data.videos,
      tags: this.data.selectedTags,
      permission: this.data.permission,
      deleteOption: this.data.deleteOption,
      createTime: new Date().toISOString(),
      avatar: anonymous.avatar,
      nickname: anonymous.nickname,
      likeCount: 0,
      commentCount: 0,
      liked: false,
      comments: []
    }
    
    // 保存到本地存储
    const posts = wx.getStorageSync("treeHolePosts") || []
    posts.unshift(post)
    wx.setStorageSync("treeHolePosts", posts)
    
    wx.showToast({ title: "发布成功", icon: "success" })
    
    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  }
})