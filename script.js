/* ==========================================================================
   ANSH PORTFOLIO - 8-BIT RETRO ARCADE BEHAVIOR LOGIC (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. System Sound state
    let soundEnabled = false;
    let overloadMode = false;

    // Elements
    const body = document.body;
    const navLinks = document.querySelectorAll('.arcade-nav-link');
    const sections = document.querySelectorAll('.arcade-section');
    const btnSound = document.getElementById('btn-retro-sound');
    const btnSelfDestruct = document.getElementById('btn-self-destruct');

    // Audio Assets
    const audioCoin = document.getElementById('audio-coin');
    const audioJump = document.getElementById('audio-jump');
    const audioHit = document.getElementById('audio-hit');
    const audioOver = document.getElementById('audio-over');
    const audioSelect = document.getElementById('audio-select');

    // Stats
    const hpValue = document.querySelector('.stat-row:nth-child(1) .stat-num');
    const hpBar = document.querySelector('.stat-row:nth-child(1) .stat-bar');

    // Helper to play sound
    function playAudio(audio) {
        if (soundEnabled && audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log("Audio play blocked", e));
        }
    }

    // 2. Navigation Tabs
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            playAudio(audioSelect);
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(s => s.classList.remove('active-section'));
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active-section');
            }
        });
    });

    // 3. Sound & System Controls
    btnSound.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        if (soundEnabled) {
            btnSound.innerHTML = '<i class="fa-solid fa-volume-high text-green"></i>';
            playAudio(audioCoin);
        } else {
            btnSound.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        }
    });

    btnSelfDestruct.addEventListener('click', () => {
        overloadMode = !overloadMode;
        body.classList.toggle('overload-mode');
        playAudio(audioHit);

        if (overloadMode) {
            btnSelfDestruct.textContent = "NORMALIZE";
            btnSelfDestruct.classList.add('blink-text');
            if (hpValue && hpBar) {
                hpValue.textContent = "01/100";
                hpBar.style.width = "1%";
            }
        } else {
            btnSelfDestruct.textContent = "OVERLOAD";
            btnSelfDestruct.classList.remove('blink-text');
            if (hpValue && hpBar) {
                hpValue.textContent = "100/100";
                hpBar.style.width = "100%";
            }
        }
    });

    // 4. Inventory Inspect System
    const inventoryData = {
        'item-python': {
            title: "Python Blade // Weapon Loadout",
            stats: "Attack Power: +99 Automation | Mana: -12 Flasks",
            desc: "A custom weapon forged to automate recon loops. Integrated functions support async subdomain resolving, web-crawler mapping, and raw packet validation. Bypasses repetitive manual tests completely."
        },
        'item-bash': {
            title: "Bash Shield // System Guard",
            stats: "Defense Power: +85 Shell-Speed | CoolDown: 2s",
            desc: "Formulated to automate local environments. Scrapes files using custom pipelines, sweeps configurations, and logs summaries straight into markdown structures."
        },
        'item-websec': {
            title: "Web Sec Scroll // Spellbook",
            stats: "Spell Power: +80 Analysis | Mana: -40 MP",
            desc: "Casts deep heuristic scans across logical web layers. Dissects HTTP headers (CSP, HSTS, X-Frame), checks cookie parameters, and targets authorization bypass configurations."
        },
        'item-eceact': {
            title: "RF Transmitter // Engineering Relic",
            stats: "Frequence Capture: +75 SDR | Hardware: ECE-ACT Spec",
            desc: "Designed at the intersection of communication signals and cybersecurity. Inspects local radio waves, audits IoT wireless encryptions, and maps protocol boundaries."
        }
    };

    const itemCards = document.querySelectorAll('.item-card');
    const inspectHeader = document.getElementById('inspect-header');
    const inspectContent = document.getElementById('inspect-content');

    itemCards.forEach(card => {
        const handler = () => {
            const data = inventoryData[card.id];
            if (data && inspectHeader && inspectContent) {
                playAudio(audioSelect);
                inspectHeader.innerHTML = `DATABASE RETRIEVED: <span class="text-yellow">${data.title}</span>`;
                inspectContent.innerHTML = `
                    <p class="text-green font-retro" style="font-size: 1.1rem; margin-bottom: 0.5rem;">${data.stats}</p>
                    <p class="text-white">${data.desc}</p>
                `;
            }
        };
        card.addEventListener('mouseenter', handler);
        card.addEventListener('click', handler);
    });

    // 5. Playable Canvas Game: "BUG HUNTER"
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    
    // Game state elements
    const screenInsertCoin = document.getElementById('screen-insert-coin');
    const screenGame = document.getElementById('screen-game');
    const screenGameOver = document.getElementById('screen-game-over');
    const gameScoreDisplay = document.getElementById('game-score');
    const gameLivesDisplay = document.getElementById('game-lives');
    const finalScoreDisplay = document.getElementById('final-score');
    const highScoreDisplay = document.getElementById('high-score');
    
    const btnInsertCoin = document.getElementById('btn-insert-coin');
    const btnGameRetry = document.getElementById('btn-game-retry');
    
    // Joystick elements
    const joystickKnob = document.getElementById('joystick-knob');
    const ctrlLeft = document.getElementById('ctrl-left');
    const ctrlRight = document.getElementById('ctrl-right');
    const ctrlAction = document.getElementById('ctrl-action');

    let gameRunning = false;
    let score = 0;
    let lives = 3;
    let highscore = parseInt(localStorage.getItem('ansh_arcade_highscore') || '0');
    
    // Game objects
    let player = {
        x: 0,
        y: 0,
        width: 60,
        height: 12,
        speed: 8
    };

    let projectiles = [];
    let projectileSpawnTimer = 0;
    let keyState = {};

    // Setup canvas sizing
    function resizeCanvas() {
        if (canvas) {
            canvas.width = canvas.parentElement.clientWidth - 32;
            canvas.height = canvas.parentElement.clientHeight - 60;
            player.x = canvas.width / 2 - player.width / 2;
            player.y = canvas.height - 25;
        }
    }
    
    window.addEventListener('resize', resizeCanvas);

    // Initial load highscore display
    if (highScoreDisplay) {
        highScoreDisplay.textContent = highscore;
    }

    // Keyboard handlers
    window.addEventListener('keydown', (e) => {
        keyState[e.key] = true;
    });
    window.addEventListener('keyup', (e) => {
        keyState[e.key] = false;
    });

    // Mobile buttons handlers
    let leftInterval, rightInterval;
    if (ctrlLeft && ctrlRight) {
        ctrlLeft.addEventListener('mousedown', () => {
            keyState['ArrowLeft'] = true;
            playAudio(audioSelect);
        });
        ctrlLeft.addEventListener('mouseup', () => { keyState['ArrowLeft'] = false; });
        ctrlLeft.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keyState['ArrowLeft'] = true;
            playAudio(audioSelect);
        });
        ctrlLeft.addEventListener('touchend', () => { keyState['ArrowLeft'] = false; });

        ctrlRight.addEventListener('mousedown', () => {
            keyState['ArrowRight'] = true;
            playAudio(audioSelect);
        });
        ctrlRight.addEventListener('mouseup', () => { keyState['ArrowRight'] = false; });
        ctrlRight.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keyState['ArrowRight'] = true;
            playAudio(audioSelect);
        });
        ctrlRight.addEventListener('touchend', () => { keyState['ArrowRight'] = false; });
    }

    if (ctrlAction) {
        ctrlAction.addEventListener('click', () => {
            playAudio(audioJump);
            // Action button triggers a brief shield visual or score bonus if game is running
            if (gameRunning) {
                player.width = 100; // Power Up shield!
                setTimeout(() => { player.width = 60; }, 1000);
            }
        });
    }

    // Interactive Joystick Knob Dragging
    if (joystickKnob) {
        let isDraggingJoystick = false;
        let startX = 0;

        joystickKnob.addEventListener('mousedown', (e) => {
            isDraggingJoystick = true;
            startX = e.clientX;
            joystickKnob.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDraggingJoystick) return;
            const diffX = e.clientX - startX;
            // Limit joystick travel to 20px left/right
            const limitedDiff = Math.max(-20, Math.min(20, diffX));
            joystickKnob.style.transform = `translate(${limitedDiff}px, 0)`;

            if (limitedDiff < -5) {
                keyState['ArrowLeft'] = true;
                keyState['ArrowRight'] = false;
            } else if (limitedDiff > 5) {
                keyState['ArrowRight'] = true;
                keyState['ArrowLeft'] = false;
            } else {
                keyState['ArrowLeft'] = false;
                keyState['ArrowRight'] = false;
            }
        });

        window.addEventListener('mouseup', () => {
            if (isDraggingJoystick) {
                isDraggingJoystick = false;
                joystickKnob.style.transform = `translate(0, 0)`;
                joystickKnob.style.cursor = 'grab';
                keyState['ArrowLeft'] = false;
                keyState['ArrowRight'] = false;
            }
        });

        // Touch support for Joystick
        joystickKnob.addEventListener('touchstart', (e) => {
            isDraggingJoystick = true;
            startX = e.touches[0].clientX;
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDraggingJoystick) return;
            const diffX = e.touches[0].clientX - startX;
            const limitedDiff = Math.max(-20, Math.min(20, diffX));
            joystickKnob.style.transform = `translate(${limitedDiff}px, 0)`;

            if (limitedDiff < -5) {
                keyState['ArrowLeft'] = true;
                keyState['ArrowRight'] = false;
            } else if (limitedDiff > 5) {
                keyState['ArrowRight'] = true;
                keyState['ArrowLeft'] = false;
            } else {
                keyState['ArrowLeft'] = false;
                keyState['ArrowRight'] = false;
            }
        });

        window.addEventListener('touchend', () => {
            if (isDraggingJoystick) {
                isDraggingJoystick = false;
                joystickKnob.style.transform = `translate(0, 0)`;
                keyState['ArrowLeft'] = false;
                keyState['ArrowRight'] = false;
            }
        });
    }

    // Start Game Function
    function startGame() {
        playAudio(audioCoin);
        resizeCanvas();
        
        // Update screens
        screenInsertCoin.classList.remove('active-screen');
        screenGameOver.classList.remove('active-screen');
        screenGame.classList.add('active-screen');
        
        score = 0;
        lives = 3;
        projectiles = [];
        projectileSpawnTimer = 0;
        gameRunning = true;
        
        updateHUD();
        requestAnimationFrame(gameLoop);
    }

    function updateHUD() {
        if (gameScoreDisplay) {
            gameScoreDisplay.textContent = score.toString().padStart(5, '0');
        }
        if (gameLivesDisplay) {
            gameLivesDisplay.textContent = '❤'.repeat(lives);
        }
    }

    // Core Game Loop
    function gameLoop() {
        if (!gameRunning) return;
        
        update();
        draw();
        
        requestAnimationFrame(gameLoop);
    }

    function update() {
        // Player Movement
        if (keyState['ArrowLeft'] || keyState['a']) {
            player.x = Math.max(0, player.x - player.speed);
        }
        if (keyState['ArrowRight'] || keyState['d']) {
            player.x = Math.min(canvas.width - player.width, player.x + player.speed);
        }
        
        // Spawn projectiles (bugs / firewalls)
        projectileSpawnTimer++;
        if (projectileSpawnTimer > 35) { // every 35 ticks
            projectileSpawnTimer = 0;
            const isFirewall = Math.random() < 0.35; // 35% chance firewall
            projectiles.push({
                x: Math.random() * (canvas.width - 20),
                y: -20,
                width: 20,
                height: 20,
                speed: 3 + Math.random() * 4,
                isFirewall: isFirewall
            });
        }
        
        // Update Projectiles
        for (let i = projectiles.length - 1; i >= 0; i--) {
            let p = projectiles[i];
            p.y += p.speed;
            
            // Collision Detection
            if (p.x < player.x + player.width &&
                p.x + p.width > player.x &&
                p.y < player.y + player.height &&
                p.y + p.height > player.y) {
                
                // Collision!
                projectiles.splice(i, 1);
                
                if (p.isFirewall) {
                    lives--;
                    playAudio(audioHit);
                    updateHUD();
                    
                    // Trigger dynamic screen shake class temporarily
                    body.classList.add('overload-mode');
                    setTimeout(() => {
                        if (!overloadMode) body.classList.remove('overload-mode');
                    }, 200);

                    if (lives <= 0) {
                        endGame();
                    }
                } else {
                    score += 10;
                    playAudio(audioJump);
                    updateHUD();
                }
                continue;
            }
            
            // Out of bounds
            if (p.y > canvas.height) {
                projectiles.splice(i, 1);
            }
        }
    }

    function draw() {
        if (!ctx) return;
        
        // Clear canvas
        ctx.fillStyle = '#07040f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid lines (retro backdrop)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Draw Player Ship / Platform
        ctx.fillStyle = overloadMode ? '#ff0055' : '#00ff66';
        // Pixel style double border
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.fillStyle = '#000';
        ctx.fillRect(player.x + 4, player.y + 4, player.width - 8, player.height - 8);
        ctx.fillStyle = overloadMode ? '#ff0055' : '#00ff66';
        ctx.fillRect(player.x + 8, player.y + 2, player.width - 16, player.height - 4);
        
        // Label ANSH inside player block
        ctx.fillStyle = '#fff';
        ctx.font = '8px Courier New';
        ctx.fillText('ANSH', player.x + (player.width / 2) - 10, player.y + 9);

        // Draw Projectiles
        projectiles.forEach(p => {
            if (p.isFirewall) {
                // Draw red firewall block
                ctx.fillStyle = '#ff3366';
                ctx.fillRect(p.x, p.y, p.width, p.height);
                ctx.fillStyle = '#000';
                ctx.fillRect(p.x + 4, p.y + 4, p.width - 8, p.height - 8);
                // Core
                ctx.fillStyle = '#ff3366';
                ctx.fillRect(p.x + 8, p.y + 8, p.width - 16, p.height - 16);
            } else {
                // Draw green bug block (spider shape mock-pixel)
                ctx.fillStyle = '#00ff66';
                ctx.fillRect(p.x + 4, p.y + 4, 12, 12);
                // Legs
                ctx.fillRect(p.x, p.y + 2, 4, 2);
                ctx.fillRect(p.x + 16, p.y + 2, 4, 2);
                ctx.fillRect(p.x, p.y + 8, 4, 2);
                ctx.fillRect(p.x + 16, p.y + 8, 4, 2);
                ctx.fillRect(p.x, p.y + 14, 4, 2);
                ctx.fillRect(p.x + 16, p.y + 14, 4, 2);
            }
        });
    }

    function endGame() {
        gameRunning = false;
        playAudio(audioOver);
        
        // High score handling
        if (score > highscore) {
            highscore = score;
            localStorage.setItem('ansh_arcade_highscore', highscore.toString());
        }
        
        // Update displays
        if (finalScoreDisplay) finalScoreDisplay.textContent = score;
        if (highScoreDisplay) highScoreDisplay.textContent = highscore;
        
        screenGame.classList.remove('active-screen');
        screenGameOver.classList.add('active-screen');
    }

    // Bind Button Clicks to Start
    if (btnInsertCoin) {
        btnInsertCoin.addEventListener('click', startGame);
    }
    if (btnGameRetry) {
        btnGameRetry.addEventListener('click', startGame);
    }
});
