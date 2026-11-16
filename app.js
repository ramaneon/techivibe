/**
 * TECHIVIBE · MOBILE-FIRST INTERACTIVE ENGINE
 * Lightweight, zero-dependency, ultra responsive
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initHaptics();
  initThemeToggle();
  initSearchAndFilter();
  initCopyActions();
  initVCardDownload();
  initShareAction();
  initModals();
  initParticles();
  initAudioEngine();
  initPWA();
  initGitHubActivity();
  initNFCFeatures();
});

/* ─── HAPTIC FEEDBACK FOR MOBILE TOUCH ─── */
function haptic(ms = 12) {
  if (navigator.vibrate) {
    try {
      navigator.vibrate(ms);
    } catch (e) {}
  }
}

function initHaptics() {
  const interactiveEls = document.querySelectorAll('button, a, .link-card, .chip-pill, .tab-btn');
  interactiveEls.forEach(el => {
    el.addEventListener('touchstart', () => haptic(8), { passive: true });
  });
}

/* ─── THEME TOGGLE (NEON <-> AMOLED TRUE BLACK) ─── */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-btn');
  const themeIcon = document.getElementById('theme-icon');
  if (!themeBtn) return;

  const savedTheme = localStorage.getItem('techivibe_theme') || 'neon';
  if (savedTheme === 'amoled') {
    document.body.classList.add('theme-amoled');
    if (themeIcon) themeIcon.textContent = '🌑';
  }

  themeBtn.addEventListener('click', () => {
    haptic(15);
    const isAmoled = document.body.classList.toggle('theme-amoled');
    const newTheme = isAmoled ? 'amoled' : 'neon';
    localStorage.setItem('techivibe_theme', newTheme);
    if (themeIcon) themeIcon.textContent = isAmoled ? '🌑' : '⚡';
    showToast(isAmoled ? 'AMOLED Black Mode Active' : 'Cyber Neon Mode Active');
  });
}

/* ─── SEARCH & CATEGORY FILTER ─── */
function initSearchAndFilter() {
  const searchInput = document.getElementById('link-search');
  const clearBtn = document.getElementById('clear-search');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.link-card');

  let activeCategory = 'all';
  let searchQuery = '';

  function applyFilter() {
    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardText = (card.getAttribute('data-title') || '') + ' ' + card.innerText.toLowerCase();

      const matchesCat = (activeCategory === 'all') || (cardCategory === activeCategory);
      const matchesSearch = !searchQuery || cardText.includes(searchQuery);

      if (matchesCat && matchesSearch) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      if (clearBtn) clearBtn.style.display = searchQuery ? 'block' : 'none';
      applyFilter();
    });
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      haptic(10);
      searchInput.value = '';
      searchQuery = '';
      clearBtn.style.display = 'none';
      applyFilter();
      searchInput.focus();
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      haptic(12);
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category') || 'all';
      applyFilter();
    });
  });
}

/* ─── TOAST & COPY ACTION ─── */
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function initCopyActions() {
  const copyBtns = document.querySelectorAll('.copy-btn, [data-copy]');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      haptic(18);

      const val = btn.getAttribute('data-copy');
      if (val) {
        navigator.clipboard.writeText(val).then(() => {
          showToast(`Copied: ${val}`);
        }).catch(() => {
          showToast('Failed to copy');
        });
      }
    });
  });
}

/* ─── MOBILE VCARD GENERATOR (.VCF DOWNLOAD) ─── */
function initVCardDownload() {
  const vcardBtns = [document.getElementById('vcard-btn'), document.getElementById('dock-vcard')];

  const vcardData = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Raman Kumar (Techivibe)',
    'N:Kumar;Raman;;;',
    'ORG:Techivibe',
    'TITLE:Security Researcher & Full-Stack Developer',
    'EMAIL;TYPE=INTERNET,PREF:itstechy40@gmail.com',
    'URL:https://techivibe.in',
    'X-SOCIALPROFILE;type=telegram:https://t.me/techivibe',
    'X-SOCIALPROFILE;type=youtube:https://www.youtube.com/@Techivibe',
    'X-SOCIALPROFILE;type=github:https://github.com/ramaneon',
    'NOTE:Techivibe Official: https://techivibe.in | Hub: https://ramaneon.github.io/techivibe/ | Telegram: @techivibe',
    'END:VCARD'
  ].join('\r\n');

  vcardBtns.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      haptic(25);

      const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Raman_Kumar_Techivibe.vcf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('Contact file ready! Tap to save in Contacts');
    });
  });
}

