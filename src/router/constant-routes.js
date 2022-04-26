import lazyLoadView from './lazyload-view'
import store from '@state/store'
import request from '@utils/request'

export default [{
        path: '/login',
        name: 'login',
        component: () => lazyLoadView(import('@views/login')),
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters['auth/loggedIn']) {
                    // Redirect to the user default redirect page instead
                    next({
                        name: store.state.auth.currentUser.redirect
                    })
                } else {
                    // Continue to the login page
                    next()
                }
            },
        },
    },
    {
      path: '/user/password/reset/:resetToken?',
      name: 'password',
      component: () => lazyLoadView(import('@views/login')),
      meta: {
          beforeResolve(routeTo, routeFrom, next) {
              // If the user is already logged in
              if (store.getters['auth/loggedIn']) {
                  // Redirect to the user default redirect page instead
                  next({
                      name: store.state.auth.currentUser.redirect
                  })
              } else {
                  // Continue to the login page
                  const token = routeTo.params.resetToken
                  if(token){
                    store.dispatch('auth/checkResetToken',token)
                      .then(() => next())
                      .catch(()=>{
                        next({
                          name: 'login'
                        })
                    })
                  }
                  // console.log(routeTo.params.resetToken)
                  next()
              }
          },
      },
  },
    {
        path: '/subscription',
        name: 'subscription',
        component: () => lazyLoadView(import('@views/subscription/plans')),
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                if (store.state.auth.currentSubscription !== null || store.state.merchant.cached !== '') {
                    store.dispatch('merchant/fetchSingle').then(() => next())
                } else {
                    next({
                        path: '/'
                    })
                }

            },
        },
    },

    {
        path: '/merchant/:orderId/success',
        name: 'newebpay-success',
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                // 商店設定：變更信用卡（成功）
                if (sessionStorage.getItem('merchant.tryToChangeCard') !== null) {
                    next({
                        name: 'settings',
                        params: {
                            'routeFrom': 'newebpay-success'
                        }
                    })
                    return
                }
                if (store.state.auth.currentSubscriptionAuthority)
                    store.dispatch('merchant/fetchSingle').then(() => next())
                else
                    next({
                        name: '404'
                    })
            },
        },
        component: () => lazyLoadView(import('@views/subscription/plans')),
    },
    {
        path: '/merchant/:merchantAlias/fail',
        name: 'newebpay-fail',
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                // 商店設定：變更信用卡（失敗）
                if (sessionStorage.getItem('merchant.tryToChangeCard') !== null) {
                    next({
                        name: 'settings',
                        params: {
                            'routeFrom': 'newebpay-fail'
                        }
                    })
                    return
                }
                if (store.state.auth.currentSubscriptionAuthority)
                    store.dispatch('merchant/fetchSingle').then(() => next())
                else
                    next({
                        name: '404'
                    })
            },
        },
        component: () => lazyLoadView(import('@views/subscription/plans')),
    },
    {
        path: '/logout',
        name: 'logout',
        component: () => lazyLoadView(import('@views/logout')),
        meta: {
            // authRequired: true,
            // beforeResolve(routeTo, routeFrom, next) {
            //     store.dispatch('auth/logOut').then(() => next({
            //         name: 'login'
            //     }))
            // },
        },
    },
    {
      path: '/notification',
      name: 'notification',
      component: () => lazyLoadView(import('@/src/router/views/notification/list')),
      meta: {
        title: '推播中心',
        authRequired: true,
      },
    },
    {
      path: '/employee-notification',
      name: 'employee-notification',
      component: () => lazyLoadView(import('@/src/router/views/employee/notification')),
      meta: {
        title: '推播中心',
        authRequired: true,
      },
    },

    {
        path: '/404',
        name: '404',
        component: require('@views/_404').default,
        // Allows props to be passed to the 404 page through route
        // params, such as `resource` to define what wasn't found.
        props: true,
    },
    {
      path: '/timeout',
      name: 'timeout',
      component: require('@views/_timeout').default,
    },
    // Redirect any unmatched routes to the 404 page. This may
    // require some server configuration to work in production:
    // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
    {
        path: '*',
        redirect: '404',
    },
]
