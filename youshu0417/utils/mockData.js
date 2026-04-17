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

module.exports = {
  recommendUsers,
  defaultPosts,
  articleLibrary
}
