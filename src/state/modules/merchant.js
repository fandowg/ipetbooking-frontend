import { getSavedState, saveState } from '@utils/browser-help'
import request from '@utils/request'

export const state = {
  cached: '',
  // cached: getCookie('merchant.cached') || '',
  cachedUsers: [],
  cachedUserGroups: [],
  cachedPlans: [],
  hasMerchant: false
};

export const getters = {
    isJtails(state){
      return state.cached.alias==='j-tails' || state.cached.alias==='j-tails1'
    },
    hasHomeService(state){
      if(state.cached.plan){
        return state.cached.plan.additionalModules.includes('homeService')
      }else{
        return false
      }
    }
};

export const mutations = {
  SET_STATE(state, newValue) {
    state.cached = newValue.cached;
  },
  HAS_MERCHANT(state, newValue) {
    state.hasMerchant = newValue
  },
  CACHE_MERCHANT(state, newValue) {
    state.cached = newValue;
    // saveState('merchant.cached', newValue)
    // setCookie('merchant.cached', newValue)
  },
  CACHE_USER(state, users) {
    state.cachedUsers = users
  },
  CACHE_USER_GROUPS(state, groups) {
    // 小捲尾不提供資料上稿 但是ipetbooking要喔
    // state.cachedUserGroups = groups.filter((group)=> group.id !== 9)
    state.cachedUserGroups = groups
  },
  CACHE_PLANS(state, plans) {
    state.cachedPlans = plans
  },
  // cashflowSetting
  // 0: 未申請
  // 1: 審核通過
  // 2: 審核中
  /* async SET_PRICE_API_TO_CURRENT_USER_PERMISSION(state, newValue) {
    const permission = getSavedState('auth.currentUserPermission');

    if(permission === null || Object.keys(permission).length === 0) {
      return
    }

    if(!permission.apis.includes('setPrice')) {
      if(newValue.cashflowSetting === 1) {
        permission.apis.push('setPrice');
        this.state.auth.currentUserPermission.apis.push('setPrice');
        await saveState('auth.currentUserPermission', permission)
      }
    }
  }, */
  PUSH_PRICE_API_TO_CURRENT_USER_PERMISSION(state, newValue) {
    this.state.auth.currentUserPermission.apis.push(newValue);
  }
};

export const actions = {
  async init({ state, commit }) {
    const initState = async () => {
      commit('SET_STATE', {
        ...state,
        cached: await getSavedState('merchant.cached')
      })
    };

    await initState();

    return Promise.resolve(state)
  },
  /**
   * 取得商店所有管理身份列表
   */
  fetchUserGroups({
    commit
  }) {
    const cachedUserGroups = state.cachedUserGroups
    if(cachedUserGroups.length > 0) {
      return Promise.resolve(cachedUserGroups)
    }

    return request.get('/admin/merchant/userGroups')
      .then((response) => {
        const usersGroups = response.items;

        commit('CACHE_USER_GROUPS', usersGroups);
        return usersGroups
      })
  },
  /**
   * 新增商店管理帳號
   */
  storeUser({
    commit
  }, submitData) {
    return request.post('/admin/merchant/user/store', submitData)
  },
  /**
   * 驗證欲新增的帳號 Email 是否已註冊
   */
  validUserEmail({
    commit
  }, email) {
    return request.post(
      '/admin/merchant/user/checkEmail', {
        email
      }, {
        errorHandle: false
      }
    )
  },
  /**
   * 取得商店所有管理帳號列表
   */
  fetchUsers({
    commit
  }, query) {
    return request
      .post('/admin/merchant/user/search', query)
      .then(({
        items,
        pagination: {
          total
        }
      }) => {
        commit('CACHE_USER', items)
        return total
      })
  },
  fetchUsersForStaff({
    commit
  }, query) {
    return request
      .post('/admin/merchant/user/search', query)
      .then((response) => {
        return response.items
      })
  },
  /**
   * 取得單一付費發票
   */
  fetchSingleInvoice({
    commit
  }, historyId) {
    return request
      .get(`/admin/merchant/payment/invoice/search/${ historyId }`)
      .then((response) => response.items)
  },
  /**
   * 訂閱付費紀錄列表
   */
  subscriptionHistory({
    commit
  }, mode) {
    return request
      .post('/admin/merchant/payment/history', {
        mode
      })
      .then((response) => response.items)
  },
  /**
   * 取得綁定信用卡並導向藍新
   */
  changeCard({
    commit
  }, merchantAlias) {
    return request
      .post('/merchant/bindCardPostData', {
        alias: merchantAlias
      })
      .then((response) => response.items)
  },
  /**
   * 金流申請
   */
  paymentApply({
    commit
  }, submitData) {
    return request
      .post('/admin/merchant/cashflow/add', submitData)
      .then((response) => {
        return response.items
      })
  },
  /**
   * 儲存商店資訊
   */
  store({
    commit
  }, storeData) {
    return request.post('/admin/merchant/store', storeData)
  },
  /**
   * 取得商店資訊
   */
  fetchSingle({
    commit
  }) {
    return request.get('/admin/merchant')
      .then(async (response) => {
        const merchant = response.items;
        const pushPriceApiToCurrentUserPermission = async () => {
          const permission = await getSavedState('auth.currentUserPermission');

          if(permission === null || Object.keys(permission).length === 0) {
            return;
          }
          if(!permission.apis.includes('setPrice')) {
            if(merchant.cashflowSetting === 1) {
              commit('PUSH_PRICE_API_TO_CURRENT_USER_PERMISSION', 'setPrice');
            }
          }
        };

        await pushPriceApiToCurrentUserPermission();

        await saveState('merchant.cached', merchant);
        commit('CACHE_MERCHANT', merchant);

        return merchant
      })
  },
  /**
   * 續訂原先方案
   */
  renewPlan() {
    return request.get('/admin/merchant/renew')
  },
  /**
   * 取得所有方案
   */
  fetchPlans({
    commit
  }) {
    return request.get('/plan/list')
      .then((response) => {
        const plans = response
        commit('CACHE_PLANS', plans)
        return plans
      })
  },
  /**
   * 更新方案資訊
   */
  async updateSubscription({
    commit
  }, userData) {
    await saveState('merchant.cached', userData);
    commit('CACHE_MERCHANT', userData)
  },
  /**
   * 變更訂閱方案
   */
  storePlan({
    commit
  }, storeData) {
    return request.post('/admin/merchant/plan/store', storeData)
  },
  /**
   * 取得通知設定
   */
  fetchConfig({
    commit
  }, storeData) {
    return request.get('/admin/merchant/config')
      .then((response) => response.items.notification)
  },
  /**
   * 發送通知
   */
  sendNoti({
    commit
  }, submitData) {
    return request.post('/admin/merchant/notification/send', submitData)
  },
  /**
   * 簡訊紀錄
   */
  fetchSmsHistory({
    commit
  }, query) {
    return request.post('/admin/merchant/smshistory/search', query)
      .then((response) => {
        return {
          items: response.items,
          total: response.pagination.total,
        }
      })
  },
}
