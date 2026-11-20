// Anonymized real-world MacBook Pro scan dataset modeled directly after Mactimize.app
window.MACTIMIZE_DATA = {
  disk: {
    usedPercent: 83,
    freeGB: 79.24,
    totalGB: 494.38
  },
  sections: [
    { id: 'overview', group: 'OVERVIEW', name: 'Overview', icon: '⊞', tint: 'blue', desc: 'Combined view of every cleanable cache, build artifact, orphaned leftover, duplicate download, archive, and large file found on your Mac.' },
    { id: 'caches', group: 'CLEANUP', name: 'Caches', icon: '◫', tint: 'cyan', desc: 'Temporary application, web browser, and global CLI caches (~/Library/Caches, ~/.npm, ~/.cache, ~/.cargo). Cleaning frees space without touching your personal settings or logins.' },
    { id: 'devbloat', group: 'CLEANUP', name: 'Dev Build Bloat', icon: '⌘', tint: 'indigo', desc: 'Heavy dependency and compiler output folders (node_modules, Rust target/, Flutter build/, Next.js .next/, Python .venv/) inside your project directories. Source code is 100% untouched.' },
    { id: 'leftovers', group: 'CLEANUP', name: 'App Leftovers', icon: '❖', tint: 'teal', desc: 'Orphaned folders in ~/Library/Application Support, Containers, and Saved Application State left behind by applications no longer installed in /Applications.' },
    { id: 'duplicates', group: 'FILES', name: 'Duplicates', icon: '❐', tint: 'blue', desc: '100% byte-for-byte identical files in ~/Downloads verified with Apple CryptoKit SHA-256 hashing. The original file is always kept untouched; only redundant copies are listed here.' },
    { id: 'installers', group: 'FILES', name: 'Archives & Installers', icon: '▣', tint: 'mint', desc: 'Disk image installers (.dmg, .pkg), incomplete browser temp files (.com.google.Chrome.*), and .zip/.tar.gz archives whose contents have already been extracted into folders right next to them.' },
    { id: 'large', group: 'FILES', name: 'Large Files', icon: '◷', tint: 'orange', desc: 'Single files larger than 50 MB across ~/Downloads, ~/Desktop, and ~/Movies (videos, recordings, datasets, models) with last-modified age so you can review or preview them.' },
    { id: 'trash', group: 'FILES', name: 'Trash & Backups', icon: '⌫', tint: 'red', desc: 'Items currently sitting in your macOS Trash (~/.Trash), old iOS/iPadOS device backups (MobileSync), and local crash/log archives.' },
    { id: 'startup', group: 'SPEED & COOLING', name: 'Startup Items', icon: '⏻', tint: 'orange', desc: 'User LaunchAgents, System LaunchAgents, and root LaunchDaemons that automatically launch at boot or run continuously in the background.' },
    { id: 'memory', group: 'SPEED & COOLING', name: 'Memory & CPU', icon: '◔', tint: 'blue', desc: 'Live multi-process memory & CPU analyzer. Groups all helper/renderer subprocesses under their parent .app so you see each application’s true combined RAM and CPU load.' },
    { id: 'fans', group: 'SPEED & COOLING', name: 'Fans & Thermals', icon: '❋', tint: 'cyan', desc: 'Real-time hardware fan speed monitor, manual RPM controller, and live CPU/GPU/Battery temperature sensors via Apple SMC. Automatically detects if your Mac has active cooling fans or is fanless.' }
  ],
  diskItems: [
    // Caches (total ~6.66 GB)
    { id: 'c1', cat: 'caches', title: 'BraveSoftware', path: '~/Library/Caches/BraveSoftware', sizeMB: 1770, safety: 'safe', selected: true, explanation: 'Web browser media & script cache. Safe to clean; does NOT remove logins, bookmarks, or history.' },
    { id: 'c2', cat: 'caches', title: 'Google', path: '~/Library/Caches/Google', sizeMB: 1370, safety: 'safe', selected: true, explanation: 'Google Chrome & Updater web cache. Automatically regenerated as you browse without logging you out.' },
    { id: 'c3', cat: 'caches', title: 'com.brave.Browser', path: '~/Library/Caches/com.brave.Browser', sizeMB: 897.1, safety: 'safe', selected: true, explanation: 'Browser shader & compiled script cache. 100% safe to move to Trash.' },
    { id: 'c4', cat: 'caches', title: 'Flutter / Dart Pub Package Cache', path: '~/.pub-cache', sizeMB: 839.2, safety: 'review', selected: false, explanation: 'Downloaded Dart/Flutter packages. Safe to clean; flutter pub get restores active packages.' },
    { id: 'c5', cat: 'caches', title: 'Xcode DerivedData Build Cache', path: '~/Library/Developer/Xcode/DerivedData', sizeMB: 651.2, safety: 'safe', selected: true, explanation: 'Intermediate Xcode build artifacts and indexes. Safely regenerated on next build.' },
    { id: 'c6', cat: 'caches', title: 'Homebrew Bottle Cache', path: '~/Library/Caches/Homebrew', sizeMB: 436.5, safety: 'safe', selected: true, explanation: 'Downloaded Homebrew installer tarballs left over after package upgrades.' },
    { id: 'c7', cat: 'caches', title: 'com.apple.Music', path: '~/Library/Caches/com.apple.Music', sizeMB: 174.6, safety: 'keep', selected: false, explanation: 'Core macOS Apple system cache. Best left intact so macOS doesn’t rebuild system indexes.' },
    { id: 'c8', cat: 'caches', title: 'GeoServices', path: '~/Library/Caches/GeoServices', sizeMB: 97.6, safety: 'keep', selected: false, explanation: 'Core macOS Maps & location tile cache. Protected by default.' },
    { id: 'c9', cat: 'caches', title: 'com.apple.helpd', path: '~/Library/Caches/com.apple.helpd', sizeMB: 59.7, safety: 'keep', selected: false, explanation: 'macOS system help index cache. Protected by default.' },

    // Dev Build Bloat (anonymized developer projects)
    { id: 'd1', cat: 'devbloat', title: 'src-tauri → Rust Compiled Build Artifacts (target/)', path: '~/Projects/desktop-studio/src-tauri/target', refPath: '~/Projects/desktop-studio', sizeMB: 7454, safety: 'review', selected: false, explanation: 'Recently active project (modified 2 days ago) — cleaning is safe for code, but next cargo build will take longer.' },
    { id: 'd2', cat: 'devbloat', title: 'storefront-app → Node.js Dependencies (node_modules)', path: '~/Projects/storefront-app/node_modules', refPath: '~/Projects/storefront-app', sizeMB: 2273, safety: 'safe', selected: true, explanation: 'Inactive project (last modified 94 days ago). Restorable anytime via npm install. Source code is untouched.' },
    { id: 'd3', cat: 'devbloat', title: 'vision-ocr → Python Virtual Environment (.venv/)', path: '~/Projects/ml-tools/vision-ocr/.venv', refPath: '~/Projects/ml-tools/vision-ocr', sizeMB: 985.5, safety: 'safe', selected: true, explanation: 'Inactive project (last modified 48 days ago). Local Python packages restorable via uv venv / pip install.' },
    { id: 'd4', cat: 'devbloat', title: 'desktop-studio → Node.js Dependencies (node_modules)', path: '~/Projects/desktop-studio/node_modules', refPath: '~/Projects/desktop-studio', sizeMB: 832.6, safety: 'review', selected: false, explanation: 'Recently active project (modified today). Unchecked by default so you don’t slow down today’s build.' },
    { id: 'd5', cat: 'devbloat', title: 'billing-portal → Node.js Dependencies (node_modules)', path: '~/Projects/billing-portal/node_modules', refPath: '~/Projects/billing-portal', sizeMB: 813.1, safety: 'review', selected: false, explanation: 'Recently active project (modified 3 days ago). Restorable anytime via pnpm install.' },
    { id: 'd6', cat: 'devbloat', title: 'starter-kit → Node.js Dependencies (node_modules)', path: '~/Projects/starter-kit/node_modules', refPath: '~/Projects/starter-kit', sizeMB: 541.5, safety: 'safe', selected: true, explanation: 'Inactive project (last modified 174 days ago). Safe to clean.' },
    { id: 'd7', cat: 'devbloat', title: 'docs-site → Next.js Build Cache (.next/)', path: '~/Projects/docs-site/.next', refPath: '~/Projects/docs-site', sizeMB: 506.2, safety: 'safe', selected: true, explanation: 'Inactive project (last modified 29 days ago). Next.js webpack cache recreated automatically on dev/build.' },
    { id: 'd8', cat: 'devbloat', title: 'admin-dashboard → Node.js Dependencies (node_modules)', path: '~/Projects/admin-dashboard/node_modules', refPath: '~/Projects/admin-dashboard', sizeMB: 473.7, safety: 'safe', selected: true, explanation: 'Inactive project (last modified 64 days ago). Safe to clean.' },

    // App Leftovers
    { id: 'a1', cat: 'leftovers', title: 'App Support Leftover: Steam', path: '~/Library/Application Support/Steam', sizeMB: 934.1, safety: 'safe', selected: false, explanation: 'No matching app found in /Applications (last modified 112 days ago). Verify via Reveal before removing.' },
    { id: 'a2', cat: 'leftovers', title: 'App Support Leftover: ZAP', path: '~/Library/Application Support/ZAP', sizeMB: 195.6, safety: 'safe', selected: false, explanation: 'Orphaned application support data left behind after uninstalling OWASP ZAP.' },
    { id: 'a3', cat: 'leftovers', title: 'App Support Leftover: CEF', path: '~/Library/Application Support/CEF', sizeMB: 121.0, safety: 'safe', selected: false, explanation: 'Orphaned Chromium Embedded Framework support cache from an uninstalled app.' },
    { id: 'a4', cat: 'leftovers', title: 'App Support Leftover: MacWall', path: '~/Library/Application Support/MacWall', sizeMB: 20.7, safety: 'safe', selected: false, explanation: 'No matching MacWall.app found in /Applications.' },
    { id: 'a5', cat: 'leftovers', title: 'App Support Leftover: Loom', path: '~/Library/Application Support/Loom', sizeMB: 11.8, safety: 'safe', selected: false, explanation: 'Leftover settings & cache from uninstalled Loom desktop app.' },

    // Duplicates (SHA-256 verified, anonymized paths)
    { id: 'u1', cat: 'duplicates', title: 'Vacation-2026/IMG_3601 2.MOV', path: '~/Downloads/Photos/Vacation-2026/IMG_3601 2.MOV', refPath: '~/Downloads/IMG_3601.MOV', sizeMB: 97.0, safety: 'review', selected: false, previewable: true, explanation: '100% identical byte-for-byte duplicate (SHA-256 verified) of ~/Downloads/IMG_3601.MOV. Original copy will be kept safe.' },
    { id: 'u2', cat: 'duplicates', title: 'Vacation-2026/IMG_4235 2.MOV', path: '~/Downloads/Photos/Vacation-2026/IMG_4235 2.MOV', refPath: '~/Downloads/Photos/Vacation-2026/IMG_4235.MOV', sizeMB: 18.8, safety: 'safe', selected: true, previewable: true, explanation: '100% identical SHA-256 duplicate of IMG_4235.MOV in the same folder.' },
    { id: 'u3', cat: 'duplicates', title: 'Course-Notes/Week-2/Architecture-Slides.pdf', path: '~/Downloads/Course-Notes/Week-2/Architecture-Slides.pdf', refPath: '~/Downloads/Course-Notes/Lecture-Slides/Architecture-Slides.pdf', sizeMB: 2.1, safety: 'review', selected: false, previewable: true, explanation: '100% identical SHA-256 duplicate located inside a nested subfolder.' },
    { id: 'u4', cat: 'duplicates', title: 'Vacation-2026/IMG_4223(1).HEIC', path: '~/Downloads/Photos/Vacation-2026/IMG_4223(1).HEIC', refPath: '~/Downloads/Photos/Vacation-2026/IMG_4223.HEIC', sizeMB: 1.9, safety: 'safe', selected: true, previewable: true, explanation: '100% identical SHA-256 duplicate of IMG_4223.HEIC. Original copy kept safe.' },
    { id: 'u5', cat: 'duplicates', title: 'Vacation-2026/IMG_4224(1).HEIC', path: '~/Downloads/Photos/Vacation-2026/IMG_4224(1).HEIC', refPath: '~/Downloads/Photos/Vacation-2026/IMG_4224.HEIC', sizeMB: 1.9, safety: 'safe', selected: true, previewable: true, explanation: '100% identical SHA-256 duplicate of IMG_4224.HEIC. Original copy kept safe.' },

    // Archives & Installers
    { id: 'i1', cat: 'installers', title: 'media-pack-20260624T130617Z-3-001.zip', path: '~/Downloads/media-pack-20260624T130617Z-3-001.zip', refPath: '~/Downloads/media-pack', sizeMB: 1054, safety: 'safe', selected: true, explanation: 'Already extracted into folder "media-pack" in Downloads. Keeping the .zip wastes space.' },
    { id: 'i2', cat: 'installers', title: 'media-pack-20260806T053418Z-1-001.zip', path: '~/Downloads/media-pack-20260806T053418Z-1-001.zip', refPath: '~/Downloads/media-pack', sizeMB: 1054, safety: 'safe', selected: true, explanation: 'Duplicate export already extracted into folder "media-pack" in Downloads.' },
    { id: 'i3', cat: 'installers', title: '.com.google.Chrome.sLzhVX', path: '~/Downloads/.com.google.Chrome.sLzhVX', sizeMB: 224.1, safety: 'safe', selected: true, explanation: 'Abandoned / incomplete browser temporary download file.' },
    { id: 'i4', cat: 'installers', title: 'Install-Studio-arm64.dmg', path: '~/Downloads/Install-Studio-arm64.dmg', sizeMB: 110.2, safety: 'safe', selected: true, explanation: 'macOS app installer disk image (.dmg). Safe to remove once the app is installed in /Applications.' },
    { id: 'i5', cat: 'installers', title: 'Lecture-Slides.zip', path: '~/Downloads/Lecture-Slides.zip', refPath: '~/Downloads/Course-Notes/Lecture-Slides', sizeMB: 16.6, safety: 'safe', selected: true, explanation: 'Already extracted into folder "Course-Notes/Lecture-Slides".' },
    { id: 'i6', cat: 'installers', title: 'apache-tomcat-9.0.100.tar.gz', path: '~/Downloads/apache-tomcat-9.0.100.tar.gz', refPath: '~/Downloads/apache-tomcat-9.0.100', sizeMB: 12.8, safety: 'safe', selected: true, explanation: 'Already extracted into folder "apache-tomcat-9.0.100" in Downloads.' },

    // Large Files (>50 MB)
    { id: 'l1', cat: 'large', title: 'IMG_1894.MOV', path: '~/Downloads/Videos/Trips/IMG_1894.MOV', sizeMB: 685.2, safety: 'review', selected: false, previewable: true, explanation: 'Large video file • Last modified 312 days ago. Use Preview (Quick Look) or Reveal before removing.' },
    { id: 'l2', cat: 'large', title: 'Product-Demo-4K.mp4', path: '~/Downloads/Exports/Product-Demo-4K.mp4', sizeMB: 620.1, safety: 'review', selected: false, previewable: true, explanation: 'Large video export • Last modified 143 days ago. Unchecked by default.' },
    { id: 'l3', cat: 'large', title: 'Keynote-Recording.mp4', path: '~/Downloads/media-pack/Keynote-Recording.mp4', sizeMB: 605.4, safety: 'review', selected: false, previewable: true, explanation: 'Large recording • Last modified 226 days ago.' },
    { id: 'l4', cat: 'large', title: 'IMG_6053.MOV', path: '~/Downloads/Videos/Archive/IMG_6053.MOV', sizeMB: 454.9, safety: 'review', selected: false, previewable: true, explanation: 'Large video file • Last modified 410 days ago.' },
    { id: 'l5', cat: 'large', title: 'Screen-Capture-2026.mov', path: '~/Movies/Screen-Capture-2026.mov', sizeMB: 384.7, safety: 'review', selected: false, previewable: true, explanation: 'Large screen recording • Last modified 95 days ago.' },

    // Trash & Backups
    { id: 't1', cat: 'trash', title: 'Diagnostic Logs: OneDrive', path: '~/Library/Logs/OneDrive', sizeMB: 137.4, safety: 'safe', selected: true, explanation: 'Old application diagnostic & crash log files in ~/Library/Logs. 100% safe to clean.' },
    { id: 't2', cat: 'trash', title: 'Diagnostic Logs: Google', path: '~/Library/Logs/Google', sizeMB: 61.9, safety: 'safe', selected: true, explanation: 'Old Google Updater diagnostic logs. 100% safe to clean.' },
    { id: 't3', cat: 'trash', title: 'Diagnostic Logs: CreativeCloud', path: '~/Library/Logs/CreativeCloud', sizeMB: 18.4, safety: 'safe', selected: true, explanation: 'Old Adobe Creative Cloud install & sync logs.' },
    { id: 't4', cat: 'trash', title: 'Diagnostic Logs: JetBrains', path: '~/Library/Logs/JetBrains', sizeMB: 13.7, safety: 'safe', selected: true, explanation: 'Old JetBrains IDE diagnostic logs.' },
    { id: 't5', cat: 'trash', title: 'Diagnostic Logs: Xcode', path: '~/Library/Logs/Xcode', sizeMB: 7.9, safety: 'safe', selected: true, explanation: 'Old Xcode build & crash logs.' }
  ],
  startupItems: [
    { id: 's1', name: 'Adobe Creative Cloud Background Daemon (com.adobe.acc.installer.v2)', scope: 'System LaunchDaemon', flags: ['Starts at login'], safety: 'safe', admin: true, plist: '/Library/LaunchDaemons/com.adobe.acc.installer.v2.plist', desc: 'Runs Adobe Creative Cloud updater processes at startup even when no Adobe app is open.' },
    { id: 's2', name: 'Adobe Creative Cloud Agent (com.adobe.ccxprocess)', scope: 'System LaunchAgent', flags: ['Starts at login'], safety: 'safe', admin: true, plist: '/Library/LaunchAgents/com.adobe.ccxprocess.plist', desc: 'Background Adobe Creative Cloud sync helper.' },
    { id: 's3', name: 'Microsoft AutoUpdate Agent (com.microsoft.update.agent)', scope: 'System LaunchAgent', flags: ['Starts at login'], safety: 'safe', admin: true, plist: '/Library/LaunchAgents/com.microsoft.update.agent.plist', desc: 'Periodically checks for Microsoft Office updates in the background.' },
    { id: 's4', name: 'Microsoft OneDrive Updater (com.microsoft.OneDriveStandaloneUpdater)', scope: 'System LaunchAgent', flags: ['Starts at login'], safety: 'safe', admin: true, plist: '/Library/LaunchAgents/com.microsoft.OneDriveStandaloneUpdater.plist', desc: 'Runs OneDrive background update checks and telemetry.' },
    { id: 's5', name: 'com.adobe.AdobeCreativeCloud (Orphaned / Leftover)', scope: 'User LaunchAgent', flags: ['App missing', 'Starts at login'], safety: 'safe', admin: false, orphan: true, plist: '~/Library/LaunchAgents/com.adobe.AdobeCreativeCloud.plist', desc: 'ORPHANED ITEM: The target app binary no longer exists on your Mac! Safe and recommended to remove.' },
    { id: 's6', name: 'AnyDesk Remote Desktop Service (com.philandro.anydesk.Frontend)', scope: 'System LaunchAgent', flags: ['Starts at login', 'Always running'], safety: 'review', admin: true, plist: '/Library/LaunchAgents/com.philandro.anydesk.Frontend.plist', desc: 'Keeps AnyDesk remote access service running at boot. Disable if only used occasionally.' },
    { id: 's7', name: 'MySQL Database Server Daemon (com.oracle.oss.mysql.mysqld)', scope: 'System LaunchDaemon', flags: ['Starts at login', 'Always running'], safety: 'review', admin: true, plist: '/Library/LaunchDaemons/com.oracle.oss.mysql.mysqld.plist', desc: 'Runs a full MySQL database server 24/7 in the background on every boot.' },
    { id: 's8', name: 'Docker Desktop Networking Daemon (com.docker.vmnetd)', scope: 'System LaunchDaemon', flags: ['Always running'], safety: 'keep', admin: true, plist: '/Library/LaunchDaemons/com.docker.vmnetd.plist', desc: 'Required by Docker Desktop for container socket & VM networking.' }
  ],
  processes: [
    { id: 'p1', name: 'Google Chrome', count: 18, cpu: 0.4, memMB: 2375, safety: 'review', path: '/Applications/Google Chrome.app', advice: 'Web browser running 18 tab/renderer processes (2.32 GB RAM). Closing unused tabs or quitting frees large amounts of RAM.' },
    { id: 'p2', name: 'Brave Browser', count: 12, cpu: 14.2, memMB: 1720, safety: 'review', path: '/Applications/Brave Browser.app', advice: 'Web browser running 12 helper processes (1.68 GB RAM).' },
    { id: 'p3', name: 'VS Code / IDE', count: 11, cpu: 2.1, memMB: 1540, safety: 'keep', path: '/Applications/Visual Studio Code.app', advice: 'Your active coding environment. Protected so your work isn’t interrupted.' },
    { id: 'p4', name: 'Safari / WebKit WebContent', count: 4, cpu: 2.4, memMB: 460.9, safety: 'review', path: '/System/Library/Frameworks/WebKit.framework', advice: '4 WebKit tab processes consuming 461 MB RAM.' },
    { id: 'p5', name: 'WhatsApp Desktop', count: 3, cpu: 1.2, memMB: 412.0, safety: 'safe', path: '/Applications/WhatsApp.app', advice: 'Idle background messaging app using 412 MB RAM. Safe to quit to free RAM immediately.' },
    { id: 'p6', name: 'macOS WindowServer (System Display)', count: 1, cpu: 18.6, memMB: 167.5, safety: 'keep', path: '/System/Library/PrivateFrameworks/SkyLight.framework', advice: 'Core macOS display compositor. Never quit.' },
    { id: 'p7', name: 'Grammarly Desktop', count: 2, cpu: 2.3, memMB: 150.4, safety: 'safe', path: '/Applications/Grammarly Desktop.app', advice: 'Background writing helper using 150 MB RAM. Safe to quit when not actively typing.' }
  ],
  sensors: [
    { name: 'CPU Efficiency Core 1', cat: 'CPU', base: 49 },
    { name: 'CPU Performance Core 1', cat: 'CPU', base: 49 },
    { name: 'CPU Performance Core 2', cat: 'CPU', base: 47 },
    { name: 'CPU Performance Core 3', cat: 'CPU', base: 46 },
    { name: 'CPU Cluster Die A', cat: 'CPU', base: 49 },
    { name: 'CPU Cluster Die B', cat: 'CPU', base: 47 },
    { name: 'Airflow Left', cat: 'Airflow', base: 40 },
    { name: 'Airflow Right', cat: 'Airflow', base: 42 },
    { name: 'Battery Sensor 1', cat: 'Battery', base: 34 },
    { name: 'Battery Sensor 2', cat: 'Battery', base: 34 },
    { name: 'Wi-Fi / Airport Proximity', cat: 'Wireless', base: 38 }
  ]
};
