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
            const target = parseInt(btn.dataset.target, 10);
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

    // 2. Email Copy-to-Clipboard Action
    const btnCopyEmail = document.getElementById('btn-copy-email');
    if (btnCopyEmail) {
        btnCopyEmail.addEventListener('click', () => {
            const email = btnCopyEmail.getAttribute('data-clipboard');
            if (email && navigator.clipboard) {
                navigator.clipboard.writeText(email).then(() => {
                    btnCopyEmail.innerHTML = '<i class="fa-solid fa-check text-accent"></i>';
                    btnCopyEmail.title = "Copied to clipboard!";
                    setTimeout(() => {
                        btnCopyEmail.innerHTML = '<i class="fa-regular fa-copy"></i>';
                        btnCopyEmail.title = "Copy to clipboard";
                    }, 2000);
                }).catch(err => {
                    console.error("Clipboard copy failed", err);
                });
            }
        });
    }
});
