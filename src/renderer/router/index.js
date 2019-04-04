import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

export default new Router({
    routes: [
        {
            path: '/order',
            hidden: true,
            component: () => import('@/components/order/order')
        },
        {
            path: '/login', component: ()=>import('@/views/login/index.vue'), hidden: true, redirect: '/login/generallogin',
            children: [
                { path: 'generallogin', name: 'Generallogin', component: ()=>import('@/views/login/generallogin.vue') },
                { path: 'register', name: 'Register', component:()=>import('@/views/login/register.vue') },
                { path: 'retrievepsw', name: 'Retrievepsw', component: ()=>import('@/views/login/retrievepsw.vue') }
            ]
        },
        { path: '/picLooker', component: () => import('@/components/picLooker/picLooker'), hidden: true },
        { path: '/updata', component: () => import('@/components/UpData'), hidden: true },
        { path: '/404', component: () => import('@/views/404'), hidden: true },
        {
            path: '/', component: Layout, redirect: '/dashboard', name: 'Dashboard', hidden: true,
            children: [{
                path: 'dashboard',
                component: () => import('@/views/dashboard/index')
            }]
        },
        {
            path: '/vin',
            component: Layout,
            redirect: '/vin/index',
            name: 'VIN',
            meta: { title: 'VIN查询', icon: 'example' },
            children: [
                {
                    path: 'index',
                    name: 'Index',
                    component: () => import('@/views/vin/index'),
                    meta: { title: 'VIN查询', icon: 'search' }
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
        {
            path: '/notice',
            component: Layout,
            children: [
                {
                    path: 'index',
                    name: 'notice',
                    component: () => import('@/views/notice/index'),
                    meta: { title: '通知', icon: 'tongzhi(1)' }
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
                    meta: { title: '报价商圈', icon: 'quote',keepAlive: true },
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
                    meta: { title: '报价中心', icon: 'quote'},
                    children: [
                        {
                            path: 'one',
                            name: 'Quote-one',
                            component: () => import('@/views/quote/quote-one'),
                            hidden: true,
                            meta:{keepAlive:true}
                        }, {
                            path: 'two',
                            name: 'Quote-two',
                            component: () => import('@/views/quote/quote-two'),
                            hidden: true,
                            meta:{keepAlive:true}
                        }
                    ]
                }, {
                    path: "details",
                    name: "circleDetails",
                    component: () => import('@/views/quote/circleDetails.vue'),
                    hidden: true
                }
            ]
        },
        // // 报价
        // {
        //     path: '/offer',
        //     name: 'Quote-offer',
        //     component: () => import('@/views/quote/offer.vue')
        // },

        // 汽配经销商
        {
            path: '/accessories',
            component: Layout,
            children: [
                {
                    path: 'list',
                    name: 'list',
                    component: () => import('@/views/accessories/index.vue'),
                    meta: { title: '汽配门店', icon: 'Distributor',keepAlive:true}
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
                    meta: { title: '汽配门店', icon: 'Distributor',keepAlive:true },
                    children: []
                },
                {
                    path: 'details/:id',
                    name: 'details',
                    component: () => import('@/views/accessories/details.vue')
                },
                {
                    path: 'searchList',
                    name: 'searchList',
                    component: () => import('@/views/accessories/searchList.vue')
                }
            ]
        },

        //我的报价单
        {
            path: "/quotation",
            component: Layout,
            children: [
                {
                    path: 'index',
                    name: 'quotation',
                    component: () => import('@/views/quotation/index.vue'),
                    meta: { title: '我的报价单', icon: 'quotation'}
                }
            ]
        },
        {
            path: "/quotation",
            component: Layout,
            hidden: true,
            children: [
                {
                    path: 'index',
                    name: 'quotation',
                    component: () => import('@/views/quotation/index'),
                    meta: { title: '我的报价单', icon: 'quotation',keepAlive:true}
                },
                {
                    path: 'detail',
                    name: 'quotationDetail',
                    component: () => import('@/views/quotation/detail')
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
                    meta: { title: '我的采购单', icon: 'shoppingcart',keepAlive:true }
                }
            ]
        },
        //我的订单
        {
            path: '/MyOrder',
            component: Layout,
            name: 'order',
            children: [
                {
                    path: 'index',
                    name: 'MyOrder',
                    component: () => import('@/views/myOrder/index.vue'),
                    meta: { title: '我的订单', icon: 'dingdan' }
                }
            ]
        },
        //钱包
        {
            path: '/purse',
            component: Layout,
            children: [
                {
                    path: 'index',
                    name: 'Purse',
                    component: () => import('@/views/purse/index'),
                    meta: { title: '钱包', icon: 'statement' }
                }
            ]
        },
        // //买配件
        // {
        //     path: '/shopping',
        //     name: 'buy',
        //     component: Layout,
        //     children: [
        //         {
        //             path: 'index',
        //             name: 'buyTab',
        //             redirect: "/shopping/index/release",
        //             component: () => import("@/views/shopping/index.vue"),
        //             meta: { title: '买配件', icon: 'accessories' }
        //         }
        //     ]
        // },
        // {
        //     path: '/shopping',
        //     name: 'buy',
        //     component: Layout,
        //     hidden: true,
        //     children: [
        //         {
        //             path: 'index',
        //             name: 'buyTab',
        //             redirect: "/shopping/index/release",
        //             component: () => import("@/views/shopping/index.vue"),
        //             meta: { title: '买配件', icon: 'accessories' },
        //             children: [
        //                 {
        //                     path: "release",
        //                     name: 'release',
        //                     component: () => import("@/views/shopping/release.vue")
        //                 },
        //                 {
        //                     path: "purchase",
        //                     name: 'purchase',
        //                     component: () => import("@/views/shopping/purchase.vue")
        //                 }
        //             ]
        //         },

        //     ]
        // },
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
        {
            path: '/sysset',
            component: Layout,
            children: [
                {
                    path: 'index',
                    name: 'sys',
                    component: () => import('@/views/sysset/index'),
                    meta: { title: '设置', icon: 'setting' }
                }
            ]
        },
        { path: '*', redirect: '/404', hidden: true },
        { path: '/news/:id', component: () => import('@/views/news/news'), hidden: true }
    ]
})