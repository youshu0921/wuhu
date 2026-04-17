const { defaultPosts } = require("../../utils/mockData")
const { POSTS_KEY, USER_KEY, read, write } = require("../../utils/storage")

Page({
  data: {
    posts: [],
    displayPosts: [],
    showModal: false,
    postText: "",
    filter: "all"
  },

  onLoad() {
    this.loadPosts()
  },

  loadPosts() {
    const savedPosts = read(POSTS_KEY, [])
    const posts = savedPosts.length ? savedPosts : defaultPosts
    if (!savedPosts.length) {
      write(POSTS_KEY, posts)
    }
    this.setData({ posts }, () => this.applyFilter())
  },

  applyFilter() {
    if (this.data.filter === "all") {
      this.setData({ displayPosts: this.data.posts })
      return
    }

    const userInfo = read(USER_KEY, {})
    const displayPosts = this.data.posts.filter((item) => item.city && item.city === userInfo.city)
    this.setData({ displayPosts })
  },

  setFilter(e) {
    this.setData({ filter: e.currentTarget.dataset.filter }, () => this.applyFilter())
  },

  showPostModal() {
    this.setData({ showModal: true })
  },

  hidePostModal() {
    this.setData({ showModal: false, postText: "" })
  },

  onPostInput(e) {
    this.setData({ postText: e.detail.value })
  },

  submitPost() {
    const content = this.data.postText.trim()
    if (!content) {
      wx.showToast({ title: "请输入动态内容", icon: "none" })
      return
    }

    const userInfo = read(USER_KEY, {})
    const newPost = {
      id: Date.now().toString(),
      nickname: userInfo.nickname || "我",
      avatar: userInfo.avatar || "https://picsum.photos/seed/me/200",
      text: content,
      city: userInfo.city || "杭州",
      time: "刚刚",
      images: [],
      likeCount: 0,
      commentCount: 0,
      liked: false,
      showAllComments: false,
      comments: []
    }

    const posts = [newPost, ...this.data.posts]
    write(POSTS_KEY, posts)
    this.setData({ posts }, () => this.applyFilter())
    this.hidePostModal()
    wx.showToast({ title: "发布成功", icon: "success" })
  },

  likePost(e) {
    const id = e.currentTarget.dataset.id
    const posts = this.data.posts.map((item) => {
      if (item.id === id) {
        const liked = !item.liked
        return {
          ...item,
          liked,
          likeCount: Math.max(0, (item.likeCount || 0) + (liked ? 1 : -1))
        }
      }
      return item
    })

    write(POSTS_KEY, posts)
    this.setData({ posts }, () => this.applyFilter())
  },

  showComment(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: "发表评论",
      editable: true,
      placeholderText: "说点什么吧...",
      success: (res) => {
        if (!res.confirm || !res.content || !res.content.trim()) {
          return
        }

        const userInfo = read(USER_KEY, {})
        const posts = this.data.posts.map((item) => {
          if (item.id === id) {
            const comments = item.comments || []
            comments.push({
              name: userInfo.nickname || "我",
              content: res.content.trim()
            })

            return {
              ...item,
              comments,
              commentCount: (item.commentCount || 0) + 1
            }
          }
          return item
        })

        write(POSTS_KEY, posts)
        this.setData({ posts }, () => this.applyFilter())
      }
    })
  },

  toggleComments(e) {
    const id = e.currentTarget.dataset.id
    const posts = this.data.posts.map((item) => {
      if (item.id === id) {
        return { ...item, showAllComments: !item.showAllComments }
      }
      return item
    })

    this.setData({ posts }, () => this.applyFilter())
  }
})