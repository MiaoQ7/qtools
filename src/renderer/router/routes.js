// import Home from 'views/Home.vue'
import About from 'views/About.vue'
import Index from 'views/Index.vue'

const files = require.context(
  '../features', // 目录路径
  true, // 是否遍历子目录
  /\.vue$/ // 匹配文件名的正则表达式
)

const routes = files.keys().map((key) => {
  const component = files(key).default
  return {
    path: component.path,
    name: component.name,
    component: component,
    meta: {
      show: !component.hide,
      desc: component.desc,
      icon: component.icon,
      type: component.type,
      repo: component.repo
    }
  }
})

export default [
  {
    path: '/',
    name: 'Index',
    component: Index,
    meta: {
      keepAlive: true // keepAlive will allow the page to load only once
    }
  },
  // {
  //   path: '/page',
  //   name: 'Page',
  //   component: Page
  // },
  // {
  //   path: 'features/test',
  //   name: 'cn.miao7.test',
  //   component: test.page
  // },
  // {
  //   path: 'features/nettunnel',
  //   name: 'cn.miao7.nettunnel',
  //   component: nettunnel.page
  // },
  // {
  //   path: 'features/netproxy',
  //   name: 'cn.miao7.netproxy',
  //   component: netproxy.page
  // },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  ...routes
]
