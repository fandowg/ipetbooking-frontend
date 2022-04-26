// the components' interface to the Vuex store.
import { mapState, mapGetters } from 'vuex'

export const appComputed = {
  ...mapGetters('app', ['appVersion']),
}

export const authComputed = {
  ...mapState('auth', {
    currentUser: (state) => state.currentUser,
    currentUserRoutes: (state) => state.currentUserRoutes,
    currentSubscription: (state) => state.currentSubscription,
  }),
  ...mapGetters('auth', ['loggedIn', 'merchantUrl']),
}

// 商品人員
export const staffComputed = {
  ...mapState('staff', {
    staffs: (state) => state.cached,
  }),
}

// 商店設定
export const merchantComputed = {
  ...mapState('merchant', {
    currentMerchant: (state) => state.cached,
    planList: (state) => state.cachedPlans,
    hasMerchant: (state) => state.hasMerchant
  }),
  ...mapGetters('auth', ['merchantUrl']),
}

// 商店管理帳號
export const merchantUserComputed = {
  ...mapState('merchant', {
    userList: (state) => state.cachedUsers,
    userGroupList: (state) => state.cachedUserGroups,
  }),
  ...mapGetters('merchant',['isJtails'])
}

// 接待報到
export const checkInComputed = {
  ...mapState('product', {
    cachedProducts: (state) => state.cached,
  }),
}

export const couponComputed = {
  ...mapState('product', {
    cachedProductsById: (state) => state.byId,
    cachedPricesById: (state) => state.byPriceId,
  }),
  ...mapState('auth', {
    currentUser: (state) => state.currentUser,
  }),
}

// 客戶管理
export const memberComputed = {
  ...mapState('member', {
    members: (state) => state.cachedMembers,
    activeChatMemberId: (state) => state.cachedMemberId,
  }),
}

export const deviceComputed = {
  ...mapState('device', {
    currentDeviceToken: (state) => state.currentDeviceToken,
  }),
}
