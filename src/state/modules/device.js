import request from '@utils/request'
import { getSavedState, saveState } from "@utils/browser-help";

export const state = {
  currentDeviceToken: ''
};

export const getters = {};

export const mutations = {
  SET_STATE(state, newValue) {
    state = Object.assign(state, newValue);
  },
  SET_CURRENT_DEVICE_TOKEN(state, newValue) {
    state.currentDeviceToken = newValue
  },
};

export const actions = {
  async init({ state, commit }) {
    const initState = async () => {
      const stateData = {
        currentDeviceToken: await getSavedState('device.currentDeviceToken'),
      };

      commit('SET_STATE', stateData);

      return Promise.resolve();
    };

    await initState();

    return Promise.resolve(state);
  },
  /**
   * 設定裝置token
   * @param commit
   * @param token
   * @returns {Promise<void>}
   */
  async setCurrentDeviceToken({ commit }, { token }) {
    commit('SET_CURRENT_DEVICE_TOKEN', token);
    await saveState('device.currentDeviceToken', token);

    return Promise.resolve()
  },

  /**
   * 註冊裝置
   * @param commit
   * @param dispatch
   * @param token
   * @param platform
   * @returns {AxiosPromise<any>}
   */
  registerDevice({ commit, dispatch }, {
    token,
    platform = 'ios'
  }) {
    dispatch('setCurrentDeviceToken', { token });

    return request.post(`/admin/device/register`, {
      token,
      platform
    })
  },

  /**
   * 移除裝置
   * @param commit
   * @param dispatch
   * @param token
   * @returns {AxiosPromise<any>}
   */
  deleteDevice({ commit, dispatch }, {
    token,
  }) {
    dispatch('setCurrentDeviceToken', { token: '' });

    return request.post(`/admin/device/delete`, {
      token,
    })
  },
};