/* ─── NATIVE MOBILE SHARE ─── */
function initShareAction() {
  const shareBtns = [document.getElementById('dock-share')];

  shareBtns.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      haptic(15);
      const shareData = {
        title: 'Techivibe · Raman Kumar (@ramaneon)',
        text: 'Connect with Techivibe — Telegram, YouTube, GitHub, and full links base.',
        url: 'https://ramaneon.github.io/techivibe/'
      };

      if (navigator.share) {
        navigator.share(shareData).catch(() => {});
      } else {
        navigator.clipboard.writeText(shareData.url).then(() => {
          showToast('Hub link copied to clipboard!');
        });
      }
    });
  });
}

/* ─── MODALS (QR CODE & STORY STATUS) ─── */
function initModals() {
  // QR Modal
  const qrModal = document.getElementById('qr-modal');
  const qrTriggers = [document.getElementById('qr-trigger-btn'), document.getElementById('dock-qr')];
  const closeQr = document.getElementById('close-qr-modal');
  const copyHubUrlBtn = document.getElementById('copy-hub-link-btn');

  function openModal(modal) {
    if (!modal) return;
    haptic(15);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    haptic(10);
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  qrTriggers.forEach(t => {
    if (t) t.addEventListener('click', () => openModal(qrModal));
  });

  if (closeQr) closeQr.addEventListener('click', () => closeModal(qrModal));
  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) closeModal(qrModal);
    });
  }

  if (copyHubUrlBtn) {
    copyHubUrlBtn.addEventListener('click', () => {
      haptic(20);
      navigator.clipboard.writeText('https://ramaneon.github.io/techivibe/').then(() => {
        showToast('Hub link copied!');
        closeModal(qrModal);
      });
    });
  }

  // Story Status Modal
  const storyModal = document.getElementById('story-modal');
  const avatarTrigger = document.getElementById('avatar-trigger');
  const closeStory = document.getElementById('close-story-modal');
  const storyFill = document.getElementById('story-fill');
  let storyTimer = null;
  let storyInterval = null;

  if (avatarTrigger && storyModal) {
    avatarTrigger.addEventListener('click', () => {
      openModal(storyModal);
      if (storyFill) {
        storyFill.style.width = '0%';
        let progress = 0;
        clearInterval(storyInterval);
        storyInterval = setInterval(() => {
          progress += 2;
          storyFill.style.width = `${progress}%`;
          if (progress >= 100) {
            clearInterval(storyInterval);
            closeModal(storyModal);
          }
        }, 120);
      }
    });

    if (closeStory) {
      closeStory.addEventListener('click', () => {
        clearInterval(storyInterval);
        closeModal(storyModal);
      });
    }

    storyModal.addEventListener('click', (e) => {
      if (e.target === storyModal) {
        clearInterval(storyInterval);
        closeModal(storyModal);
      }
    });
  }

  // Privacy Policy Modal
  const privacyModal = document.getElementById('privacy-modal');
  const privacyBtn = document.getElementById('privacy-policy-btn');
  const closePrivacy = document.getElementById('close-privacy-modal');
  const confirmPrivacy = document.getElementById('confirm-privacy-btn');

  if (privacyBtn) privacyBtn.addEventListener('click', () => openModal(privacyModal));
  if (closePrivacy) closePrivacy.addEventListener('click', () => closeModal(privacyModal));
  if (confirmPrivacy) confirmPrivacy.addEventListener('click', () => closeModal(privacyModal));
  if (privacyModal) {
    privacyModal.addEventListener('click', (e) => {
      if (e.target === privacyModal) closeModal(privacyModal);
    });
  }

  // Terms & Conditions Modal
  const termsModal = document.getElementById('terms-modal');
  const termsBtn = document.getElementById('terms-conditions-btn');
  const closeTerms = document.getElementById('close-terms-modal');
  const confirmTerms = document.getElementById('confirm-terms-btn');

  if (termsBtn) termsBtn.addEventListener('click', () => openModal(termsModal));
  if (closeTerms) closeTerms.addEventListener('click', () => closeModal(termsModal));
  if (confirmTerms) confirmTerms.addEventListener('click', () => closeModal(termsModal));
  if (termsModal) {
    termsModal.addEventListener('click', (e) => {
      if (e.target === termsModal) closeModal(termsModal);
    });
  }

  // NFC Pass Modal
  const nfcModal = document.getElementById('nfc-modal');
  const nfcBtn = document.getElementById('nfc-trigger-btn');
  const closeNfc = document.getElementById('close-nfc-modal');

  if (nfcBtn) nfcBtn.addEventListener('click', () => openModal(nfcModal));
  if (closeNfc) closeNfc.addEventListener('click', () => closeModal(nfcModal));
  if (nfcModal) {
    nfcModal.addEventListener('click', (e) => {
      if (e.target === nfcModal) closeModal(nfcModal);
    });
  }
}

