// ============================
// ESTRELAS FIXAS + FOLHAS CAINDO
// ============================
const magicLayer = document.getElementById('magicLayer');

function criarEstrelas(count = 70) {
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.classList.add('star');
    const size = Math.random() * 3 + 1;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDelay = Math.random() * 3 + 's';
    s.style.animationDuration = (Math.random() * 3 + 2) + 's';
    magicLayer.appendChild(s);
  }
}
criarEstrelas();

const simbolosCaindo = [
  '🍃', '🌿', '🍂', '✨', '⭐', '💫', '🌟',
  '📖', '📕', '📗', '🔮', '🪶', '🌸', '💛', '🧝‍♀️'
];

function criarSimboloCaindo() {
  const s = document.createElement('div');
  s.classList.add('falling');
  s.textContent = simbolosCaindo[Math.floor(Math.random() * simbolosCaindo.length)];
  s.style.left = Math.random() * 100 + '%';
  const size = Math.random() * 20 + 16;
  s.style.fontSize = size + 'px';
  const duration = Math.random() * 6 + 7;
  s.style.animationDuration = duration + 's';
  s.style.animationDelay = Math.random() * 2 + 's';
  s.style.opacity = (Math.random() * 0.4 + 0.5).toFixed(2);
  document.body.appendChild(s);
  setTimeout(() => s.remove(), (duration + 2) * 1000);
}

setInterval(criarSimboloCaindo, 450);
for (let i = 0; i < 10; i++) {
  setTimeout(criarSimboloCaindo, i * 180);
}

// ============================
// ✨ LUZ QUE SEGUE O MOUSE
// ============================
const cursorGlow = document.getElementById('cursorGlow');

if (cursorGlow) {
  let mouseInside = false;

  // Ativa a luz quando o mouse entra na página
  document.addEventListener('mouseenter', () => {
    mouseInside = true;
    cursorGlow.classList.add('active');
  });

  // Desativa quando sai
  document.addEventListener('mouseleave', () => {
    mouseInside = false;
    cursorGlow.classList.remove('active');
  });

  // Segue o mouse
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    if (!mouseInside) {
      cursorGlow.classList.add('active');
      mouseInside = true;
    }
  });

  // Remove no celular
  if (window.matchMedia('(max-width: 600px)').matches) {
    cursorGlow.style.display = 'none';
  }
}

// ============================
// 🍃 SOM DE FLORESTA
// ============================
const forestAmbient = document.getElementById('forestAmbient');
const musicToggle = document.getElementById('musicToggle');

let soundPlaying = false;
let fadeFloresta = null;

forestAmbient.volume = 0;

// Fade in suave do volume
function fadeIn(audioEl, volumeAlvo, duracao) {
  if (fadeFloresta) clearInterval(fadeFloresta);
  const passos = 40;
  const incremento = volumeAlvo / passos;
  let atual = 0;
  fadeFloresta = setInterval(() => {
    atual += incremento;
    if (atual >= volumeAlvo) {
      audioEl.volume = volumeAlvo;
      clearInterval(fadeFloresta);
      fadeFloresta = null;
    } else {
      audioEl.volume = atual;
    }
  }, duracao / passos);
}

// Fade out suave
function fadeOut(audioEl, duracao) {
  if (fadeFloresta) clearInterval(fadeFloresta);
  const passos = 30;
  const volumeInicial = audioEl.volume;
  const decremento = volumeInicial / passos;
  fadeFloresta = setInterval(() => {
    if (audioEl.volume - decremento <= 0) {
      audioEl.volume = 0;
      audioEl.pause();
      clearInterval(fadeFloresta);
      fadeFloresta = null;
    } else {
      audioEl.volume -= decremento;
    }
  }, duracao / passos);
}

// Tocar som de floresta
function tocarFloresta() {
  forestAmbient.volume = 0;
  forestAmbient.play().then(() => {
    soundPlaying = true;
    musicToggle.classList.add('playing');
    musicToggle.textContent = '🍃';
    fadeIn(forestAmbient, 0.25, 2500); // ← volume final: 0.25
  }).catch(() => {
    console.warn('Som de floresta falhou. Coloque o arquivo floresta.mp3 na pasta.');
  });
}

// Pausar som de floresta
function pausarFloresta() {
  fadeOut(forestAmbient, 1000);
  soundPlaying = false;
  musicToggle.classList.remove('playing');
  musicToggle.textContent = '🔇';
}


