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
    'URL:https://ramaneon.github.io/techivibe/',
    'X-SOCIALPROFILE;type=telegram:https://t.me/techivibe',
    'X-SOCIALPROFILE;type=youtube:https://www.youtube.com/@Techivibe',
    'X-SOCIALPROFILE;type=github:https://github.com/ramaneon',
    'NOTE:Techivibe Link Hub: https://ramaneon.github.io/techivibe/ | Telegram: @techivibe',
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
