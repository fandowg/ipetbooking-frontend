import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@state/store'
import i18n from '@src/locales'
import router from '@router'

axios.defaults.baseURL = process.env.VUE_APP_BUILD_MODE === 'admin-app-build'
  ? 'https://admin.ipetbooking.com/api'
  // ? 'https://admin.ipetbooking.daydream-lab.com/api'
  : '/api';

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.post['Access-Control-Allow-Headers'] = 'Content-Type';
axios.defaults.headers.post['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS';

axios.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
);

axios.interceptors.response.use((response) => {
  return response.data && (response.data.data || response.data)
}, errorResponseHandler);

export function formatStatusMessage(status, isError = true) {
  const messagePrefix = isError
    ? 'ERROR'
    : 'SUCCESS';
  return i18n.t(`${ messagePrefix }.${ status }`) || status
}

export default axios

function errorResponseHandler(error) {
  // check for errorHandle in config
  const { config, response } = error
  if(response) {
    const { status: statusCode, data } = response

    if(
      config.hasOwnProperty('hideErrorMessage') &&
      config.hideErrorMessage &&
      statusCodeErrorHandler.hasOwnProperty(statusCode)
    ) {
      statusCodeErrorHandler[statusCode].call(this, data.status)
      return Promise.reject(data)
    }

    if(statusCodeErrorHandler.hasOwnProperty(statusCode)) {
      Message.error(formatStatusMessage(data.status))
      statusCodeErrorHandler[statusCode].call(this, data.status)
      return Promise.reject(data)
    }

    // axios v0.19.0 custom config 會被忽略
    if(!config.hasOwnProperty('errorHandle') && !config.errorHandle) {
      Message.error(formatStatusMessage(data.status))
    }

    return Promise.reject(data)
  } else {
    return Promise.reject(error)
  }
}

const statusCodeErrorHandler = {
  401: function () {
    window.reLoginVisible === true && MessageBox.close();
    router.push({
      name: 'logout',
    })
    // window.location.reload()
  },
  403: function (status) {
    if(
      status === 'USER_TOKEN_REVOKED' &&
      window.reLoginVisible === undefined
    ) {
      handleReLogin()
    }
  },
}

function handleReLogin() {
  window.reLoginVisible = true
  const messageHTML = `
    <div>
      <div role="alert" class="el-alert el-alert--warning is-light" style="margin-bottom: 20px;">
        <i class="el-alert__icon el-icon-warning"></i>
        <div class="el-alert__content">
          <span class="el-alert__title">此帳號已從不同裝置上登入</span>
        </div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__content">
          <div class="el-input">
            <input type="text" autocomplete="off" placeholder="Email" class="el-input__inner">
          </div>
        </div>
      </div>
      <div class="el-form-item">
        <div class="el-form-item__content">
          <div class="el-input">
            <input type="password" autocomplete="off" placeholder="密碼" class="el-input__inner">
          </div>
        </div>
      </div>
    </div>
  `
  MessageBox.alert(messageHTML, '重新登入', {
    dangerouslyUseHTMLString: true,
    center: true,
    showClose: false,
    confirmButtonText: '登入',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    beforeClose: (action, instance, done) => {
      if(action === 'confirm') {
        const email = instance.$el
          .getElementsByClassName('el-input__inner')[0]
          .value.trim()
        const password = instance.$el
          .getElementsByClassName('el-input__inner')[1]
          .value.trim()
        if(validate(email, password) === false) {
          return
        }
        tryToLogin(
          {
            email,
            password,
          },
          instance,
          done
        )
      }
    },
  })

  function validate(email, password) {
    if(email === '') {
      Message.error('請輸入 Email')
      return false
    }
    if(validateEmail(email) === false) {
      Message.error('請輸入有效的 Email')
      return false
    }
    if(password === '') {
      Message.error('請輸入密碼')
      return false
    }
    return true

    function validateEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(email)
        .toLowerCase())
    }
  }

  function tryToLogin(account, instance, done) {
    instance.confirmButtonLoading = true
    const isSameAccount =
      store.state.auth.currentUserAccount.email === account.email
    store
      .dispatch('auth/logIn', account)
      .then(() => {
        if(isSameAccount) {
          window.reLoginVisible = undefined
          instance.confirmButtonLoading = false
          done()
        } else {
          tryFetchAccess(account, instance, done)
        }
      })
      .catch((error) => {
        Message.error(formatStatusMessage(error.status))
        instance.confirmButtonLoading = false
      })
  }

  // refresh menu
  function tryFetchAccess(account, instance, done) {
    store.dispatch('auth/fetchAccess')
      .then(() => {
        window.reLoginVisible = undefined
        instance.confirmButtonLoading = false
        done()

        router.push({
          name: 'login',
        })
      })
  }
}