// Botão de ligar/desligar
musicToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  if (soundPlaying) {
    pausarFloresta();
  } else {
    if (forestAmbient.paused) forestAmbient.currentTime = 0;
    tocarFloresta();
  }
});

// Controle de volume pelo teclado (Shift + ← →)
document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowRight' && e.shiftKey) {
    e.preventDefault();
    forestAmbient.volume = Math.min(1, forestAmbient.volume + 0.05);
  }
  if (e.code === 'ArrowLeft' && e.shiftKey) {
    e.preventDefault();
    forestAmbient.volume = Math.max(0, forestAmbient.volume - 0.05);
  }
});

// ============================
// FADE-IN AO ROLAR
// ============================
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.chapter, .photo-frame, .letter, .ending, .spell, .game-section, .gallery-section').forEach((el) => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ============================
// 🔊 SOM DE MAGIA (Web Audio API)
// ============================
let audioCtx = null;

function garantirAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function tocarSomMagia() {
  const ctx = garantirAudioCtx();
  const agora = ctx.currentTime;
  const notas = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];

  notas.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, agora + i * 0.08);
    gain.gain.linearRampToValueAtTime(0.18, agora + i * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, agora + i * 0.08 + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(agora + i * 0.08);
    osc.stop(agora + i * 0.08 + 0.5);
  });
}

function tocarSomPulo() {
  const ctx = garantirAudioCtx();
  const agora = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(400, agora);
  osc.frequency.exponentialRampToValueAtTime(750, agora + 0.12);
  gain.gain.setValueAtTime(0.15, agora);
  gain.gain.exponentialRampToValueAtTime(0.001, agora + 0.15);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(agora);
  osc.stop(agora + 0.15);
}

function tocarSomColeta() {
  const ctx = garantirAudioCtx();
  const agora = ctx.currentTime;
  [880, 1320].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, agora + i * 0.06);
    gain.gain.linearRampToValueAtTime(0.15, agora + i * 0.06 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, agora + i * 0.06 + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(agora + i * 0.06);
    osc.stop(agora + i * 0.06 + 0.25);
  });
}

function tocarSomPerder() {
  const ctx = garantirAudioCtx();
  const agora = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(400, agora);
  osc.frequency.exponentialRampToValueAtTime(80, agora + 0.4);
  gain.gain.setValueAtTime(0.2, agora);
  gain.gain.exponentialRampToValueAtTime(0.001, agora + 0.45);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(agora);
  osc.stop(agora + 0.45);
}

