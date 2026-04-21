// 加密工具 - AES-256-GCM 加密（微信小程序环境）
// 注意：微信小程序没有内置crypto模块，这里提供简化版加密
// 实际项目中可以引入 crypto-js 库或使用 wx.encryptAES

const ENCRYPTION__KEY_NAME = "treeHole_encryption_key"

// 生成随机加密密钥
function generateKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let key = ""
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return key
}

// 简单的Base64编码（实际项目中应使用真正的AES加密）
function encryptContent(text, key) {
  if (!text || !key) return ""
  
  try {
    // 简单混淆：Base64编码 + 简单位移
    const shifted = text.split("").map(c => {
      return String.fromCharCode(c.charCodeAt(0) + 1)
    }).join("")
    
    const combined = shifted + "||KEY||" + key.substring(0, 8)
    const base64 = base64Encode(combined)
    
    return base64
  } catch (e) {
    console.error("加密失败:", e)
    return ""
  }
}

// 解密内容
function decryptContent(encrypted, key) {
  if (!encrypted || !key) return ""
  
  try {
    const decoded = base64Decode(encrypted)
    const parts = decoded.split("||KEY||")
    if (parts.length !== 2 || parts[1] !== key.substring(0, 8)) {
      console.error("密钥验证失败")
      return ""
    }
    
    const shifted = parts[0]
    const original = shifted.split("").map(c => {
      return String.fromCharCode(c.charCodeAt(0) - 1)
    }).join("")
    
    return original
  } catch (e) {
    console.error("解密失败:", e)
    return ""
  }
}

// Base64 编码（纯JS实现）
function base64Encode(str) {
  const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  let result = ""
  let i = 0
  
  while (i < str.length) {
    const char1 = str.charCodeAt(i++)
    const char2 = i < str.length ? str.charCodeAt(i++) : NaN
    const char3 = i < str.length ? str.charCodeAt(i++) : NaN
    
    const enc1 = char1 >> 2
    const enc2 = ((char1 & 3) << 4) | (char2 >> 4)
    let enc3 = ((char2 & 15) << 2) | (char3 >> 6)
    let enc4 = char3 & 63
    
    if (isNaN(char2)) {
      enc3 = enc4 = 64
    } else if (isNaN(char3)) {
      enc4 = 64
    }
    
    result += base64Chars.charAt(enc1) + base64Chars.charAt(enc2) + 
              (enc3 === 64 ? "=" : base64Chars.charAt(enc3)) + 
              (enc4 === 64 ? "=" : base64Chars.charAt(enc4))
  }
  
  return result
}

// Base64 解码（纯JS实现）
function base64Decode(str) {
  const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  let result = ""
  let i = 0
  
  str = str.replace(/[^A-Za-z0-9\+\/=]/g, "")
  
  while (i < str.length) {
    const enc1 = base64Chars.indexOf(str.charAt(i++))
    const enc2 = base64Chars.indexOf(str.charAt(i++))
    const enc3 = base64Chars.indexOf(str.charAt(i++))
    const enc4 = base64Chars.indexOf(str.charAt(i++))
    
    const char1 = (enc1 << 2) | (enc2 >> 4)
    const char2 = ((enc2 & 15) << 4) | (enc3 >> 2)
    const char3 = ((enc3 & 3) << 6) | enc4
    
    result += String.fromCharCode(char1)
    if (enc3 !== 64) result += String.fromCharCode(char2)
    if (enc4 !== 64) result += String.fromCharCode(char3)
  }
  
  return result
}

// 获取加密密钥
function getKey() {
  return wx.getStorageSync(ENCRYPTION_KEY_NAME)
}

// 保存加密密钥
function setKey(key) {
  wx.setStorageSync(ENCRYPTION_KEY_NAME, key)
}

// 检查是否有密钥
function hasKey() {
  return !!wx.getStorageSync(ENCRYPTION_KEY_NAME)
}

module.exports = {
  ENCRYPTION_KEY: ENCRYPTION_KEY_NAME,
  generateKey,
  encryptContent,
  decryptContent,
  getKey,
  setKey,
  hasKey
}