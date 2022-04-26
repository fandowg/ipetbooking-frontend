import { saveState, getSavedState } from '@utils/browser-help'

import request from '@utils/request'
import router, { resetRouter, generateUserRoutes } from '@router'

export const state = {
  currentUser: {},
  currentUserRoutes: [],
  currentUserPermission: {},
  currentUserTours: {},
  currentUserAccount: {},
  currentSubscription: null,
  currentSubscriptionAuthority: false,
};
//
export const mutations = {
  SET_STATE(state, newValue) {
    state = Object.assign(state, newValue);
  },
  SET_CURRENT_USER(state, newValue) {
    state.currentUser = newValue
    // await saveState('auth.currentUser', newValue);
    setDefaultAuthHeaders(state)
  },
  SET_CURRENT_USER_ACCESS(state, { assets, ...permission }) {
    state.currentUserRoutes = assets;
    state.currentUserRoutes.push('employee-staff'); // 新增頁面先加route
    state.currentUserPermission = permission;
    // await saveState('auth.currentUserRoutes', assets);
    // await saveState('auth.currentUserPermission', permission)
  },
  SET_CURRENT_USER_TOUR(state, tourPages) {
    state.currentUserTours = tourPages
    // await saveState('auth.currentUserTours', tourPages)
  },
  SET_CURRENT_USER_ACCOUNT(state, account) {
    state.currentUserAccount = account
    // await saveState('auth.currentUserAccount', account)
  },
  SET_CURRENT_SUBSCRIPTION(state, newValue) {
    state.currentSubscription = newValue
    // await saveState('auth.currentSubscription', newValue)
  },
  SET_CURRENT_SUBSCRIPTION_AUTHORITY(state, newValue) {
    state.currentSubscriptionAuthority = newValue
    // await saveState('auth.currentSubscriptionAuthority', newValue)
  },
  CLEAR_MERCHANT_CACHED(state) {
    // await saveState('merchant.cached', {})
  },
};

