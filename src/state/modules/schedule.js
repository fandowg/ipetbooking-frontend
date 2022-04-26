import request from '@utils/request'

export const state = {
  cached: [],
}

export const getters = {}

export const mutations = {
  CACHE_STAFFS(state, currentStaffs) {
    state.cached = currentStaffs
  },
}

export const actions = {
  storeStaff({ commit }, storeData) {
    return request.post('/admin/schedule/item/store', storeData).then((response) => response.items)
  },
  fetchStaff({ commit }) {
    return request.post('/admin/schedule/item/search').then((response) => response.items)
  },
  fetchStaffDetail({ commit }, { id, ...queryData }) {
    return request.post(`/admin/schedule/item/${id}`, queryData).then((response) => response.items)
  },
  storeItem({ commit }, storeData) {
    return request.post('/admin/schedule/calendar/addScheduleItem', storeData).then((response) => response.items)
  },
  fetchList({ commit }, { date, ...submitData }) {
    return request.post(`/admin/schedule/calendar/${date}`, { ...submitData }).then(({ items: { scheduleItems, filters: { orderStatus, products, scheduleItems: staffs, services } } }) => {
      return {
        scheduleItems,
        orderStatus,
        products,
        staffs,
        services,
      }
    })
  },
  fetchRangeList({ commit }, { date, ...submitData }) {
    return request.post(`/admin/schedule/calendar/${date}`, { ...submitData }).then((response) => response.items)
  },
  fetchItemDetail({ commit }, id) {
    return request.get(`/admin/schedule/calendar/detail/${id}`).then((response) => response.items)
  },
  storeItemDetail({ commit }, storeData) {
    return request.post('/admin/schedule/calendar/detail/store', storeData)
  },
  removeItemDetail({ commit }, storeData) {
    return request.post('/admin/schedule/calendar/detail/remove', storeData)
  },
  deleteScheduleItem({ commit }, storeData) {
    return request.post('admin/schedule/calendar/deleteScheduleItem', storeData)
  },
  fetchMonthly({ commit }, queryData) {
    return request.post('/admin/schedule/calendar/search/monthly', queryData).then((response) => response.items)
  },
  fetchBookingList({
    commit
  }, query) {
    return request
        .post('/admin/schedule/item/searchOrder', query)
        .then(({
            items,
            pagination: {
                total
            },
            filter: {
                products,
                services,
                orderStatus,
            }
        }) => {
            return {
                items,
                total,
                products,
                services,
                orderStatus,
            }
        })
  },
  sendLinkUser({ commit }, queryData) {
    return request.post('/admin/schedule/item/linkUser', queryData).then((response) => response.items)
  },

}