// ============================
// 🎆 FOGOS DE ARTIFÍCIO (CANVAS)
// ============================
const fwCanvas = document.createElement('canvas');
fwCanvas.id = 'fireworksCanvas';
fwCanvas.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 9997;
`;
document.body.appendChild(fwCanvas);

const fwCtx = fwCanvas.getContext('2d');
let fwWidth = window.innerWidth;
let fwHeight = window.innerHeight;
fwCanvas.width = fwWidth;
fwCanvas.height = fwHeight;

window.addEventListener('resize', () => {
  fwWidth = window.innerWidth;
  fwHeight = window.innerHeight;
  fwCanvas.width = fwWidth;
  fwCanvas.height = fwHeight;
});

let rockets = [];
let fwParticles = [];
let fwAnimationId = null;

function lancarFoguete(x, y) {
  const cores = ['#ffe97a', '#fff6c2', '#c9a227', '#a8c98a', '#ffb8e0', '#b8d4ff'];
  const cor = cores[Math.floor(Math.random() * cores.length)];
  rockets.push({
    x, y: fwHeight,
    targetY: y,
    vy: -Math.random() * 4 - 8,
    cor
  });
  if (!fwAnimationId) animarFogos();
}

function explodirFoguete(x, y, cor) {
  const qtd = 40 + Math.floor(Math.random() * 30);
  for (let i = 0; i < qtd; i++) {
    const ang = (Math.PI * 2 / qtd) * i + Math.random() * 0.2;
    const vel = Math.random() * 5 + 2;
    fwParticles.push({
      x, y,
      vx: Math.cos(ang) * vel,
      vy: Math.sin(ang) * vel,
      cor,
      vida: 1,
      tamanho: Math.random() * 3 + 2
    });
  }
  for (let i = 0; i < 15; i++) {
    const ang = Math.random() * Math.PI * 2;
    const vel = Math.random() * 8 + 3;
    fwParticles.push({
      x, y,
      vx: Math.cos(ang) * vel,
      vy: Math.sin(ang) * vel,
      cor: ['#fff6c2', '#ffb8e0', '#b8d4ff'][Math.floor(Math.random() * 3)],
      vida: 1,
      tamanho: Math.random() * 4 + 2
    });
  }
}

function animarFogos() {
  fwCtx.clearRect(0, 0, fwWidth, fwHeight);

  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i];
    r.y += r.vy;
    r.vy += 0.15;

    fwCtx.save();
    fwCtx.shadowColor = r.cor;
    fwCtx.shadowBlur = 20;
    fwCtx.fillStyle = r.cor;
    fwCtx.beginPath();
    fwCtx.arc(r.x, r.y, 4, 0, Math.PI * 2);
    fwCtx.fill();
    fwCtx.restore();

    fwParticles.push({
      x: r.x + (Math.random() - 0.5) * 5,
      y: r.y + 5,
      vx: (Math.random() - 0.5) * 1,
      vy: Math.random() * 2 + 1,
      cor: r.cor,
      vida: 0.6,
      tamanho: Math.random() * 2 + 1
    });

    if (r.y <= r.targetY || r.vy >= 0) {
      explodirFoguete(r.x, r.y, r.cor);
      rockets.splice(i, 1);
    }
  }

  for (let i = fwParticles.length - 1; i >= 0; i--) {
    const p = fwParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08;
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.vida -= 0.012;

    if (p.vida <= 0) {
      fwParticles.splice(i, 1);
      continue;
    }

    fwCtx.save();
    fwCtx.globalAlpha = p.vida;
    fwCtx.shadowColor = p.cor;
    fwCtx.shadowBlur = 15;
    fwCtx.fillStyle = p.cor;
    fwCtx.beginPath();
    fwCtx.arc(p.x, p.y, p.tamanho * p.vida, 0, Math.PI * 2);
    fwCtx.fill();
    fwCtx.restore();
  }

  if (rockets.length > 0 || fwParticles.length > 0) {
    fwAnimationId = requestAnimationFrame(animarFogos);
  } else {
    fwAnimationId = null;
    fwCtx.clearRect(0, 0, fwWidth, fwHeight);
  }
}

// ============================
// 🎊 CONFETES
// ============================
function criarConfete() {
  const c = document.createElement('div');
  const cores = ['#ffe97a', '#fff6c2', '#c9a227', '#a8c98a', '#ffb8e0', '#b8d4ff', '#ff8866', '#a89ce0'];
  const cor = cores[Math.floor(Math.random() * cores.length)];
  const size = Math.random() * 8 + 5;
  const rot = Math.random() * 360;

  c.style.cssText = `
    position: fixed;
    top: -20px;
    left: ${Math.random() * 100}vw;
    width: ${size}px;
    height: ${size * 0.6}px;
    background: ${cor};
    border-radius: 2px;
    pointer-events: none;
    z-index: 9996;
    box-shadow: 0 0 8px ${cor};
    transform: rotate(${rot}deg);
    transition: transform 4s linear, opacity 4s ease-out;
    will-change: transform;
  `;
  document.body.appendChild(c);

  const drift = (Math.random() - 0.5) * 300;
  const rotF = rot + (Math.random() > 0.5 ? 720 : -720);

  requestAnimationFrame(() => {
    c.style.transform = `translate(${drift}px, ${window.innerHeight + 100}px) rotate(${rotF}deg)`;
    c.style.opacity = '0';
  });
  setTimeout(() => c.remove(), 4100);
}

function criarChuvaConfetes(qtd = 60) {
  for (let i = 0; i < qtd; i++) {
    setTimeout(criarConfete, i * 30);
  }
}

// ============================
// 🪄 BOTÃO MÁGICO
// ============================
const magicBtn = document.getElementById('magicBtn');
const magicMsg = document.getElementById('magicMsg');

const mensagens = [
  '🍃 Que sua vida seja um jardim eterno de coisas boas, Fernanda!',
  '✨ Você é a magia que faz sentido em um mundo tão comum.',
  '📖 Que cada capítulo novo da sua história seja digno de ser relido!',
  '🌿 Que a paz das florestas antigas te acompanhe sempre.',
  '💛 Amizade de verdade é o mais raro dos encantamentos — e nós temos.',
  '🌟 Que este novo ano te traga tudo que você merece: tudo de bom!',
  '🧝‍♀️ Você é a elfa mais linda que já andou por este mundo.',
  '🔮 Eu previ no futuro: você vai ter um ano incrível!',
  '🎂 Feliz aniversário, minha amiga mágica!'
];

let clickCount = 0;

magicBtn.addEventListener('click', () => {
  const rect = magicBtn.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  tocarSomMagia();

  magicMsg.textContent = mensagens[clickCount % mensagens.length];
  clickCount++;
  magicMsg.style.animation = 'none';
  setTimeout(() => {
    magicMsg.style.animation = 'magic-text 1.2s ease-out';
  }, 10);

  criarFlash(x, y);

  document.body.style.animation = 'screen-shake 0.6s';
  setTimeout(() => document.body.style.animation = '', 600);

  criarExplosaoEmLeque(x, y);

  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      const fx = Math.random() * fwWidth;
      const fy = Math.random() * (fwHeight * 0.6) + 50;
      lancarFoguete(fx, fy);
    }, i * 220);
  }

  criarChuvaConfetes(80);

  for (let i = 0; i < 60; i++) {
    setTimeout(criarSimboloCaindo, i * 25);
  }

  for (let i = 0; i < 24; i++) {
    setTimeout(() => criarFogoCircular(x, y, i), i * 30);
  }

  for (let i = 0; i < 40; i++) {
    setTimeout(() => criarParticula(x, y), i * 20);
  }

  setTimeout(() => {
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        const fx = Math.random() * fwWidth;
        const fy = Math.random() * (fwHeight * 0.5) + 80;
        lancarFoguete(fx, fy);
      }, i * 200);
    }
  }, 1500);
});

function criarFlash(x, y) {
  const flash = document.createElement('div');
  flash.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: radial-gradient(circle, #fff6c2 0%, #ffe97a 40%, transparent 70%);
    transform: translate(-50%, -50%) scale(0);
    pointer-events: none;
    z-index: 9998;
    transition: transform 0.8s ease-out, opacity 0.8s ease-out;
  `;
  document.body.appendChild(flash);
  requestAnimationFrame(() => {
    flash.style.transform = 'translate(-50%, -50%) scale(40)';
    flash.style.opacity = '0';
  });
  setTimeout(() => flash.remove(), 900);
}

