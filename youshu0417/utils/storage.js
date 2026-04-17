const USER_KEY = "userInfo"
const POSTS_KEY = "posts"
const LIKED_USERS_KEY = "likedUsers"
const FAVORITES_KEY = "favorites"
const CHECK_IN_KEY = "checkInData"
const POINTS_KEY = "pointsData"
const SWAP_USAGE_KEY = "swapUsageData"

function read(key, defaultValue) {
  const value = wx.getStorageSync(key)
  if (value === undefined || value === "") {
    return defaultValue
  }

  return value
}

function write(key, value) {
  wx.setStorageSync(key, value)
}

module.exports = {
  USER_KEY,
  POSTS_KEY,
  LIKED_USERS_KEY,
  FAVORITES_KEY,
  CHECK_IN_KEY,
  POINTS_KEY,
  SWAP_USAGE_KEY,
  read,
  write
}