/* ─── PWA SERVICE WORKER & INSTALL PROMPT ─── */
function initPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch((err) => {
        console.warn('SW registration failed:', err);
      });
    });
  }

  let deferredPrompt = null;
  const installBtn = document.getElementById('install-pwa-btn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) {
      installBtn.style.display = 'inline-flex';
      installBtn.addEventListener('click', async () => {
        haptic(20);
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            showToast('Techivibe App Installed! 🚀');
          }
          deferredPrompt = null;
          installBtn.style.display = 'none';
        }
      });
    }
  });

  window.addEventListener('appinstalled', () => {
    if (installBtn) installBtn.style.display = 'none';
    showToast('Techivibe is installed on your Home Screen');
  });
}

/* ─── DYNAMIC GITHUB REAL-TIME ACTIVITY ─── */
async function initGitHubActivity() {
  const pill = document.getElementById('gh-activity-pill');
  const textEl = document.getElementById('gh-activity-text');
  if (!pill || !textEl) return;

  const CACHE_KEY = 'techivibe_gh_activity';
  const CACHE_TIME_KEY = 'techivibe_gh_activity_ts';
  const now = Date.now();
  const cachedData = sessionStorage.getItem(CACHE_KEY);
  const cachedTime = sessionStorage.getItem(CACHE_TIME_KEY);

  function timeAgo(dateString) {
    const diffSec = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDays = Math.floor(diffHr / 24);
    return `${diffDays}d ago`;
  }

  function displayActivity(repoName, action, timeStr) {
    textEl.innerHTML = `<strong>Git:</strong> ${action} on <span style="color:#00e5ff">${repoName}</span> · ${timeStr}`;
    pill.style.display = 'inline-flex';
  }

  if (cachedData && cachedTime && (now - parseInt(cachedTime, 10)) < 300000) {
    try {
      const parsed = JSON.parse(cachedData);
      displayActivity(parsed.repo, parsed.action, parsed.time);
      return;
    } catch (e) {}
  }

  try {
    const res = await fetch('https://api.github.com/users/ramaneon/events/public?per_page=5');
    if (!res.ok) return;
    const events = await res.json();
    if (!Array.isArray(events) || events.length === 0) return;

    // Find the first push or create or public event
    const event = events.find(e => e.type === 'PushEvent') || events[0];
    const rawRepo = event.repo ? event.repo.name.replace('ramaneon/', '') : 'techivibe';
    let action = 'Pushed code';
    if (event.type === 'CreateEvent') action = 'Created branch/repo';
    if (event.type === 'WatchEvent') action = 'Starred repo';
    const timeStr = timeAgo(event.created_at);

    const cachePayload = { repo: rawRepo, action, time: timeStr };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));
    sessionStorage.setItem(CACHE_TIME_KEY, now.toString());

    displayActivity(rawRepo, action, timeStr);
  } catch (err) {
    // Graceful fallback to static message if offline or rate limited
    textEl.innerHTML = `<strong>Git:</strong> Active in open source · @ramaneon`;
    pill.style.display = 'inline-flex';
  }
}

