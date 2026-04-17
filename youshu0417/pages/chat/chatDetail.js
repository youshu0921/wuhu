Page({
  data: {posts:[],showModal:false,postText:"",previewImages:[],selectedVideo:""},
  onLoad(){this.loadPosts()},
  loadPosts(){var s=wx.getStorageSync("posts")||[];if(s.length==0){s.push({id:"1",nickname:"小精灵",avatar:"https://picsum.photos/200",text:"今天天气真好，出去踏青啦～ 🌸",time:"2小时前",images:["https://picsum.photos/300"],likeCount:12,commentCount:3,liked:false,comments:[{name:"阳光 girl",content:"真美！"}]});wx.setStorageSync("posts",s)}this.setData({posts:s})},
  showPostModal(){this.setData({showModal:true})},
  hidePostModal(){this.setData({showModal:false,postText:"",previewImages:[],selectedVideo:""})},
  onPostInput(e){this.setData({postText:e.detail.value})},
  chooseImage(){wx.chooseImage({count:9,success:r=>{this.setData({previewImages:r.tempFilePaths})}})},
  chooseVideo(){wx.chooseVideo({success:r=>{this.setData({selectedVideo:r.tempFilePath})}})},
  submitPost(){var n={id:Date.now().toString(),nickname:"我",avatar:"https://picsum.photos/100",text:this.data.postText,time:"刚刚",images:this.data.previewImages,video:this.data.selectedVideo,likeCount:0,commentCount:0,liked:false,comments:[]};var p=[n,...this.data.posts];wx.setStorageSync("posts",p);this.setData({posts:p});this.hidePostModal();wx.showToast({title:"发布成功",icon:"success"})},
  likePost(e){var id=e.currentTarget.dataset.id;var ps=this.data.posts.map(p=>{if(p.id==id){p.liked=!p.liked;p.likeCount=(p.likeCount||0)+(p.liked?1:-1)}return p});this.setData({posts:ps});wx.setStorageSync("posts",ps)},
  showComment(e){wx.showModal({title:"评论",content:"评论功能开发中",showCancel:false})},
  goDetail(e){var id=e.currentTarget.dataset.id;wx.navigateTo({url:"/pages/detail/detail?0.id="+id})}
})