export const getters = {
  // Whether the user is currently logged in.
  loggedIn(state) {
    return !!state.currentUser && state.currentUserRoutes.length > 0
  },
  merchantUrl() {
    // IE11
    let url = '';

    if(process.env.VUE_APP_BUILD_MODE === 'admin-app-build'){
      url = 'https://admin.ipetbooking.com' 
    }else{
      if (!location.origin) {
        location.origin = location.protocol + "//" 
          + location.hostname 
          + (location.port ? ':' + location.port : '');
      }
      url = location.origin
    }

    return url.replace('admin.', '')
  },
};

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  async init({ state, commit, dispatch }) {
    const initState = async () => {
      const stateData = {
        currentUser: await getSavedState('auth.currentUser'),
        currentUserRoutes: await getSavedState('auth.currentUserRoutes') || [],
        currentUserPermission: await getSavedState('auth.currentUserPermission') || {},
        currentUserTours: await getSavedState('auth.currentUserTours') || {},
        currentUserAccount: await getSavedState('auth.currentUserAccount') || {},
        currentSubscription: await getSavedState('auth.currentSubscription') || null,
        currentSubscriptionAuthority: await getSavedState('auth.currentSubscriptionAuthority') || false,
      };

      commit('SET_STATE', stateData);

      return Promise.resolve();
    };

    await initState();

    setDefaultAuthHeaders(state);

    return Promise.resolve(state);
  },
  fetchTour({ commit }, readPage) {
    return request
      .get('/admin/merchant/user/tour', {
        params: {
          read: readPage,
        },
      })
      .then(async (response) => {
        const tourPages = response.items;

        commit('SET_CURRENT_USER_TOUR', tourPages);
        await saveState('auth.currentUserTours', tourPages);

        return tourPages
      })
  },
  fetchAccess({ commit }) {
    return request.get('/admin/merchant/user/access').then(async (response) => {
      const { assets, ...permission } = response.items;

      commit('SET_CURRENT_USER_ACCESS', response.items);
      await saveState('auth.currentUserRoutes', assets);
      await saveState('auth.currentUserPermission', permission);

      return generateUserRoutes(state)
    })
  },
  checkResetToken({ commit},token ){
    console.log(token)
    return request.get(`/password/reset/${token}`)
      .then((response)=>{
        // console.log(response.code)
        return response.code===200
      })
      .catch((error) => {
        // if (
        //   error.status === 'MERCHANT_FRONT_PLEASE_RENEW_SUBSCRIPTION' ||
        //   error.status === 'MERCHANT_FRONT_PLEASE_BIND_CARD_FIRST'
        // ) {
        //   commit('SET_CURRENT_USER', error.data.items)
        //   commit('SET_CURRENT_SUBSCRIPTION', error.data.items)
        // }
        console.log(error)
        return Promise.reject(error)
      })
  },
  reset({ commit }, resetData) {
    // token, password, passwordConfirm
    return request.post('/password/reset', resetData)
  },
  forgot({ commit }, email) {
    return request.post('/password/email', {
      email,
    })
  },
  // Logs in the current user.
  logIn({ commit, dispatch, getters }, { email, password } = {}) {
    // if (getters.loggedIn) return dispatch('validate')

    return request
      .post(
        '/merchant/user/login',
        {
          email,
          password,
        },
        {
          errorHandle: false,
          hideErrorMessage: true,
        }
      )
      .then(async (response) => {
        const user = response.items;
        commit('SET_CURRENT_USER', user);
        await saveState('auth.currentUser', user);

        commit('SET_CURRENT_USER_ACCOUNT', {
          email,
          password,
        });
        await saveState('auth.currentUserAccount', {
          email,
          password,
        });

        return user
      })
      .catch(async (error) => {
        if (
          error.status === 'MERCHANT_FRONT_PLEASE_RENEW_SUBSCRIPTION' ||
          error.status === 'MERCHANT_FRONT_PLEASE_BIND_CARD_FIRST'
        ) {
          commit('SET_CURRENT_USER', error.data.items);
          await saveState('auth.currentUser', error.data.items);

          commit('SET_CURRENT_SUBSCRIPTION', error.data.items);
          await saveState('auth.currentSubscription', error.data.items);
        }
        return Promise.reject(error)
      })
  },
  /**
   * 更新方案資訊
   */
  async clearSubscription({ commit, state }) {
    commit('SET_CURRENT_SUBSCRIPTION', null);
    await saveState('auth.currentSubscription', null);

    return Promise.resolve()
  },
  // 判斷訂閱方案的藍星金流 callback 頁面
  async updateAccessSubscription({ commit }, status) {
    commit('SET_CURRENT_SUBSCRIPTION_AUTHORITY', status);
    await saveState('auth.currentSubscriptionAuthority', status);

    return Promise.resolve()
  },

  // Logs out the current user.
  logOut({ commit }) {
    return request.get('/merchant/user/logout').then(async () => {
      commit('SET_CURRENT_USER', null);
      await saveState('auth.currentUser', null);

      commit('SET_CURRENT_USER_ACCESS', {
        assets: [],
      });
      await saveState('auth.currentUserRoutes', []);
      await saveState('auth.currentUserPermission', null);

      commit('SET_CURRENT_USER_TOUR', null);
      await saveState('auth.currentUserTours', null);

      commit('SET_CURRENT_USER_ACCOUNT', null);
      await saveState('auth.currentUserAccount', null);

      commit('CLEAR_MERCHANT_CACHED');
      await saveState('merchant.cached', {});

      resetRouter();
      return Promise.resolve();
    })
  },
  validateOrder({ commit }, orderId) {
    return validateUser(
      {
        commit,
      },
      `/merchant/${orderId}/valid`
    )
  },
  // Validates the current user's token and refreshes it
  // with new data from the API.
  validate({ commit, state, dispatch }) {
    if (!state.currentUser) return Promise.resolve(null)

    return validateUser(
      {
        commit,
        dispatch,
      },
      '/merchant/user/login'
    )
  },
}

// ===
// Private helpers
// ===

function validateUser({ commit }, requestPath) {
  return request
    .get(requestPath, {
      errorHandle: false,
    })
    .then(async (response) => {
      const user = response.items;

      commit('SET_CURRENT_USER', user);
      await saveState('auth.currentUser', user);

      return user
    })
    .catch(async (error) => {
      if (error && error.code === 401) {
        router.push({
          name: 'logout',
        })
        // commit('SET_CURRENT_USER', null)
        // await saveState('auth.currentUser', null);
      }
      return null
    })
}


function setDefaultAuthHeaders(state) {
  request.defaults.headers.common.Authorization = state.currentUser
    ? `Bearer ${state.currentUser.token}`
    : ''
}
