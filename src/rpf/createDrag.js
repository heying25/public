function createDrag(
  elem,
  { inertial = true, friction = 0.05, onStart, onUpdate, onEnd, onInertialEnd }
) {
  if (typeof inertial !== 'boolean') {
    throw Error('inertial should be boolean');
  }
  if (typeof friction !== 'number') {
    throw Error('friction should be number');
  }
  if (friction <= 0 || friction >= 1) {
    throw Error('friction should be in range of (0, 1)');
  }
  if (onStart && typeof onStart !== 'function') {
    throw Error('onStart should be function');
  }
  if (onUpdate && typeof onUpdate !== 'function') {
    throw Error('onUpdate should be function');
  }
  if (onEnd && typeof onEnd !== 'function') {
    throw Error('onEnd should be function');
  }
  if (onInertialEnd && typeof onInertialEnd !== 'function') {
    throw Error('onInertialEnd should be function');
  }

  let velocity = { x: 0, y: 0 };
  let dragging = false;
  let rafId = null;
  let prevTouch = {
    clientX: 0,
    clientY: 0
  };
  let inerEnded = true;
  let hasStart = false;

  function step() {
    rafId = requestAnimationFrame(step);
    if (!dragging) {
      if (Math.abs(velocity.x) >= 1 || Math.abs(velocity.y) >= 1) {
        const inerialDelta = {
          x: velocity.x,
          y: velocity.y
        };
        onUpdate &&
          onUpdate({
            delta: inerialDelta
          });
        velocity.x *= 1 - friction;
        velocity.y *= 1 - friction;
      } else if (!inerEnded) {
        onInertialEnd && onInertialEnd();
        inerEnded = true;
      }
    }
  }
  if (inertial) {
    step();
  }

  function normalizeTouch(e) {
    if (e.touches) {
      return e.touches[0];
    }
    return {
      clientX: e.clientX,
      clientY: e.clientY
    };
  }

  function onTouchStart(e) {
    hasStart = true;
    const touch = normalizeTouch(e);
    prevTouch = {
      clientX: touch.clientX,
      clientY: touch.clientY
    };
    dragging = true;
    velocity = { x: 0, y: 0 };
    onStart && onStart(e);
    inerEnded = false;
  }

  function onTouchMove(e) {
    if (dragging) {
      e.preventDefault();
      const touch = normalizeTouch(e);
      const moveDelta = {
        x: touch.clientX - prevTouch.clientX,
        y: touch.clientY - prevTouch.clientY
      };
      velocity = moveDelta;
      onUpdate && onUpdate({ delta: moveDelta }, e);
      prevTouch = {
        clientX: touch.clientX,
        clientY: touch.clientY
      };
    }
  }

  function onTouchEnd(e) {
    if (!hasStart) {
      return;
    }
    hasStart = false;
    const touch = normalizeTouch(e);
    if (/^mouse/.test(e.type)) {
      dragging = false;
    } else if (touch) {
      prevTouch = {
        clientX: touch.clientX,
        clientY: touch.clientY
      };
    } else {
      dragging = false;
    }
    onEnd && onEnd(e);
  }

  function onCtxMenu(e) {
    e.preventDefault();
  }

  function cancel() {
    elem.removeEventListener('mousedown', onTouchStart);
    window.removeEventListener('mousemove', onTouchMove);
    window.removeEventListener('mouseup', onTouchEnd);
    elem.removeEventListener('contextmenu', onCtxMenu);

    elem.removeEventListener('touchstart', onTouchStart);
    elem.removeEventListener('touchmove', onTouchMove);
    elem.removeEventListener('touchend', onTouchEnd);

    cancelAnimationFrame(rafId);
  }
  elem.addEventListener('mousedown', onTouchStart);
  window.addEventListener('mousemove', onTouchMove);
  window.addEventListener('mouseup', onTouchEnd);
  elem.addEventListener('contextmenu', onCtxMenu);

  elem.addEventListener('touchstart', onTouchStart);
  elem.addEventListener('touchmove', onTouchMove);
  elem.addEventListener('touchend', onTouchEnd);

  return {
    cancel
  };
}

export default createDrag;
