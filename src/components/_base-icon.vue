<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library as fontAwesomeIconLibrary } from '@fortawesome/fontawesome-svg-core'
import camelCase from 'lodash/camelCase'

// https://fontawesome.com/icons
fontAwesomeIconLibrary.add(
  require('@fortawesome/pro-regular-svg-icons/faSync').definition,
  require('@fortawesome/pro-regular-svg-icons/faSearch').definition,
  require('@fortawesome/pro-regular-svg-icons/faSignOut').definition,
  require('@fortawesome/pro-regular-svg-icons/faAngleDown').definition,
  require('@fortawesome/pro-regular-svg-icons/faAngleLeft').definition,
  require('@fortawesome/pro-regular-svg-icons/faAngleRight').definition,
  require('@fortawesome/pro-regular-svg-icons/faBell').definition,
  require('@fortawesome/pro-regular-svg-icons/faEdit').definition,
  require('@fortawesome/pro-regular-svg-icons/faEye').definition,
  require('@fortawesome/pro-regular-svg-icons/faEyeSlash').definition,
  require('@fortawesome/pro-regular-svg-icons/faClipboardList').definition,
  require('@fortawesome/pro-regular-svg-icons/faTicketAlt').definition,
  require('@fortawesome/pro-regular-svg-icons/faPlus').definition,
  require('@fortawesome/pro-regular-svg-icons/faMinus').definition,
  require('@fortawesome/pro-regular-svg-icons/faInfoCircle').definition,
  require('@fortawesome/pro-regular-svg-icons/faTimes').definition,
  require('@fortawesome/pro-regular-svg-icons/faEllipsisV').definition,
  require('@fortawesome/pro-regular-svg-icons/faHistory').definition,
  // Main Menu
  require('@fortawesome/pro-regular-svg-icons/faBars').definition,
  require('@fortawesome/pro-regular-svg-icons/faTachometerAltFast').definition,
  require('@fortawesome/pro-regular-svg-icons/faGripHorizontal').definition,
  require('@fortawesome/pro-regular-svg-icons/faAnalytics').definition,
  require('@fortawesome/pro-regular-svg-icons/faUsersClass').definition,
  require('@fortawesome/pro-regular-svg-icons/faUserLock').definition,
  require('@fortawesome/pro-regular-svg-icons/faConciergeBell').definition,
  require('@fortawesome/pro-regular-svg-icons/faUser').definition,
  require('@fortawesome/pro-regular-svg-icons/faCog').definition,
  require('@fortawesome/pro-regular-svg-icons/faExclamationTriangle').definition,
  require('@fortawesome/pro-regular-svg-icons/faAddressBook').definition,
  require('@fortawesome/pro-regular-svg-icons/faExternalLink').definition,
  require('@fortawesome/pro-regular-svg-icons/faImage').definition,
  require('@fortawesome/pro-regular-svg-icons/faCaretDown').definition,
  require('@fortawesome/pro-regular-svg-icons/faTag').definition,
  require('@fortawesome/pro-regular-svg-icons/faPiggyBank').definition,
  require('@fortawesome/pro-regular-svg-icons/faInbox').definition,
  require('@fortawesome/pro-regular-svg-icons/faStore').definition,
  require('@fortawesome/pro-regular-svg-icons/faStoreAlt').definition,
  // Product Type
  require('@fortawesome/pro-regular-svg-icons/faIcons').definition,
  require('@fortawesome/pro-regular-svg-icons/faGraduationCap').definition,
  require('@fortawesome/pro-regular-svg-icons/faUtensils').definition,
  require('@fortawesome/pro-regular-svg-icons/faHeadset').definition,
  require('@fortawesome/pro-regular-svg-icons/faHandReceiving').definition,
  // Check in
  require('@fortawesome/pro-regular-svg-icons/faPhone').definition,
  require('@fortawesome/pro-regular-svg-icons/faBackspace').definition,
  require('@fortawesome/pro-regular-svg-icons/faCalendar').definition,
  require('@fortawesome/pro-regular-svg-icons/faCalendarCheck').definition,
  // Dashboard
  require('@fortawesome/pro-regular-svg-icons/faTh').definition,
  require('@fortawesome/pro-regular-svg-icons/faFileInvoiceDollar').definition,
  require('@fortawesome/pro-regular-svg-icons/faFlag').definition,
  require('@fortawesome/pro-regular-svg-icons/faDollarSign').definition,
  require('@fortawesome/pro-regular-svg-icons/faCogs').definition,
  require('@fortawesome/pro-regular-svg-icons/faDonate').definition,
  // Order
  require('@fortawesome/pro-regular-svg-icons/faPaperPlane').definition,
  require('@fortawesome/pro-regular-svg-icons/faShareAlt').definition,
  require('@fortawesome/pro-regular-svg-icons/faBan').definition,
  require('@fortawesome/pro-regular-svg-icons/faCopy').definition,
  require('@fortawesome/free-brands-svg-icons/faFacebookF').definition,
  require('@fortawesome/free-brands-svg-icons/faLine').definition,
  require('@fortawesome/pro-regular-svg-icons/faSms').definition,
  require('@fortawesome/pro-regular-svg-icons/faCommentDots').definition,
  require('@fortawesome/pro-regular-svg-icons/faEnvelope').definition,
  require('@fortawesome/pro-regular-svg-icons/faFileExport').definition,
  require('@fortawesome/free-solid-svg-icons/faUser').definition,
  require('@fortawesome/pro-regular-svg-icons/faUndo').definition,
  require('@fortawesome/pro-light-svg-icons/faPencil').definition,
  require('@fortawesome/pro-light-svg-icons/faEnvelope').definition,
  require('@fortawesome/pro-light-svg-icons/faPaperPlane').definition,
  require('@fortawesome/pro-light-svg-icons/faAddressCard').definition,
  require('@fortawesome/pro-light-svg-icons/faAngleDoubleRight').definition,
  // Product
  require('@fortawesome/pro-regular-svg-icons/faCheck').definition,
  require('@fortawesome/pro-regular-svg-icons/faTrashAlt').definition,
  require('@fortawesome/free-solid-svg-icons/faGripVertical').definition,
  require('@fortawesome/pro-regular-svg-icons/faTimes').definition,
  require('@fortawesome/pro-regular-svg-icons/faSearch').definition,
  require('@fortawesome/pro-regular-svg-icons/faLockAlt').definition,
  // Filter
  require('@fortawesome/pro-regular-svg-icons/faFilter').definition,
  // User Permission
  require('@fortawesome/pro-regular-svg-icons/faCheckCircle').definition,
  require('@fortawesome/pro-regular-svg-icons/faInfo').definition,
  // Loading icon
  require('@fortawesome/pro-regular-svg-icons/faSpinner').definition,
  require('@fortawesome/pro-regular-svg-icons/faQuestionCircle').definition,
  // Merchant
  require('@fortawesome/pro-regular-svg-icons/faFileInvoice').definition,
  // Subscription
  require('@fortawesome/pro-regular-svg-icons/faPencilAlt').definition,
  require('@fortawesome/free-brands-svg-icons/faCcAmex').definition,
  require('@fortawesome/free-brands-svg-icons/faCcDinersClub').definition,
  require('@fortawesome/free-brands-svg-icons/faCcJcb').definition,
  require('@fortawesome/free-brands-svg-icons/faCcMastercard').definition,
  require('@fortawesome/free-brands-svg-icons/faCcPaypal').definition,
  require('@fortawesome/free-brands-svg-icons/faCcVisa').definition,
  // Member
  require('@fortawesome/pro-regular-svg-icons/faMailBulk').definition,
  require('@fortawesome/pro-regular-svg-icons/faTags').definition,
  require('@fortawesome/pro-regular-svg-icons/faComments').definition,

  require('@fortawesome/pro-regular-svg-icons/faLightbulbOn').definition,
  // Chat
  require('@fortawesome/free-solid-svg-icons/faReply').definition,
  require('@fortawesome/pro-regular-svg-icons/faArrowDown').definition,
  require('@fortawesome/pro-regular-svg-icons/faArrowRight').definition,
  // Schedule
  require('@fortawesome/pro-regular-svg-icons/faUserClock').definition,
  require('@fortawesome/pro-light-svg-icons/faChevronDown').definition,
  // Price
  require('@fortawesome/pro-regular-svg-icons/faCut').definition,
  require('@fortawesome/pro-regular-svg-icons/faDog').definition,
  require('@fortawesome/pro-regular-svg-icons/faCat').definition,
  // Staff UI
  require('@fortawesome/pro-light-svg-icons/faChevronLeft').definition,
  require('@fortawesome/pro-light-svg-icons/faChevronRight').definition,
  require('@fortawesome/pro-regular-svg-icons/faBriefcase').definition,
  require('@fortawesome/pro-light-svg-icons/faMoneyCheckAlt').definition,
  require('@fortawesome/pro-light-svg-icons/faCalendar').definition,
  require('@fortawesome/pro-light-svg-icons/faEye').definition,
  require('@fortawesome/pro-light-svg-icons/faClipboardList').definition,
  require('@fortawesome/pro-light-svg-icons/faClock').definition,
  require('@fortawesome/pro-light-svg-icons/faCut').definition,
  require('@fortawesome/pro-light-svg-icons/faFileInvoiceDollar').definition,
  // Coupon
  require('@fortawesome/pro-light-svg-icons/faUserCheck').definition,
  require('@fortawesome/pro-light-svg-icons/faUserTimes').definition,

  require('@fortawesome/pro-light-svg-icons/faPaw').definition,
  require('@fortawesome/pro-light-svg-icons/faShoppingCart').definition,
  require('@fortawesome/pro-light-svg-icons/faShoppingBag').definition,
  require('@fortawesome/pro-light-svg-icons/faUsersClass').definition,
  require('@fortawesome/pro-light-svg-icons/faPlus').definition,
  
  require('@fortawesome/pro-light-svg-icons/faTimes').definition,
  require('@fortawesome/pro-light-svg-icons/faTachometer').definition,
  require('@fortawesome/pro-regular-svg-icons/faBell').definition,
  require('@fortawesome/pro-regular-svg-icons/faChartBar').definition,
  require('@fortawesome/pro-regular-svg-icons/faCaretRight').definition,
  require('@fortawesome/pro-regular-svg-icons/faTimes').definition,
  require('@fortawesome/pro-regular-svg-icons/faUserTag').definition,
  require('@fortawesome/pro-regular-svg-icons/faUserPlus').definition,
  require('@fortawesome/pro-regular-svg-icons/faShare').definition,
  require('@fortawesome/pro-regular-svg-icons/faMapMarkerAlt').definition,
)

export default {
  components: {
    FontAwesomeIcon,
  },
  inheritAttrs: false,
  props: {
    source: {
      type: String,
      default: 'font-awesome',
    },
    name: {
      type: String,
      required: true,
    },
    circle: {
      type: Boolean,
      default: false,
    },
    iconStyle: {
      type: String,
      default: 'far',
    },
    spin: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // Gets a CSS module class, e.g. iconCustomLogo
    customIconClass() {
      return this.$style[camelCase('icon-custom-' + this.name)]
    },
  },
}
</script>

<template>
  <FontAwesomeIcon v-if="source === 'font-awesome'" v-bind="$attrs" :icon="[iconStyle, name]" :class="$style.fontAwesome" :spin="spin" />
  <span v-else-if="source === 'custom'" v-bind="$attrs" :class="customIconClass" />
</template>
<style lang="scss" module>
@import '@design';
.fontAwesome:global(.svg-inline--fa) {
  width: 1em;
  + span {
    margin-left: 0.5em;
  }
}
</style>
