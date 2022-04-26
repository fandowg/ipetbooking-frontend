export function generateUniqueString(length) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
}

export function pickObjectByKey(object, keys) {
  return keys.reduce((obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key]
    }
    return obj
  }, {})
}

export function groupByKey(array, key) {
  return (array || []).reduce(
    (acc, x = {}) => ({
      ...acc,
      [x[key]]: [...(acc[x[key]] || []), x],
    }),
    {}
  )
}
