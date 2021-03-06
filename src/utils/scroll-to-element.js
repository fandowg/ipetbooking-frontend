export default function scrollToElement($el, offset = 0) {
  const container = findScrollableContainer($el)
  container.scrollTo({
    top: findPos($el) - offset,
    behavior: "smooth"
  })
}

function isScrollable($el) {
  // Compare the height to see if the element has scrollable content
  const hasScrollableContent = $el.scrollHeight > $el.clientHeight;

  // It's not enough because the element's `overflow-y` style can be set as
  // * `hidden`
  // * `hidden !important`
  // In those cases, the scrollbar isn't shown
  const overflowYStyle = window.getComputedStyle($el).overflowY;
  const isOverflowYScroll = ['scroll', 'auto'].includes(overflowYStyle)

  return hasScrollableContent && isOverflowYScroll;
}

function findScrollableContainer($el) {
  if(!isScrollable($el))
    return findScrollableContainer($el.parentElement)
  else
    return $el
}

function findPos(el) {
  var curtop = 0
  if (el.offsetParent) {
    do {
      curtop += el.offsetTop
    } while ((el = el.offsetParent))
    return curtop
  }
}