function criarExplosaoEmLeque(x, y) {
  const emojis = ['✨', '⭐', '🌟', '💫', '🪄', '📖', '🍃', '🌸', '💛'];
  for (let i = 0; i < 16; i++) {
    const ang = (Math.PI * 2 / 16) * i;
    setTimeout(() => {
      const p = document.createElement('div');
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: ${Math.random() * 15 + 20}px;
        pointer-events: none;
        z-index: 9999;
        filter: drop-shadow(0 0 15px #ffe97a);
        transition: transform 1.5s cubic-bezier(0.2, 0.8, 0.4, 1), opacity 1.5s ease-out;
      `;
      document.body.appendChild(p);
      requestAnimationFrame(() => {
        const dist = 300 + Math.random() * 150;
        p.style.transform = `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist}px) rotate(${Math.random() * 720}deg) scale(0.3)`;
        p.style.opacity = '0';
      });
      setTimeout(() => p.remove(), 1600);
    }, i * 25);
  }
}

function criarFogoCircular(x, y, indice) {
  const ang = (Math.PI * 2 / 24) * indice;
  const p = document.createElement('div');
  const emojis = ['✨', '⭐', '💫', '🌟'];
  p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  p.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    font-size: 24px;
    pointer-events: none;
    z-index: 9999;
    filter: drop-shadow(0 0 20px #ffe97a);
    transition: transform 2s ease-out, opacity 2s ease-out;
  `;
  document.body.appendChild(p);
  requestAnimationFrame(() => {
    const dist = 220;
    p.style.transform = `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist}px) scale(0)`;
    p.style.opacity = '0';
  });
  setTimeout(() => p.remove(), 2100);
}

function criarParticula(x, y) {
  const p = document.createElement('div');
  const cores = ['#ffe97a', '#fff6c2', '#c9a227', '#a8c98a', '#ffb8e0'];
  const cor = cores[Math.floor(Math.random() * cores.length)];
  p.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: ${Math.random() * 8 + 4}px;
    height: ${Math.random() * 8 + 4}px;
    border-radius: 50%;
    background: ${cor};
    box-shadow: 0 0 15px ${cor};
    pointer-events: none;
    z-index: 9999;
    transition: transform 1.8s ease-out, opacity 1.8s ease-out;
  `;
  document.body.appendChild(p);
  requestAnimationFrame(() => {
    const ang = Math.random() * Math.PI * 2;
    const dist = 100 + Math.random() * 250;
    p.style.transform = `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist}px) scale(0)`;
    p.style.opacity = '0';
  });
  setTimeout(() => p.remove(), 1900);
}

// ============================
// 🎮 MINI-JOGO FÁCIL
// ============================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('gameOverlay');
const scoreEl = document.getElementById('gameScore');
const highScoreEl = document.getElementById('gameHighScore');

let gameRunning = false;
let gameScore = 0;
let gameHighScore = parseInt(localStorage.getItem('vooMagicoRecorde') || '0', 10);
highScoreEl.textContent = gameHighScore;

const dino = {
  x: 90,
  y: 0,
  width: 60,
  height: 60,
  vy: 0,
  gravity: 0.4,
  jumpForce: -10.5,
  isJumping: false,
  jumpCount: 0,
  maxJumps: 3,
  emoji: '🐉',
  glow: 0
};

const obstaculos = [];
const coletaveis = [];
const obstaculoEmojis = ['📕', '📗', '📘'];
const coletavelEmojis = ['⭐', '✨', '💫'];
const chaoY = 250;

let frameCount = 0;
let speed = 3;
let spawnInterval = 180;
let coletavelInterval = 80;
let animationId = null;
let particles = [];

function ajustarCanvas() {
  const wrapper = canvas.parentElement;
  const ratio = canvas.width / canvas.height;
  canvas.style.width = '100%';
  canvas.style.height = (wrapper.clientWidth / ratio) + 'px';
}
ajustarCanvas();
window.addEventListener('resize', ajustarCanvas);

function adicionarParticula(x, y, cor, emoji = null) {
  particles.push({
    x, y,
    vx: (Math.random() - 0.5) * 6,
    vy: (Math.random() - 1) * 4,
    vida: 1, cor, emoji,
    tamanho: emoji ? 20 : Math.random() * 6 + 3
  });
}

function atualizarParticulas() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.2;
    p.vida -= 0.02;
    if (p.vida <= 0) particles.splice(i, 1);
  }
}

function desenharParticulas() {
  particles.forEach((p) => {
    ctx.save();
    ctx.globalAlpha = p.vida;
    if (p.emoji) {
      ctx.font = `${p.tamanho}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, p.x, p.y);
    } else {
      ctx.fillStyle = p.cor;
      ctx.shadowColor = p.cor;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.tamanho, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
}

