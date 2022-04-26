import request from '@utils/request'

export const state = {
  cachedMembers: [],
  cachedMessageId: '',
  cachedMemberId: ''
}

export const getters = {}

export const mutations = {
  CACHE_MEMBERS(state, currentMembers) {
    state.cachedMembers = currentMembers
  },
  CACHE_MESSAGE_ID(state, currentOrderMessage) {
    state.cachedMessageId = currentOrderMessage.data.id
  },
  CLEAR_MESSAGE_ID(state) {
    state.cachedMessageId = ''
  },
  CACHE_MEMBER_ID(state, id) {
    state.cachedMemberId = id
  },
}

export const actions = {
  findByPhone({ commit }, phoneData) {
    return request
      .post('/admin/merchant/member/searchByPhone', phoneData, {
        errorHandle: false,
      })
      .then((response) => response.items)
  },
  fetchSingle({ commit }, memberId) {
    return request.get(`/admin/merchant/member/${memberId}`).then((response) => response.items)
  },
  store({ commit }, storeData) {
    return request.post('/admin/merchant/member/store', storeData)
  },
  fetchList({ commit }, query) {
    return request
      .all([
        request.post('/admin/merchant/member/search', query),
        request.post('/admin/merchant/member/search', {
          ...query,
          page: 0,
          limit: 0,
        }),
      ])
      .then(
        request.spread((per, all) => {
          commit('CACHE_MEMBERS', all.items)
          return {
            items: per.items,
            total: per.pagination.total,
            membersLimit: per.membersLimit,
            membersUsed: per.membersUsed,
          }
        })
      )
  },
  fetchListShort({ commit }, query) {
    return request.post('/admin/merchant/member/search', query).then((response) => {return{items:response.items} })
  },
  fetchListByKeyword({ commit }, keyword) {
    return request.post(`/admin/merchant/member/search`, {search: keyword}).then((response) => response.items)
  },
  fetchTags({ commit }, search) {
    return request.post('/admin/merchant/member/tag/search', search).then((response) => response)
  },
  storeTag({ commit }, storeData) {
    return request.post('/admin/merchant/member/tag/store', storeData)
  },
  removeTags({ commit }, removeData) {
    return request.post('/admin/merchant/member/tag/remove', removeData)
  },
  applyTags({ commit }, applyData) {
    return request.post('/admin/merchant/member/tag/apply', applyData)
  },

  fetchChats({ commit }, query) {
    return request.post('/admin/merchant/notifications/chat/getAllChatNotification', query).then((response) => {
      return {
        items: response.items,
        total: response.pagination.total,
      }
    })
  },
  fetchSingleChat({ commit }, search) {
    return request.post('/admin/merchant/extrarequest/getRecord', search).then((response) => response.items)
  },
  fetchMoreChat({ commit }, search) {
    return request.post('/admin/merchant/extrarequest/loadMoreChatRecord', search).then((response) => response.items)
  },
  fetchSpecificChat({ commit }, search) {
    return request.post('/admin/merchant/extrarequest/getSpecificRecord', search).then((response) => response.items)
  },
  storeChatReaded({ commit }, storeData) {
    return request.post('/admin/merchant/notifications/chat/readAllChatNotification', storeData)
  },
  sendChat({ commit }, submitData) {
    return request.post('/admin/merchant/member/extrarequest/request', submitData).then((response) => response)
  },
  replyChat({ commit }, submitData) {
    return request.post('/admin/merchant/member/extrarequest/reply', submitData).then((response) => response)
  },
  updateMessageId({ commit }, message) {
    commit('CACHE_MESSAGE_ID', message)
    setTimeout(()=>{
      commit('CLEAR_MESSAGE_ID')
    },100)
  },
  fetchOrderRelatedChat({ commit }, search) {
    return request.post('/admin/merchant/extrarequest/getSpecificOrderRecord', search).then((response) => response)
  },
  updateActiveChatMemberId({ commit }, memberId) {
    commit('CACHE_MEMBER_ID', memberId)
  },
  // pet
  fetchPetList({ commit }, search) {
    return request.post('/admin/merchant/member/pet/search', search).then((response) => response)
  },
  removehPet({ commit }, removeData) {
    return request.post('/admin/merchant/member/pet/remove', removeData).then((response) => response)
  },
  fetchSinglePet({ commit }, {memberId,petId}) {
    return request.get(`/admin/merchant/member/${memberId}/pet/${petId}`).then((response) => response)
  },
  storeSinglePet({ commit }, submitData) {
    return request.post('admin/merchant/member/pet/store',submitData).then((response) => response)
  },
}
