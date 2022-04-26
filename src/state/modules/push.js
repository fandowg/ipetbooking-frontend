import request from '@utils/request'
import router from '@router'

export const state = {
  // pushList:[],
  normalPushes:[],
  systemPushes:[],
  readData:{},
  isUnread:false,
  isFirst:true
};

export const getters = {
  // normalPushes(state){
  //   return state.pushList.filter(item =>{
  //     return item.type !== 'PushSystemPostEvent'
  //   })
  // },
  // systemPushes(state){
  //   return state.pushList.filter(item =>{
  //     return item.type === 'PushSystemPostEvent'
  //   })
  // },
};

export const mutations = {
  // PUSH_LIST(state,newValue){
  //   state.pushList = [...state.pushList,...newValue]
  // },
  CLEAR_PUSHES(state){
    state.normalPushes=[]
    state.systemPushes=[]
  },
  NORMAL_PUSHES(state,newValue){
    state.normalPushes = [...state.normalPushes,...newValue]
  },
  SYSTEM_PUSHES(state,newValue){
    state.systemPushes = [...state.systemPushes,...newValue]
  },
  ADD_PUSH(state,{isSystem,pushItem}){
    if(!isSystem){
      state.normalPushes.unshift(pushItem)
    }else{
      state.systemPushes.unshift(pushItem)
    }
    
    // console.log(data,state.pushList)
  },
  DELETE_PUSH(state,{type,i}){
    // state.pushList.splice(index,1)
    if(type==='normal'){
      state.normalPushes.splice(i,1)
    }
    if(type==='system'){
      state.systemPushes.splice(i,1)
    }
    // console.log(state.pushList)
  },
  READ_DATA(state,newValue){
    state.readData = newValue
  },
  UPDATE_READ_DATA(state,newValue){
    state.readData.unRead += newValue.unRead
    state.readData.sysUnRead += newValue.sysUnRead
    // console.log(state.readData)
    // state.readData = {
    //   unRead:state.readData.unRead + newValue.unRead,
    //   sysUnRead:state.readData.unRead + newValue.unRead,
    // }
  },
  IS_UNREAD(state,newValue){
    state.isUnread = newValue
  },
  IS_FIRST(state,newValue){
    state.isFirst = newValue
  },
  CHANGE_READ_STATUS(state,{type,index}){
    // console.log(124)
  
    if(type==='normal'){
      state.normalPushes[index].readAt='read'
    }
    if(type==='system'){
      state.systemPushes[index].readAt='read'
    }
    // activeList[index].readAt='read'
    // console.log(state.pushList[index])
  }
};

