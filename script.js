// 1. Light (Default) / Dark Appearance Toggle (macOS style)
const rootEl = document.documentElement;
const themeBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');

function setTheme(mode) {
  rootEl.setAttribute('data-theme', mode);
  if (themeIcon) themeIcon.textContent = mode === 'dark' ? '☀' : '☾';
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute('content', mode === 'dark' ? '#07090e' : '#f5f5f7');
  try { localStorage.setItem('mactimize-theme', mode); } catch {}
}

try {
  const saved = localStorage.getItem('mactimize-theme');
  setTheme(saved === 'dark' ? 'dark' : 'light');
} catch {
  setTheme('light');
}

themeBtn?.addEventListener('click', () => {
  const current = rootEl.getAttribute('data-theme') || 'light';
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// 2. Real App Screenshot Showcase Tab Switcher
const scPills = document.querySelectorAll('.sc-pill[data-shot]');
const showcaseImg = document.getElementById('showcaseImage');

scPills.forEach((pill) => {
  pill.addEventListener('click', () => {
    const nextSrc = pill.dataset.shot;
    const nextAlt = pill.dataset.alt || 'Mactimize app screenshot';
    scPills.forEach((p) => {
      const active = p === pill;
      p.classList.toggle('active', active);
      p.setAttribute('aria-selected', String(active));
    });
    if (showcaseImg && showcaseImg.getAttribute('src') !== nextSrc) {
      showcaseImg.classList.add('fading');
      const preload = new Image();
      preload.onload = () => {
        showcaseImg.src = nextSrc;
        showcaseImg.alt = nextAlt;
        showcaseImg.classList.remove('fading');
      };
      preload.src = nextSrc;
    }
  });
});

// 4. Interactive Apple SMC Fan Speed Simulator (syncs spinning SVG rotor speed!)
const fanSlider = document.getElementById('fanSlider');
const fanRotor = document.getElementById('fanRotor');
const simRpmVal = document.getElementById('simRpmVal');
const simTempVal = document.getElementById('simTempVal');
const simModeBadge = document.getElementById('simModeBadge');
const simWarning = document.getElementById('simWarning');
const presetBtns = document.querySelectorAll('.preset-pills [data-rpm]');

function updateFanSim(rpm, isAuto, activeBtnKey) {
  const clamped = Math.max(2317, Math.min(6800, Number(rpm)));
  if (fanSlider) fanSlider.value = String(clamped);
  if (simRpmVal) simRpmVal.textContent = clamped.toLocaleString();

  const ratio = (clamped - 2317) / (6800 - 2317);
  // Spin duration from 2.4s (slow) down to 0.25s (full blast)
  const spinSec = (2.4 - ratio * 2.15).toFixed(2);
  if (fanRotor) fanRotor.style.setProperty('--fan-speed', `${spinSec}s`);

  const temp = Math.round(82 - ratio * 34);
  if (simTempVal) {
    simTempVal.textContent = `${temp}°C`;
    simTempVal.style.color = temp >= 78 ? 'var(--red)' : temp >= 60 ? 'var(--orange)' : 'var(--green)';
  }

  if (simModeBadge) {
    simModeBadge.textContent = isAuto ? 'Auto' : 'Manual';
    simModeBadge.className = isAuto ? 'tag safe' : 'tag review';
  }

  if (simWarning) simWarning.hidden = !(temp >= 78 && !isAuto);

  presetBtns.forEach((b) => {
    b.classList.toggle('active', activeBtnKey && b.dataset.rpm === activeBtnKey);
  });
}

fanSlider?.addEventListener('input', (e) => updateFanSim(e.target.value, false, null));

presetBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const val = btn.dataset.rpm;
    if (val === 'auto') {
      updateFanSim(3600, true, 'auto');
    } else {
      updateFanSim(Number(val), false, val);
    }
  });
});

updateFanSim(3600, true, 'auto');

// 5. Pointer-Tracking Specular Spotlight on Liquid Glass Bento Cards
document.querySelectorAll('.spotlight').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});

// 6. Scroll-Triggered Reveal Animations
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('in-view'));
}

// 7. Native <dialog> Safety Modal
const safetyDialog = document.getElementById('safetyDialog');
document.getElementById('openSafetyDialogBtn')?.addEventListener('click', () => safetyDialog?.showModal());
document.getElementById('closeSafetyDialogBtn')?.addEventListener('click', () => safetyDialog?.close());
document.getElementById('ackSafetyDialogBtn')?.addEventListener('click', () => safetyDialog?.close());
safetyDialog?.addEventListener('click', (e) => {
  if (e.target === safetyDialog) safetyDialog.close();
});

// 8. Copy Terminal Commands
const copyBtn = document.getElementById('copyCmdBtn');
const installCode = document.getElementById('installCommands');
copyBtn?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(installCode.textContent.trim());
    copyBtn.textContent = 'Copied ✓';
    setTimeout(() => (copyBtn.textContent = 'Copy'), 1800);
  } catch {
    copyBtn.textContent = 'Error';
  }
});
