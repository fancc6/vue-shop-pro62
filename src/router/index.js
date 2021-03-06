import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import User from '@/components/User'

Vue.use(Router)

var router = new Router({
  routes: [
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User }
      ]
    }
  ]
})

/**
 * to: 即将进入的目标路由对象
 * from: 当前导航将要离开的路由
 */

// 给路由设置"导航守卫"
// 在守卫中对token进行监听, 有token就让直行, 否则调整钻到登录页去
router.beforeEach((to, from, next) => {
  // 请求"login"就直接通过
  if (to.path === '/login') {
    return next()
  }
  // 请求"非login, 就判断token
  var token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})

export default router
