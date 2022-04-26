import Cookies from 'js-cookie'
// https://capacitorjs.com/docs/apis/storage
import { Storage } from '@capacitor/storage';

export function getCookie(key) {
  if(process.env.VUE_APP_BUILD_MODE === 'admin-app-build') {
    // no working
  } else {
    return JSON.parse(Cookies.get(key) || null)
  }
}

export function setCookie(key, value) {
  if(process.env.VUE_APP_BUILD_MODE === 'admin-app-build') {
    // no working
  } else {
    return Cookies.set(key, JSON.stringify(value), {
      expires: 7,
      sameSite: 'lax',
    });
  }
}

export const getSavedState = async (key) => {
  const { value: stateValue } = process.env.VUE_APP_BUILD_MODE === 'admin-app-build'
    ? await Storage.get({ key })
    : {
      value: window.localStorage.getItem(key)
    };

  if(!stateValue || stateValue === 'undefined') {
    return undefined;
  }

  return Promise.resolve(typeof stateValue === 'object'
    ? stateValue
    : JSON.parse((stateValue || '')));
};

export const saveState = async (key, value) => {
  const stateValue = JSON.stringify(value);

  if(process.env.VUE_APP_BUILD_MODE === 'admin-app-build') {
    await Storage.set({
      key,
      value: stateValue,
    });
  } else {
    window.localStorage.setItem(key, stateValue)
  }

  return Promise.resolve(stateValue)
};
