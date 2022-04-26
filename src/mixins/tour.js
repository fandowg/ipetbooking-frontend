import Shepherd from 'shepherd.js'
import Popper from 'popper.js'
import store from '@state/store'
import {
  pickObjectByKey
} from '@utils'

const KEY_NAME = 'tourName'
const TEXT_ATTRIBUTE_NAME = 'data-tour-text'
const STEP_ATTRIBUTE_NAME = 'data-tour-step'

const GUIDE_TITLE_ATTRIBUTE_SUFFIX = '-guide-title'
const GUIDE_INTRO_ATTRIBUTE_SUFFIX = '-guide-intro'

const tourOptions = {
  useModalOverlay: true,
  defaultStepOptions: {
    classes: 'tour',
    scrollTo: {
      behavior: 'smooth',
      block: 'center',
    },
  },
}

export default {
  data: function() {
    return {
      tourIsActive: false,
      pageTour: '',
      tourTimer: '',
      pageGuides: [],
    }
  },
  computed: {
    pageTourName() {
      return this.$options[KEY_NAME]
    },
  },
  mounted: function() {
    this.$nextTick(() => {
      if (!checkTourIsRead('welcome')) {
        this.initWelcome()
      } else {
        // this.initPageTour()
      }
    })
  },
  destroyed: function() {
    this.destroyPageTour()
  },
  methods: {
    initWelcome() {
      this.initPageGuide('welcome')
      const welcomeSteps = [{
          title: '歡迎使用 iPetBooking 管理系統',
          text: '歡迎使用 iPetBooking 管理系統，<br>首次登入請前往【商店設定】 設置基本資訊',
          buttons: [
            // {
            //   text: '略過',
            //   classes: 'is-skip',
            //   action: function() {
            //     return this.cancel()
            //   },
            // },
            {
              text: '我知道了',
              action() {
                return this.cancel()
                // this.next()
              },
            },
          ],
        },
        {
          buttons: [
            // {
            //   text: '略過',
            //   classes: 'is-skip',
            //   action: function() {
            //     return this.cancel()
            //   },
            // },
            {
              text: '開始使用',
              action: function() {
                this.complete()
              },
            },
          ],
          when: {
            show: () => {
              this.initPageGuide('welcome')
            },
            destroy: () => {
              this.destroyPageGuide()
            },
          },
        },
      ]

      const welcomeTour = setupTour(welcomeSteps)

      welcomeTour.once('cancel', () => {
        // this.initPageTour()
      })
      welcomeTour.once('complete', () => {
        // this.initPageTour()
      })

      welcomeTour.start()
      store.dispatch('auth/fetchTour')
    },
    destroyPageGuide() {
      this.pageGuides.forEach((guide) => guide.destroy())
    },
    initPageGuide(guideName) {
      const guides = document.querySelectorAll(
        `[${guideName}${GUIDE_TITLE_ATTRIBUTE_SUFFIX}]`
      )
      if (guides.length === 0) return
      this.pageGuides = convertElementToGuide(guideName, guides)
    },

    destroyPageTour() {
      if (!this.pageTour) return

      this.pageTour.off('active')
      this.pageTour.off('inactive')
    },
    initPageTour() {
      if (!this.pageTourName || checkTourIsRead(this.pageTourName)) return

      const steps = document.querySelectorAll(`[${TEXT_ATTRIBUTE_NAME}]`)
      if (steps.length === 0) return

      this.pageTour = setupTour(steps)
      this.pageTour.on('active', () => {
        this.tourIsActive = true
      })

      this.pageTour.on('inactive', () => {
        this.tourIsActive = false
      })
      this.tourTimer = setTimeout(() => {
        this.pageTour.start()
        store.dispatch('auth/fetchTour', this.pageTourName)
      }, 400)
    },
    $_tour_pageInit() {
      this.initPageTour()
    },
  },
}
/**
 * 檢查導覽是否已讀
 * @param {String} pageName 導覽名稱
 * @returns {Error, Boolean} true: 未讀，顯示導覽；false: 已讀，不顯示導覽
 */
