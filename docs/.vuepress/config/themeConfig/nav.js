// nav
module.exports = [
  { text: '首页', link: '/' },
  {
    text: '前端',
    link: '/web/', //目录页链接，此处link是vdoing主题新增的配置项，有二级导航时，可以点击一级导航跳到目录页
    items: [
      // 说明：以下所有link的值只是在相应md文件定义的永久链接（不是什么特殊生成的编码）。另外，注意结尾是有斜杠的
      { text: 'ES6', link: '/pages/712848/' },
      { text: 'Vue', link: '/pages/decaf9/' },
      { text: 'react', link: '/pages/5d463fbdb172d43b/' },
      { text: '页面', link: '/pages/5d463fbdb172d43b/' },
    ],
  },
  {
    text: '后端',
    link: '/back/',
    items: [
      { text: 'Node', link: '/pages/8309a5b876fc95e3/' },
      { text: 'PHP', link: '/pages/0a83b083bdf257cb/' },
    ],
  },
  {
    text: '运维',
    link: '/DepOps/',
    items: [
      { text: '技术文档', link: '/pages/9a7ee40fc232253e/' },
      { text: 'GitHub技巧', link: '/pages/4c778760be26d8b3/' },
      { text: 'Nodejs', link: '/pages/117708e0af7f0bd9/' },
      { text: '博客搭建', link: '/pages/41f87d890d0a02af/' },
    ],
  },
  {
    text: '杂谈',
    link: '/more/',
    items: [
     
    ],
  },
  { text: '关于', link: '/guanyu/' },
  {
    text: '收藏',
    link: '/pages/beb6c0bd8a66cea6/',
    items: [
      { text: '网站', link: '/pages/beb6c0bd8a66cea6/' },
      { text: '资源', link: '/pages/eee83a9211a70f9d/' },
      { text: 'Vue资源', link: '/pages/12df8ace52d493f6/' },
    ],
  },
  {
    text: '索引',
    link: '/archives/',
    items: [
      { text: '分类', link: '/categories/' },
      { text: '标签', link: '/tags/' },
      { text: '归档', link: '/archives/' },
    ],
  },
]
