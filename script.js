// ============================================================
// Mactimize Interactive Web Experience (100% Real-App Parity)
// ============================================================

(function () {
  const DATA = window.MACTIMIZE_DATA;
  if (!DATA) return;

  // --- Theme Toggle (Default: Light) ---
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
    setTheme((rootEl.getAttribute('data-theme') || 'light') === 'dark' ? 'light' : 'dark');
  });

  // --- App State (Cloned from demo-data so users can clean, rescan, quit apps, adjust fans!) ---
  let state = {
    section: 'overview',
    search: '',
    safety: 'all',
    focused: null, // { type: 'disk'|'startup'|'process', id: string }
    isScanning: false,
    scanPercent: 100,
    scanStage: '',
    toast: null,
    showPermBanner: true,
    diskFreeGB: DATA.disk.freeGB,
    diskTotalGB: DATA.disk.totalGB,
    diskItems: DATA.diskItems.map((x) => ({ ...x })),
    startupItems: DATA.startupItems.map((x) => ({ ...x })),
    processes: DATA.processes.map((x) => ({ ...x })),
    fans: [
      { id: 0, name: 'Left Side Fan', rpm: 3423, target: 3423, min: 2317, max: 6800, manual: false },
      { id: 1, name: 'Right Side Fan', rpm: 3409, target: 3409, min: 2317, max: 6800, manual: false }
    ],
    fanTracking: true
  };

  // --- Helpers ---
  function fmtMB(mb) {
    if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
    if (mb <= 0.01) return 'Zero KB';
    return `${mb.toFixed(1)} MB`;
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function usedPercent() {
    const used = Math.max(0, state.diskTotalGB - state.diskFreeGB);
    return Math.min(99, Math.round((used / state.diskTotalGB) * 100));
  }

  function ringColorClass(pct) {
    if (pct >= 90) return 'red';
    if (pct >= 70) return 'orange';
    return 'green';
  }

  function avgCpuTemp() {
    const avgRpm = (state.fans[0].rpm + state.fans[1].rpm) / 2;
    const ratio = (avgRpm - 2317) / (6800 - 2317);
    return Math.round(58 - ratio * 14); // ~44°C at Max, ~58°C at Min
  }

  function sectionInfo(id) {
    return DATA.sections.find((s) => s.id === id) || DATA.sections[0];
  }

  function isDiskSection(id) {
    return ['caches', 'devbloat', 'leftovers', 'duplicates', 'installers', 'large', 'trash'].includes(id);
  }

  function itemsForCat(cat) {
    return state.diskItems.filter((i) => i.cat === cat);
  }

  function safeCleanableItems() {
    return state.diskItems.filter((i) => i.safety === 'safe' && i.cat !== 'trash');
  }

  // --- DOM Refs ---
  const sidebarNav = document.getElementById('mzSidebarNav');
  const headerIcon = document.getElementById('mzHeaderIcon');
  const headerTitle = document.getElementById('mzHeaderTitle');
  const headerDesc = document.getElementById('mzHeaderDesc');
  const headerActions = document.getElementById('mzHeaderActions');
  const filterBar = document.getElementById('mzFilterBar');
  const searchInput = document.getElementById('mzSearchInput');
  const diskFilterActions = document.getElementById('mzDiskFilterActions');
  const canvas = document.getElementById('mzCanvas');
  const statusText = document.getElementById('mzStatusText');
  const bottomActions = document.getElementById('mzBottomActions');
  const inspector = document.getElementById('mzInspector');
  const inspectorBody = document.getElementById('mzInspectorBody');

  // --- Render Master ---
  function render() {
    renderDiskWidgets();
    renderSidebar();
    renderHeader();
    renderFilterBar();
    renderCanvas();
    renderBottomBar();
    renderInspector();
  }

  function renderDiskWidgets() {
    const pct = usedPercent();
    const colorCls = ringColorClass(pct);
    const sbPct = document.getElementById('sbDiskPct');
    const sbFill = document.getElementById('sbDiskFill');
    const sbSub = document.getElementById('sbDiskSub');
    if (sbPct) sbPct.textContent = `${pct}%`;
    if (sbFill) {
      sbFill.style.width = `${pct}%`;
      sbFill.className = colorCls;
    }
    if (sbSub) sbSub.textContent = `${state.diskFreeGB.toFixed(2)} GB free of ${state.diskTotalGB.toFixed(2)} GB`;

    // Menu Bar Widget Sync
    const safeMB = safeCleanableItems().reduce((a, b) => a + b.sizeMB, 0);
    const ramMB = state.processes.reduce((a, b) => a + b.memMB, 0);
    const cpu = avgCpuTemp();
    const mbStats = document.getElementById('mbLiveStats');
    if (mbStats) mbStats.textContent = state.fanTracking ? `${cpu}°C · ${state.diskFreeGB.toFixed(1)} GB Free` : `Paused · ${state.diskFreeGB.toFixed(1)} GB Free`;
    const mbRingPct = document.getElementById('mbRingPct');
    if (mbRingPct) mbRingPct.textContent = `${pct}%`;
    const mbDiskSub = document.getElementById('mbDiskSub');
    if (mbDiskSub) mbDiskSub.textContent = `${state.diskFreeGB.toFixed(2)} GB free of ${state.diskTotalGB.toFixed(2)} GB`;
    const mbSafe = document.getElementById('mbSafeVal');
    if (mbSafe) mbSafe.textContent = fmtMB(safeMB);
    const mbRam = document.getElementById('mbRamVal');
    if (mbRam) mbRam.textContent = fmtMB(ramMB);
    const mbFan = document.getElementById('mbFanVal');
    if (mbFan) mbFan.textContent = state.fanTracking ? `${cpu}°C · ${Math.round(state.fans[0].rpm)} RPM` : 'Tracking paused';
  }

  function sidebarTrailing(secId) {
    if (secId === 'overview') {
      const safeMB = safeCleanableItems().reduce((a, b) => a + b.sizeMB, 0);
      return safeMB > 0 ? fmtMB(safeMB) : '';
    }
    if (secId === 'startup') return String(state.startupItems.length);
    if (secId === 'memory') return fmtMB(state.processes.reduce((a, b) => a + b.memMB, 0));
    if (secId === 'fans') return state.fanTracking ? `${avgCpuTemp()}°C` : 'Paused';
    const sum = itemsForCat(secId).reduce((a, b) => a + b.sizeMB, 0);
    return sum > 0 ? fmtMB(sum) : '';
  }

  function renderSidebar() {
    sidebarNav.textContent = '';
    const groups = ['OVERVIEW', 'CLEANUP', 'FILES', 'SPEED & COOLING'];
    groups.forEach((grp) => {
      sidebarNav.appendChild(el('div', 'mz-nav-group', grp));
      DATA.sections.filter((s) => s.group === grp).forEach((sec) => {
        const btn = el('button', `mz-nav-btn${state.section === sec.id ? ' active' : ''}`);
        btn.type = 'button';
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', String(state.section === sec.id));

        const ic = el('span', `mz-nav-icon txt-${sec.tint === 'indigo' || sec.tint === 'mint' || sec.tint === 'teal' ? 'blue' : sec.tint}`, sec.icon);
        const lbl = el('span', 'mz-nav-label', sec.name);
        const val = el('span', 'mz-nav-val', sidebarTrailing(sec.id));
        btn.append(ic, lbl, val);

        btn.addEventListener('click', () => {
          state.section = sec.id;
          state.focused = null;
          state.search = '';
          state.safety = 'all';
          if (searchInput) searchInput.value = '';
          render();
        });
        sidebarNav.appendChild(btn);
      });
    });
  }

  function renderHeader() {
    const info = sectionInfo(state.section);
    headerIcon.className = `mz-icon-tile tint-${info.tint}`;
    headerIcon.textContent = info.icon;
    headerTitle.textContent = info.name;
    headerDesc.textContent = info.desc;

    headerActions.textContent = '';
    if (state.section === 'trash') {
      const b = el('button', 'mz-small-btn', 'Empty Trash');
      b.type = 'button';
      b.addEventListener('click', () => {
        const trashItems = itemsForCat('trash');
        const mb = trashItems.reduce((a, x) => a + x.sizeMB, 0);
        state.diskItems = state.diskItems.filter((x) => x.cat !== 'trash');
        state.diskFreeGB += mb / 1024;
        state.toast = `Emptied ${trashItems.length} log/trash items (${fmtMB(mb)} freed in demo).`;
        state.focused = null;
        render();
      });
      headerActions.appendChild(b);
    } else if (state.section === 'memory') {
      const b = el('button', 'mz-small-btn', '⚡ Free Idle RAM');
      b.type = 'button';
      b.addEventListener('click', freeIdleRam);
      headerActions.appendChild(b);
    } else if (state.section === 'fans') {
      const pauseBtn = el('button', 'mz-small-btn', state.fanTracking ? '⏸ Stop Tracking' : '▶ Start Tracking');
      pauseBtn.type = 'button';
      pauseBtn.addEventListener('click', toggleFanTracking);
      const autoBtn = el('button', 'mz-small-btn', 'All Auto');
      autoBtn.type = 'button';
      autoBtn.addEventListener('click', () => applyAllFansAuto());
      const maxBtn = el('button', 'mz-small-btn', 'Max Cooling');
      maxBtn.type = 'button';
      maxBtn.addEventListener('click', () => applyAllFansRPM(6800));
      headerActions.append(pauseBtn, autoBtn, maxBtn);
    }
  }

  function renderFilterBar() {
    const show = state.section !== 'overview' && state.section !== 'fans';
    filterBar.hidden = !show;
    if (!show) return;
    diskFilterActions.hidden = !isDiskSection(state.section);
    document.querySelectorAll('#mzSafetyFilter .mz-seg').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.safety === state.safety);
    });
  }

  // --- Render Canvas Views ---
  function renderCanvas() {
    canvas.textContent = '';
    if (state.isScanning) {
      renderScanningState();
      return;
    }
    if (state.section === 'overview') {
      renderOverview();
    } else if (state.section === 'fans') {
      renderFansTab();
    } else if (state.section === 'startup') {
      renderStartupList();
    } else if (state.section === 'memory') {
      renderProcessList();
    } else {
      renderDiskList(state.section);
    }
  }

  function renderScanningState() {
    const card = el('div', 'mz-scan-card');
    const ring = makeRingSVG(state.scanPercent, 'blue', `${state.scanPercent}%`, '');
    card.appendChild(ring);
    card.appendChild(el('strong', '', 'Scanning your Mac…'));
    card.appendChild(el('small', '', state.scanStage));
    const bar = el('div', 'mz-scan-bar');
    const fill = el('span');
    fill.style.width = `${state.scanPercent}%`;
    bar.appendChild(fill);
    card.appendChild(bar);
    canvas.appendChild(card);
  }

  function makeRingSVG(percent, colorCls, mainLabel, subLabel) {
    const wrap = el('div', 'mz-ring');
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');

    const track = document.createElementNS(svgNS, 'circle');
    track.setAttribute('cx', '50');
    track.setAttribute('cy', '50');
    track.setAttribute('r', '42');
    track.setAttribute('class', 'r-track');

    const fill = document.createElementNS(svgNS, 'circle');
    fill.setAttribute('cx', '50');
    fill.setAttribute('cy', '50');
    fill.setAttribute('r', '42');
    fill.setAttribute('class', `r-fill ${colorCls}`);
    const circ = 264;
    fill.setAttribute('stroke-dasharray', String(circ));
    fill.setAttribute('stroke-dashoffset', String(circ - (circ * percent) / 100));

    svg.append(track, fill);
    wrap.appendChild(svg);

    const lbl = el('div', 'mz-ring-lbl');
    lbl.appendChild(el('strong', '', mainLabel));
    if (subLabel) lbl.appendChild(el('span', '', subLabel));
    wrap.appendChild(lbl);
    return wrap;
  }

  function renderOverview() {
    if (state.showPermBanner) {
      const perm = el('div', 'mz-perm-banner');
      const left = el('div');
      left.appendChild(el('strong', '', 'Optional macOS Permissions Needed'));
      left.appendChild(el('span', '', 'macOS Trash inspection requires Full Disk Access in Privacy & Security.'));
      const btn = el('button', 'mz-small-btn', 'Dismiss Demo Notice');
      btn.type = 'button';
      btn.addEventListener('click', () => {
        state.showPermBanner = false;
        render();
      });
      perm.append(left, btn);
      canvas.appendChild(perm);
    }

    const pct = usedPercent();
    const safeList = safeCleanableItems();
    const safeMB = safeList.reduce((a, b) => a + b.sizeMB, 0);
    const reviewList = state.diskItems.filter((i) => i.safety === 'review');
    const reviewMB = reviewList.reduce((a, b) => a + b.sizeMB, 0);
    const ramMB = state.processes.reduce((a, b) => a + b.memMB, 0);

    // Hero Storage Card
    const hero = el('div', 'mz-hero-card');
    const heroLeft = el('div', 'mz-hero-left');
    heroLeft.appendChild(makeRingSVG(pct, ringColorClass(pct), `${pct}%`, 'used'));

    const copy = el('div', 'mz-hero-copy');
    copy.appendChild(el('strong', '', 'Macintosh HD'));
    copy.appendChild(el('div', 'sub', `${state.diskFreeGB.toFixed(2)} GB free of ${state.diskTotalGB.toFixed(2)} GB`));
    const freeLine = el('div', 'mz-hero-free', `${fmtMB(safeMB)} `);
    freeLine.appendChild(el('span', '', 'can be safely freed'));
    copy.appendChild(freeLine);
    heroLeft.appendChild(copy);

    const btns = el('div', 'mz-hero-btns');
    const cleanBtn = el('button', 'mz-btn-green', '✓ Clean Safe Items');
    cleanBtn.type = 'button';
    cleanBtn.disabled = safeList.length === 0;
    cleanBtn.addEventListener('click', cleanAllSafe);

    const rescanBtn = el('button', 'mz-btn-neutral', '↻ Rescan');
    rescanBtn.type = 'button';
    rescanBtn.addEventListener('click', runAnimatedRescan);
    btns.append(cleanBtn, rescanBtn);

    hero.append(heroLeft, btns);
    canvas.appendChild(hero);

    // 4 Stat Cards
    const stats = el('div', 'mz-stat-grid');
    const statDefs = [
      { ic: '✓', tint: 'green', title: 'Safe to clean', val: fmtMB(safeMB), sub: `${safeList.length} items` },
      { ic: '!', tint: 'orange', title: 'Needs review', val: fmtMB(reviewMB), sub: `${reviewList.length} items` },
      { ic: '⏻', tint: 'orange', title: 'Startup items', val: String(state.startupItems.length), sub: `${state.startupItems.filter((x) => x.flags.includes('Starts at login')).length} start at login` },
      { ic: '◔', tint: 'blue', title: 'Apps memory', val: fmtMB(ramMB), sub: `${state.processes.length} heavy apps` }
    ];
    statDefs.forEach((d) => {
      const card = el('div', 'mz-stat');
      card.appendChild(el('div', `mz-stat-ic tint-${d.tint}`, d.ic));
      const info = el('div');
      info.append(el('small', '', d.title), el('strong', '', d.val), el('span', '', d.sub));
      card.appendChild(info);
      stats.appendChild(card);
    });
    canvas.appendChild(stats);

    // Categories Grid
    canvas.appendChild(el('h3', 'mz-subhead', 'Categories'));
    const grid = el('div', 'mz-cat-grid');
    DATA.sections.filter((s) => s.id !== 'overview').forEach((sec) => {
      const tile = el('button', 'mz-cat-tile');
      tile.type = 'button';

      const top = el('div', 'mz-cat-top');
      top.append(el('div', `mz-cat-ic tint-${sec.tint}`, sec.icon), el('span', 'mz-chev', '›'));

      let meta = '';
      let val = '';
      if (sec.id === 'startup') {
        meta = '1 orphaned · LaunchAgents';
        val = `${state.startupItems.length} items`;
      } else if (sec.id === 'memory') {
        meta = `${state.processes.length} heavy apps`;
        val = fmtMB(ramMB);
      } else if (sec.id === 'fans') {
        meta = `2 fans · ${Math.round(state.fans[0].rpm)} RPM`;
        val = `${avgCpuTemp()}°C CPU`;
      } else {
        const list = itemsForCat(sec.id);
        const safeCount = list.filter((i) => i.safety === 'safe').length;
        meta = `${list.length} items · ${safeCount} safe`;
        val = fmtMB(list.reduce((a, b) => a + b.sizeMB, 0));
      }

      tile.append(top, el('span', 'mz-cat-name', sec.name), el('span', 'mz-cat-meta', meta), el('span', 'mz-cat-val', val));
      tile.addEventListener('click', () => {
        state.section = sec.id;
        state.focused = null;
        render();
      });
      grid.appendChild(tile);
    });
    canvas.appendChild(grid);
  }

  function renderDiskList(cat) {
    const info = sectionInfo(cat);
    const items = itemsForCat(cat).filter((it) => {
      const mSafety = state.safety === 'all' || it.safety === state.safety;
      const q = state.search.toLowerCase();
      const mSearch = !q || it.title.toLowerCase().includes(q) || it.path.toLowerCase().includes(q);
      return mSafety && mSearch;
    });

    const summary = el('div', 'mz-list-summary');
    const safeCnt = items.filter((i) => i.safety === 'safe').length;
    summary.append(
      el('span', '', `${items.length} items · ${fmtMB(items.reduce((a, b) => a + b.sizeMB, 0))} · ${safeCnt} safe`),
      el('span', '', 'Click a row for details')
    );
    canvas.appendChild(summary);

    if (items.length === 0) {
      const empty = el('div', 'mz-scan-card');
      empty.append(el('strong', '', 'Nothing to clean here'), el('small', '', 'All items in this view are spotless or filtered out.'));
      canvas.appendChild(empty);
      return;
    }

    const listCard = el('div', 'mz-list-card');
    items.forEach((item) => {
      const isFoc = state.focused?.type === 'disk' && state.focused.id === item.id;
      const row = el('div', `mz-row${isFoc ? ' focused' : ''}`);

      const chk = el('button', `mz-chk${item.selected ? ' checked' : ''}`, item.selected ? '✓' : '');
      chk.type = 'button';
      chk.setAttribute('aria-label', `Select ${item.title}`);
      chk.addEventListener('click', (e) => {
        e.stopPropagation();
        item.selected = !item.selected;
        render();
      });

      const ic = el('div', `mz-row-ic tint-${info.tint}`, info.icon);
      const mid = el('div', 'mz-row-info');
      mid.append(el('strong', '', item.title), el('small', '', item.path));

      const tag = el('span', `tag ${item.safety}`, item.safety === 'safe' ? 'Safe' : item.safety === 'review' ? 'Review' : 'Keep');
      const sz = el('span', 'mz-row-size', fmtMB(item.sizeMB));
      const chev = el('span', 'mz-chev', '›');

      row.append(chk, ic, mid, tag, sz, chev);
      row.addEventListener('click', () => {
        state.focused = { type: 'disk', id: item.id };
        render();
      });
      listCard.appendChild(row);
    });
    canvas.appendChild(listCard);
  }

  function renderStartupList() {
    const items = state.startupItems.filter((it) => {
      const mSafety = state.safety === 'all' || it.safety === state.safety;
      const q = state.search.toLowerCase();
      const mSearch = !q || it.name.toLowerCase().includes(q) || it.scope.toLowerCase().includes(q);
      return mSafety && mSearch;
    });

    const summary = el('div', 'mz-list-summary');
    summary.append(
      el('span', '', `${items.length} items · ${items.filter((x) => x.flags.includes('Starts at login')).length} start automatically`),
      el('span', '', 'Click a row for details')
    );
    canvas.appendChild(summary);

    const listCard = el('div', 'mz-list-card');
    items.forEach((item) => {
      const isFoc = state.focused?.type === 'startup' && state.focused.id === item.id;
      const row = el('div', `mz-row${isFoc ? ' focused' : ''}`);
      const ic = el('div', `mz-row-ic tint-${item.orphan ? 'red' : 'orange'}`, item.orphan ? '!' : '⏻');
      const mid = el('div', 'mz-row-info');
      mid.append(el('strong', '', item.name), el('small', '', [item.scope, ...item.flags].join(' · ')));
      const tag = el('span', `tag ${item.safety}`, item.safety === 'safe' ? 'Safe' : item.safety === 'review' ? 'Review' : 'Keep');
      row.append(ic, mid, tag, el('span', 'mz-chev', '›'));
      row.addEventListener('click', () => {
        state.focused = { type: 'startup', id: item.id };
        render();
      });
      listCard.appendChild(row);
    });
    canvas.appendChild(listCard);
  }

  function renderProcessList() {
    const items = state.processes.filter((it) => {
      const mSafety = state.safety === 'all' || it.safety === state.safety;
      const q = state.search.toLowerCase();
      return mSafety && (!q || it.name.toLowerCase().includes(q));
    });
    const maxRam = Math.max(1, ...items.map((x) => x.memMB));

    const summary = el('div', 'mz-list-summary');
    summary.append(
      el('span', '', `${items.length} heavy apps · ${fmtMB(items.reduce((a, b) => a + b.memMB, 0))} RAM`),
      el('span', '', 'Click a row to inspect or quit')
    );
    canvas.appendChild(summary);

    const listCard = el('div', 'mz-list-card');
    items.forEach((proc) => {
      const isFoc = state.focused?.type === 'process' && state.focused.id === proc.id;
      const row = el('div', `mz-row${isFoc ? ' focused' : ''}`);
      const heavy = proc.memMB > 450;
      const ic = el('div', `mz-row-ic tint-${heavy ? 'red' : 'blue'}`, '▢');
      const mid = el('div', 'mz-row-info');
      mid.append(el('strong', '', proc.name), el('small', '', `${proc.count} process${proc.count > 1 ? 'es' : ''} · CPU ${proc.cpu.toFixed(1)}%`));

      const bar = el('div', 'mz-ram-bar');
      const fill = el('span');
      fill.style.width = `${Math.max(8, (proc.memMB / maxRam) * 100)}%`;
      fill.style.background = heavy ? 'var(--red)' : 'var(--blue)';
      bar.appendChild(fill);

      const sz = el('span', 'mz-row-size', fmtMB(proc.memMB));
      const tag = el('span', `tag ${proc.safety}`, proc.safety === 'safe' ? 'Safe' : proc.safety === 'review' ? 'Review' : 'Keep');

      row.append(ic, mid, bar, sz, tag, el('span', 'mz-chev', '›'));
      row.addEventListener('click', () => {
        state.focused = { type: 'process', id: proc.id };
        render();
      });
      listCard.appendChild(row);
    });
    canvas.appendChild(listCard);
  }

  function renderFansTab() {
    const topBar = el('div', 'mz-list-summary');
    topBar.append(
      el('strong', '', 'Cooling Fans'),
      el('span', state.fanTracking ? 'txt-green' : '', state.fanTracking ? '● Live tracking (2s)' : '● Tracking paused')
    );
    canvas.appendChild(topBar);

    const grid = el('div', 'mz-fans-grid');
    state.fans.forEach((fan) => {
      const card = el('div', 'mz-fan-card');
      const head = el('div', 'mz-fan-head');
      const left = el('div');
      const titleRow = el('div');
      titleRow.style.display = 'flex';
      titleRow.style.gap = '6px';
      titleRow.style.alignItems = 'center';
      titleRow.append(el('strong', '', fan.name), el('span', `tag ${fan.manual ? 'review' : 'safe'}`, fan.manual ? 'Manual' : 'Auto'));
      left.append(titleRow, el('small', '', `Range: ${fan.min.toLocaleString()} – ${fan.max.toLocaleString()} RPM`));

      const rpmBox = el('div', 'mz-fan-rpm', Math.round(fan.rpm).toLocaleString());
      rpmBox.appendChild(el('small', '', 'RPM'));
      head.append(left, rpmBox);

      const frac = Math.max(0.05, Math.min(1, (fan.rpm - fan.min) / (fan.max - fan.min)));
      const bar = el('div', 'mz-bar');
      const fill = el('span', frac > 0.75 ? 'orange' : 'cyan');
      fill.style.width = `${frac * 100}%`;
      bar.appendChild(fill);

      const sliderWrap = el('div', 'mz-fan-slider-row');
      const lbl = el('label', '', `Target Speed: ${Math.round(fan.target).toLocaleString()} RPM`);
      const input = document.createElement('input');
      input.type = 'range';
      input.min = String(fan.min);
      input.max = String(fan.max);
      input.step = '100';
      input.value = String(fan.target);
      input.addEventListener('input', (e) => {
        fan.target = Number(e.target.value);
        lbl.textContent = `Target Speed: ${Math.round(fan.target).toLocaleString()} RPM`;
        applyBtn.textContent = `Apply ${Math.round(fan.target).toLocaleString()} RPM`;
      });
      sliderWrap.append(lbl, input);

      const acts = el('div', 'mz-fan-actions');
      const autoB = el('button', 'mz-small-btn', 'Auto');
      autoB.type = 'button';
      autoB.addEventListener('click', () => {
        fan.manual = false;
        fan.rpm = 3420;
        fan.target = 3420;
        state.toast = `${fan.name} returned to macOS Auto.`;
        render();
      });
      const applyBtn = el('button', 'mz-btn-green', `Apply ${Math.round(fan.target).toLocaleString()} RPM`);
      applyBtn.type = 'button';
      applyBtn.style.background = 'var(--cyan)';
      applyBtn.style.padding = '5px 8px';
      applyBtn.style.fontSize = '11px';
      applyBtn.addEventListener('click', () => {
        fan.manual = true;
        fan.rpm = fan.target;
        state.toast = `${fan.name} set to ${Math.round(fan.target).toLocaleString()} RPM (demo).`;
        render();
      });
      acts.append(autoB, applyBtn);

      card.append(head, bar, sliderWrap, acts);
      grid.appendChild(card);
    });
    canvas.appendChild(grid);

    // Quick Presets Bar
    const presets = el('div', 'mz-fan-presets');
    presets.appendChild(el('span', '', 'Quick Presets:'));
    [
      { label: 'macOS Auto', fn: applyAllFansAuto },
      { label: 'Balanced (3500 RPM)', fn: () => applyAllFansRPM(3500) },
      { label: 'High Cooling (5000 RPM)', fn: () => applyAllFansRPM(5000) },
      { label: 'Full Blast (Max)', fn: () => applyAllFansRPM(6800) }
    ].forEach((p) => {
      const b = el('button', 'mz-small-btn', p.label);
      b.type = 'button';
      b.addEventListener('click', p.fn);
      presets.appendChild(b);
    });
    canvas.appendChild(presets);

    // 11 Live Thermal Sensors Grid
    const cpuAvg = avgCpuTemp();
    const sHead = el('div', 'mz-list-summary');
    sHead.append(el('strong', '', `Temperature Sensors (${DATA.sensors.length})`), el('strong', 'txt-green', `CPU Avg: ${cpuAvg}.4°C`));
    canvas.appendChild(sHead);

    const sGrid = el('div', 'mz-sensor-grid');
    const offset = cpuAvg - 48;
    DATA.sensors.forEach((s) => {
      const temp = Math.max(30, s.base + (s.cat === 'CPU' ? offset : Math.round(offset * 0.4)));
      const card = el('div', 'mz-sensor-card');
      const left = el('div');
      left.style.minWidth = '0';
      left.append(el('strong', '', s.name), el('small', '', s.cat));
      const tCls = temp >= 75 ? 'txt-red' : temp >= 60 ? 'txt-orange' : 'txt-green';
      card.append(left, el('span', `mz-sensor-temp ${tCls}`, `${temp}°C`));
      sGrid.appendChild(card);
    });
    canvas.appendChild(sGrid);
  }

  // --- Bottom Bar ---
  function renderBottomBar() {
    if (state.toast) {
      statusText.className = 'mz-status-text ok';
      statusText.textContent = `✓ ${state.toast}`;
    } else {
      const totalMB = state.diskItems.reduce((a, b) => a + b.sizeMB, 0);
      statusText.className = 'mz-status-text';
      statusText.textContent = `Scan complete · ${state.diskItems.length} disk items (${fmtMB(totalMB)}), ${state.startupItems.length} startup agents, ${state.processes.length} heavy apps`;
    }

    bottomActions.textContent = '';
    if (state.section === 'overview') {
      const safe = safeCleanableItems();
      const mb = safe.reduce((a, b) => a + b.sizeMB, 0);
      const btn = el('button', 'mz-btn-green', `✓ Clean Safe Items (${fmtMB(mb)})`);
      btn.type = 'button';
      btn.disabled = safe.length === 0 || state.isScanning;
      btn.addEventListener('click', cleanAllSafe);
      bottomActions.appendChild(btn);
    } else if (isDiskSection(state.section)) {
      const sel = itemsForCat(state.section).filter((i) => i.selected);
      const mb = sel.reduce((a, b) => a + b.sizeMB, 0);
      bottomActions.appendChild(el('span', '', `${sel.length} selected · ${fmtMB(mb)}`));
      const btn = el('button', 'mz-btn-red', 'Move to Trash');
      btn.type = 'button';
      btn.disabled = sel.length === 0;
      btn.addEventListener('click', () => {
        state.diskItems = state.diskItems.filter((i) => !(i.cat === state.section && i.selected));
        state.diskFreeGB += mb / 1024;
        state.toast = `Moved ${sel.length} items (${fmtMB(mb)}) to macOS Trash (simulated).`;
        state.focused = null;
        render();
      });
      bottomActions.appendChild(btn);
    }
  }

  // --- Right Slide-In Details Inspector (Removed to keep full-width app canvas) ---
  function renderInspector() {
    if (!inspector) return;
    inspector.hidden = true;
  }

  // --- Interactive Actions ---
  function cleanAllSafe() {
    const safe = safeCleanableItems();
    const mb = safe.reduce((a, b) => a + b.sizeMB, 0);
    state.diskItems = state.diskItems.filter((i) => !(i.safety === 'safe' && i.cat !== 'trash'));
    state.diskFreeGB += mb / 1024;
    state.toast = `Cleaned ${safe.length} safe items (${fmtMB(mb)} freed in demo). Click Rescan Mac to reset.`;
    state.focused = null;
    render();
  }

  function freeIdleRam() {
    const safeProcs = state.processes.filter((p) => p.safety === 'safe');
    if (safeProcs.length === 0) {
      state.toast = 'No idle background apps marked Safe to quit right now.';
      render();
      return;
    }
    const mb = safeProcs.reduce((a, b) => a + b.memMB, 0);
    state.processes = state.processes.filter((p) => p.safety !== 'safe');
    state.toast = `Quit ${safeProcs.length} idle background apps, freeing ${fmtMB(mb)} RAM (demo).`;
    render();
  }

  function toggleFanTracking() {
    state.fanTracking = !state.fanTracking;
    state.toast = state.fanTracking ? 'Live 2-second fan & thermal tracking resumed.' : 'Live fan & thermal tracking paused.';
    render();
  }

  function applyAllFansAuto() {
    state.fans.forEach((f) => { f.manual = false; f.rpm = 3420; f.target = 3420; });
    state.toast = 'All fans set to macOS Auto.';
    render();
  }

  function applyAllFansRPM(rpm) {
    state.fans.forEach((f) => { f.manual = true; f.rpm = rpm; f.target = rpm; });
    state.toast = `All fans set to ${rpm.toLocaleString()} RPM (demo).`;
    render();
  }

  function runAnimatedRescan() {
    if (state.isScanning) return;
    state.isScanning = true;
    state.section = 'overview';
    state.focused = null;
    state.toast = null;

    // Reset demo data on rescan so visitors can play again!
    state.diskFreeGB = DATA.disk.freeGB;
    state.diskItems = DATA.diskItems.map((x) => ({ ...x }));
    state.startupItems = DATA.startupItems.map((x) => ({ ...x }));
    state.processes = DATA.processes.map((x) => ({ ...x }));

    const stages = [
      { p: 15, t: 'Stage 1/8 · Scanning ~/Library/Caches and global developer caches…' },
      { p: 30, t: 'Stage 2/8 · Scanning ~/Documents for Dev Project Build Bloat (node_modules, target, build)…' },
      { p: 50, t: 'Stage 4/8 · Scanning ~/Downloads for leftover archives & installers…' },
      { p: 70, t: 'Stage 5/8 · Computing Apple CryptoKit SHA-256 hashes for duplicates…' },
      { p: 90, t: 'Stage 8/8 · Analyzing Login Items, LaunchDaemons & Live RAM/CPU…' }
    ];

    let idx = 0;
    function step() {
      if (idx < stages.length) {
        state.scanPercent = stages[idx].p;
        state.scanStage = stages[idx].t;
        render();
        idx += 1;
        setTimeout(step, 340);
      } else {
        state.isScanning = false;
        state.scanPercent = 100;
        state.toast = 'Rescan complete — fresh real-world MacBook dataset loaded.';
        render();
      }
    }
    step();
  }

  // --- Event Listeners ---
  searchInput?.addEventListener('input', (e) => {
    state.search = e.target.value;
    renderCanvas();
  });

  document.querySelectorAll('#mzSafetyFilter .mz-seg').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.safety = btn.dataset.safety;
      renderFilterBar();
      renderCanvas();
    });
  });

  document.getElementById('mzSelectSafeBtn')?.addEventListener('click', () => {
    itemsForCat(state.section).forEach((i) => { i.selected = i.safety === 'safe'; });
    render();
  });

  document.getElementById('mzDeselectBtn')?.addEventListener('click', () => {
    itemsForCat(state.section).forEach((i) => { i.selected = false; });
    render();
  });

  document.getElementById('mzInspectorClose')?.addEventListener('click', () => {
    state.focused = null;
    render();
  });

  document.getElementById('rescanMacBtn')?.addEventListener('click', runAnimatedRescan);

  // Safety Guide Dialog
  const safetyDialog = document.getElementById('safetyDialog');
  document.getElementById('openSafetyGuideBtn')?.addEventListener('click', () => safetyDialog?.showModal());
  document.getElementById('closeSafetyDialogBtn')?.addEventListener('click', () => safetyDialog?.close());
  document.getElementById('ackSafetyDialogBtn')?.addEventListener('click', () => safetyDialog?.close());
  safetyDialog?.addEventListener('click', (e) => { if (e.target === safetyDialog) safetyDialog.close(); });

  // Menu Bar Popover
  const mbToggle = document.getElementById('menuBarToggleBtn');
  const mbPopover = document.getElementById('menuBarPopover');
  const mbToast = document.getElementById('mbToast');
  mbToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = !mbPopover.hidden;
    mbPopover.hidden = isOpen;
    mbToggle.setAttribute('aria-expanded', String(!isOpen));
  });
  document.addEventListener('click', (e) => {
    if (mbPopover && !mbPopover.hidden && !mbPopover.contains(e.target) && e.target !== mbToggle) {
      mbPopover.hidden = true;
      mbToggle?.setAttribute('aria-expanded', 'false');
    }
  });
  document.getElementById('mbQuickRamBtn')?.addEventListener('click', () => {
    freeIdleRam();
    if (mbToast) { mbToast.textContent = '✓ Freed idle background RAM.'; mbToast.hidden = false; }
  });
  document.getElementById('mbPauseFanBtn')?.addEventListener('click', (e) => {
    toggleFanTracking();
    e.target.textContent = state.fanTracking ? 'Stop Fan Tracking' : 'Resume Tracking';
    if (mbToast) { mbToast.textContent = state.toast; mbToast.hidden = false; }
  });

  // Copy Build Commands
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

  // --- Interactive Spinning Fan Rotor Simulator ---
  const fanSlider = document.getElementById('fanSlider');
  const fanRotor = document.getElementById('fanRotor');
  const simRpmVal = document.getElementById('simRpmVal');
  const simTempVal = document.getElementById('simTempVal');
  const simModeBadge = document.getElementById('simModeBadge');
  const simWarning = document.getElementById('simWarning');
  const presetBtns = document.querySelectorAll('.preset-pills [data-rpm]');

  function updateFanSim(rpm, isAuto, activeKey) {
    const clamped = Math.max(2317, Math.min(6800, Number(rpm)));
    if (fanSlider) fanSlider.value = String(clamped);
    if (simRpmVal) simRpmVal.textContent = clamped.toLocaleString();

    const ratio = (clamped - 2317) / (6800 - 2317);
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
      b.classList.toggle('active', Boolean(activeKey && b.dataset.rpm === activeKey));
    });
  }

  fanSlider?.addEventListener('input', (e) => updateFanSim(e.target.value, false, null));
  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.rpm;
      if (val === 'auto') updateFanSim(3600, true, 'auto');
      else updateFanSim(Number(val), false, val);
    });
  });
  updateFanSim(3600, true, 'auto');

  // --- Interactive Pointer-Tracking Liquid Glass Specular Sheen ---
  document.querySelectorAll('.glass-nav, .footer-row, .cooling-shell, .tier-card, .pricing-card').forEach((elNode) => {
    elNode.addEventListener('pointermove', (e) => {
      const rect = elNode.getBoundingClientRect();
      elNode.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      elNode.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });

  // Initial Render
  render();
})();
