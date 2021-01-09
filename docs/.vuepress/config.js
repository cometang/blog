const head = require('./config/head.js');
const plugins = require('./config/plugins.js');
const themeConfig = require('./config/themeConfig.js');

module.exports = {
  theme: 'vdoing', // 使用依赖包主题
  // theme: require.resolve('../../theme-vdoing'), // 使用本地主题

  title: "Come Tang 唐家世少",
  description: 'cometang,唐家世少个人博客,web前端技术博客,简洁至上,专注web前端学习与总结。JavaScript,js,ES6,TypeScript,vue,python,css3,html5,Node,git,github等技术文章。',
  // base: '/', // 格式：'/<仓库名>/'， 默认'/'
  dest: './dist',   // 设置输出目录
  markdown: {
    lineNumbers: true, // 代码行号
  },

  head,
  plugins,
  themeConfig,
}
