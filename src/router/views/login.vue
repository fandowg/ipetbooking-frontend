<script>
  import { formatStatusMessage } from '@utils/request'

  import { appComputed, authComputed } from '@state/helpers'
  import appConfig from '@src/app.config'
  import Cookies from "js-cookie";
  import { Http } from '@capacitor-community/http';
  import { Storage } from "@capacitor/storage";
  import { getSavedState, saveState } from "@utils/browser-help";

  export default {
    page: {
      title: '登入',
      meta: [{ name: 'description', content: `Log in to ${ appConfig.title }` }],
    },
    data() {
      return {
        forgotMode: false,
        loginData: {
          // email: 'admin@j-tails.com',
          // password: 'j-tails@2020',
          email: process.env.VUE_APP_BUILD_MODE === 'admin-app-build' ? '' : '',
          password: process.env.VUE_APP_BUILD_MODE === 'admin-app-build' ? '' : '',
        },
        resetData: {
          password: '',
          passwordConfirm: '',
        },
        resetRules: {
          password: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if(!value) {
                  return callback(new Error('請輸入密碼'))
                }
                const passwordPattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[$@$!%*#?&])|(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*#?&])|(?=.*[a-z])(?=.*[0-9])(?=.*[$@$!%*#?&]).{8,16}/
                const passwordConfirmValue = this.resetData.passwordConfirm
                if(!passwordPattern.test(value)) {
                  callback(new Error('請用 8~16 個大小寫英文字母、數字與特殊符號組合'))
                }
                if(passwordConfirmValue !== '') {
                  this.$refs.form.validateField('passwordConfirm')
                }

                callback()
              },
              trigger: 'blur',
            },
          ],
          passwordConfirm: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if(!value) {
                  return callback(new Error('請再次輸入密碼'))
                }
                const passwordValue = this.resetData.password
                if(value !== passwordValue) {
                  callback(new Error('兩次輸入的密碼不一致'))
                } else {
                  callback()
                }
              },
              trigger: 'blur',
            },
          ],
        },
        buttonLoading: false,
        subscriptionData: {},
        bindCardFormData: '',
        processingLogin: false,
        processingText: '',
        passwordVisible: false,
      }
    },
    computed: {
      ...appComputed,
      ...authComputed,
      resetMode() {
        return this.$route.params.resetToken
      },
      formRules() {
        return {
          email: [
            {
              required: true,
              message: '請輸入 Email',
              trigger: 'blur',
            },
            {
              type: 'email',
              message: '請輸入有效的 Email',
              trigger: 'blur',
            },
          ],
          password: [
            {
              required: !this.forgotMode,
              message: '請輸入密碼',
              trigger: 'blur',
            },
          ],
        }
      },
    },
    methods: {
      async tryToReset() {
        this.buttonLoading = true
        try {
          await this.$store.dispatch('auth/reset', {
            ...this.resetData,
            token: this.resetMode,
          })
          await this.$alert('您的密碼已重置，請重新登入', '密碼已更新', {
            confirmButtonText: '回到登入頁',
            type: 'success',
            center: true,
          })

          this.backToLogin()
        } catch(error) {
        } finally {
          this.buttonLoading = false
        }
      },
      async tryToSendForget() {
        this.buttonLoading = true
        try {
          await this.$store.dispatch('auth/forgot', this.loginData.email)
          await this.$alert('請至您的信箱查看並進行重置密碼', '已成功寄出重置密碼信件！', {
            confirmButtonText: '確定',
            type: 'success',
            center: true,
          })
          this.switchForgotMode()
        } finally {
          this.buttonLoading = false
        }
      },
      // Try to log the user in with the email
      // and password they provided.
      tryToLogIn() {
        this.buttonLoading = true
        return this.$store
          .dispatch('auth/logIn', this.loginData)
          .then(() => this.handleLogin())
          .catch((error) => {
            console.log('TCL: tryToLogIn -> error', error)
            switch(error.status) {
              // 無綁定的卡
              case 'MERCHANT_FRONT_PLEASE_BIND_CARD_FIRST':
                this.subscriptionData = error.data.items
                this.handleBindingCard()
                break
              // 無訂閱項目
              case 'MERCHANT_FRONT_PLEASE_RENEW_SUBSCRIPTION':
                this.subscriptionData = error.data.items
                this.handleSubscription()
                break
              default:
                this.$alert(formatStatusMessage(error.status), '登入失敗', {
                  confirmButtonText: '確定',
                  type: 'error',
                  center: true,
                })
                break
            }
          })
          .finally(() => (this.buttonLoading = false))
      },
      async tryToBindingCard() {
        this.bindCardFormData = await this.$store.dispatch('merchant/changeCard', this.subscriptionData.merchantAlias)
        this.$nextTick(() => {
          this.$refs.cardForm.submit()
        })
      },
      async handleBindingCard() {
        await this.$confirm('設定您的付款方式後，您的會員資格就會立即開始', '您尚未設定付款方式', {
          confirmButtonText: '前往設定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        })
        this.$router.push({
          name: 'subscription',
        })
      },
      async handleSubscription() {
        const cardIsExpired = this.subscriptionData.creditCard.isExpired === 1
        const title = cardIsExpired
          ? '您的信用卡已過期'
          : '訂閱已到期'
        const description = cardIsExpired
          ? '請重新綁定您的信用卡'
          : '您的訂閱已到期，故無法登入。<br>欲重啟訂閱請與我們聯繫，謝謝！<br>(02)2531-6628'
        const confirmButtonText = cardIsExpired
          ? '前往更新'
          : '確定'
        await this.$confirm(description, title, {
          confirmButtonText,
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
          dangerouslyUseHTMLString: true,
          // showConfirmButton:cardIsExpired,
          showCancelButton: cardIsExpired,
          showClose: cardIsExpired,
          closeOnClickModal: cardIsExpired
        })
        this.$router.push({
          name: 'logout',
        })
      },
      async handleLogin() {
        this.processingLogin = true
        this.processingText = '登入成功，取得身份權限中'

        try {
          const userRoutes = await this.$store.dispatch('auth/fetchAccess')
          this.$router.addRoutes(userRoutes)
          await this.$store.dispatch('auth/fetchTour')
          if(this.$route.params.routeFromPath) {
            this.$router.push({
              path: String(this.$route.params.routeFromPath),
            })
          } else {
            this.$router.push(
              this.$route.query.redirectFrom || {
                name: this.currentUser.redirect,
              }
            )
          }
        } catch(error) {
          this.processingLogin = false
        }

        // console.log('this.$store.state.auth', this.$store.state.auth)
      },
      handleSubmitForm() {
        this.forgotMode
          ? this.tryToSendForget()
          : this.tryToLogIn()
      },
      switchForgotMode() {
        this.$refs.form.clearValidate()
        this.forgotMode = !this.forgotMode
      },
      backToLogin() {
        this.$router.push({ name: 'login' })
      },
      /* async testGet() {
        const value = await getSavedState('key');
        // const { value } = await Storage.get({ key: 'key' });

        console.log(value)
        alert(`Hello ${value.aa}`)
      },
      async testSave() {
        await saveState('key', {
          aa: 'BB'
        });
        const value = await getSavedState('key');
        /!* await Storage.set({
          key: 'key',
          value: 'Max',
        }); *!/

        // const { value } = await Storage.get({ key: 'key' });

        console.log(value)
        alert(`Save ${value.aa}`)
      } */
    },
  }
</script>

<template>
  <el-container class="login-container" :class="[$style.loginWrapper, { isReset: resetMode || forgotMode }]">
    <div class="inner">
      <div :class="$style.top">
        <img :src="require(`@assets/images/logo-dark.svg`)" class="logo-pet"/>
        <img :src="require(`@assets/images/login_logo.svg`)" class="logo-site"/>
      </div>

      <transition name="login-form" appear>
        <el-form v-if="resetMode" ref="form" :model="resetData" :rules="resetRules" :class="$style.main"
                 class="el-form-item--normal-margin" @submit.native.prevent="tryToReset">
          <h3>重置密碼</h3>
          <el-form-item prop="password">
            <el-input v-model="resetData.password" :type="passwordVisible ? 'text' : 'password'" placeholder="輸入新的密碼">
              <el-button slot="append" @click="passwordVisible = !passwordVisible">
                <BaseIcon :name="passwordVisible ? 'eye-slash' : 'eye'"/>
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item prop="passwordConfirm">
            <el-input v-model="resetData.passwordConfirm" :type="passwordVisible ? 'text' : 'password'"
                      placeholder="再次輸入密碼以確認">
              <el-button slot="append" @click="passwordVisible = !passwordVisible">
                <BaseIcon :name="passwordVisible ? 'eye-slash' : 'eye'"/>
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="large" type="primary" class="is-fullwidth" native-type="submit" :loading="buttonLoading"
                       :disabled="buttonLoading">變更密碼
            </el-button>
          </el-form-item>
          <el-button type="text" @click="backToLogin">回到登入頁</el-button>
        </el-form>
      </transition>
      <transition name="login-form" appear>
        <el-form
          v-if="!$route.params.resetToken"
          ref="form"
          v-loading="processingLogin"
          :model="loginData"
          :rules="formRules"
          :validate-on-rule-change="false"
          :class="$style.main"
          class="el-form-item--normal-margin"
          :element-loading-text="processingText"
          @submit.native.prevent="handleSubmitForm"
        >
          <template v-if="!processingLogin">
            <div v-if="forgotMode" :class="$style.main__header">
              <h3>忘記密碼？</h3>
              <p>不用擔心！您只要輸入您註冊的 Email，我們將會協助您重置密碼。</p>
            </div>

            <el-form-item prop="email">
              <h3 v-show="!forgotMode" style="margin-top: 0">登入</h3>
              <el-input v-model="loginData.email" class="is-round" type="text" placeholder="Email"></el-input>
            </el-form-item>

            <template v-if="forgotMode">
              <el-form-item>
                <el-button size="large" type="primary" class="is-fullwidth is-round" native-type="submit"
                           :loading="buttonLoading" :disabled="buttonLoading">取得重置密碼信
                </el-button>
              </el-form-item>
              <div :class="$style['help-text']">
                記得您的密碼？試著
                <el-button type="text" @click="switchForgotMode">登入</el-button>
                吧！
              </div>
            </template>
            <div v-show="!forgotMode">
              <el-form-item prop="password">
                <el-input v-model="loginData.password" class="is-round" :type="passwordVisible ? 'text' : 'password'"
                          placeholder="密碼">
                  <el-button slot="append" @click="passwordVisible = !passwordVisible">
                    <BaseIcon :name="passwordVisible ? 'eye-slash' : 'eye'"/>
                  </el-button>
                </el-input>
              </el-form-item>
              <el-button type="text" class="is-fullwidth"
                         style="text-align: right; margin-top: -20px; margin-bottom: 20px" @click="switchForgotMode">
                忘記密碼？
              </el-button>
              <el-form-item>
                <el-button size="large" type="primary" native-type="submit" :loading="buttonLoading"
                           :disabled="buttonLoading" class="is-fullwidth is-round">登入
                </el-button>
              </el-form-item>
            </div>
          </template>
        </el-form>
      </transition>
    </div>
    <div :class="$style.footer">{{ `版本 ${ appVersion }` }}</div>
    <form v-if="bindCardFormData" ref="cardForm" :action="bindCardFormData.PostUrl" method="POST" hidden>
      <input v-for="(value, field) in bindCardFormData" :key="field" :name="field" :value="value"/>
    </form>
    <!-- <div :class="$style['bg-mark']" :style="`background-image: url(${require('@assets/images/login_bg-pattern.svg')});`"></div> -->
  </el-container>
</template>

<style lang="scss" module>
  @import '@design';

  :global {
    .login-form-enter-active,
    .login-form-leave-active {
      transition: opacity 1s ease-in-out;
    }

    .login-form-enter,
    .login-form-leave-to {
      opacity: 0;
    }
  }

  .loginWrapper {
    background-image: url('@assets/images/login_bg.svg');
    background-repeat: no-repeat;
    background-color: #FCF4EC;
    background-position: 5% 67%;
    @include pad {
      background-image: none;
    }

    &:global {
      &.isReset {
        background-image: none;
        justify-content: center;
        padding-right: 0;

        .logo-pet {
          display: inline-block;
          height: 75px;
          margin-right: 30px;
        }

        .logo-site {
          height: 76px;
        }

        // color: #f63;
      }
    }
  }

  .top {
    margin-bottom: 25px;
    color: white;
    text-align: center;
    letter-spacing: $font-letter-spacing-base;
    // width: 145px;
    &__header {
      font-size: 2.25rem;
      font-weight: $heading-font-weight;
      line-height: 2.25rem * 1.5;
    }

    :global {
      .logo-pet {
        display: none;
      }

      .logo-site {
      }
    }
  }

  .main {
    @include layer-elevation(10);

    // width: 404px;
    min-height: 250px;
    padding: 30px;
    // margin: 0 auto;
    text-align: center;
    background-color: white;
    z-index: 3;

    &__header {
      margin-bottom: 25px;
    }

    @include pad {
      width: 100%;
      margin: 0;
      box-shadow: none;
      background: transparent;
      padding-top: 0;
    }

    :global {
      .el-input-group__append {
        background: transparent;
        border-left: none;
      }

      @include pad {
        .el-input__inner {
          background: white;
        }
      }
    }
  }

  .help-text {
    color: $color-text-secondary;
  }

  .footer {
    position: absolute;
    bottom: 20px;
    left: 50%;
    // color: white;
    color: $color-secondary;
    text-transform: uppercase;
    letter-spacing: 0.15rem;
    transform: translateX(-50%);
    @include pad {
      display: none;
    }
  }

  .bg-mark {
    position: absolute;
    right: 64px;
    bottom: 0;
    width: 440px;
    height: 357px;
    opacity: 0.1;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    @include pad {
      display: none;
    }
  }
</style>
