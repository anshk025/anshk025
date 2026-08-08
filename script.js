/* ==========================================================================
   ANSH PORTFOLIO - CYBERSECURITY & AUTOMATION BEHAVIOR LOGIC (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Core State
    let systemSoundEnabled = false;
    let systemOverclocked = false;
    let matrixRainInterval = null;
    let matrixCanvas = null;

    // Elements
    const body = document.body;
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section-container');
    
    // Audio Elements
    const audioClick = document.getElementById('audio-click');
    const audioKeystroke = document.getElementById('audio-keystroke');
    const audioSuccess = document.getElementById('audio-success');
    const audioHologram = document.getElementById('audio-hologram');

    // Controls
    const btnSound = document.getElementById('btn-sound');
    const btnTheme = document.getElementById('btn-theme');
    const btnOverclock = document.getElementById('btn-overclock');
    const integrityValue = document.getElementById('integrity-value');

    // Terminal Elements
    const consoleInput = document.getElementById('console-input');
    const consoleHistory = document.getElementById('console-history');
    const consoleBody = document.getElementById('console-body');

    // Playback Scanner Elements
    const playgroundInput = document.getElementById('playground-input');
    const btnRunScan = document.getElementById('btn-run-scan');
    const scanStatus = document.getElementById('scan-status');
    const scanResultsContainer = document.getElementById('scan-results-container');
    const presetHeadersBtn = document.getElementById('preset-headers');
    const presetSecretsBtn = document.getElementById('preset-secrets');

    // Custom helper to play sound checks
    function playSound(audio) {
        if (systemSoundEnabled && audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log("Audio playback blocked", e));
        }
    }

    // 2. Navigation / Tab Switching
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            playSound(audioClick);
            
            // Remove active from all nav links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active to clicked link
            link.classList.add('active');

            // Hide all sections
            sections.forEach(sec => sec.classList.remove('active-section'));

            // Show corresponding section
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active-section');
                
                // Focus terminal if switched to console
                if (targetId === 'console-section' && consoleInput) {
                    setTimeout(() => consoleInput.focus(), 100);
                }
            }
        });
    });

    // 3. Audio & Control Toggles
    btnSound.addEventListener('click', () => {
        systemSoundEnabled = !systemSoundEnabled;
        if (systemSoundEnabled) {
            btnSound.innerHTML = '<i class="fa-solid fa-volume-high text-green"></i>';
            btnSound.classList.add('pulse');
            playSound(audioSuccess);
            audioHologram.volume = 0.15;
            audioHologram.play().catch(e => console.log("Ambient sound blocked", e));
        } else {
            btnSound.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            btnSound.classList.remove('pulse');
            audioHologram.pause();
        }
    });

    // Theme (Matrix View Switcher) - toggling bright tactical grid versus default deep dark
    btnTheme.addEventListener('click', () => {
        playSound(audioClick);
        body.classList.toggle('light-theme');
        if (body.classList.contains('light-theme')) {
            btnTheme.innerHTML = '<i class="fa-solid fa-eye text-cyan"></i>';
        } else {
            btnTheme.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
        }
    });

    // Overclock Easter Egg
    btnOverclock.addEventListener('click', () => {
        systemOverclocked = !systemOverclocked;
        body.classList.toggle('overclock-mode');
        playSound(audioSuccess);

        if (systemOverclocked) {
            btnOverclock.textContent = "DE-CLOCK";
            btnOverclock.classList.add('pulse');
            integrityValue.textContent = "138% OVERHEAT";
            integrityValue.className = "value pulse text-cyan"; // in overclock it displays neon red due to class mapping overrides
            
            // Random fluctuating integrity interval
            const integrityInterval = setInterval(() => {
                if (!systemOverclocked) {
                    clearInterval(integrityInterval);
                    return;
                }
                const randomVal = 130 + Math.floor(Math.random() * 20);
                integrityValue.textContent = `${randomVal}% CORE_TEMP`;
            }, 1000);
        } else {
            btnOverclock.textContent = "OVERCLOCK";
            btnOverclock.classList.remove('pulse');
            integrityValue.textContent = "100%";
            integrityValue.className = "value pulse text-green";
        }
    });

    // 4. Terminal Command Interpreter
    const commands = {
        help: () => {
            return `Available system routines:
  about    - Details on who I am and my engineering focus
  skills   - Technical skills mapping and ECE application vectors
  projects - Listing of security automation repositories
  contact  - Links to reach the system administrator
  matrix   - Triggers terminal digital rain visualization
  hack     - Execute standard vulnerability diagnostic script
  clear    - Clear console screen history`;
        },
        about: () => {
            return `[IDENTITY MODULE: ANSH]
------------------------------------------------------
ROLE:     2nd Year B.Tech Student (ECE-ACT)
CAMPUS:   Maharaja Agrasen Institute of Technology (MAIT), Delhi
MAJORS:   Electronics and Communication Engineering (Advanced Communication Tech)
FOCUS:    Cybersecurity, Penetration Testing, Automation Systems, Scripting
MINDSET:  Vibecoder. Focused on code logic flows, protocol security analysis,
          and building automated solutions instead of simply running tools.`;
        },
        skills: () => {
            return `[SPECIALIZATIONS MATRIX]
------------------------------------------------------
• Cyber Security & Web Auditing [████████░░] 80%
  - Web applications testing, Network packet tracing, Phishing defense simulation
• Automation & Scripting       [█████████░] 90%
  - Python security wrappers, asynchronous logic, Bash scripts, custom regex engines
• ECE-ACT Network Security     [███████░░░] 70%
  - RF packet capture analysis, Software Defined Radio (SDR) exploits, hardware channels`;
        },
        projects: () => {
            return `[PROJECT PIPELINES]
------------------------------------------------------
1. Subdomain Sentinel  - Async Python script targeting asset enumerations
2. VulnScanner Pipeline - Automated Bash workflow scheduling local diagnostics
3. RF Packet Sniffer    - ECE Hardware SDR integration logging local radio packet structures
4. VibeSinks Audit      - Static analysis utility grep scanning codebases for API issues

Type command 'hack' to simulate a diagnostic scan on a test target!`;
        },
        contact: () => {
            return `[COMMUNICATION CHANNELS]
------------------------------------------------------
GitHub Profile:   https://github.com/anshk011
Email Address:    ansh@mait-act.edu.in
Node Location:    Delhi, India

Feel free to connect or open issues on my automation repositories!`;
        },
        clear: () => {
            consoleHistory.innerHTML = '';
            return '';
        }
    };

    // Keystroke sound handler
    consoleInput.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== 'Shift' && e.key !== 'Control') {
            playSound(audioKeystroke);
        }
    });

    consoleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const inputVal = consoleInput.value.trim();
            consoleInput.value = '';
            
            if (inputVal === '') return;

            // Stop matrix rain if active
            stopMatrixRain();

            // Print command command line to history
            const userLine = document.createElement('div');
            userLine.className = 'console-line';
            userLine.innerHTML = `<span class="prompt">guest@anshk011:~ $</span> <span class="text-white">${escapeHtml(inputVal)}</span>`;
            consoleHistory.appendChild(userLine);

            const parts = inputVal.toLowerCase().split(' ');
            const cmd = parts[0];

            let response = '';
            if (cmd === 'clear') {
                commands.clear();
                playSound(audioSuccess);
                return;
            } else if (cmd === 'matrix') {
                startMatrixRain();
                response = 'Matrix rain initialized. Type any command to close.';
                playSound(audioSuccess);
            } else if (cmd === 'hack') {
                simulateSecurityScan();
                playSound(audioSuccess);
                return;
            } else if (commands[cmd]) {
                response = commands[cmd]();
                playSound(audioSuccess);
            } else {
                response = `bash: command not found: ${escapeHtml(cmd)}. Type 'help' to review directory routines.`;
            }

            if (response !== '') {
                const responseLine = document.createElement('div');
                responseLine.className = 'console-line text-muted';
                responseLine.innerHTML = response.replace(/\n/g, '<br>');
                consoleHistory.appendChild(responseLine);
            }

            // Scroll to bottom
            consoleBody.scrollTop = consoleBody.scrollHeight;
        }
    });

    // Helper to prevent HTML injections in terminal logs
    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // 5. Matrix Code Rain Simulator (Easter Egg)
    function startMatrixRain() {
        stopMatrixRain();
        
        matrixCanvas = document.createElement('canvas');
        matrixCanvas.id = 'matrix-canvas';
        matrixCanvas.style.position = 'absolute';
        matrixCanvas.style.top = '0';
        matrixCanvas.style.left = '0';
        matrixCanvas.style.width = '100%';
        matrixCanvas.style.height = '100%';
        matrixCanvas.style.opacity = '0.15';
        matrixCanvas.style.pointerEvents = 'none';
        consoleBody.appendChild(matrixCanvas);

        const ctx = matrixCanvas.getContext('2d');
        
        // Match sizing
        matrixCanvas.width = consoleBody.clientWidth;
        matrixCanvas.height = consoleBody.clientHeight;

        const columns = Math.floor(matrixCanvas.width / 16);
        const yPositions = Array(columns).fill(0);
        
        matrixRainInterval = setInterval(() => {
            ctx.fillStyle = 'rgba(5, 6, 8, 0.05)';
            ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            
            ctx.fillStyle = '#00ff66';
            ctx.font = '14px Courier New';
            
            for (let i = 0; i < yPositions.length; i++) {
                const char = String.fromCharCode(33 + Math.floor(Math.random() * 93));
                const x = i * 16;
                const y = yPositions[i];
                
                ctx.fillText(char, x, y);
                
                if (y > 100 + Math.random() * 10000) {
                    yPositions[i] = 0;
                } else {
                    yPositions[i] += 16;
                }
            }
        }, 33);
    }

    function stopMatrixRain() {
        if (matrixRainInterval) {
            clearInterval(matrixRainInterval);
            matrixRainInterval = null;
        }
        if (matrixCanvas && matrixCanvas.parentNode) {
            matrixCanvas.parentNode.removeChild(matrixCanvas);
            matrixCanvas = null;
        }
    }

    // 6. Mock Hack Automation Process
    function simulateSecurityScan() {
        const lines = [
            "Initiating remote vulnerability probe...",
            "Resolving target domain [sandbox.mait-act.edu.in] -> 192.168.43.10",
            "Port scanning: TCP 80, 443, 8080 (Filtered)",
            "Auditing security handshake certificates...",
            "Injecting pilot payloads into endpoint /api/v1/auth/reset...",
            "Analyzing API state latency for timing race conditions...",
            "WARNING: Host header validation missing on password reset callback.",
            "WARNING: Hardcoded JWT sign signature detected on client side bundle.",
            "Compilation diagnostic completed. 2 vulnerabilities cataloged.",
            "Run 'help' for directory menus."
        ];

        let index = 0;
        
        function printNextLine() {
            if (index < lines.length) {
                const lineDiv = document.createElement('div');
                lineDiv.className = 'console-line';
                
                if (lines[index].includes("WARNING")) {
                    lineDiv.className += ' text-yellow';
                } else if (lines[index].includes("completed")) {
                    lineDiv.className += ' text-green';
                } else {
                    lineDiv.className += ' text-muted';
                }
                
                lineDiv.textContent = `[AUDIT] ${lines[index]}`;
                consoleHistory.appendChild(lineDiv);
                
                playSound(audioKeystroke);
                consoleBody.scrollTop = consoleBody.scrollHeight;
                
                index++;
                setTimeout(printNextLine, 400 + Math.random() * 300);
            }
        }
        printNextLine();
    }

    // 7. Security Lab Automated Regex Scanner
    // Presets
    const headerPreset = `HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Content-Type: text/html; charset=UTF-8
Connection: keep-alive
Keep-Alive: timeout=5
X-Powered-By: Express

# No HSTS, No Content-Security-Policy headers found.
# Running standard staging environment.`;

    const codePreset = `// Connection string configuration
const database_uri = "mongodb://admin:p@ssword123@mait-cluster.act-telecom.net:27017/prod_db";
const JWT_SECRET = "super_vibecoder_secret_signature_key_2026";

function authenticateUser(req, res) {
    const raw_query = "SELECT * FROM users WHERE username = '" + req.body.user + "' AND password = '" + req.body.pwd + "'";
    // TODO: Migrate MD5 checks to PBKDF2 later
    const password_hash = md5(req.body.pwd);
}`;

    presetHeadersBtn.addEventListener('click', () => {
        playgroundInput.value = headerPreset;
        playSound(audioClick);
    });

    presetSecretsBtn.addEventListener('click', () => {
        playgroundInput.value = codePreset;
        playSound(audioClick);
    });

    // Scanner logic
    btnRunScan.addEventListener('click', () => {
        const input = playgroundInput.value.trim();
        if (!input) {
            alert("Please paste configuration code or headers to execute scan.");
            return;
        }

        playSound(audioClick);
        
        // Reset output to scanning status
        scanStatus.textContent = "Scanning...";
        scanStatus.className = "status-tag scanning";
        scanResultsContainer.innerHTML = `
            <div class="diagnostic-empty">
                <i class="fa-solid fa-sync fa-spin pulse-radar"></i>
                <p class="text-cyan">Executing pattern recognition heuristics...</p>
                <p class="text-muted text-small">Parsing inputs for hardcoded secrets, cryptographic weaknesses, and misconfigured HTTP variables.</p>
            </div>
        `;

        // Simulate script scan time delay
        setTimeout(() => {
            const findings = performRegexAnalysis(input);
            displayScanFindings(findings);
        }, 1500);
    });

    function performRegexAnalysis(text) {
        const findings = [];
        
        // 1. Check Hardcoded Secrets
        const secretRegexes = [
            { pattern: /(password|passwd|pwd|pass)\s*=\s*['"][^'"]+['"]/i, name: "Hardcoded Credential Exposure", desc: "Detected plain-text password assignation variable.", severity: "HIGH" },
            { pattern: /(secret|signature|private_key|token)\s*=\s*['"][^'"]{8,}['"]/i, name: "Hardcoded Cryptographic Token", desc: "Leaked signing signature keys inside client script logs.", severity: "HIGH" },
            { pattern: /mongodb:\/\/[^:]+:[^@]+@/i, name: "Database Connection URI Leak", desc: "Database credentials embedded directly inside connection strings.", severity: "HIGH" }
        ];

        // 2. Check Cryptographic Vulnerabilities
        const cryptoRegexes = [
            { pattern: /md5\s*\(/i, name: "Insecure Hash Routine (MD5)", desc: "MD5 algorithms are highly susceptible to collision attacks. Migrate hashes to PBKDF2/bcrypt.", severity: "MEDIUM" },
            { pattern: /sha1\s*\(/i, name: "Weak Hash Routine (SHA-1)", desc: "SHA-1 signatures are deprecated. Migrate checksum structures to SHA-256.", severity: "LOW" }
        ];

        // 3. Check Web API / SQL vulnerabilities
        const injectionRegexes = [
            { pattern: /SELECT\s+.*\s+FROM\s+.*\s+WHERE\s+.*['"]\s*\+\s*\w+/i, name: "Direct Concatenation in SQL Query", desc: "Risk of SQL Injection. Utilize parameterized queries or ORM frameworks to prevent bypasses.", severity: "HIGH" }
        ];

        // 4. Check Missing HTTP Headers (If input contains HTTP Header structure)
        const isHeaderInput = text.includes("HTTP/") || text.includes("Server:") || text.includes("Content-Type:");
        
        if (isHeaderInput) {
            const headers = [
                { header: "Strict-Transport-Security", name: "Missing HSTS Header", desc: "HSTS prevents downgrade protocol interceptions (man-in-the-middle).", severity: "MEDIUM" },
                { header: "Content-Security-Policy", name: "Missing Content Security Policy (CSP)", desc: "Without CSP, the app is vulnerable to malicious script injections (XSS).", severity: "HIGH" },
                { header: "X-Frame-Options", name: "Missing Clickjacking Guard (X-Frame-Options)", desc: "Allows domain overlaying. Restrict frame loadings using DENY or SAMEORIGIN.", severity: "MEDIUM" },
                { header: "X-Content-Type-Options", name: "Missing Mime-Sniffing Guard", desc: "Ensures browser respects defined script files. Add header value 'nosniff'.", severity: "LOW" }
            ];

            headers.forEach(h => {
                const regex = new RegExp(h.header, "i");
                if (!regex.test(text)) {
                    findings.push({ name: h.name, desc: h.desc, severity: h.severity });
                }
            });

            // Server Banner Leak check
            if (/Server:\s*\w+/i.test(text)) {
                findings.push({
                    name: "Server Version Banner Leak",
                    desc: "Disclosing exact server stacks (e.g. nginx/1.18.0) simplifies cataloging vulnerabilities for exploit targeting.",
                    severity: "LOW"
                });
            }
        }

        // Run non-header checks
        secretRegexes.forEach(rule => {
            if (rule.pattern.test(text)) findings.push({ name: rule.name, desc: rule.desc, severity: rule.severity });
        });

        cryptoRegexes.forEach(rule => {
            if (rule.pattern.test(text)) findings.push({ name: rule.name, desc: rule.desc, severity: rule.severity });
        });

        injectionRegexes.forEach(rule => {
            if (rule.pattern.test(text)) findings.push({ name: rule.name, desc: rule.desc, severity: rule.severity });
        });

        return findings;
    }

    function displayScanFindings(findings) {
        scanResultsContainer.innerHTML = '';
        
        if (findings.length === 0) {
            scanStatus.textContent = "Stable";
            scanStatus.className = "status-tag active";
            scanResultsContainer.innerHTML = `
                <div class="diagnostic-empty">
                    <i class="fa-solid fa-shield-halved text-green pulse-radar"></i>
                    <p class="text-green">Diagnostic Auditing Passed</p>
                    <p class="text-muted text-small">No direct security warnings matching core regex structures detected.</p>
                </div>
            `;
            playSound(audioSuccess);
            return;
        }

        // Aggregate severity counts
        const highCount = findings.filter(f => f.severity === 'HIGH').length;
        const mediumCount = findings.filter(f => f.severity === 'MEDIUM').length;
        
        if (highCount > 0) {
            scanStatus.textContent = `${findings.length} Vulnerabilities`;
            scanStatus.className = "status-tag";
            scanStatus.style.backgroundColor = "rgba(255, 51, 102, 0.2)";
            scanStatus.style.color = "var(--cyber-red)";
            scanStatus.style.border = "1px solid var(--cyber-red)";
        } else if (mediumCount > 0) {
            scanStatus.textContent = `${findings.length} Warnings`;
            scanStatus.className = "status-tag";
            scanStatus.style.backgroundColor = "rgba(255, 183, 3, 0.2)";
            scanStatus.style.color = "var(--cyber-yellow)";
            scanStatus.style.border = "1px solid var(--cyber-yellow)";
        } else {
            scanStatus.textContent = "Info Alerts";
            scanStatus.className = "status-tag";
            scanStatus.style.backgroundColor = "rgba(0, 229, 255, 0.2)";
            scanStatus.style.color = "var(--cyber-cyan)";
            scanStatus.style.border = "1px solid var(--cyber-cyan)";
        }

        // Print details
        findings.forEach(f => {
            const row = document.createElement('div');
            let severityClass = 'finding-info';
            let labelBadgeColor = 'text-muted';
            
            if (f.severity === 'HIGH') {
                severityClass = 'finding-high';
                labelBadgeColor = 'text-cyan'; /* in overclock mode this shifts automatically to alert colors */
            } else if (f.severity === 'MEDIUM') {
                severityClass = 'finding-medium';
                labelBadgeColor = 'text-yellow';
            } else if (f.severity === 'LOW') {
                severityClass = 'finding-low';
                labelBadgeColor = 'text-cyan';
            }

            row.className = `finding-row ${severityClass}`;
            row.innerHTML = `
                <div class="finding-title">
                    <span class="${labelBadgeColor}">[${f.severity}]</span> ${escapeHtml(f.name)}
                </div>
                <div class="finding-desc">${escapeHtml(f.desc)}</div>
            `;
            scanResultsContainer.appendChild(row);
        });

        playSound(audioSuccess);
    }
});
