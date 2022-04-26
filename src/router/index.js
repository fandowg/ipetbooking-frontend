import Vue from 'vue'
import VueRouter from 'vue-router'
// https://github.com/declandewet/vue-meta
import VueMeta from 'vue-meta'
// Adds a loading bar at the top during page loads.
import NProgress from 'nprogress/nprogress'
import store from '@state/store'
import constantRoutes from './constant-routes'
import asyncRoutes from '@router/async-routes'
import filterArrayByValue from '@utils/filter-array-by-value'

export function generateUserRoutes(userState) {
  const {
    currentUser,
    currentUserRoutes
  } = userState;


  if(!currentUser) {
    return [];
  }
  if(currentUserRoutes.length === 0) {
    return [];
  }

  return [
    ...filterArrayByValue(asyncRoutes, currentUserRoutes, 'name'),
    {
      path: '',
      redirect: {
        name: currentUser.redirect
      },

      meta: {
        authRequired: true,
      },
    },
  ]
}

const createRoutes = (userRoutes) => {
  constantRoutes.splice(-1, 0, ...userRoutes);
  return constantRoutes
};

const createRouter = () => {
  return new VueRouter({
    routes: createRoutes(generateUserRoutes(store.state.auth)),
    // Use the HTML5 history API (i.e. normal-looking routes)
    // instead of routes with hashes (e.g. example.com/#/about).
    // This may require some server configuration in production:
    // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
    mode: 'history',
    // base: '/dashboard',
    // Simulate native-like scroll behavior when navigating to a new
    // route and using back/forward buttons.
    scrollBehavior(to, from, savedPosition) {
      if(savedPosition) {
        return savedPosition
      } else {
        return {
          x: 0,
          y: 0
        }
      }
    },
  });
};

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();

  router.matcher = newRouter.matcher // 重置 Routes
}

// Before each route evaluates...
router.beforeEach(async (routeTo, routeFrom, next) => {
  // console.log(routeTo)
  store.commit('title/SET_TITLE', '');
  // If this isn't an initial page load...
  if(routeFrom.name !== null) {
    // Start the route progress bar.
    NProgress.start()
  }

  // Check if auth is required on this route
  // (including nested routes).
  const authRequired = routeTo.matched.some((route) => route.meta.authRequired);
  // console.log(String(routeTo.redirectedFrom).includes('orders'))
  // console.log(routeTo.redirectedFrom === '/')

  // Check route is default path
  let OrderLink = '';
  if(String(routeTo.redirectedFrom)
    .includes('orders')) {
    OrderLink = routeTo.redirectedFrom;
  }
  const isDefaultPath = routeTo.redirectedFrom === '/' || OrderLink;
  // console.log(isDefaultPath)
  // If auth isn't required for the route, just continue.
  // console.log(!isDefaultPath)

  if(!isDefaultPath && !authRequired) {
    return next()
  }

  if(store.getters['auth/loggedIn']) {
    return next()
  }

  // If auth is required and the user is NOT currently logged in,
  // redirect to login.
  if(OrderLink) {
    // console.log(366,OrderLink)
    redirectToLogin(OrderLink)
  } else {
    redirectToLogin()
  }


  function redirectToLogin(path = '') {
    const needRedirect = routeTo.name !== '404' && routeTo.name !== 'logout';
    // console.log(345,path)
    // Pass the original route to the login component
    next({
      name: 'login',
      query: needRedirect
        ? {
          redirectFrom: routeTo.fullPath
        }
        : '',
      params: {
        routeFromPath: path
      },
      replace: true
    })
  }

});

router.beforeResolve(async (routeTo, routeFrom, next) => {
  // Create a `beforeResolve` hook, which fires whenever
  // `beforeRouteEnter` and `beforeRouteUpdate` would. This
  // allows us to ensure data is fetched even when params change,
  // but the resolved route does not. We put it in `meta` to
  // indicate that it's a hook we created, rather than part of
  // Vue Router (yet?).
  try {
    // For each matched route...
    for(const route of routeTo.matched) {
      await new Promise((resolve, reject) => {
        // If a `beforeResolve` hook is defined, call it with
        // the same arguments as the `beforeEnter` hook.
        if(route.meta && route.meta.beforeResolve) {
          route.meta.beforeResolve(routeTo, routeFrom, (...args) => {
            // If the user chose to redirect...
            if(args.length) {
              // If redirecting to the same route we're coming from...
              if(routeFrom.name === args[0].name) {
                // Complete the animation of the route progress bar.
                NProgress.done()
              }
              // Complete the redirect.
              next(...args)
              reject(new Error('Redirected'))
            } else {
              resolve()
            }
          })
        } else {
          // Otherwise, continue resolving the route.
          resolve()
        }
      })
    }
    // If a `beforeResolve` hook chose to redirect, just return.
  } catch(error) {
    return
  }

  // If we reach this point, continue resolving the route.
  next()
});

// When each route is finished evaluating...
router.afterEach((routeTo, routeFrom) => {
  // Complete the animation of the route progress bar.
  NProgress.done()
});

Vue.use(VueRouter);
Vue.use(VueMeta, {
  // The component option name that vue-meta looks for meta info on.
  keyName: 'page',
});

export default router
