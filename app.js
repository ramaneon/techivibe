/**
 * TECHIVIBE · INTERACTIVE HUB ENGINE
 * Lightweight, zero-dependency, high performance
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCursor();
  initTiltCards();
  initCopyActions();
  initShare();
  initAudioEngine();
});

/* ─── INTERACTIVE PARTICLE CANVAS ─── */
function initParticles() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 45;

  let mouse = { x: -1000, y: -1000, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.8;
      this.baseAlpha = Math.random() * 0.35 + 0.15;
      this.color = Math.random() > 0.5 ? '#00e5ff' : '#8b5cf6';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Mouse repulsion / attraction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 1.2;
        this.y -= (dy / dist) * force * 1.2;
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

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = '#00e5ff';
          ctx.globalAlpha = (1 - dist / 110) * 0.12;
          ctx.lineWidth = 0.6;
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

/* ─── SMOOTH CURSOR GLOW ─── */
function initCursor() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;

  let mouseX = -100, mouseY = -100;
  let currentX = -100, currentY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursor() {
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();
}

/* ─── 3D CARD TILT EFFECT ─── */
function initTiltCards() {
  const cards = document.querySelectorAll('.link-card[data-tilt]');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ─── TOAST & COPY ACTION ─── */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function initCopyActions() {
  const copyButtons = document.querySelectorAll('.copy-action-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied: ${textToCopy}`);
        }).catch(() => {
          showToast('Failed to copy');
        });
      }
    });
  });
}

/* ─── SHARE BUTTON ─── */
function initShare() {
  const shareBtn = document.getElementById('share-btn');
  if (!shareBtn) return;

  shareBtn.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        title: 'Techivibe · Raman Kumar (@ramaneon)',
        text: 'Connect with Techivibe across all platforms.',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Hub link copied to clipboard!');
      });
    }
  });
}

/* ─── WEB AUDIO AMBIENT SOUNDSCAPE ─── */
function initAudioEngine() {
  const soundBtn = document.getElementById('sound-btn');
  if (!soundBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let chordInterval = null;

  // Harmonic chord freqs (Cmaj9, Am7, Fmaj7, Gsus4)
  const chords = [
    [261.63, 329.63, 392.0, 493.88], // C E G B
    [220.0, 261.63, 329.63, 392.0],  // A C E G
    [174.61, 220.0, 261.63, 329.63], // F A C E
    [196.0, 261.63, 293.66, 392.0],  // G C D G
  ];
  let currentChord = 0;

  function playAmbientPad(chord) {
    if (!audioCtx || audioCtx.state !== 'running') return;
    const now = audioCtx.currentTime;

    chord.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650 + idx * 80, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 4);
    });
  }

  soundBtn.addEventListener('click', async () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    isPlaying = !isPlaying;

    if (isPlaying) {
      soundBtn.classList.add('active');
      soundBtn.querySelector('.ctrl-label').textContent = 'Mute';
      showToast('Ambient synthesizer active');

      playAmbientPad(chords[currentChord]);
      chordInterval = setInterval(() => {
        currentChord = (currentChord + 1) % chords.length;
        playAmbientPad(chords[currentChord]);
      }, 3500);
    } else {
      soundBtn.classList.remove('active');
      soundBtn.querySelector('.ctrl-label').textContent = 'Sound';
      if (chordInterval) clearInterval(chordInterval);
      showToast('Sound muted');
    }
  });
}
