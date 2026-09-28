// ==========================================================================
// HARIHARAN & DIVYA BHARATHI ROYAL WEDDING INVITATION - CLIENT LOGIC
// Video Hero with Tap-to-Open (MUTED - NO MUSIC), Scroll Lock & Location
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initScrollLocker();
  initVideoHero();
  initScratchCard();
  initCountdown();
  initCalendarAndActions();
});

/* --------------------------------------------------------------------------
   1. STRICT SCROLL LOCK SYSTEM
   Locks scrolling initially so user cannot scroll down before name reveal
   -------------------------------------------------------------------------- */
let isScrollLocked = true;

function initScrollLocker() {
  window.scrollTo(0, 0);

  const lockHandler = (e) => {
    if (isScrollLocked) {
      e.preventDefault();
      return false;
    }
  };

  const keyHandler = (e) => {
    if (isScrollLocked) {
      // Space, Page Down, End, Down Arrow
      if ([32, 34, 35, 40].includes(e.keyCode)) {
        e.preventDefault();
        return false;
      }
    }
  };

  window.addEventListener('wheel', lockHandler, { passive: false });
  window.addEventListener('touchmove', lockHandler, { passive: false });
  window.addEventListener('keydown', keyHandler, false);
}

function unlockScroll() {
  isScrollLocked = false;
  document.body.classList.remove('scroll-locked');
}

/* --------------------------------------------------------------------------
   2. HERO VIDEO & TAP-TO-OPEN SYSTEM (MUTED - NO MUSIC)
   -------------------------------------------------------------------------- */
function initVideoHero() {
  const introVideo = document.getElementById('introVideo');
  const tapOverlay = document.getElementById('tapOverlay');
  const tapOpenBtn = document.getElementById('tapOpenBtn');
  const scrollPrompt = document.getElementById('scrollPrompt');
  const invitationSection = document.getElementById('invitationSection');

  if (!introVideo || !tapOverlay) return;

  // Video is permanently muted as requested (no audio / no music)
  introVideo.muted = true;
  introVideo.pause();
  introVideo.currentTime = 0.01;

  let hasStarted = false;
  let hasEnded = false;

  const startVideoPlayback = (e) => {
    if (hasStarted) return;
    hasStarted = true;

    // Mini celebration confetti
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#D4AF37', '#FFF2A3', '#AA771C']
      });
    }

    // Fade out tap overlay
    tapOverlay.classList.add('fade-out');

    // Play video in 100% silent mode
    introVideo.muted = true;
    introVideo.currentTime = 0;
    introVideo.play().catch(err => {
      console.warn("Play attempt:", err);
    });
  };

  // Allow clicking anywhere on the overlay or button
  tapOverlay.addEventListener('click', startVideoPlayback);
  if (tapOpenBtn) tapOpenBtn.addEventListener('click', startVideoPlayback);

  // When video completes, freeze on final frame & unlock scroll
  const handleEnd = () => {
    if (hasEnded) return;
    hasEnded = true;

    // Freeze video at the exact final frame showing Hariharan & Divya Bharathi
    introVideo.pause();

    // Unlock scrolling
    unlockScroll();

    // Show floating scroll down indicator
    if (scrollPrompt) {
      scrollPrompt.classList.remove('hidden');
    }
  };

  introVideo.addEventListener('ended', handleEnd);

  introVideo.addEventListener('timeupdate', () => {
    // If within 0.15s of the video duration, freeze on final frame
    if (introVideo.duration && introVideo.currentTime >= (introVideo.duration - 0.15)) {
      handleEnd();
    }
  });

  // When user clicks the "Scroll Down" button, smoothly glide to invitation section
  if (scrollPrompt) {
    scrollPrompt.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      smoothScrollTo(invitationSection, 1300);
    });
  }
}

/* --------------------------------------------------------------------------
   CINEMATIC SMOOTH SCROLL FUNCTION
   Glides down smoothly at a majestic pace with ease-in-out curve
   -------------------------------------------------------------------------- */
function smoothScrollTo(targetElement, duration = 1200) {
  if (!targetElement) return;

  const startPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  const targetRect = targetElement.getBoundingClientRect();
  const targetPosition = targetRect.top + startPosition;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animationStep(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    // Luxury easeInOutCubic curve: starts gentle, glides, ends soft
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const currentY = startPosition + (distance * ease);
    window.scrollTo(0, currentY);
    document.documentElement.scrollTop = currentY;
    document.body.scrollTop = currentY;

    if (timeElapsed < duration) {
      requestAnimationFrame(animationStep);
    }
  }

  requestAnimationFrame(animationStep);
}

/* --------------------------------------------------------------------------
   3. INTERACTIVE CANVAS SCRATCH CARD
   -------------------------------------------------------------------------- */
