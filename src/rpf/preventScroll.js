// polyfill
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;

    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

// detect supportsPassive
let supportsPassive = false;
function noop() {}
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassive = true;
      return true;
    }
  });

  window.addEventListener('testPassive', noop, opts);
  window.removeEventListener('testPassive', noop, opts);
} catch (e) {
  supportsPassive = false;
}

// utils fn
function reachTop(elem) {
  return elem.scrollTop <= 0;
}

function reachBottom(elem) {
  return elem.scrollHeight - elem.scrollTop <= elem.clientHeight;
}

function intentToScrollVert(touch, prevTouch, canScrollHori) {
  if (!canScrollHori) {
    return true;
  }
  let deltaX = touch.clientX - prevTouch.clientX;
  let deltaY = touch.clientY - prevTouch.clientY;
  let absX = Math.abs(deltaX);
  let absY = Math.abs(deltaY);
  return absX < absY;
}

function getCanScroll(elem, clientSizeKey, scrollSizeKey, overflowKey) {
  const clientSize = elem[clientSizeKey];
  const scrollSize = elem[scrollSizeKey];
  if (scrollSize <= clientSize) {
    return false;
  }
  return (
    ['hidden', 'visible'].indexOf(getComputedStyle(elem)[overflowKey]) === -1
  );
}

function getCanScrollHori(elem) {
  return getCanScroll(elem, 'clientWidth', 'scrollWidth', 'overflowX');
}

// function getCanScrollVert(elem) {
//   return getCanScroll(elem, 'clientHeight', 'scrollHeight', 'overflowY');
// }

let prevTouch = null;
let $ignoreElem = null;
let isInsideVConsole = false;
let canScrollHori = false;
let ignoreArg = null;

function clearup() {
  prevTouch = null;
  $ignoreElem = null;
  isInsideVConsole = false;
  canScrollHori = false;
}

function injectCSS(selector) {
  var $style = document.createElement('style');
  $style.type = 'text/css';
  $style.setAttribute('data-prevent-scroll', 'true');
  $style.textContent = `${selector} { -webkit-overflow-scrolling: touch; }`;
  document.head.appendChild($style);
}

function removeCSS() {
  const $elem = document.querySelector('style[data-prevent-scroll]');
  $elem && $elem.parentElement.removeChild($elem);
}

function touchStartHandler(e) {
  if (typeof ignoreArg === 'string') {
    $ignoreElem = e.target.closest(ignoreArg);
    if ($ignoreElem) {
      canScrollHori = getCanScrollHori($ignoreElem);
    }
    let { clientX, clientY } = e.touches[0];
    prevTouch = { clientX, clientY };
  }
  isInsideVConsole = e.target.closest('#__vconsole');
}

function touchMoveHandler(e) {
  if (isInsideVConsole) {
    return;
  }
  if (typeof ignoreArg === 'string') {
    let touch = e.touches[0];
    let canScroll = true;
    if (!$ignoreElem) {
      canScroll = false;
    } else if (
      touch.clientY < prevTouch.clientY &&
      intentToScrollVert(touch, prevTouch, canScrollHori) &&
      reachBottom($ignoreElem)
    ) {
      canScroll = false;
    } else if (
      touch.clientY > prevTouch.clientY &&
      intentToScrollVert(touch, prevTouch, canScrollHori) &&
      reachTop($ignoreElem)
    ) {
      canScroll = false;
    }
    prevTouch = {
      clientX: touch.clientX,
      clientY: touch.clientY
    };
    if (canScroll) {
      return;
    }
  }
  if (typeof ignoreArg === 'function' && ignoreArg(e.target)) {
    return;
  }
  if (e.cancelable) {
    e.preventDefault();
  }
}

function touchEndHandler() {
  $ignoreElem = null;
  isInsideVConsole = false;
}

export let hasCalled = false;

function preventScroll({ ignore = '.scrollable' } = {}) {
  if (hasCalled) {
    return {
      cancel: () => {}
    };
  }

  ignoreArg = ignore;
  const options = supportsPassive ? { passive: false } : false;
  function cancel() {
    clearup();
    removeCSS();
    window.removeEventListener('touchstart', touchStartHandler, options);
    window.removeEventListener('touchmove', touchMoveHandler, options);
    window.removeEventListener('touchend', touchEndHandler, options);
    hasCalled = false;
  }
  cancel();
  hasCalled = true;

  injectCSS(ignore);
  window.addEventListener('touchstart', touchStartHandler, options);
  window.addEventListener('touchmove', touchMoveHandler, options);
  window.addEventListener('touchend', touchEndHandler, options);
  return { cancel };
}

export default preventScroll;