function desenharFundo() {
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#1a1a4d');
  grad.addColorStop(0.7, '#0f0f2e');
  grad.addColorStop(1, '#0a0d1a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 40; i++) {
    const x = (i * 137 + frameCount * 0.3) % canvas.width;
    const y = (i * 43) % (chaoY - 30);
    const size = (i % 3) + 1;
    ctx.fillStyle = `rgba(255, 246, 194, ${0.3 + Math.sin(frameCount * 0.05 + i) * 0.3})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.save();
  ctx.shadowColor = '#fff6c2';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#fff6c2';
  ctx.beginPath();
  ctx.arc(canvas.width - 60, 60, 25, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#2a1f4d';
  ctx.fillRect(0, chaoY, canvas.width, canvas.height - chaoY);

  ctx.fillStyle = '#3a2f6d';
  for (let i = 0; i < canvas.width; i += 20) {
    const offset = (i + frameCount * speed) % canvas.width;
    ctx.fillRect(offset, chaoY + 5, 3, 8);
    ctx.fillRect(offset + 8, chaoY + 12, 2, 6);
  }

  ctx.strokeStyle = '#c9a227';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, chaoY);
  ctx.lineTo(canvas.width, chaoY);
  ctx.stroke();
}

function desenharDino() {
  ctx.save();
  ctx.shadowColor = '#ffe97a';
  ctx.shadowBlur = 25 + (dino.glow ? dino.glow * 30 : 0);
  if (dino.jumpCount > 0) {
    ctx.shadowColor = '#ffb8e0';
    ctx.shadowBlur = 35;
  }
  ctx.font = '56px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(dino.emoji, dino.x + dino.width / 2, dino.y + dino.height / 2);
  ctx.restore();
}

function desenharObstaculos() {
  obstaculos.forEach((obs) => {
    ctx.save();
    ctx.shadowColor = '#ff8866';
    ctx.shadowBlur = 15;
    ctx.font = '44px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(obs.emoji, obs.x + obs.width / 2, obs.y + obs.height / 2);
    ctx.restore();
  });
}

function desenharColetaveis() {
  coletaveis.forEach((c) => {
    ctx.save();
    const pulse = Math.sin(frameCount * 0.15) * 0.3 + 1;
    ctx.shadowColor = '#ffe97a';
    ctx.shadowBlur = 25 * pulse;
    ctx.font = `${40 * pulse}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(c.emoji, c.x + c.width / 2, c.y + c.height / 2);
    ctx.restore();
  });
}

