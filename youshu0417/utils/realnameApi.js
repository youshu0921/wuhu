const REALNAME_API_HOST = "https://kzidcardv1.market.alicloudapi.com"
const REALNAME_API_PATH = "/api/id_card/check"

// 注意：为了快速联调，这里暂放在前端。生产环境请迁移到云函数/服务端，避免密钥泄露。
const REALNAME_CREDENTIAL = {
  appKey: "204575916",
  appSecret: "Gy2sAbTpy26DXe8CKm9ggj8NKcV8DSCR",
  appCode: "e7a4c04c518149f7a5bac62f506d3001"
}

function normalizeResult(raw) {
  const root = raw && typeof raw === "object" ? raw : {}
  const nested = root.data && typeof root.data === "object" ? root.data : {}

  const message =
    root.msg ||
    root.message ||
    root.reason ||
    nested.msg ||
    nested.message ||
    ""

  const failByMessage =
    typeof message === "string" &&
    (message.includes("不一致") || message.includes("失败") || message.includes("错误"))

  const candidates = [root.pass, root.result, root.success, nested.pass, nested.result, nested.success]
  let passed
  for (const item of candidates) {
    if (typeof item === "boolean") {
      passed = item
      break
    }
    if (typeof item === "number") {
      passed = item > 0
      break
    }
    if (typeof item === "string") {
      if (["true", "1", "ok"].includes(item.toLowerCase()) || item.includes("一致") || item.includes("通过")) {
        passed = true
        break
      }
      if (["false", "0"].includes(item.toLowerCase()) || item.includes("不一致") || item.includes("失败")) {
        passed = false
        break
      }
    }
  }

  if (typeof passed !== "boolean") {
    passed = !failByMessage
  }

  return {
    passed,
    message: message || (passed ? "实名认证通过" : "实名认证未通过"),
    raw: root
  }
}

function verifyRealNameByAppCode(name, idCard) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${REALNAME_API_HOST}${REALNAME_API_PATH}`,
      method: "GET",
      timeout: 12000,
      header: {
        Authorization: `APPCODE ${REALNAME_CREDENTIAL.appCode}`
      },
      data: {
        name,
        idcard: idCard
      },
      success: (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`实名认证请求失败(${res.statusCode})`))
          return
        }

        const parsed = normalizeResult(res.data)
        if (!parsed.passed) {
          reject(new Error(parsed.message || "实名认证未通过"))
          return
        }

        resolve(parsed)
      },
      fail: () => reject(new Error("实名认证请求超时或网络异常"))
    })
  })
}

module.exports = {
  verifyRealNameByAppCode
}
