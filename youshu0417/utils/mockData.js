const recommendUsers = [
  {
    id: "177",
    nickname: "小晴",
    age: 28,
    city: "杭州",
    education: "本科",
    job: "产品经理",
    height: 165,
    weight: 48,
    income: 15000,
    hasCar: true,
    hasHouse: false,
    avatar: "https://picsum.photos/seed/177/300",
    verified: true,
    intro: "喜欢徒步和咖啡，工作稳定，期待认真交往。",
    interests: ["旅行", "美食", "电影", "健身"],
    requirementsText: "希望对方身高170cm以上、体重70kg以内，收入稳定，愿意长期沟通。",
    requirements: { minHeight: 170, maxWeight: 70, minIncome: 10000 }
  },
  {
    id: "168",
    nickname: "阳光",
    age: 26,
    city: "上海",
    education: "硕士",
    job: "算法工程师",
    height: 162,
    weight: 50,
    income: 20000,
    hasCar: false,
    hasHouse: true,
    avatar: "https://picsum.photos/seed/168/300",
    verified: true,
    intro: "偏爱户外与阅读，愿意一起成长。",
    interests: ["摄影", "音乐", "烘焙"],
    requirementsText: "希望另一半有责任感，身高172cm以上，三观一致，能共同规划未来。",
    requirements: { minHeight: 172, maxWeight: 75, minIncome: 15000 }
  },
  {
    id: "189",
    nickname: "温柔",
    age: 27,
    city: "北京",
    education: "本科",
    job: "中学教师",
    height: 168,
    weight: 52,
    income: 12000,
    hasCar: false,
    hasHouse: false,
    avatar: "https://picsum.photos/seed/189/300",
    verified: false,
    intro: "热爱美术和阅读，周末常逛展。",
    interests: ["绘画", "读书", "音乐"],
    requirementsText: "希望不抽烟、情绪稳定，尊重彼此边界，有结婚意愿更好。",
    requirements: { minHeight: 170, maxWeight: 75, minIncome: 8000 }
  }
]

const defaultPosts = [
  {
    id: "1",
    nickname: "小晴",
    avatar: "https://picsum.photos/seed/u1/200",
    text: "今天在西湖边看夕阳，心情很好。",
    city: "杭州",
    time: "2小时前",
    images: ["https://picsum.photos/seed/p1/400", "https://picsum.photos/seed/p2/400"],
    likeCount: 12,
    commentCount: 2,
    liked: false,
    showAllComments: false,
    comments: [
      { name: "阳光", content: "画面太美了" },
      { name: "阿泽", content: "下次一起去" }
    ]
  },
  {
    id: "2",
    nickname: "阳光",
    avatar: "https://picsum.photos/seed/u2/200",
    text: "周末有没有人一起打羽毛球？",
    city: "上海",
    time: "昨天",
    images: [],
    likeCount: 8,
    commentCount: 1,
    liked: false,
    showAllComments: false,
    comments: [{ name: "小晴", content: "我报名" }]
  }
]

const articleLibrary = [
  {
    id: "a1",
    title: "第一次见面怎么不冷场",
    category: "聊天技巧",
    summary: "用开放式问题和共鸣表达，让第一次见面更自然。"
  },
  {
    id: "a2",
    title: "如何判断对方是否真诚",
    category: "关系认知",
    summary: "从稳定投入、边界感和兑现承诺三个维度判断。"
  },
  {
    id: "a3",
    title: "长期关系里的高质量沟通",
    category: "关系经营",
    summary: "表达感受而非指责，建立可执行的沟通约定。"
  }
]

// 匿名头像 - 渐变色块、抽象符号、 无脸插画风格
const anonymousAvatars = [
  "https://api.dicebear.com/7.x/shapes/svg?seed=tree1&backgroundColor=f5f5f5",
  "https://api.dicebear.com/7.x/shapes/svg?seed=tree2&backgroundColor=fff1f2",
  "https://api.dicebear.com/7.x/shapes/svg?seed=tree3&backgroundColor=f0f9ff",
  "https://api.dicebear.com/7.x/shapes/svg?seed=tree4&backgroundColor=faf5ff",
  "https://api.dicebear.com/7.x/shapes/svg?seed=tree5&backgroundColor=fef3c7",
  "https://api.dicebear.com/7.x/shapes/svg?seed=tree6&backgroundColor=ecfeff",
  "https://api.dicebear.com/7.x/shapes/svg?seed=tree7&backgroundColor=fff7ed",
  "https://api.dicebear.com/7.x/shapes/svg?seed=tree8&backgroundColor=fae8ff",
  "https://api.dicebear.com/7.x/shapes/svg?seed=tree9&backgroundColor=f0fdfa",
  "https://api.dicebear.com/7.x/shapes/svg?seed=tree10&backgroundColor=fff",
  "https://api.dicebear.com/7.x/shapes/svg?seed=tree11&backgroundColor=fafafa",
  "https://api.dicebear.com/7.x/shapes/svg?seed=tree12&backgroundColor=f5f5f4"
]

// 树洞标签
const treeHoleTags = [
  "相亲焦虑",
  "择偶困惑",
  "家庭压力",
  "工作烦恼",
  "情绪低落",
  "自我怀疑",
  "生活吐槽"
]

// 树洞模拟数据
const treeHolePosts = [
  {
    id: "th_001",
    content: "今年28了， 相亲相了十几个， 感觉越来越麻木。爸妈天天催， 我也不是不想找， 就是没遇到合适的。",
    avatar: anonymousAvatars[0],
    nickname: "匿名用户 7829",
    tags: ["相亲焦虑", "择偶困惑"],
    permission: 3,
    deleteOption: 0,
    createTime: new Date(Date.now() - 36e5 * 2).toISOString(),
    likeCount: 15,
    commentCount: 3,
    liked: false,
    comments: [
      { nickname: "匿名用户 3451", content: "加油，我也在经历" },
      { nickname: "匿名用户 9023", content: "28还好，不急" }
    ]
  },
  {
    id: "th_002",
    content: "今天又被家里催婚了，说我再不结婚就对不起他们。我真的压力好大，工作已经够烦了...",
    avatar: anonymousAvatars[3],
    nickname: "匿名用户 1562",
    tags: ["家庭压力", "情绪低落"],
    permission: 3,
    deleteOption: 0,
    createTime: new Date(Date.now() - 36e5 * 5).toISOString(),
    likeCount: 28,
    commentCount: 5,
    liked: false,
    comments: []
  },
  {
    id: "th_003",
    content: "工作了三年，感觉越来越迷茫。每天重复同样的事情，不知道这样的意义在哪里。",
    avatar: anonymousAvatars[6],
    nickname: "匿名用户 6642",
    tags: ["工作烦恼", "自我怀疑"],
    permission: 3,
    deleteOption: 0,
    createTime: new Date(Date.now() - 36e5 * 24).toISOString(),
    likeCount: 42,
    commentCount: 8,
    liked: false,
    comments: [
      { nickname: "匿名用户 2289", content: "同感，一起加油" }
    ]
  }
]

module.exports = {
  recommendUsers,
  defaultPosts,
  articleLibrary,
  anonymousAvatars,
  treeHoleTags,
  treeHolePosts
}