function atualizar() {
  // Reduz brilho do dino suavemente
  if (dino.glow && dino.glow > 0) {
    dino.glow -= 0.05;
    if (dino.glow < 0) dino.glow = 0;
  }

  dino.vy += dino.gravity;
  dino.y += dino.vy;

  const chaoDino = chaoY - dino.height;
  if (dino.y >= chaoDino) {
    dino.y = chaoDino;
    dino.vy = 0;
    dino.isJumping = false;
    dino.jumpCount = 0;
  }

  for (let i = obstaculos.length - 1; i >= 0; i--) {
    const obs = obstaculos[i];
    obs.x -= speed;

    if (obs.x + obs.width < 0) {
      obstaculos.splice(i, 1);
      gameScore++;
      scoreEl.textContent = gameScore;
      if (gameScore % 10 === 0) speed += 0.2;
    }
  }

  for (let i = coletaveis.length - 1; i >= 0; i--) {
    const c = coletaveis[i];
    c.x -= speed;
    if (c.x + c.width < 0) coletaveis.splice(i, 1);
  }

  frameCount++;
  if (frameCount > spawnInterval) {
    frameCount = 0;
    spawnInterval = Math.max(120, 180 - Math.floor(gameScore / 5) * 5);
    const emoji = obstaculoEmojis[Math.floor(Math.random() * obstaculoEmojis.length)];
    const size = 44;
    obstaculos.push({
      x: canvas.width,
      y: chaoY - size - 5,
      width: size,
      height: size,
      emoji: emoji
    });
  }

  if (frameCount % coletavelInterval === 0 && Math.random() > 0.4) {
    const emoji = coletavelEmojis[Math.floor(Math.random() * coletavelEmojis.length)];
    const size = 40;
    coletaveis.push({
      x: canvas.width,
      y: chaoY - 130 - Math.random() * 60,
      width: size,
      height: size,
      emoji: emoji
    });
  }

  const dinoBox = {
    x: dino.x + 10, y: dino.y + 10,
    w: dino.width - 20, h: dino.height - 20
  };

  for (const obs of obstaculos) {
    const obsBox = {
      x: obs.x + 12, y: obs.y + 12,
      w: obs.width - 24, h: obs.height - 24
    };
    if (
      dinoBox.x < obsBox.x + obsBox.w &&
      dinoBox.x + dinoBox.w > obsBox.x &&
      dinoBox.y < obsBox.y + obsBox.h &&
      dinoBox.y + dinoBox.h > obsBox.y
    ) {
      fimDeJogo();
      return;
    }
  }

  for (let i = coletaveis.length - 1; i >= 0; i--) {
    const c = coletaveis[i];
    const cBox = {
      x: c.x + 10, y: c.y + 10,
      w: c.width - 20, h: c.height - 20
    };
    if (
      dinoBox.x < cBox.x + cBox.w &&
      dinoBox.x + dinoBox.w > cBox.x &&
      dinoBox.y < cBox.y + cBox.h &&
      dinoBox.y + dinoBox.h > cBox.y
    ) {
      coletaveis.splice(i, 1);
      gameScore += 5;
      scoreEl.textContent = gameScore;

      tocarSomColeta();

      // Brilho suave só no dragoninho (sem piscar a tela)
      dino.glow = 1;

      for (let j = 0; j < 12; j++) {
        adicionarParticula(
          dino.x + dino.width / 2,
          dino.y + dino.height / 2,
          '#ffe97a',
          ['✨', '⭐', '💫'][Math.floor(Math.random() * 3)]
        );
      }
    }
  }

  atualizarParticulas();
}

