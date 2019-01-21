import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
import Login from '@/views/login/index.vue'
import Generallogin from '@/views/login/generallogin.vue'
import Register from '@/views/login/register.vue'
import Retrievepsw from '@/views/login/retrievepsw.vue'

export default new Router({
  routes: [
    {
      path: '/login', component: Login, hidden: true, redirect: '/login/generallogin',
      children: [
        { path: 'generallogin', name: 'Generallogin', component: Generallogin },
        { path: 'register', name: 'Register', component: Register },
        { path: 'retrievepsw', name: 'Retrievepsw', component: Retrievepsw }
      ]
    },
    { path: '/404', component: () => import('@/views/404'), hidden: true },
    {
      path: '/', component: Layout, redirect: '/dashboard', name: 'Dashboard', hidden: true,
      children: [{
        path: 'dashboard',
        component: () => import('@/views/dashboard/index')
      }]
    },
    {
      path: '/vin', component: Layout, redirect: '/vin/index', name: 'VIN', meta: { title: 'VIN查询', icon: 'example' },
      children: [
        {
          path: 'index', name: 'Index', component: () => import('@/views/vin/index'), meta: { title: 'VIN查询', icon: 'search' }
        }
      ]
    },
    {
      path: '/message',
      component: Layout,
      children: [
        {
          path: 'index/:sessionId',
          name: 'Message',
          component: () => import('@/views/message/index'),
          meta: { title: '消息', icon: 'message' }
        }
      ]
    },
    // 通讯录
    {
      path: '/concat',
      component: Layout,
      children: [
        {
          path: 'index',
          name: 'Contact',
          component: () => import('@/views/concat/index'),
          meta: { title: '通讯录', icon: 'contact' }
        }
      ]
    },
    // 报价中心
    {
      path: '/quote',
      component: Layout,
      redirect: "/quote/index",
      children: [
        {
          path: 'index',
          redirect: "/quote/index/one",
          name: 'Quote',
          component: () => import('@/views/quote/index'),
          meta: { title: '报价中心', icon: 'quote' },
        }
      ]
    },
    {
      path: '/quote',
      component: Layout,
      redirect: "/quote/index",
      hidden: true,
      children: [
        {
          path: 'index',
          redirect: "/quote/index/one",
          name: 'Quote',
          component: () => import('@/views/quote/index'),
          meta: { title: '报价中心', icon: 'quote' },
          children: [
            {
              path: 'one',
              name: 'Quote-one',
              component: () => import('@/views/quote/quote-one'),
              hidden: true
            }, {
              path: 'two',
              name: 'Quote-two',
              component: () => import('@/views/quote/quote-two'),
              hidden: true
            }
          ]
        }, {
          path: "details/:id",
          name: "circleDetails",
          component: () => import('@/views/quote/circleDetails.vue'),
          hidden: true
        }
      ]
    },
    // 报价
    {
      path: '/offer',
      name: 'Quote-offer',
      component: () => import('@/views/quote/offer.vue')
    },
    // 买配件
    {
      path: '/accessories',
      component: Layout,
      children: [
        {
          path: 'list',
          name: 'list',
          component: () => import('@/views/accessories/index.vue'),
          meta: { title: '买配件', icon: 'accessories' }
        }
      ]
    },
    {
      path: '/accessories',
      component: Layout,
      hidden: true,
      children: [
        {
          path: 'list',
          name: 'list',
          component: () => import('@/views/accessories/index.vue'),
          meta: { title: '买配件', icon: 'accessories' },
          children: [
          ]
        },
        {
          path: 'details/:id',
          name: 'details',
          component: () => import('@/views/accessories/details.vue'),
          hidden: true
        }
      ]
    },
    //我要入驻
    {
      path: '/admission',
      component: Layout,
      children: [
        {
          path: 'index',
          name: 'admission',
          component: () => import('@/views/admission/show.vue'),
          meta: { title: '我要入驻', icon: 'admission' }
        }
      ]
    },
    {
      path: '/admission',
      component: Layout,
      hidden: true,
      children: [
        {
          path: 'index',
          name: 'admission',
          component: () => import('@/views/admission/show.vue'),
          meta: { title: '我要入驻', icon: 'admission' },
          children: [
            {
              path: 'step1/:isone',
              name: 'step1',
              component: () => import('@/views/admission/index'),
              hidden: true
            },
            {
              path: 'step2/:isone',
              name: 'step2',
              component: () => import('@/views/admission/step2'),
              hidden: true
            },
            {
              path: 'onAudit',
              name: 'onAudit',
              component: () => import('@/views/admission/onAudit'),
              hidden: true
            },
            {
              path: 'resultError',
              name: 'resultError',
              component: () => import('@/views/admission/step/resultError'),
              hidden: true
            },
            {
              path: 'resultSucc',
              name: 'resultSucc',
              component: () => import('@/views/admission/step/success'),
              hidden: true
            },
            {
              path: 'Record',
              name: 'Record',
              component: () => import('@/views/admission/step/Record'),
              hidden: true
            }
          ]
        }
      ]
    },
    // 订单管理
    {
      path: '/ordermanager',
      component: Layout,
      children: [
        {
          path: 'index',
          name: 'Ordermanager',
          component: () => import('@/views/ordermanager/index'),
          meta: { title: '订单管理', icon: 'ordermanager' }
        }
      ]
    },
    // 商品库存
    {
      path: '/product',
      component: Layout,
      children: [
        {
          path: 'index',
          name: 'Productstock',
          component: () => import('@/views/productstock/index'),
          meta: { title: '商品库存', icon: 'productstock' }
        }
      ]
    },
    // 财务数据
    {
      path: '/statement',
      component: Layout,
      children: [
        {
          path: 'index',
          name: 'Statement',
          component: () => import('@/views/statement/index'),
          meta: { title: '财务数据', icon: 'statement' }
        }
      ]
    },
    // 客户管理
    {
      path: '/customer',
      component: Layout,
      children: [
        {
          path: 'index',
          name: 'Customer',
          component: () => import('@/views/customer/index'),
          meta: { title: '客户管理', icon: 'customer' }
        }
      ]
    },
    {
      path: '/shopcar',
      component: Layout,
      children: [
        {
          path: 'index',
          name: 'shoplist',
          component: () => import('@/views/shopcar/index'),
          meta: { title: '购物车', icon: 'shoppingcart' }
        }
      ]
    },
    {
      path: '/sysset',
      component: Layout,
      children: [
        {
          path: 'index',
          name: 'sys',
          component: () => import('@/views/sysset/index'),
          meta: { title: '系统设置', icon: 'setting' }
        }
      ]
    },
    { path: '*', redirect: '/404', hidden: true }
  ]
})