/* ─── NFC SMART PASS & WEB NFC API WRITER ─── */
function initNFCFeatures() {
  const writeBtn = document.getElementById('write-nfc-btn');
  const copyPayloadBtn = document.getElementById('copy-nfc-payload-btn');
  const statusHint = document.getElementById('nfc-status-hint');
  const targetUrl = 'https://ramaneon.github.io/techivibe/';

  if (copyPayloadBtn) {
    copyPayloadBtn.addEventListener('click', () => {
      haptic(15);
      navigator.clipboard.writeText(targetUrl).then(() => {
        showToast('NFC URL Payload Copied!');
      });
    });
  }

  if (writeBtn) {
    writeBtn.addEventListener('click', async () => {
      haptic(25);

      if ('NDEFReader' in window) {
        try {
          const ndef = new NDEFReader();
          statusHint.innerHTML = '<span style="color:#00e5ff">📡 Approaching NFC... Hold blank tag against back of device!</span>';
          writeBtn.disabled = true;

          await ndef.write({
            records: [
              { recordType: 'url', data: targetUrl }
            ]
          });

          haptic(50);
          statusHint.innerHTML = '<span style="color:#10b981">✓ NFC Tag Successfully Programmed with Techivibe!</span>';
          showToast('NFC Tag Written Successfully!');
          writeBtn.disabled = false;
        } catch (err) {
          writeBtn.disabled = false;
          statusHint.innerHTML = `<span style="color:#ef4444">Write failed: ${err.message || 'Permission denied or timed out'}. You can copy the URL payload below.</span>`;
        }
      } else {
        // Fallback for browsers without Web NFC (iOS Safari, Desktop)
        navigator.clipboard.writeText(targetUrl).then(() => {
          statusHint.innerHTML = '<span>Payload copied to clipboard! Paste into <strong>NFC Tools</strong> app (iOS/Android) to write to any tag.</span>';
          showToast('NFC URL copied for NFC Tools app');
        });
      }
    });
  }
}

/* ─── TOUCH & MOUSE REACTIVE PARTICLES ─── */
function initParticles() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 35; // Kept lightweight for mobile battery efficiency

  let pointer = { x: -1000, y: -1000, radius: 120 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      pointer.x = e.touches[0].clientX;
      pointer.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    pointer.x = -1000;
    pointer.y = -1000;
  });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.radius = Math.random() * 1.5 + 0.8;
      this.baseAlpha = Math.random() * 0.3 + 0.15;
      this.color = Math.random() > 0.5 ? '#00e5ff' : '#8b5cf6';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      const dx = pointer.x - this.x;
      const dy = pointer.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < pointer.radius) {
        const force = (pointer.radius - dist) / pointer.radius;
        this.x -= (dx / dist) * force * 1.4;
        this.y -= (dy / dist) * force * 1.4;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.baseAlpha;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 95) {
          ctx.beginPath();
          ctx.strokeStyle = '#00e5ff';
          ctx.globalAlpha = (1 - dist / 95) * 0.1;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
}

/* ─── WEB AUDIO AMBIENT SOUND ENGINE ─── */
function initAudioEngine() {
  const soundBtn = document.getElementById('sound-btn');
  const soundLabel = document.getElementById('sound-label');
  if (!soundBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let chordInterval = null;

  const chords = [
    [261.63, 329.63, 392.0, 493.88], // Cmaj9
    [220.0, 261.63, 329.63, 392.0],  // Am7
    [174.61, 220.0, 261.63, 329.63], // Fmaj7
    [196.0, 261.63, 293.66, 392.0],  // Gsus4
  ];
  let currentChord = 0;

  function playPad(chord) {
    if (!audioCtx || audioCtx.state !== 'running') return;
    const now = audioCtx.currentTime;

    chord.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600 + idx * 75, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 4);
    });
  }

  soundBtn.addEventListener('click', async () => {
    haptic(15);
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    isPlaying = !isPlaying;

    if (isPlaying) {
      soundBtn.classList.add('active');
      if (soundLabel) soundLabel.textContent = 'Mute';
      showToast('Ambient audio active');

      playPad(chords[currentChord]);
      chordInterval = setInterval(() => {
        currentChord = (currentChord + 1) % chords.length;
        playPad(chords[currentChord]);
      }, 3600);
    } else {
      soundBtn.classList.remove('active');
      if (soundLabel) soundLabel.textContent = 'Audio';
      if (chordInterval) clearInterval(chordInterval);
      showToast('Audio muted');
    }
  });
}