function loop() {
  if (!gameRunning) return;
  atualizar();
  if (!gameRunning) return;
  desenharFundo();
  desenharDino();
  desenharObstaculos();
  desenharColetaveis();
  desenharParticulas();
  animationId = requestAnimationFrame(loop);
}

function iniciarJogo() {
  if (gameRunning) return;
  gameRunning = true;
  gameScore = 0;
  scoreEl.textContent = 0;
  speed = 3;
  frameCount = 0;
  spawnInterval = 180;
  obstaculos.length = 0;
  coletaveis.length = 0;
  particles.length = 0;
  dino.y = chaoY - dino.height;
  dino.vy = 0;
  dino.isJumping = false;
  dino.jumpCount = 0;
  dino.glow = 0;
  overlay.classList.add('hidden');
  loop();
}

function fimDeJogo() {
  gameRunning = false;
  cancelAnimationFrame(animationId);

  tocarSomPerder();

  for (let i = 0; i < 30; i++) {
    adicionarParticula(
      dino.x + dino.width / 2,
      dino.y + dino.height / 2,
      ['#ff8866', '#ffe97a', '#c9a227'][Math.floor(Math.random() * 3)]
    );
  }

  if (gameScore > gameHighScore) {
    gameHighScore = gameScore;
    localStorage.setItem('vooMagicoRecorde', gameHighScore);
    highScoreEl.textContent = gameHighScore;
  }

  overlay.classList.remove('hidden');
  overlay.querySelector('.game-overlay-title').textContent = '💥 Ops! Bateu!';
  overlay.querySelector('.game-overlay-text').innerHTML =
    `Você fez <strong>${gameScore} pontos</strong>!<br>Aperte ESPAÇO ou toque para jogar de novo.`;

  document.body.style.animation = 'screen-shake 0.4s';
  setTimeout(() => document.body.style.animation = '', 400);
}

function pular() {
  if (!gameRunning) {
    iniciarJogo();
    return;
  }
  if (dino.jumpCount < dino.maxJumps) {
    dino.vy = dino.jumpForce;
    dino.isJumping = true;
    dino.jumpCount++;

    tocarSomPulo();

    for (let i = 0; i < 6; i++) {
      adicionarParticula(
        dino.x + dino.width / 2,
        dino.y + dino.height,
        '#a8c98a'
      );
    }
  }
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    pular();
  }
});

canvas.addEventListener('click', pular);
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  pular();
}, { passive: false });

overlay.addEventListener('click', iniciarJogo);
overlay.addEventListener('touchstart', (e) => {
  e.preventDefault();
  iniciarJogo();
}, { passive: false });

dino.y = chaoY - dino.height;
desenharFundo();
desenharDino();

// ============================
// 🎬 OVERLAY DE ENTRADA
// ============================
const entryOverlay = document.getElementById('entryOverlay');
const entryBtn = document.getElementById('entryBtn');
const entryParticles = document.getElementById('entryParticles');

// Cria partículas mágicas caindo no overlay
function criarParticulasEntrada() {
  if (!entryParticles) return;
  const emojis = ['✨', '⭐', '💫', '🌟', '🍃', '🌿', '📖', '🔮'];
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'entry-particle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = Math.random() * 100 + '%';
    p.style.fontSize = (Math.random() * 15 + 12) + 'px';
    const duracao = Math.random() * 8 + 8;
    p.style.animationDuration = duracao + 's';
    p.style.animationDelay = Math.random() * 5 + 's';
    entryParticles.appendChild(p);
  }
}
criarParticulasEntrada();

