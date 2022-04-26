import store from '@state/store'

export default {
  inserted: function(el, binding) {
    const userHasPermission = checkPermission(binding.arg, binding.value)

    const forNoPermission = binding.modifiers.not
    if (
      (userHasPermission && forNoPermission) ||
      (!userHasPermission && !forNoPermission)
    ) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  },
}
/**
 *
 * @param {String} type 權限類型，為 /admin/merchant/user/access 回傳資料除了 assets 之鍵值
 * @param {String, Array} value 元素所綁定的操作權限值
 * @returns {Boolean} 是否可見
 */
export function checkPermission(type, value) {
  if (!type)
    return new Error(
      'Element should have binding argument to assign the type of permission.'
    )
  if (!value)
    return new Error(
      "Element should have binding value to determine user's accessibility."
    )

  const userAccessRange = new Set(
    store.state.auth.currentUserPermission[`${type}s`]
  )

  if (!userAccessRange) return true

  if (Array.isArray(value)) {
    const duplicatedValues = value.filter((item) => userAccessRange.has(item))
    return duplicatedValues.length > 0
  } else {
    return userAccessRange.has(value)
  }
}