function checkTourIsRead(pageName) {
  const userTours = store.state.auth.currentUserTours

  if (typeof userTours === 'object' && !(pageName in userTours))
    throw new Error(
      `[DingSomething] page: ${pageName} is not including in user tour list. Check the logic in backend about permission`
    )
  const tourIsRead = userTours[pageName]
  return tourIsRead
}

function convertElementToGuide(guideName, elements) {
  const elementArray = Array.from(elements)

  const guideTooltips = document.createDocumentFragment() // use fragment to prevent DOM reflow
  const guidePoppers = []

  elementArray.forEach((el, index) => {
    const guideTitle = el.getAttribute(
      `${guideName}${GUIDE_TITLE_ATTRIBUTE_SUFFIX}`
    )
    const guideIntro = el.getAttribute(
      `${guideName}${GUIDE_INTRO_ATTRIBUTE_SUFFIX}`
    )

    const tooltipElement = document.createElement('div')
    tooltipElement.className = 'guide'

    const arrowElement = document.createElement('div')
    arrowElement.setAttribute('x-arrow', '')
    arrowElement.className = 'guide__arrow'
    tooltipElement.appendChild(arrowElement)

    const tooltipContent = document.createElement('div')
    tooltipContent.className = 'guide__content'

    const titleElement = document.createElement('div')
    titleElement.className = 'guide__title'
    titleElement.appendChild(document.createTextNode(guideTitle))
    tooltipContent.appendChild(titleElement)

    const introElement = document.createElement('div')
    introElement.appendChild(document.createTextNode(guideIntro))
    tooltipContent.appendChild(introElement)

    tooltipElement.appendChild(tooltipContent)

    guideTooltips.appendChild(tooltipElement)

    const isWelcomePage = guideName === 'welcome'

    guidePoppers.push(
      new Popper(el, tooltipElement, {
        placement: isWelcomePage && index + 1 === elementArray.length ?
          'bottom' :
          'right',
        removeOnDestroy: true,
      })
    )
  })

  document.body.appendChild(guideTooltips)

  return guidePoppers
}

function setupTour(steps) {
  const tour = new Shepherd.Tour(tourOptions)

  const stepIsNodeList = !Array.isArray(steps)
  const tourSteps = stepIsNodeList ? convertElementToStep(steps) : steps
  tour.addSteps(tourSteps)

  return tour
}

function convertElementToStep(elements) {
  const elementArray = Array.from(elements)

  const groupStepByOrder = {
    widthOrder: [],
    noOrder: [],
  }
  elementArray.forEach((el, index) => {
    const stepOrder = el.getAttribute(STEP_ATTRIBUTE_NAME)
    const stepText = el.getAttribute(TEXT_ATTRIBUTE_NAME)

    const stepObject = {
      order: stepOrder,
      options: {
        attachTo: {
          element: el,
          on: 'bottom'
        },
        text: stepText,
        buttons: getStepButtons(elementArray.length, index + 1),
      },
    }

    groupStepByOrder[stepOrder ? 'widthOrder' : 'noOrder'].push(stepObject)
  })

  const {
    widthOrder,
    noOrder
  } = groupStepByOrder

  return widthOrder
    .sort(sortArrayByKey('order'))
    .concat(noOrder)
    .map((step) => step.options)
}

function getStepButtons(totalStep, currentStep) {
  const buttonsMap = {
    skip: {
      text: '跳過導覽',
      classes: 'is-skip',
      action: function() {
        return this.cancel()
      },
    },
    prev: {
      text: '上一步',
      classes: 'is-default',
      action: function() {
        return this.back()
      },
    },
    next: {
      text: '下一步',
      action: function() {
        return this.next()
      },
    },
    done: {
      text: '知道了',
      action: function() {
        return this.complete()
      },
    },
  }
  const positionButtonsMap = {
    first: ['skip', 'next'],
    middle: ['skip', 'prev', 'next'],
    last: ['skip', 'prev', 'done'],
    only: ['done'],
  }
  const currentStepPosition =
    totalStep === 1 ?
    'only' :
    currentStep === 1 ?
    'first' :
    totalStep === currentStep ?
    'last' :
    'middle'

  const stepButtonsArray = positionButtonsMap[currentStepPosition]

  return Object.values(pickObjectByKey(buttonsMap, stepButtonsArray))
}

function sortArrayByKey(key) {
  return (a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0)
}