// Ao clicar em "Entrar no mundo mágico"
if (entryBtn) {
  entryBtn.addEventListener('click', () => {
    // 1. Toca a música IMEDIATAMENTE (o clique libera o áudio)
    const forestAmbient = document.getElementById('forestAmbient');
    const musicToggle = document.getElementById('musicToggle');

    if (forestAmbient && !forestAmbient.paused === false) {
      forestAmbient.volume = 0;
      forestAmbient.play().then(() => {
        // Atualiza o botão de música
        if (musicToggle) {
          musicToggle.classList.add('playing');
          musicToggle.textContent = '🍃';
        }

        // Fade in suave do volume
        let vol = 0;
        const alvo = 0.25;
        const passos = 40;
        const inc = alvo / passos;
        const intervalo = setInterval(() => {
          vol += inc;
          if (vol >= alvo) {
            forestAmbient.volume = alvo;
            clearInterval(intervalo);
          } else {
            forestAmbient.volume = vol;
          }
        }, 2500 / passos);
      }).catch(() => {
        console.warn('Erro ao tocar som');
      });
    }

    // 2. Efeito visual: chuveiro de magia saindo do botão
    const rect = entryBtn.getBoundingClientRect();
    const bx = rect.left + rect.width / 2;
    const by = rect.top + rect.height / 2;

    const emojis = ['✨', '⭐', '💫', '🌟', '🍃', '🌸', '💛'];
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const s = document.createElement('div');
        s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        s.style.cssText = `
          position: fixed;
          left: ${bx}px;
          top: ${by}px;
          font-size: ${Math.random() * 15 + 15}px;
          pointer-events: none;
          z-index: 100002;
          filter: drop-shadow(0 0 15px #ffe97a);
          transition: transform 1.8s ease-out, opacity 1.8s ease-out;
        `;
        document.body.appendChild(s);

        requestAnimationFrame(() => {
          const ang = Math.random() * Math.PI * 2;
          const dist = 150 + Math.random() * 300;
          s.style.transform = `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist}px) scale(0.3) rotate(${Math.random() * 720}deg)`;
          s.style.opacity = '0';
        });
        setTimeout(() => s.remove(), 1900);
      }, i * 25);
    }

    // 3. Some o overlay com fade
    setTimeout(() => {
      entryOverlay.classList.add('hidden');
    }, 300);

    // 4. Libera o scroll da página
    document.body.style.overflow = 'auto';

    // 5. Toca som de "entrada mágica" (Web Audio API)
    tocarSomEntrada();
  });
}

// Bloqueia o scroll enquanto o overlay estiver visível
document.body.style.overflow = 'hidden';

// Som de "entrada mágica" (arpejo subindo)
function tocarSomEntrada() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const agora = audioCtx.currentTime;
    const notas = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];

    notas.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, agora + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.15, agora + i * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, agora + i * 0.1 + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(agora + i * 0.1);
      osc.stop(agora + i * 0.1 + 0.6);
    });
  } catch (e) {}
}

// Se a página for recarregada e o usuário já entrou antes, pula o overlay
if (sessionStorage.getItem('jaEntrou') === 'sim') {
  entryOverlay.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

// Marca que entrou ao clicar
if (entryBtn) {
  entryBtn.addEventListener('click', () => {
    sessionStorage.setItem('jaEntrou', 'sim');
  });
}

function criarParticulasEntrada() {
  if (!entryParticles) return;
  const emojis = ['✨', '⭐', '💫', '🌟', '✦', '✧', '💜'];
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'entry-particle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = Math.random() * 100 + '%';
    p.style.fontSize = (Math.random() * 15 + 12) + 'px';
    const duracao = Math.random() * 8 + 8;
    p.style.animationDuration = duracao + 's';
    p.style.animationDelay = Math.random() * 5 + 's';
    entryParticles.appendChild(p);
  }
}
criarParticulasEntrada();

// ✨ Brilhos cintilando por todo o overlay
function criarBrilhinhos() {
  if (!entrySparkles) return;
  for (let i = 0; i < 50; i++) {
    const s = document.createElement('div');
    s.className = 'entry-sparkle';
    s.textContent = Math.random() > 0.5 ? '✦' : '✧';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.fontSize = (Math.random() * 14 + 8) + 'px';
    s.style.animationDelay = Math.random() * 3 + 's';
    s.style.animationDuration = (Math.random() * 2 + 2) + 's';
    // Cores variadas (roxo, branco, lilás)
    const cores = ['#ffffff', '#e8d8ff', '#d4b8ff', '#c8a8ff'];
    s.style.color = cores[Math.floor(Math.random() * cores.length)];
    entrySparkles.appendChild(s);
  }
}
criarBrilhinhos();