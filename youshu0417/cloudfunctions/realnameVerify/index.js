const cloud = require("wx-server-sdk")
const https = require("https")

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const API_HOST = "kzidcardv1.market.alicloudapi.com"
const API_PATH = "/api/id_card/check"

// 建议后续改成环境变量管理，避免直接写在代码里。
const CREDENTIAL = {
  appKey: "204575916",
  appSecret: "Gy2sAbTpy26DXe8CKm9ggj8NKcV8DSCR",
  appCode: "e7a4c04c518149f7a5bac62f506d3001"
}

function parseResponse(raw) {
  const root = raw && typeof raw === "object" ? raw : {}
  const nested = root.data && typeof root.data === "object" ? root.data : {}

  const message =
    root.msg || root.message || root.reason || nested.msg || nested.message || ""

  const failByMessage =
    typeof message === "string" &&
    (message.includes("不一致") || message.includes("失败") || message.includes("错误"))

  const candidates = [root.pass, root.result, root.success, nested.pass, nested.result, nested.success]
  let passed

  for (const val of candidates) {
    if (typeof val === "boolean") {
      passed = val
      break
    }
    if (typeof val === "number") {
      passed = val > 0
      break
    }
    if (typeof val === "string") {
      const lowered = val.toLowerCase()
      if (["true", "1", "ok"].includes(lowered) || val.includes("一致") || val.includes("通过")) {
        passed = true
        break
      }
      if (["false", "0"].includes(lowered) || val.includes("不一致") || val.includes("失败")) {
        passed = false
        break
      }
    }
  }

  if (typeof passed !== "boolean") {
    passed = !failByMessage
  }

  return {
    ok: !!passed,
    message: message || (passed ? "实名认证通过" : "实名认证未通过"),
    raw: root
  }
}

function requestVerify(name, idcard) {
  return new Promise((resolve, reject) => {
    const query = `name=${encodeURIComponent(name)}&idcard=${encodeURIComponent(idcard)}`
    const options = {
      hostname: API_HOST,
      path: `${API_PATH}?${query}`,
      method: "GET",
      headers: {
        Authorization: `APPCODE ${CREDENTIAL.appCode}`
      }
    }

    const req = https.request(options, (res) => {
      let body = ""
      res.setEncoding("utf8")
      res.on("data", (chunk) => {
        body += chunk
      })
      res.on("end", () => {
        if (res.statusCode !== 200) {
          reject(new Error(`实名认证接口异常(${res.statusCode})`))
          return
        }

        try {
          const parsedJson = JSON.parse(body || "{}")
          const parsed = parseResponse(parsedJson)
          if (!parsed.ok) {
            reject(new Error(parsed.message || "实名认证未通过"))
            return
          }

          resolve(parsed)
        } catch (err) {
          reject(new Error("实名认证接口返回解析失败"))
        }
      })
    })

    req.on("error", () => reject(new Error("实名认证接口网络错误")))
    req.setTimeout(12000, () => {
      req.destroy(new Error("实名认证接口超时"))
    })
    req.end()
  })
}

exports.main = async (event) => {
  const name = (event && event.name ? String(event.name) : "").trim()
  const idcard = (event && event.idcard ? String(event.idcard) : "").trim()

  if (!name || !idcard) {
    return {
      ok: false,
      message: "缺少实名认证参数"
    }
  }

  try {
    const result = await requestVerify(name, idcard)
    return {
      ok: true,
      message: result.message,
      data: result.raw
    }
  } catch (err) {
    return {
      ok: false,
      message: err.message || "实名认证失败"
    }
  }
}
