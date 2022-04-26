import lazyLoadView from './lazyload-view'
import store from '@state/store'
import request from '@utils/request'

export default [
  // 接待報到
  {
    path: '/check-in',
    name: 'check-in',
    component: () => lazyLoadView(import('@/src/router/views/check-in/index')),
    meta: {
      authRequired: true,
    },
  },
  // 儀表板
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => lazyLoadView(import('@/src/router/views/dashboard/index')),
    meta: {
      authRequired: true,
      title: '儀表板'
    },
  },

  // 訂單
  {
    path: '/orders',
    name: 'orders',
    component: () => lazyLoadView(import('@/src/router/views/order/index')),
    meta: {
      title: '訂單管理',
      authRequired: true,
    },
  },
  // 客戶
  {
    path: '/member',
    name: 'member',
    component: () => lazyLoadView(import('@/src/router/views/member/list')),
    meta: {
      title: '客戶管理',
      authRequired: true,
    },
  },
  {
    path: '/member/:memberId',
    name: 'view-member',
    component: () => lazyLoadView(import('@/src/router/views/member/detail')),
    meta: {
      title: '客戶管理',
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        store
          .dispatch('member/fetchSingle', routeTo.params.memberId)
          .then((member) => {
            routeTo.params.defaultValue = member
            next()
          })
          .catch(() => {
            next({
              name: '404',
              params: {
                resource: '客戶'
              }
            })
          })
      },
    },
    props: (route) => ({
      defaultValue: route.params.defaultValue,
    }),
  },
  // 折價券
  {
    path: '/coupon',
    name: 'coupon',
    component: () => lazyLoadView(import('@/src/router/views/coupon/list')),
    meta: {
      title: '優惠券管理',
      authRequired: true,
    },
  },
  {
    path: '/coupon/add',
    name: 'add-coupon',
    component: () => lazyLoadView(import('@/src/router/views/coupon/add')),
    meta: {
      title: '新增優惠券',
      authRequired: true,
    },
  },
  {
    path: '/coupon/:couponId',
    name: 'view-coupon',
    component: () => lazyLoadView(import('@/src/router/views/coupon/detail')),
    meta: {
      title: '優惠券管理',
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        store
          .dispatch('coupon/fetchSingle', routeTo.params.couponId)
          .then((coupon) => {
            routeTo.params.defaultValue = coupon
            next()
          })
          .catch(() => {
            next({
              name: '404',
              params: {
                resource: '優惠券'
              }
            })
          })
      },
    },
    props: (route) => ({
      defaultValue: route.params.defaultValue,
    }),
  },
  // 包月方案
  {
    path: '/prepaid',
    name: 'prepaid',
    component: () => lazyLoadView(import('@/src/router/views/prepaid/list')),
    meta: {
      title: '包月方案管理',
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        Promise.all([
           
            store.dispatch('product/fetchServiceCategory'),
       
          ])
          .then(
            request.spread((category) => {
          
              routeTo.params.serviceCategory = category
         
              next()
            })
          )
          .catch(() => {
            next({
              name: '404',
              params: {
                resource: '包月方案'
              }
            })
          })
      },
    },
    props: (route) => ({
   
      category: route.params.serviceCategory,
 
    }),
  },
  {
    path: '/prepaid/add',
    name: 'add-prepaid',
    component: () => lazyLoadView(import('@/src/router/views/prepaid/add')),
    meta: {
      title: '新增包月方案',
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        Promise.all([
            store.dispatch('product/fetchList', {
              limit: 10000,
              page: 1
            }),
            store.dispatch('product/fetchServiceCategory'),
            store.dispatch('product/fetchServicePriceGroup',{groupByGroupOrdering:1}),
          ])
          .then(
            request.spread((products, category,prices) => {
              routeTo.params.merchantProducts = products.items
              routeTo.params.serviceCategory = category
              routeTo.params.prices = prices
              next()
            })
          )
          .catch(() => {
            next({
              name: '404',
              params: {
                resource: '包月方案'
              }
            })
          })
      },
    },
    props: (route) => ({
      products: route.params.merchantProducts,
      category: route.params.serviceCategory,
      prices: route.params.prices,
    }),
  },
  {
    path: '/prepaid/:groupOrdering',
    name: 'view-prepaid',
    component: () => lazyLoadView(import('@/src/router/views/prepaid/detail')),
    meta: {
      title: '包月方案管理',
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        Promise.all([
          store.dispatch('product/fetchList', {
            limit: 10000,
            page: 1
          }),
          store.dispatch('product/fetchServiceCategory'),
          store.dispatch('product/fetchServicePriceGroup',{groupByGroupOrdering:1}),
          store.dispatch('prepaid/fetchSingleGroup', routeTo.params.groupOrdering)
        ])
        .then(
          request.spread((products, category, prices, prepaid) => {
            routeTo.params.merchantProducts = products.items
            routeTo.params.serviceCategory = category
            routeTo.params.prices = prices
            routeTo.params.defaultValue = prepaid
            next()
          })
        )

        // store
        //   .dispatch('prepaid/fetchSingle', routeTo.params.groupOrdering)
        //   .then((prepaid) => {
        //     // prepaid.prices=[...prepaid.productPrices]
        //     routeTo.params.defaultValue = prepaid
        //     next()
        //   })
          .catch(() => {
            next({
              name: '404',
              params: {
                resource: '包月方案'
              }
            })
          })
      },
    },
    props: (route) => ({
      products: route.params.merchantProducts,
      category: route.params.serviceCategory,
      prices: route.params.prices,
      defaultValue: route.params.defaultValue,
    }),
  },
  // 服務項目 prices
  {
    path: '/prices',
    name: 'prices',
    component: () => lazyLoadView(import('@/src/router/views/prices/list')),
    meta: {
      title: '服務項目',
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        Promise.all([
            store.dispatch('product/fetchList', {
              limit: 10000,
              page: 1
            }),
            store.dispatch('product/fetchServiceCategory'),
          ])
          .then(
            request.spread((products, category) => {
              routeTo.params.merchantProducts = products.items
              routeTo.params.serviceCategory = category
              next()
            })
          )
          .catch(() => {
            next({
              name: '404',
              params: {
                resource: '服務項目'
              }
            })
          })
      },
    },
    props: (route) => ({
      merchantProducts: route.params.merchantProducts,
      serviceCategory: route.params.serviceCategory,
    }),
  },

  
  {
    path: '/service',
    // grooming
    name: 'service',
    component: () => lazyLoadView(import('@/src/router/views/prices/list')),
    meta: {
      title: '服務項目',
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        Promise.all([
            store.dispatch('product/fetchList', {
              limit: 10000,
              page: 1
            }),
            store.dispatch('product/fetchServiceCategory'),
          ])
          .then(
            request.spread((products, category) => {
              routeTo.params.merchantProducts = products.items
              routeTo.params.serviceCategory = category
              next()
            })
          )
          .catch(() => {
            next({
              name: '404',
              params: {
                resource: '服務項目'
              }
            })
          })
      },
    },
    props: (route) => ({
      merchantProducts: route.params.merchantProducts,
      serviceCategory: route.params.serviceCategory,
    }),
  },
  {
    path: '/service/add/:type?',
    name: 'add-service',
    component: () => lazyLoadView(import('@/src/router/views/prices/ServiceItemDetail')),
    meta: {
      title: '新增服務項目',
      authRequired: true,
      async beforeResolve(routeTo, routeFrom, next) {
        if(!routeTo.params.merchantProducts){
          // console.log(124)
          await Promise.all([
              store.dispatch('product/fetchList', {
                limit: 10000,
                page: 1
              }),
              store.dispatch('product/fetchServiceCategory'),
            ])
            .then(
              request.spread((products, category) => {
                routeTo.params.merchantProducts = products.items
                routeTo.params.serviceCategory = category
                next()
              })
            )
            .catch(() => {
              next({
                name: '404',
                params: {
                  resource: '服務項目'
                }
              })
            })
        }else{
          next()
        }

      },
      

    },
    props: (route) => ({
 
      products: route.params.merchantProducts,
      category: route.params.serviceCategory,
    }),
  },
  {
    path: '/service/edit/:groupOrdering/:type?',
    name: 'view-service',
    component: () => lazyLoadView(import('@/src/router/views/prices/ServiceItemDetail')),
    meta: {
      title: '編輯服務項目',
      authRequired: true,
      async beforeResolve(routeTo, routeFrom, next) {
        // console.log(routeTo.params)
        const url = routeTo.params.type === 'addition'?'product/fetchSingleAdditionalPriceGroup': 'product/fetchSingleServicePriceGroup'
        await  store
          .dispatch(url, routeTo.params.groupOrdering) 
          .then((service) => {
            // prepaid.prices=[...prepaid.productPrices]
            routeTo.params.defaultValue = service
            // next()
          })
          .catch(() => {
            next({
              name: '404',
              params: {
                resource: '服務項目'
              }
            })
          })
          // console.log(122)
        if(!routeTo.params.merchantProducts){
          // console.log(124)
          await Promise.all([
              store.dispatch('product/fetchList', {
                limit: 10000,
                page: 1
              }),
              store.dispatch('product/fetchServiceCategory'),
            ])
            .then(
              request.spread((products, category) => {
                routeTo.params.merchantProducts = products.items
                routeTo.params.serviceCategory = category
                next()
              })
            )
            .catch(() => {
              next({
                name: '404',
                params: {
                  resource: '服務項目'
                }
              })
            })
        }else{
          next()
        }
      },
    },
    props: (route) => ({
      defaultValue: route.params.defaultValue,
      products: route.params.merchantProducts,
      category: route.params.serviceCategory,
    }),
  },
  // 排班 schedule
  {
    path: '/schedule',
    name: 'schedule',
    component: () => lazyLoadView(import('@/src/router/views/schedule/index')),
    meta: {
      title: '排班',
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        Promise.all([
            store.dispatch('schedule/fetchStaff'),
            store.dispatch('product/fetchList', {
              limit: 10000,
              page: 1
            }),
          ])
          .then(
            request.spread((staffs, products) => {
              routeTo.params.staffItems = staffs
              routeTo.params.merchantProducts = products.items
              next()
            })
          )
          .catch(() => {
            next({
              name: '404',
              params: {
                resource: '排班'
              }
            })
          })
      },
    },
    props: (route) => ({
      staffItems: route.params.staffItems,
      merchantProducts: route.params.merchantProducts,
    }),
  },
  // 排班人員
  {
    path: '/staff',
    name: 'staff',
    component: () => lazyLoadView(import('@/src/router/views/staff/list')),
    meta: {
      title: '排班人員',
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        next()
      },
    },
  },
  // 數據分析
  {
    path: '/analytics',
    name: 'analytics',
    component: () => lazyLoadView(import('@/src/router/views/analytics/index')),
    meta: {
      title: '數據分析',
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        Promise.all([
            store.dispatch('product/fetchList', {
              limit: 10000,
              page: 1
            }),
            store.dispatch('product/fetchServiceCategory'),
          ])
          .then(
            request.spread((products, category) => {
              routeTo.params.merchantProducts = products.items
              routeTo.params.serviceCategory = category
              next()
            })
          )
          .catch(() => {
            next({
              name: '404',
              params: {
                resource: '數據分析'
              }
            })
          })
      },

      // beforeResolve(routeTo, routeFrom, next) {
      //     if (document.getElementById('gapi')) { // was already loaded
      //         next()
      //         return
      //     }
      //     var scriptTag = document.createElement('script')
      //     scriptTag.src = 'https://apis.google.com/js/client:platform.js'
      //     scriptTag.id = 'gapi'
      //     scriptTag.async = false
      //     document.getElementsByTagName('head')[0].appendChild(scriptTag)
      //     scriptTag.addEventListener('load', () => {
      //         setTimeout(() => {
      //             next()
      //         }, 700)
      //     })
      // },
    },
    props: (route) => ({
      merchantProducts: route.params.merchantProducts,
      serviceCategory: route.params.serviceCategory,
    }),
  },
  // 分店
  {
    path: '/products',
    name: 'products',
    component: () => lazyLoadView(import('@/src/router/views/product/list')),
    meta: {
      authRequired: true,
      title: '分店設定'
    },
  },
  {
    path: '/products/:productId?/add',
    name: 'add-product',
    component: () => lazyLoadView(import('@/src/router/views/product/add')),
    meta: {
      title: '新增分店',
      authRequired: true,
      async beforeResolve(routeTo, _, next) {
        const productId = routeTo.params.productId

        if (productId) {
          try {
            const matchedProduct = await store.dispatch(
              'product/fetchSingle',
              productId
            )
            // routeTo.params.defaultStep = matchedProduct.activeStep
            routeTo.params.defaultStep = 3
            routeTo.params.product = matchedProduct
            next()
          } catch (error) {
            next({
              name: '404',
              params: {
                resource: '商品'
              }
            })
          }
        } else {
          next()
        }
      },
    },
    props: (route) => ({
      // defaultStep:3,
      defaultStep: route.params.defaultStep || 1,
      defaultValue: route.params.product,
      productType: (route.params.product && route.params.product.type) || route.query.type,
    }),
  },
  {
    path: '/products/:productId/edit',
    name: 'edit-product',
    component: () => lazyLoadView(import('@/src/router/views/product/edit')),
    meta: {
      title: '編輯分店',
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        store
          .dispatch('product/fetchSingle', routeTo.params.productId)
          .then((product) => {
            routeTo.params.product = product
            next()
          })
          .catch(() => {
            next({
              name: '404',
              params: {
                resource: '商品'
              }
            })
          })
      },
    },
    props: (route) => ({
      defaultValue: route.params.product,
      productType: route.params.product.type,
    }),
  },







  // 管理帳號
  {
    path: '/account',
    name: 'account',
    meta: {
      title: '管理帳號',
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        Promise.all(
            [store.dispatch('merchant/fetchUsers')],
            [store.dispatch('merchant/fetchUserGroups')]
          )
          .then(() => next())
          .catch(() => {
            next({
              name: '404',
              params: {
                resource: '商店管理帳號'
              }
            })
          })
      },
    },
    component: () => lazyLoadView(import('@/src/router/views/admin/list')),
  },
  // 訊息回覆
  {
    path: '/chat',
    name: 'chat',
    component: () => lazyLoadView(import('@/src/router/views/chat/list')),
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/chat/:memberId',
    name: 'view-chat',
    component: () => lazyLoadView(import('@/src/router/views/chat/detail')),
    meta: {
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        store.dispatch('member/updateActiveChatMemberId', routeTo.params.memberId)
        store
          .dispatch('member/fetchSingle', routeTo.params.memberId)
          .then((member) => {
            routeTo.params.defaultValue = member
            next()
          })
          .catch(() => {
            next({
              name: '404',
              params: {
                resource: '訊息回覆'
              }
            })
          })
      },
    },
    props: (route) => ({
      defaultValue: route.params.defaultValue,
    }),
  },
  // 商家設定
  {
    path: '/settings',
    name: 'settings',
    meta: {
      title: '商店設定',
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        Promise.all([
            store.dispatch('merchant/fetchSingle'),
            // store.dispatch('merchant/fetchPlans'),
          ])
          .then(() => next())
          .catch(() => {
            next({
              name: '404',
              params: {
                resource: '商家設定'
              }
            })
          })
      },
    },
    component: () => lazyLoadView(import('@/src/router/views/settings/index')),
  },

  // 接待報到
  {
    path: '/schedule-check-in',
    name: 'schedule-check-in',
    component: () => lazyLoadView(import('@/src/router/views/schedule/check-in')),
    meta: {
      title: '行事曆',
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        Promise.all([
            store.dispatch('schedule/fetchStaff'),
            store.dispatch('product/fetchList', {
              limit: 10000,
              page: 1
            }),
          ])
          .then(
            request.spread((staffs, products) => {
              routeTo.params.staffItems = staffs
              routeTo.params.merchantProducts = products.items
              next()
            })
          )
          .catch(() => {
            next({
              name: '404',
              params: {
                resource: '前台接待'
              }
            })
          })
      },
    },
    props: (route) => ({
      staffItems: route.params.staffItems,
      merchantProducts: route.params.merchantProducts,
    }),
  },

  // ==== 美容師專屬介面 START ==== //
  {
    path: '/employee-booking',
    name: 'employee-booking',
    component: () => lazyLoadView(import('@/src/router/views/employee/booking')),
    meta: {
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        next()
      },
    },
  },
  {
    path: '/employee-calendar',
    name: 'employee-calendar',
    component: () => lazyLoadView(import('@/src/router/views/employee/calendar')),
    meta: {
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        next()
      },
    },
  },
  {
    path: '/employee-check-in',
    name: 'employee-check-in',
    component: () => lazyLoadView(import('@/src/router/views/employee/check-in')),
    meta: {
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        next()
      },
    },
  },
  {
    path: '/employee-staff',
    name: 'employee-staff',
    // component: () => lazyLoadView(import('@/src/router/views/employee/check-in')),
    component: () => lazyLoadView(import('@/src/router/views/employee/staff')),
    // meta: {
    //     authRequired: true,
    //     beforeResolve(routeTo, routeFrom, next) {
    //         next()
    //     },
    // },
  },
  // ==== 美容師專屬介面 END ==== //
]