export const actions = {
  /**
   * 讀取推播通知
   * @param commit
   * @param pushId
   * @returns {AxiosPromise<any>}
   */
  async readPush({ commit,dispatch }, { pushId}) {
    await request.get(`/admin/push/read/${pushId}`)
    dispatch('checkIsReadByCount')
    // app 讀取通知，點了會直接到訂單，所以不會清掉通知狀態，但是會計算已讀，若全部已讀才會清掉狀態
  },
  async readPushPage({ commit,dispatch }, { type,pushId,index }) {
    await request.get(`/admin/push/read/${pushId}`)
    dispatch('updateReadState',{type,index})
    // 讀取通知會計算若全部已讀，清掉通知狀態
    dispatch('checkIsReadByCount')
  },

  /**
   * 搜尋推播通知
   * @param commit
   * @param page
   * @param limit
   * @returns {AxiosPromise<any>}
   */
  async fetchPushes({ state, commit ,dispatch }, {type,nextCursorRequest} ) {
   
    // console.log(nextCursorRequest)
    let query = {
      cursorPaginate:1,
      order_by:'id',
      order:'desc',
      limit:15
    }
    const normalQuery = {
      ...query,
      other:1,
      sys:0
    }
    const systemQuery = {
      ...query,
      other:0,
      sys:1
    }
    let readData = {}
    if(nextCursorRequest){
      // query.next_cursor = nextCursorRequest
      if(type==='normal'){
        normalQuery.next_cursor = nextCursorRequest
        const { items:normalPushes, infos ,pagination:normalPagination } = await request.post(`/admin/push/search`,normalQuery)
        commit('NORMAL_PUSHES',normalPushes)
        readData = infos
        commit('READ_DATA',readData)
        dispatch('checkIsRead')
        // dispatch('removeCancelOrderPush')
        return {
          system:'not',
          normal:normalPagination.next_cursor
        }
      }
      if(type==='system'){
        systemQuery.next_cursor = nextCursorRequest
        const { items:systemPushes, infos ,pagination:systemPagination } = await request.post(`/admin/push/search`,systemQuery)
        commit('SYSTEM_PUSHES',systemPushes)
        readData = infos
        commit('READ_DATA',readData)
        dispatch('checkIsRead')
        // dispatch('removeCancelOrderPush')
        return {
          normal:'not',
          system:systemPagination.next_cursor
        }
      }
    }
    if(!nextCursorRequest){
      const { items:normalPushes, infos ,pagination:normalPagination} = await request.post(`/admin/push/search`,normalQuery)
      const { items:systemPushes,pagination:systemPagination } = await request.post(`/admin/push/search`,systemQuery)
      commit('NORMAL_PUSHES',normalPushes)
      commit('SYSTEM_PUSHES',systemPushes)
      readData = infos 
      commit('READ_DATA',readData)
      dispatch('checkIsRead')
      commit('IS_FIRST',false)
      // dispatch('removeCancelOrderPush')
      return {
        normal:normalPagination.next_cursor,
        system:systemPagination.next_cursor
      }
      // commit('READ_DATA',infos)
    }
   

    // const { items, infos ,pagination } = await request.post(`/admin/push/search`,query)
    // commit('PUSH_LIST',items)
    
    
    
    // dispatch('removeCancelOrderPush')

  },
  checkIsReadByCount({state,commit}){
    const isRead = state.readData.unRead === 0 && state.readData.sysUnRead ===0
    if(isRead){
      commit('IS_UNREAD',false)
    }
    
  },
  checkIsRead({state,commit}){
    const isRead = state.readData.unReadClear && state.readData.sysUnReadClear
    commit('IS_UNREAD',!isRead)
  },
  async addPush({ commit }, data){
    const pushItem = {
      id:data.aps.data.id,
      readAt:null,
      type:data.aps.data.type,
      data
    }
    const isSystem = pushItem.type === 'PushSystemPostEvent'
    const readDataPlus = {
      unRead:isSystem ? 0 : 1,
      sysUnRead:isSystem ? 1 : 0
    }
    commit('ADD_PUSH',{pushItem,isSystem})
    const routeName = router.app.$route.name
    // 新增通知，若已經在通知頁面，就不更新通知狀態
    if(routeName !== 'notification' && routeName !== 'employee-notification'){
      commit('IS_UNREAD',true)
    }
    commit('UPDATE_READ_DATA',readDataPlus)
    // console.log(pushItem)
  },
  updateReadState({ state, commit },{type,index}){
    
    commit('CHANGE_READ_STATUS',{type,index})
    let activeList = []
    if(type==='normal'){
      activeList = [...state.normalPushes]
    }
    if(type==='system'){
      activeList = [...state.systemPushes]
    }
    const isSystem = activeList[index].type === 'PushSystemPostEvent'
    const readDataPlus = {
      unRead:isSystem ? 0 : -1,
      sysUnRead:isSystem ? -1 : 0
    }
    commit('UPDATE_READ_DATA',readDataPlus)

  },
  removeCancelOrderPush({ state, commit }){
    // let list = [...state.pushList]
    // console.log(list)
    // const orderId = list.find(item=>{
    //   return !item.data.aps.data.url && item.type === 'PushOrderCancelEvent'
    // }).data.aps.data.body.orderId
    const removeCancel = function(array,type){
      array.forEach((item,index)=>{
        if(!item.data.aps.data.url && item.type === 'PushOrderCancelEvent'){
           const orderId = item.data.aps.data.body.orderId
          //  console.log(orderId)
          array.forEach((push,i)=>{
            if(push.data.aps.data.body.orderId === orderId && push.type !== 'PushOrderCancelEvent'){
              commit('DELETE_PUSH',{type,i})
              // list.splice(i,1)
            }
            // commit('PUSH_LIST',list)
          })
        }
      })
    }
    removeCancel(state.normalPushes,'normal')
    removeCancel(state.systemPushes,'system')

  },
  clearUnRead({commit}){
    commit('IS_UNREAD',false)
    return request.post('admin/push/clear',{
      sys:1,
      other:1
    })
    
  }
};
