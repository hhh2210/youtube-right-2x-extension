(() => {
  const DESIRED_RATE_DEFAULT = 2.0;
  const LONG_PRESS_DELAY = 300;
  const SPEEDMASTER_DETECT_DELAY = 550;
  const SPEEDMASTER_RATE = 2.0;
  let desiredRate = DESIRED_RATE_DEFAULT;
  let isPressing = false;
  let isFallbackActive = false;
  let lastRate = 1.0;
  let currentVideo = null;
  let longPressTimer = null;
  let speedmasterDetectTimer = null;
  let speedmasterRateChangeHandler = null;
  let speedmasterFailed = false;
  let speedmasterAttempting = false;
  let speedmasterDetected = false;
  let clickGuardActive = false;

  const styleEl = document.createElement('style');
  styleEl.textContent = `
    #yt-right-2x-overlay {
      position: fixed;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 14px;
      height: 34px;
      background: rgba(33, 33, 33, 0.9);
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      border-radius: 4px;
      z-index: 2147483647;
      pointer-events: none;
      user-select: none;
      opacity: 0;
      transition: opacity 150ms ease;
      transform: translateX(-50%);
    }
    #yt-right-2x-overlay .yt-2x-icon {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      margin-right: 6px;
    }
    #yt-right-2x-overlay .yt-2x-chevron {
      display: inline-block;
      width: 0;
      height: 0;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-left: 6px solid #fff;
      animation: yt-2x-pulse 0.9s ease-in-out infinite;
    }
    #yt-right-2x-overlay .yt-2x-chevron:nth-child(2) {
      animation-delay: 0.15s;
    }
    #yt-right-2x-overlay .yt-2x-chevron:nth-child(3) {
      animation-delay: 0.3s;
    }
    @keyframes yt-2x-pulse {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }
  `;
  document.documentElement.appendChild(styleEl);

  const overlay = document.createElement('div');
  overlay.id = 'yt-right-2x-overlay';
  const iconSpan = document.createElement('span');
  iconSpan.className = 'yt-2x-icon';
  for (let i = 0; i < 3; i++) {
    const chevron = document.createElement('span');
    chevron.className = 'yt-2x-chevron';
    iconSpan.appendChild(chevron);
  }
  const textSpan = document.createElement('span');
  textSpan.className = 'yt-2x-text';
  overlay.appendChild(iconSpan);
  overlay.appendChild(textSpan);
  document.documentElement.appendChild(overlay);

  const showOverlay = (text, isSpecial = false) => {
    const iconEl = overlay.querySelector('.yt-2x-icon');
    const textEl = overlay.querySelector('.yt-2x-text');

    if (isSpecial) {
      iconEl.style.display = 'none';
    } else {
      iconEl.style.display = 'inline-flex';
    }

    textEl.textContent = text;
    positionOverlay();
    overlay.style.opacity = '1';
  };

  const hideOverlay = () => {
    overlay.style.opacity = '0';
  };

  const positionOverlay = () => {
    const v = currentVideo || getVideo();
    if (!v) return;
    const rect = v.getBoundingClientRect();
    overlay.style.left = `${Math.round(rect.left + rect.width / 2)}px`;
    overlay.style.top = `${Math.round(rect.top + 18)}px`;
  };

  const repositionIfVisible = () => {
    if (overlay.style.opacity !== '0') {
      positionOverlay();
    }
  };

  window.addEventListener('resize', repositionIfVisible, { passive: true });
  window.addEventListener('scroll', repositionIfVisible, true);

  const seekBy = (video, seconds = 5) => {
    if (!video) return;
    try {
      const duration = Number.isFinite(video.duration) ? video.duration : Infinity;
      video.currentTime = Math.min(duration, video.currentTime + seconds);
    } catch {}
  };

  const isEditable = (el) => {
    if (!el) return false;
    const tag = el.tagName ? el.tagName.toLowerCase() : '';
    return el.isContentEditable || tag === 'input' || tag === 'textarea' || tag === 'select';
  };

  const getVideo = () => {
    const videos = Array.from(document.querySelectorAll('video'));
    for (const v of videos) {
      const rect = v.getBoundingClientRect();
      const visible = rect.width > 0 && rect.height > 0;
      if (visible) return v;
    }
    return videos[0] || null;
  };

  const getPlayerElement = (video) => {
    return (
      document.querySelector('#movie_player') ||
      document.querySelector('.html5-video-container') ||
      video.closest('ytd-player') ||
      video.closest('.html5-video-player') ||
      video.parentElement ||
      document.documentElement
    );
  };

  const dispatchPointerEvent = (video, type) => {
    if (!video) return false;

    const player = getPlayerElement(video);
    if (!player || !player.getBoundingClientRect) return false;

    const rect = player.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return false;

    const x = rect.left + rect.width * 0.76;
    const y = rect.top + rect.height * 0.5;

    const options = {
      bubbles: true,
      cancelable: true,
      composed: true,
      clientX: x,
      clientY: y,
      pageX: Math.round(x + window.scrollX),
      pageY: Math.round(y + window.scrollY),
      screenX: Math.round(window.screenX + x),
      screenY: Math.round(window.screenY + y),
      button: 0,
      buttons: type === 'pointerup' ? 0 : 1,
      pointerId: 1,
      pointerType: 'mouse',
      isPrimary: true
    };

    if (type === 'pointerdown' || type === 'pointerup') {
      if (typeof PointerEvent === 'function') {
        return player.dispatchEvent(new PointerEvent(type, options));
      }
      if (typeof MouseEvent === 'function') {
        const evType = type === 'pointerdown' ? 'mousedown' : 'mouseup';
        return player.dispatchEvent(new MouseEvent(evType, options));
      }
    }

    return false;
  };

  const clickGuard = (e) => {
    if (!isPressing) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
  };

  const enableClickGuard = () => {
    if (clickGuardActive) return;
    clickGuardActive = true;
    document.addEventListener('click', clickGuard, true);
  };

  const disableClickGuard = () => {
    if (!clickGuardActive) return;
    clickGuardActive = false;
    document.removeEventListener('click', clickGuard, true);
  };

  const clearAllTimers = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    if (speedmasterDetectTimer) {
      clearTimeout(speedmasterDetectTimer);
      speedmasterDetectTimer = null;
    }
  };

  const stopSpeedmasterAttempt = (video) => {
    if (speedmasterDetectTimer) {
      clearTimeout(speedmasterDetectTimer);
      speedmasterDetectTimer = null;
    }

    if (speedmasterRateChangeHandler && video) {
      video.removeEventListener('ratechange', speedmasterRateChangeHandler);
    }

    speedmasterRateChangeHandler = null;
  };

  const activateFallback = (video) => {
    if (!video || !isPressing || isFallbackActive) return;

    isFallbackActive = true;

    if (Math.abs(video.playbackRate - desiredRate) > 0.0001) {
      video.playbackRate = desiredRate;
    }

    const displayRate = desiredRate % 1 === 0 ? desiredRate.toFixed(0) : desiredRate.toFixed(1);
    showOverlay(`${displayRate}× 倍速播放中`);
  };

  const startFallbackLongPress = (video) => {
    if (!video) return;
    clearAllTimers();

    lastRate = Number.isFinite(video.playbackRate) ? video.playbackRate : 1.0;
    longPressTimer = setTimeout(() => {
      activateFallback(video);
    }, LONG_PRESS_DELAY);
  };

  const resetPressState = () => {
    disableClickGuard();
    speedmasterAttempting = false;
    speedmasterDetected = false;
    isPressing = false;
  };

  const startSpeedmasterAttempt = (video) => {
    if (!video) return;

    const started = dispatchPointerEvent(video, 'pointerdown');
    if (!started) {
      speedmasterFailed = true;
      speedmasterAttempting = false;
      speedmasterDetected = false;
      stopSpeedmasterAttempt(video);
      disableClickGuard();
      startFallbackLongPress(video);
      return;
    }

    speedmasterAttempting = true;
    speedmasterDetected = false;
    speedmasterFailed = false;

    clearAllTimers();

    if (speedmasterRateChangeHandler && currentVideo) {
      currentVideo.removeEventListener('ratechange', speedmasterRateChangeHandler);
    }

    const startRate = Number.isFinite(video.playbackRate) ? video.playbackRate : 1.0;
    lastRate = startRate;
    speedmasterRateChangeHandler = () => {
      const currentRate = Number(video.playbackRate);
      if (!Number.isFinite(currentRate)) return;

      if (
        Math.abs(currentRate - SPEEDMASTER_RATE) < 0.0001 &&
        Math.abs(currentRate - startRate) > 0.0001
      ) {
        speedmasterDetected = true;
      }
    };

    video.addEventListener('ratechange', speedmasterRateChangeHandler, { passive: true });

    speedmasterDetectTimer = setTimeout(() => {
      if (!isPressing || !speedmasterAttempting) return;
      if (speedmasterDetected) return;
      speedmasterFailed = true;
      speedmasterAttempting = false;
      stopSpeedmasterAttempt(video);
      activateFallback(video);
    }, SPEEDMASTER_DETECT_DELAY);
  };

  const ensureVideoHooked = () => {
    const v = getVideo();
    if (!v || v === currentVideo) return;

    if (currentVideo) {
      if (isFallbackActive && currentVideo) {
        currentVideo.playbackRate = (lastRate && lastRate > 0) ? lastRate : 1.0;
      }
      stopSpeedmasterAttempt(currentVideo);
    }

    currentVideo = v;
    speedmasterAttempting = false;
    speedmasterDetected = false;
    isFallbackActive = false;
    isPressing = false;
    
    disableClickGuard();
    clearAllTimers();
    hideOverlay();
    speedmasterFailed = false;
  };

  const mo = new MutationObserver(() => ensureVideoHooked());
  mo.observe(document.documentElement, { subtree: true, childList: true });
  setInterval(ensureVideoHooked, 1000);
  ensureVideoHooked();

  try {
    const saved = localStorage.getItem('yt_right_2x_rate');
    if (saved) {
      const n = Number(saved);
      if (!Number.isNaN(n) && n > 0.25 && n <= 16) desiredRate = n;
    }
  } catch {}

  const cycleRates = [1.5, 2.0, 2.5, 3.0];
  let cycleIdx = cycleRates.indexOf(desiredRate);
  if (cycleIdx < 0) cycleIdx = 1;

  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r' && e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
      cycleIdx = (cycleIdx + 1) % cycleRates.length;
      desiredRate = cycleRates[cycleIdx];
      try { localStorage.setItem('yt_right_2x_rate', String(desiredRate)); } catch {}
      const displayRate = desiredRate % 1 === 0 ? desiredRate.toFixed(0) : desiredRate.toFixed(1);
      showOverlay(`${displayRate}×`, true);
      setTimeout(hideOverlay, 600);
      return;
    }

    if (e.key !== 'ArrowRight' || e.altKey || e.ctrlKey || e.metaKey) return;
    if (isEditable(document.activeElement)) return;

    const v = getVideo();
    if (!v) return;

    if (e.repeat) {
      if (isPressing || isFallbackActive || speedmasterAttempting) {
        e.preventDefault();
        e.stopPropagation();
      }
      return;
    }

    isPressing = true;
    isFallbackActive = false;
    
    speedmasterAttempting = false;
    speedmasterDetected = false;

    e.preventDefault();
    e.stopPropagation();

    if (speedmasterFailed) {
      startFallbackLongPress(v);
      return;
    }

    enableClickGuard();
    startSpeedmasterAttempt(v);
  }, { capture: true });

  window.addEventListener('keyup', (e) => {
    if (e.key !== 'ArrowRight' || e.altKey || e.ctrlKey || e.metaKey) return;

    const shouldHandle = isPressing || isFallbackActive || speedmasterAttempting;
    if (!shouldHandle) return;

    const v = getVideo();
    const hadSpeedmasterAttempt = speedmasterAttempting;

    clearAllTimers();

    if (hadSpeedmasterAttempt && v) {
      dispatchPointerEvent(v, 'pointerup');
      stopSpeedmasterAttempt(v);
      disableClickGuard();
    }

    if (isFallbackActive) {
      e.preventDefault();
      e.stopPropagation();
      if (v) {
        v.playbackRate = (lastRate && lastRate > 0) ? lastRate : 1.0;
        hideOverlay();
      }
      isFallbackActive = false;
      resetPressState();
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    if (v && (!hadSpeedmasterAttempt || !speedmasterDetected)) {
      seekBy(v, 5);
    }

    resetPressState();
  }, { capture: true });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'hidden') return;

    const v = currentVideo;

    clearAllTimers();

    if (v && isFallbackActive) {
      v.playbackRate = (lastRate && lastRate > 0) ? lastRate : 1.0;
      hideOverlay();
      isFallbackActive = false;
    }

    if (speedmasterAttempting && v) {
      dispatchPointerEvent(v, 'pointerup');
      stopSpeedmasterAttempt(v);
    }

    resetPressState();
  });
})();