function initScratchCard() {
  const canvas = document.getElementById('scratchCanvas');
  const scratchFill = document.getElementById('scratchFill');
  const scratchPercent = document.getElementById('scratchPercent');
  const scratchHint = document.getElementById('scratchHint');
  const revealAllBtn = document.getElementById('revealAllBtn');

  if (!canvas) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const width = canvas.width;
  const height = canvas.height;

  let isDrawing = false;
  let isRevealed = false;
  let lastCheckTime = 0;

  // Render Royal Gold Foil Overlay
  function drawGoldFoil() {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#C59A3F');
    grad.addColorStop(0.3, '#E6CA65');
    grad.addColorStop(0.5, '#F7E79B');
    grad.addColorStop(0.7, '#C59A3F');
    grad.addColorStop(1, '#916B23');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = (i % 2 === 0) ? 'rgba(255, 255, 255, 0.4)' : 'rgba(80, 50, 10, 0.3)';
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 2;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = '#684510';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, width - 20, height - 20);
    ctx.strokeStyle = '#FFE89E';
    ctx.lineWidth = 1;
    ctx.strokeRect(14, 14, width - 28, height - 28);

    ctx.fillStyle = '#4A2E05';
    ctx.font = 'bold 15px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ROYAL SURPRISE', width / 2, height / 2 - 24);

    ctx.font = '600 12px "Poppins", sans-serif';
    ctx.fillStyle = '#261400';
    ctx.fillText('Scratch Here with Finger or Cursor', width / 2, height / 2 + 6);

    ctx.font = 'italic 11px "Playfair Display", serif';
    ctx.fillStyle = '#5A3805';
    ctx.fillText('To Unveil Auspicious Blessings', width / 2, height / 2 + 28);
    ctx.restore();
  }

  drawGoldFoil();

  function scratch(x, y) {
    if (isRevealed) return;
    
    if (scratchHint && scratchHint.style.display !== 'none') {
      scratchHint.style.display = 'none';
    }

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    const now = Date.now();
    if (now - lastCheckTime > 150) {
      lastCheckTime = now;
      checkScratchPercentage();
    }
  }

  function checkScratchPercentage() {
    if (isRevealed) return;

    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      const pixels = imgData.data;
      let clearCount = 0;
      const step = 32;

      for (let i = 3; i < pixels.length; i += step * 4) {
        if (pixels[i] === 0) clearCount++;
      }

      const totalSampled = pixels.length / (step * 4);
      const pct = Math.min(100, Math.round((clearCount / totalSampled) * 100));

      if (scratchPercent) scratchPercent.textContent = `${pct}%`;
      if (scratchFill) scratchFill.style.width = `${pct}%`;

      if (pct >= 50) {
        completeReveal();
      }
    } catch (e) {
      console.warn("Scratch percentage check:", e);
    }
  }

  function completeReveal() {
    if (isRevealed) return;
    isRevealed = true;

    canvas.style.opacity = '0';
    setTimeout(() => {
      canvas.style.display = 'none';
    }, 600);

    if (scratchPercent) scratchPercent.textContent = '100%';
    if (scratchFill) scratchFill.style.width = '100%';
    if (revealAllBtn) revealAllBtn.style.display = 'none';

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFDF73', '#FF4D6D', '#FFB703', '#FFFFFF']
      });
    }
  }

  if (revealAllBtn) {
    revealAllBtn.addEventListener('click', completeReveal);
  }

  function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  });

  window.addEventListener('mouseup', () => {
    isDrawing = false;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  });

  canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDrawing = false;
  });

  canvas.addEventListener('touchmove', (e) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   4. LIVE WEDDING COUNTDOWN TIMER (Target: 25.11.2026)
   -------------------------------------------------------------------------- */
function initCountdown() {
  const daysEl = document.getElementById('daysNum');
  const hoursEl = document.getElementById('hoursNum');
  const minsEl = document.getElementById('minsNum');
  const secsEl = document.getElementById('secsNum');

  if (!daysEl) return;

  // Target: 25th November 2026, 09:15 AM IST
  const targetDate = new Date('2026-11-25T09:15:00+05:30').getTime();

  function update() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   5. ACTIONS: ADD TO CALENDAR
   -------------------------------------------------------------------------- */
function initCalendarAndActions() {
  const addToCalBtn = document.getElementById('addToCalBtn');

  if (addToCalBtn) {
    addToCalBtn.addEventListener('click', () => {
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Hariharan and Divya Bharathi Wedding//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'SUMMARY:Hariharan & Divya Bharathi Royal Wedding',
        'DESCRIPTION:You are cordially invited to celebrate the royal wedding of Hariharan & Divya Bharathi. Subha Muhurtham: 09:15 AM - 10:30 AM.',
        'LOCATION:Sri Krishna Grand Kalyana Mandapam, Chennai',
        'DTSTART:20261125T034500Z',
        'DTEND:20261125T080000Z',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Hariharan_DivyaBharathi_Wedding.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("Wedding event calendar invitation downloaded! You can add it directly to Apple Calendar, Outlook, or Google Calendar.");
    });
  }
}
