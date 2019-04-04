import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'

const whiteList = ["/login", "/login/generallogin", "/login/register", "/login/retrievepsw",'/picLooker','/updata','/news','/order'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (store.state.user.token) {
    // 如果当前是有token的，就去刷新token
    if (to.path === '/login/generallogin') {
      console.log('刷新token')
      store.dispatch("refreshToken").then(res => {
      })
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      //  如果不是登录界面
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login/generallogin')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
