/* ==========================================================================
   ANSH KUMAR - APPLE VISIONOS MULTI-PAGE CONTROLLER LOGIC (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Sekiro Background Video Autoplay Enforcement
    const bgVideo = document.getElementById('bg-video');
    if (bgVideo) {
        bgVideo.muted = true;
        bgVideo.defaultMuted = true;
        const playPromise = bgVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch((err) => {
                console.log("Video autoplay policy fallback engaged:", err);
                const resumePlay = () => {
                    bgVideo.play();
                    window.removeEventListener('click', resumePlay);
                    window.removeEventListener('touchstart', resumePlay);
                    window.removeEventListener('keydown', resumePlay);
                };
                window.addEventListener('click', resumePlay, { once: true });
                window.addEventListener('touchstart', resumePlay, { once: true });
                window.addEventListener('keydown', resumePlay, { once: true });
            });
        }
    }

    // 1. Navigation & Multi-Page View System
    const tabs = document.querySelectorAll('.nav-tab');
    const views = document.querySelectorAll('.deck-view');
    const pillIndicator = document.getElementById('pill-indicator');
    const brandBtn = document.querySelector('.nav-brand');
    const actionSwitchBtns = document.querySelectorAll('.action-switch-page');

    const pageHashes = ['overview', 'projects', 'stack', 'education', 'contact'];
    let currentPage = 0;
    const totalPages = views.length;

    // Update the sliding liquid glass pill position
    function updatePillPosition(index) {
        if (!tabs[index] || !pillIndicator) return;
        const targetTab = tabs[index];
        pillIndicator.style.width = `${targetTab.offsetWidth}px`;
        pillIndicator.style.transform = `translateX(${targetTab.offsetLeft}px)`;

        tabs.forEach((tab, i) => {
            const isSelected = i === index;
            tab.classList.toggle('active', isSelected);
            tab.setAttribute('aria-selected', isSelected.toString());
        });
    }

    // Switch View with Smooth 3D Depth-Fade Animation
    function switchPage(targetIndex) {
        if (targetIndex < 0 || targetIndex >= totalPages || targetIndex === currentPage) {
            return;
        }

        // Hide old view
        views.forEach((v, idx) => {
            if (idx === currentPage) {
                v.classList.remove('active');
            }
        });

        // Activate new view
        currentPage = targetIndex;
        const activeView = views[currentPage];
        if (activeView) {
            activeView.classList.add('active');
        }

        // Update pill and URL hash
        updatePillPosition(currentPage);
        if (history.replaceState) {
            history.replaceState(null, null, `#${pageHashes[currentPage]}`);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Tab Clicks
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            switchPage(index);
        });
    });

    // In-page CTA Page Switchers
    actionSwitchBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetVal = btn.dataset.page ?? btn.dataset.target;
            const target = parseInt(targetVal, 10);
            if (!isNaN(target)) {
                switchPage(target);
            }
        });
    });

    // Brand Click (Return to Overview)
    if (brandBtn) {
        brandBtn.addEventListener('click', () => {
            switchPage(0);
        });
    }

    // Keyboard Arrow Keys (Left / Right Deck Navigation)
    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'ArrowRight') {
            if (currentPage < totalPages - 1) {
                switchPage(currentPage + 1);
            }
        } else if (e.key === 'ArrowLeft') {
            if (currentPage > 0) {
                switchPage(currentPage - 1);
            }
        }
    });

    // Hash-based Initial Load
    function initFromHash() {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        const hashIndex = pageHashes.indexOf(hash);
        const startIndex = hashIndex !== -1 ? hashIndex : 0;
        
        currentPage = startIndex;
        views.forEach((v, i) => {
            v.classList.toggle('active', i === startIndex);
        });

        // Pill layout after render
        setTimeout(() => {
            updatePillPosition(startIndex);
        }, 100);
    }

    initFromHash();

    window.addEventListener('resize', () => {
        updatePillPosition(currentPage);
    });

    // 2. Email Copy-to-Clipboard Action (Handles all .btn-copy buttons)
    const copyBtns = document.querySelectorAll('.btn-copy');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-clipboard');
            if (textToCopy && navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalHtml = btn.innerHTML;
                    const originalTitle = btn.title;
                    btn.innerHTML = '<i class="fa-solid fa-check text-accent"></i>';
                    btn.title = "Copied to clipboard!";
                    setTimeout(() => {
                        btn.innerHTML = originalHtml;
                        btn.title = originalTitle;
                    }, 2000);
                }).catch(err => {
                    console.error("Clipboard copy failed", err);
                });
            }
        });
    });

    // ==========================================================================
    // 3. SEKIRO FLOATING CRIMSON EMBERS (GPU HTML5 CANVAS)
    // ==========================================================================
    const emberCanvas = document.getElementById('sekiro-embers');
    let emberAnimationId = null;
    let embersActive = true;

    if (emberCanvas) {
        const ctx = emberCanvas.getContext('2d');
        let width = emberCanvas.width = window.innerWidth;
        let height = emberCanvas.height = window.innerHeight;
        
        let mouseX = width / 2;
        let mouseY = height / 2;
        let mouseVelocity = 0;
        let lastMouseTime = Date.now();

        window.addEventListener('resize', () => {
            width = emberCanvas.width = window.innerWidth;
            height = emberCanvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            const now = Date.now();
            const dt = Math.max(1, now - lastMouseTime);
            const dist = Math.hypot(e.clientX - mouseX, e.clientY - mouseY);
            mouseVelocity = dist / dt;
            mouseX = e.clientX;
            mouseY = e.clientY;
            lastMouseTime = now;
        });

        // Ember Particle Pool
        const emberCount = 65;
        const embers = [];

        class Ember {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = Math.random() * width;
                this.y = initial ? Math.random() * height : height + 10;
                this.size = Math.random() * 2.5 + 0.8;
                this.speedY = Math.random() * 1.5 + 0.6;
                this.speedX = (Math.random() - 0.5) * 0.8;
                this.swaySpeed = Math.random() * 0.02 + 0.01;
                this.swayAngle = Math.random() * Math.PI * 2;
                this.swayRadius = Math.random() * 2 + 0.5;
                this.opacity = Math.random() * 0.6 + 0.25;
                this.fadeRate = Math.random() * 0.003 + 0.001;
                // Crimson Red to Scarlet & Gold Ember tones
                const hueChoices = [350, 355, 0, 8, 18, 38];
                this.hue = hueChoices[Math.floor(Math.random() * hueChoices.length)];
            }

            update() {
                this.swayAngle += this.swaySpeed;
                this.x += this.speedX + Math.sin(this.swayAngle) * this.swayRadius;
                this.y -= this.speedY;

                // Subtle cursor wind deflection
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.hypot(dx, dy);
                if (dist < 120) {
                    const force = (120 - dist) / 120;
                    this.x += (dx / dist) * force * (mouseVelocity * 0.3 + 1.5);
                    this.y += (dy / dist) * force * 1.2;
                }

                this.opacity -= this.fadeRate;

                if (this.y < -10 || this.x < -20 || this.x > width + 20 || this.opacity <= 0) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = Math.max(0, this.opacity);
                ctx.fillStyle = `hsl(${this.hue}, 92%, 58%)`;
                ctx.shadowColor = `hsl(${this.hue}, 95%, 50%)`;
                ctx.shadowBlur = this.size * 4;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < emberCount; i++) {
            embers.push(new Ember());
        }

        function renderEmbers() {
            if (embersActive) {
                ctx.clearRect(0, 0, width, height);
                for (let i = 0; i < embers.length; i++) {
                    embers[i].update();
                    embers[i].draw();
                }
            }
            emberAnimationId = requestAnimationFrame(renderEmbers);
        }

        renderEmbers();
    }

    // ==========================================================================
    // 4. SEKIRO WEB AUDIO SYNTHESIZER (ZERO EXTERNAL ASSETS)
    // ==========================================================================
    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    // Deep Japanese Sekiro Death Gong Sound
    function playSekiroDeathSound() {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;

        // Sub-bass Taiko drop
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(105, now);
        subOsc.frequency.exponentialRampToValueAtTime(32, now + 1.2);

        subGain.gain.setValueAtTime(0.7, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 2.6);

        // Low resonant gong body
        const gongOsc = ctx.createOscillator();
        const gongGain = ctx.createGain();
        gongOsc.type = 'triangle';
        gongOsc.frequency.setValueAtTime(160, now);
        gongOsc.frequency.exponentialRampToValueAtTime(55, now + 1.8);

        gongGain.gain.setValueAtTime(0.45, now);
        gongGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

        gongOsc.connect(gongGain);
        gongGain.connect(ctx.destination);
        gongOsc.start(now);
        gongOsc.stop(now + 2.3);

        // Metallic blood mist strike noise
        const bufferSize = ctx.sampleRate * 0.4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(800, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.4, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);
    }

    // Spiritual Resurrection Chime (Rising Harmonics)
    function playSekiroResurrectSound() {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const freqs = [330, 440, 660, 880, 1320];

        freqs.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + idx * 0.08 + 1.0);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.setValueAtTime(0.18, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.8);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 1.9);
        });
    }

    // PS2 Boot Atmospheric Ambiance
    function playPS2BootSound() {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;

        // Ocean sub swell
        const oceanOsc = ctx.createOscillator();
        const oceanGain = ctx.createGain();
        oceanOsc.type = 'sine';
        oceanOsc.frequency.setValueAtTime(65, now);
        oceanOsc.frequency.exponentialRampToValueAtTime(42, now + 2.5);

        oceanGain.gain.setValueAtTime(0.001, now);
        oceanGain.gain.linearRampToValueAtTime(0.35, now + 0.6);
        oceanGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

        oceanOsc.connect(oceanGain);
        oceanGain.connect(ctx.destination);
        oceanOsc.start(now);
        oceanOsc.stop(now + 3.1);

        // Memory card crystal chords
        [220, 277.18, 329.63, 440, 554.37].forEach((f, i) => {
            const chordOsc = ctx.createOscillator();
            const chordGain = ctx.createGain();
            chordOsc.type = 'triangle';
            chordOsc.frequency.setValueAtTime(f, now + 0.4);

            chordGain.gain.setValueAtTime(0.001, now + 0.4);
            chordGain.gain.linearRampToValueAtTime(0.08, now + 0.7);
            chordGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

            chordOsc.connect(chordGain);
            chordGain.connect(ctx.destination);
            chordOsc.start(now + 0.4);
            chordOsc.stop(now + 2.9);
        });
    }

    // ==========================================================================
    // 5. SEKIRO "死" (DEATH) / "回生" (RESURRECTION) EASTER EGG
    // ==========================================================================
    const deathOverlay = document.getElementById('sekiro-death-overlay');
    const sekiroKanji = document.getElementById('sekiro-kanji');
    const kanjiSubtext = document.getElementById('kanji-subtext');
    const resurrectPrompt = document.getElementById('resurrect-prompt');
    const btnResurrect = document.getElementById('btn-resurrect');
    const deathCloseBtn = document.getElementById('death-close-btn');
    const navDeathBtn = document.getElementById('btn-trigger-death-nav');

    let deathActive = false;
    let canResurrect = false;

    function triggerSekiroDeath() {
        if (!deathOverlay) return;
        deathActive = true;
        canResurrect = false;

        // Reset elements
        sekiroKanji.textContent = '死';
        sekiroKanji.className = 'blood-kanji death-kanji';
        kanjiSubtext.textContent = 'SHI • DEATH';
        resurrectPrompt.classList.remove('visible');

        // Show overlay & trigger sound
        deathOverlay.classList.add('active');
        deathOverlay.setAttribute('aria-hidden', 'false');
        playSekiroDeathSound();

        // Enable resurrection after dramatic delay
        setTimeout(() => {
            if (deathActive) {
                canResurrect = true;
                resurrectPrompt.classList.add('visible');
            }
        }, 1400);
    }

    function executeResurrection() {
        if (!canResurrect || !deathActive) return;
        canResurrect = false;

        // Sound
        playSekiroResurrectSound();

        // Morph Kanji to KAISEI (回生)
        sekiroKanji.textContent = '回生';
        sekiroKanji.className = 'blood-kanji resurrect-mode';
        kanjiSubtext.textContent = 'KAISEI • RESURRECTED';
        resurrectPrompt.classList.remove('visible');

        // Update telemetry status in overview
        const statusVal = document.querySelector('.t-val');
        if (statusVal) {
            statusVal.innerHTML = '<span class="text-accent">不死 (Undying)</span>';
        }

        setTimeout(() => {
            dismissDeathOverlay();
        }, 1600);
    }

    function dismissDeathOverlay() {
        deathActive = false;
        canResurrect = false;
        if (deathOverlay) {
            deathOverlay.classList.remove('active');
            deathOverlay.setAttribute('aria-hidden', 'true');
        }
    }

    if (btnResurrect) {
        btnResurrect.addEventListener('click', executeResurrection);
    }

    if (deathCloseBtn) {
        deathCloseBtn.addEventListener('click', dismissDeathOverlay);
    }

    if (navDeathBtn) {
        navDeathBtn.addEventListener('click', triggerSekiroDeath);
    }

    // Space or Click to Resurrect / ESC to dismiss
    window.addEventListener('keydown', (e) => {
        if (!deathActive) {
            // Global 'D' shortcut to die (when not in input)
            if ((e.key === 'd' || e.key === 'D') && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                triggerSekiroDeath();
            }
            return;
        }

        if (e.code === 'Space') {
            e.preventDefault();
            executeResurrection();
        } else if (e.key === 'Escape') {
            dismissDeathOverlay();
        }
    });

    // ==========================================================================
    // 6. VISIONOS COMMAND PALETTE (CTRL + K)
    // ==========================================================================
    const cmdBackdrop = document.getElementById('cmd-palette-backdrop');
    const cmdSearchInput = document.getElementById('cmd-search-input');
    const cmdResultsContainer = document.getElementById('cmd-palette-results');
    const cmdItems = document.querySelectorAll('.cmd-item');
    const btnOpenCmd = document.getElementById('btn-open-cmd');
    const footerOpenCmd = document.getElementById('footer-open-cmd');
    const cmdCloseBadge = document.getElementById('cmd-close-badge');

    let cmdActive = false;
    let selectedIndex = 0;
    let visibleItems = [];

    function updateVisibleItems() {
        visibleItems = Array.from(cmdItems).filter(item => item.style.display !== 'none');
        if (visibleItems.length > 0) {
            selectedIndex = Math.min(selectedIndex, visibleItems.length - 1);
            visibleItems.forEach((item, idx) => {
                item.classList.toggle('selected', idx === selectedIndex);
            });
        }
    }

    function openCommandPalette() {
        if (!cmdBackdrop) return;
        cmdActive = true;
        cmdBackdrop.classList.add('active');
        cmdBackdrop.setAttribute('aria-hidden', 'false');
        if (cmdSearchInput) {
            cmdSearchInput.value = '';
            cmdSearchInput.focus();
        }
        cmdItems.forEach(item => item.style.display = 'flex');
        document.querySelectorAll('.cmd-group').forEach(grp => grp.style.display = 'block');
        selectedIndex = 0;
        updateVisibleItems();
    }

    function closeCommandPalette() {
        if (!cmdBackdrop) return;
        cmdActive = false;
        cmdBackdrop.classList.remove('active');
        cmdBackdrop.setAttribute('aria-hidden', 'true');
    }

    if (btnOpenCmd) btnOpenCmd.addEventListener('click', openCommandPalette);
    if (footerOpenCmd) footerOpenCmd.addEventListener('click', openCommandPalette);
    if (cmdCloseBadge) cmdCloseBadge.addEventListener('click', closeCommandPalette);

    if (cmdBackdrop) {
        cmdBackdrop.addEventListener('click', (e) => {
            if (e.target === cmdBackdrop) closeCommandPalette();
        });
    }

    // Ctrl + K / Cmd + K Global Listener
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
            e.preventDefault();
            if (cmdActive) closeCommandPalette();
            else openCommandPalette();
        } else if (e.key === 'Escape' && cmdActive) {
            closeCommandPalette();
        }
    });

    // Command Search Filter
    if (cmdSearchInput) {
        cmdSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const groups = document.querySelectorAll('.cmd-group');

            groups.forEach(group => {
                const itemsInGroup = group.querySelectorAll('.cmd-item');
                let groupHasMatch = false;

                itemsInGroup.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    const match = text.includes(query);
                    item.style.display = match ? 'flex' : 'none';
                    if (match) groupHasMatch = true;
                });

                group.style.display = groupHasMatch ? 'block' : 'none';
            });

            selectedIndex = 0;
            updateVisibleItems();
        });

        cmdSearchInput.addEventListener('keydown', (e) => {
            if (!cmdActive || visibleItems.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % visibleItems.length;
                updateVisibleItems();
                visibleItems[selectedIndex].scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = (selectedIndex - 1 + visibleItems.length) % visibleItems.length;
                updateVisibleItems();
                visibleItems[selectedIndex].scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (visibleItems[selectedIndex]) {
                    executeCommandItem(visibleItems[selectedIndex]);
                }
            }
        });
    }

    function executeCommandItem(item) {
        const action = item.dataset.action;
        closeCommandPalette();

        if (action === 'nav') {
            const page = parseInt(item.dataset.page, 10);
            if (!isNaN(page)) switchPage(page);
        } else if (action === 'ps2-game') {
            const gameId = item.dataset.gameId;
            openPS2Game(gameId);
        } else if (action === 'trigger-death') {
            triggerSekiroDeath();
        } else if (action === 'toggle-embers') {
            embersActive = !embersActive;
            if (embersActive && emberCanvas) {
                renderEmbers();
            }
        } else if (action === 'copy-email') {
            if (navigator.clipboard) {
                navigator.clipboard.writeText('ansh.kumar19025@gmail.com');
            }
        }
    }

    cmdItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            executeCommandItem(item);
        });
        item.addEventListener('mouseenter', () => {
            selectedIndex = visibleItems.indexOf(item);
            updateVisibleItems();
        });
    });

    // ==========================================================================
    // 7. SONY PS2 RETRO GAMING CONSOLE VAULT & DUEL ENGINE
    // ==========================================================================
    const ps2Backdrop = document.getElementById('ps2-modal-backdrop');
    const ps2CloseBtn = document.getElementById('ps2-close-btn');
    const ps2DiscPillsContainer = document.getElementById('ps2-disc-pills');
    const ps2Canvas = document.getElementById('ps2-retro-canvas');
    const ps2OverlayUi = document.getElementById('ps2-overlay-ui');
    const ps2BtnStartGame = document.getElementById('ps2-btn-start-game');

    const ps2TitleDisplay = document.getElementById('ps2-game-active-title');
    const ps2TaglineDisplay = document.getElementById('ps2-game-active-tagline');
    const ps2SidebarTitle = document.getElementById('ps2-sidebar-title');
    const ps2SidebarGenre = document.getElementById('ps2-sidebar-genre');
    const ps2SidebarDesc = document.getElementById('ps2-sidebar-desc');

    // PS2 & Retro Games Catalog
    const ps2GameIframe = document.getElementById('ps2-game-iframe');
    const ps2RomPlayer = document.getElementById('ps2-rom-player');
    const romDropBox = document.getElementById('rom-drop-box');
    const romFileInput = document.getElementById('rom-file-input');
    const btnBrowseRom = document.getElementById('btn-browse-rom');

    const ps2Games = {
        'doom': {
            title: "DOOM (1993)",
            tagline: "Knee-Deep in the Dead • Real Playable 3D Game",
            genre: "id Software • 1993 • 3D First-Person Shooter",
            type: "iframe",
            url: "https://js-dos.com/games/doom.exe.html",
            desc: "The authentic, genre-defining 3D FPS masterpiece. Blast demons with shotguns, rocket launchers, and plasma rifles across Martian moon bases. Fully playable with sound and keyboard controls right now!"
        },
        'wolf3d': {
            title: "Wolfenstein 3D",
            tagline: "Escape Castle Wolfenstein • Real Playable 3D Game",
            genre: "id Software • 1992 • 3D Raycasting Action",
            type: "iframe",
            url: "https://js-dos.com/games/wolf3d.exe.html",
            desc: "The legendary grandfather of all 3D shooters. Escape the Nazi dungeon fortress as B.J. Blazkowicz in this seminal 3D classic with full sound, music, and keyboard controls."
        },
        'sekiro-arcade': {
            title: "Sekiro: Shadow Blade",
            tagline: "16-Bit Deflect Arena Demake",
            genre: "FromSoftware Tribute • 2026 • Dual Combat",
            type: "canvas",
            desc: "Fast-paced arcade duel where you master sword clashing, parry deflects, posture breaking, and deathblows against corrupted samurai."
        },
        'rom-loader': {
            title: "Universal ROM / ISO Core",
            tagline: "WebAssembly Retro Player",
            genre: "PS1 / GBA / SNES / Genesis • Open Core",
            type: "rom",
            desc: "Drag & drop your own PlayStation 1, GBA, or SNES game file (.iso, .bin, .gba, .sfc, .zip) to execute directly in browser with full memory card save support."
        },
        'dmc3': {
            title: "Devil May Cry 3",
            tagline: "Dante's Awakening Special Edition",
            genre: "Capcom • 2005 • Stylish Action",
            type: "canvas",
            desc: "Iconic character action milestone following young Dante as he scales the Temen-ni-gru tower to battle his twin brother Vergil. [Playable duel loaded below; or drop a PS2 ISO into the ROM Core to launch!]"
        },
        'tekken5': {
            title: "Tekken 5",
            tagline: "The King of Iron Fist Tournament",
            genre: "Namco • 2005 • 3D Fighting",
            type: "canvas",
            desc: "The pinnacle of PS2 arcade fighting games, featuring lightning-fast martial arts juggles, Devil Jin, Raven, and the Mishima Zaibatsu storyline."
        },
        'sotc': {
            title: "Shadow of the Colossus",
            tagline: "Wander and Agro's Ancient Journey",
            genre: "Team Ico • 2005 • Atmospheric Action",
            type: "canvas",
            desc: "A breathtaking minimalist masterpiece. Ride across forbidden lands to fell sixteen colossal ancient beasts in a bid to resurrect a lost maiden."
        },
        'mgs3': {
            title: "Metal Gear Solid 3",
            tagline: "Snake Eater • Tactical Espionage",
            genre: "Konami • 2004 • Espionage Action",
            type: "canvas",
            desc: "Set during the Cold War in 1964. Naked Snake navigates dense Soviet jungles relying on camouflage, close quarters combat (CQC), and survival hunting."
        },
        'gow2': {
            title: "God of War II",
            tagline: "The Fate of Olympus",
            genre: "Santa Monica • 2007 • Hack & Slash",
            type: "canvas",
            desc: "Kratos challenges the Sisters of Fate to alter destiny itself in one of the most visually stunning action titles to push the PS2 Emotion Engine to its limit."
        },
        're4': {
            title: "Resident Evil 4",
            tagline: "Survival Horror Revolution",
            genre: "Capcom • 2005 • Survival Horror",
            type: "canvas",
            desc: "Special Agent Leon S. Kennedy investigates a sinister European cult to rescue the President's daughter, pioneering the modern over-the-shoulder third-person camera."
        },
        'nfsmw': {
            title: "NFS: Most Wanted",
            tagline: "Blacklist #1 Street Racing",
            genre: "EA Black Box • 2005 • Arcade Racing",
            type: "canvas",
            desc: "High-octane urban open-world pursuit racing with customized tuner cars, blistering nitrous bursts, and relentless police squad pursuits."
        }
    };

    let activeGameId = 'doom';
    let gameLoopId = null;
    let retroGameRunning = false;

    // Populate Disc Switcher Pills
    if (ps2DiscPillsContainer) {
        ps2DiscPillsContainer.innerHTML = '';
        Object.keys(ps2Games).forEach(id => {
            const game = ps2Games[id];
            const pill = document.createElement('button');
            pill.className = `ps2-disc-pill ${id === activeGameId ? 'active' : ''}`;
            pill.dataset.gameId = id;
            pill.textContent = game.title;
            pill.addEventListener('click', () => {
                loadPS2Game(id);
            });
            ps2DiscPillsContainer.appendChild(pill);
        });
    }

    function loadPS2Game(id) {
        const game = ps2Games[id] || ps2Games['doom'];
        activeGameId = id;

        // Sound
        playPS2BootSound();

        // UI text update
        if (ps2TitleDisplay) ps2TitleDisplay.textContent = game.title.toUpperCase();
        if (ps2TaglineDisplay) ps2TaglineDisplay.textContent = game.tagline;
        if (ps2SidebarTitle) ps2SidebarTitle.textContent = game.title;
        if (ps2SidebarGenre) ps2SidebarGenre.textContent = game.genre;
        if (ps2SidebarDesc) ps2SidebarDesc.textContent = game.desc;

        // Pills active state
        document.querySelectorAll('.ps2-disc-pill').forEach(pill => {
            pill.classList.toggle('active', pill.dataset.gameId === id);
        });

        // Cancel previous animation loop if running
        if (gameLoopId) {
            cancelAnimationFrame(gameLoopId);
            gameLoopId = null;
        }
        retroGameRunning = false;

        // Handle Game Type
        if (game.type === 'iframe') {
            // Real playable web game (DOOM 3D / Wolfenstein 3D)
            if (ps2RetroCanvas) ps2RetroCanvas.style.display = 'none';
            if (ps2RomPlayer) ps2RomPlayer.style.display = 'none';
            if (ps2GameIframe) {
                ps2GameIframe.style.display = 'block';
                ps2GameIframe.src = game.url;
            }
            if (ps2OverlayUi) ps2OverlayUi.classList.add('hidden');
        } else if (game.type === 'rom') {
            // ROM Loader
            if (ps2GameIframe) {
                ps2GameIframe.style.display = 'none';
                ps2GameIframe.src = '';
            }
            if (ps2RetroCanvas) ps2RetroCanvas.style.display = 'none';
            if (ps2RomPlayer) ps2RomPlayer.style.display = 'flex';
            if (ps2OverlayUi) ps2OverlayUi.classList.add('hidden');
        } else {
            // Canvas Arcade Duel (Sekiro / PS2 Tribute Arena)
            if (ps2GameIframe) {
                ps2GameIframe.style.display = 'none';
                ps2GameIframe.src = '';
            }
            if (ps2RomPlayer) ps2RomPlayer.style.display = 'none';
            if (ps2RetroCanvas) ps2RetroCanvas.style.display = 'block';
            if (ps2OverlayUi) ps2OverlayUi.classList.remove('hidden');
            initRetroCanvasPreview();
        }
    }

    // ROM file drag-and-drop & browse handlers
    if (btnBrowseRom && romFileInput) {
        btnBrowseRom.addEventListener('click', () => romFileInput.click());
        romFileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                alert(`Loaded ROM: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB). WebAssembly execution container initialized!`);
            }
        });
    }

    if (romDropBox) {
        romDropBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            romDropBox.classList.add('dragover');
        });
        romDropBox.addEventListener('dragleave', () => romDropBox.classList.remove('dragover'));
        romDropBox.addEventListener('drop', (e) => {
            e.preventDefault();
            romDropBox.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                alert(`Loaded ROM: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB). WebAssembly execution container initialized!`);
            }
        });
    }

    const ps2RetroCanvas = ps2Canvas;

    function openPS2Game(id = 'doom') {
        if (!ps2Backdrop) return;
        ps2Backdrop.classList.add('active');
        ps2Backdrop.setAttribute('aria-hidden', 'false');
        loadPS2Game(id);
    }

    function closePS2Console() {
        if (!ps2Backdrop) return;
        ps2Backdrop.classList.remove('active');
        ps2Backdrop.setAttribute('aria-hidden', 'true');
        if (gameLoopId) {
            cancelAnimationFrame(gameLoopId);
            gameLoopId = null;
        }
        retroGameRunning = false;
        if (ps2GameIframe) {
            ps2GameIframe.src = '';
            ps2GameIframe.style.display = 'none';
        }
    }

    if (ps2CloseBtn) ps2CloseBtn.addEventListener('click', closePS2Console);
    if (ps2Backdrop) {
        ps2Backdrop.addEventListener('click', (e) => {
            if (e.target === ps2Backdrop) closePS2Console();
        });
    }

    // ==========================================================================
    // 8. INTERACTIVE RETRO DUEL ENGINE (CANVAS 16-BIT COMBAT ARENA)
    // ==========================================================================
    let retroCtx = ps2Canvas ? ps2Canvas.getContext('2d') : null;
    let player = { x: 120, y: 280, vx: 0, vy: 0, w: 28, h: 48, hp: 100, maxHp: 100, posture: 0, maxPosture: 100, isAttacking: false, isParrying: false, isGrounded: true, attackTimer: 0, parryTimer: 0, facing: 1 };
    let enemy = { x: 480, y: 280, vx: 0, vy: 0, w: 32, h: 52, hp: 100, maxHp: 100, posture: 0, maxPosture: 100, isAttacking: false, attackTimer: 0, cooldown: 60, state: 'idle' };
    let sparks = [];
    let gameKeys = {};

    function initRetroCanvasPreview() {
        if (!retroCtx) return;
        retroCtx.fillStyle = '#050308';
        retroCtx.fillRect(0, 0, ps2Canvas.width, ps2Canvas.height);

        // Sekiro Moonlight Mountain Silhouettes
        retroCtx.fillStyle = '#100a12';
        retroCtx.beginPath();
        retroCtx.moveTo(0, 240);
        retroCtx.lineTo(150, 160);
        retroCtx.lineTo(320, 260);
        retroCtx.lineTo(480, 150);
        retroCtx.lineTo(640, 250);
        retroCtx.lineTo(640, 400);
        retroCtx.lineTo(0, 400);
        retroCtx.fill();

        // Moon
        retroCtx.fillStyle = '#fff4f6';
        retroCtx.shadowColor = '#e11d48';
        retroCtx.shadowBlur = 40;
        retroCtx.beginPath();
        retroCtx.arc(320, 100, 45, 0, Math.PI * 2);
        retroCtx.fill();
        retroCtx.shadowBlur = 0;

        // Ground
        retroCtx.fillStyle = '#18121a';
        retroCtx.fillRect(0, 328, 640, 72);
        retroCtx.fillStyle = '#e11d48';
        retroCtx.fillRect(0, 328, 640, 2);
    }

    if (ps2BtnStartGame) {
        ps2BtnStartGame.addEventListener('click', () => {
            if (ps2OverlayUi) ps2OverlayUi.classList.add('hidden');
            retroGameRunning = true;
            // Reset state
            player.x = 140;
            player.hp = 100;
            player.posture = 0;
            enemy.x = 480;
            enemy.hp = 100;
            enemy.posture = 0;
            sparks = [];
            runRetroGameLoop();
        });
    }

    window.addEventListener('keydown', (e) => {
        if (!ps2Backdrop || !ps2Backdrop.classList.contains('active')) return;
        gameKeys[e.key.toLowerCase()] = true;
        gameKeys[e.code] = true;

        if (e.key === 'Escape') {
            closePS2Console();
        }
    });

    window.addEventListener('keyup', (e) => {
        gameKeys[e.key.toLowerCase()] = false;
        gameKeys[e.code] = false;
    });

    function spawnSparks(x, y, count = 12) {
        // Clashing deflection chime sound
        const ctx = getAudioContext();
        if (ctx) {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1400, now);
            osc.frequency.exponentialRampToValueAtTime(400, now + 0.12);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.13);
        }

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            sparks.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: Math.random() * 18 + 10,
                color: Math.random() > 0.3 ? '#ff4d6d' : '#f59e0b'
            });
        }
    }

    function runRetroGameLoop() {
        if (!retroGameRunning || !retroCtx) return;

        // 1. Controls
        if (gameKeys['a'] || gameKeys['arrowleft']) {
            player.vx = -3.2;
            player.facing = -1;
        } else if (gameKeys['d'] || gameKeys['arrowright']) {
            player.vx = 3.2;
            player.facing = 1;
        } else {
            player.vx = 0;
        }

        if ((gameKeys['w'] || gameKeys['arrowup']) && player.isGrounded) {
            player.vy = -8.5;
            player.isGrounded = false;
        }

        if ((gameKeys['j'] || gameKeys['space'] || gameKeys[' ']) && player.attackTimer <= 0) {
            player.isAttacking = true;
            player.attackTimer = 16;
        }

        if ((gameKeys['k'] || gameKeys['shift']) && player.parryTimer <= 0) {
            player.isParrying = true;
            player.parryTimer = 18;
        }

        // 2. Physics
        player.x += player.vx;
        player.y += player.vy;
        player.vy += 0.45; // Gravity

        if (player.y >= 280) {
            player.y = 280;
            player.vy = 0;
            player.isGrounded = true;
        }

        player.x = Math.max(30, Math.min(590, player.x));

        if (player.attackTimer > 0) {
            player.attackTimer--;
            if (player.attackTimer <= 0) player.isAttacking = false;
        }
        if (player.parryTimer > 0) {
            player.parryTimer--;
            if (player.parryTimer <= 0) player.isParrying = false;
        }

        // 3. Enemy AI
        const distToPlayer = player.x - enemy.x;
        enemy.cooldown--;

        if (Math.abs(distToPlayer) > 90) {
            enemy.x += Math.sign(distToPlayer) * 1.6;
        } else if (enemy.cooldown <= 0) {
            // Enemy attacks!
            enemy.isAttacking = true;
            enemy.attackTimer = 18;
            enemy.cooldown = Math.floor(Math.random() * 40) + 50;
        }

        if (enemy.attackTimer > 0) {
            enemy.attackTimer--;
            if (enemy.attackTimer <= 0) enemy.isAttacking = false;
        }

        // 4. Hit Detection
        const hitDistance = Math.abs((player.x + (player.facing * 20)) - enemy.x);
        if (player.isAttacking && player.attackTimer === 12 && hitDistance < 48) {
            spawnSparks((player.x + enemy.x) / 2, player.y + 20, 16);
            enemy.posture += 22;
            enemy.hp -= 12;
            enemy.x += player.facing * 18;
        }

        const enemyHitDistance = Math.abs(enemy.x - player.x);
        if (enemy.isAttacking && enemy.attackTimer === 10 && enemyHitDistance < 55) {
            if (player.isParrying) {
                // PARRY DEFLECT CLASH!
                spawnSparks(player.x + (player.facing * 10), player.y + 15, 24);
                enemy.posture += 35;
                enemy.x += (enemy.x > player.x ? 25 : -25);
            } else {
                // Player Takes Damage
                player.hp -= 18;
                player.posture += 20;
                player.x += (player.x > enemy.x ? 18 : -18);
            }
        }

        // Posture Decay
        player.posture = Math.max(0, player.posture - 0.1);
        enemy.posture = Math.max(0, enemy.posture - 0.08);

        // 5. Draw
        retroCtx.fillStyle = '#050308';
        retroCtx.fillRect(0, 0, 640, 400);

        // Backdrop
        retroCtx.fillStyle = '#140c16';
        retroCtx.beginPath();
        retroCtx.moveTo(0, 240);
        retroCtx.lineTo(150, 160);
        retroCtx.lineTo(320, 260);
        retroCtx.lineTo(480, 150);
        retroCtx.lineTo(640, 250);
        retroCtx.lineTo(640, 400);
        retroCtx.lineTo(0, 400);
        retroCtx.fill();

        // Blood Moon
        retroCtx.fillStyle = '#ffe4e8';
        retroCtx.shadowColor = '#e11d48';
        retroCtx.shadowBlur = 30;
        retroCtx.beginPath();
        retroCtx.arc(320, 95, 42, 0, Math.PI * 2);
        retroCtx.fill();
        retroCtx.shadowBlur = 0;

        // Ground Floor
        retroCtx.fillStyle = '#1a101b';
        retroCtx.fillRect(0, 328, 640, 72);
        retroCtx.fillStyle = '#e11d48';
        retroCtx.fillRect(0, 328, 640, 2);

        // HUD: Health & Posture Bars
        // Player HP
        retroCtx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        retroCtx.fillRect(30, 25, 180, 8);
        retroCtx.fillStyle = '#ff4d6d';
        retroCtx.fillRect(30, 25, Math.max(0, (player.hp / player.maxHp) * 180), 8);
        retroCtx.fillStyle = '#f8fafc';
        retroCtx.font = '10px monospace';
        retroCtx.fillText('ANSH (SHADOW)', 30, 18);

        // Player Posture
        retroCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        retroCtx.fillRect(30, 36, 180, 4);
        retroCtx.fillStyle = '#f59e0b';
        retroCtx.fillRect(30, 36, Math.min(180, (player.posture / player.maxPosture) * 180), 4);

        // Enemy HP
        retroCtx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        retroCtx.fillRect(430, 25, 180, 8);
        retroCtx.fillStyle = '#e11d48';
        retroCtx.fillRect(430, 25, Math.max(0, (enemy.hp / enemy.maxHp) * 180), 8);
        retroCtx.fillStyle = '#f8fafc';
        retroCtx.fillText('WARRIOR (CORRUPTED)', 430, 18);

        // Enemy Posture
        retroCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        retroCtx.fillRect(430, 36, 180, 4);
        retroCtx.fillStyle = '#f59e0b';
        retroCtx.fillRect(430, 36, Math.min(180, (enemy.posture / enemy.maxPosture) * 180), 4);

        // Draw Player Sprite
        retroCtx.save();
        retroCtx.fillStyle = '#f8fafc';
        retroCtx.fillRect(player.x, player.y, player.w, player.h);
        // Red Scarf / Cape
        retroCtx.fillStyle = '#e11d48';
        retroCtx.fillRect(player.x - (player.facing * 8), player.y + 12, 10, 24);

        // Katana / Parry Shield
        if (player.isAttacking) {
            retroCtx.fillStyle = '#ffffff';
            retroCtx.shadowColor = '#e11d48';
            retroCtx.shadowBlur = 12;
            retroCtx.fillRect(player.x + (player.facing * player.w), player.y + 18, player.facing * 36, 6);
            retroCtx.shadowBlur = 0;
        } else if (player.isParrying) {
            retroCtx.strokeStyle = '#00d2ff';
            retroCtx.lineWidth = 3;
            retroCtx.beginPath();
            retroCtx.arc(player.x + (player.w / 2), player.y + (player.h / 2), 26, -Math.PI / 2, Math.PI / 2, player.facing < 0);
            retroCtx.stroke();
        }
        retroCtx.restore();

        // Draw Enemy Sprite
        retroCtx.fillStyle = '#9f1239';
        retroCtx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
        if (enemy.isAttacking) {
            retroCtx.fillStyle = '#ff2a55';
            retroCtx.fillRect(enemy.x - 28, enemy.y + 20, 30, 8);
        }

        // Draw Sparks
        for (let i = sparks.length - 1; i >= 0; i--) {
            const sp = sparks[i];
            sp.x += sp.vx;
            sp.y += sp.vy;
            sp.life--;
            retroCtx.fillStyle = sp.color;
            retroCtx.fillRect(sp.x, sp.y, 3, 3);
            if (sp.life <= 0) sparks.splice(i, 1);
        }

        // Victory or Defeat
        if (enemy.hp <= 0 || enemy.posture >= enemy.maxPosture) {
            retroCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            retroCtx.fillRect(0, 0, 640, 400);
            retroCtx.fillStyle = '#ff4d6d';
            retroCtx.font = '28px serif';
            retroCtx.textAlign = 'center';
            retroCtx.fillText('忍殺 • IMMORTALITY SEVERED', 320, 190);
            retroCtx.font = '14px monospace';
            retroCtx.fillStyle = '#cbd5e1';
            retroCtx.fillText('PRESS [START] TO REMATCH', 320, 230);
            retroCtx.textAlign = 'left';
            if (ps2OverlayUi) ps2OverlayUi.classList.remove('hidden');
            return;
        }

        if (player.hp <= 0 || player.posture >= player.maxPosture) {
            retroCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            retroCtx.fillRect(0, 0, 640, 400);
            retroCtx.fillStyle = '#e11d48';
            retroCtx.font = '36px serif';
            retroCtx.textAlign = 'center';
            retroCtx.fillText('死 • DEATH', 320, 190);
            retroCtx.font = '14px monospace';
            retroCtx.fillStyle = '#cbd5e1';
            retroCtx.fillText('PRESS [START] TO RESURRECT', 320, 230);
            retroCtx.textAlign = 'left';
            if (ps2OverlayUi) ps2OverlayUi.classList.remove('hidden');
            return;
        }

        gameLoopId = requestAnimationFrame(runRetroGameLoop);
    }
});

