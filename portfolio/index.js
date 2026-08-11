document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // THEME SWITCHER
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const bodyElement = document.body;

    // Check saved theme or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light') {
        bodyElement.classList.replace('dark-theme', 'light-theme');
    } else if (savedTheme === 'dark') {
        bodyElement.classList.replace('light-theme', 'dark-theme');
    } else if (!systemPrefersDark) {
        bodyElement.classList.replace('dark-theme', 'light-theme');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (bodyElement.classList.contains('dark-theme')) {
            bodyElement.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            bodyElement.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark');
        }
        
        // Re-render active project chart
        renderActiveProjectChart();
    });

    // ==========================================================================
    // MOBILE NAVIGATION
    // ==========================================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            bodyElement.classList.toggle('mobile-menu-open');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            bodyElement.classList.remove('mobile-menu-open');
        });
    });

    document.addEventListener('click', (e) => {
        if (navMenu && !navMenu.contains(e.target) && mobileMenuBtn && !mobileMenuBtn.contains(e.target) && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            bodyElement.classList.remove('mobile-menu-open');
        }
    });

    // ==========================================================================
    // ACTIVE NAVIGATION LINKS (SCROLL MONITOR)
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    const navObsOptions = {
        root: null,
        threshold: 0.3,
        rootMargin: '-80px 0px 0px 0px'
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObsOptions);

    sections.forEach(section => navObserver.observe(section));

    // ==========================================================================
    // DYNAMIC STAT COUNTERS
    // ==========================================================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const countUp = (element) => {
        const target = parseFloat(element.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        const duration = 2000; // ms
        const stepTime = 30; // ms
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = isDecimal ? target.toFixed(2) : Math.round(target);
                clearInterval(timer);
            } else {
                element.textContent = isDecimal ? current.toFixed(2) : Math.round(current);
            }
        }, stepTime);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                statNumbers.forEach(num => countUp(num));
            }
        });
    }, { threshold: 0.5 });

    const heroSection = document.getElementById('hero');
    if (heroSection) statsObserver.observe(heroSection);

    // ==========================================================================
    // SCROLL REVEAL ANIMATIONS
    // ==========================================================================
    const revealElements = document.querySelectorAll('.about-card, .info-item, .skill-category-card, .timeline-item, .project-display-card, .education-card, .cert-card, .contact-detail-card, .contact-form-container');
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================================================
    // PLAY REEL MODAL & VOICE SYNTHESIS CONTROLLER
    // ==========================================================================
    const playReelBtn = document.getElementById('play-reel-btn');
    const reelModal = document.getElementById('reel-modal');
    const closeReelBtn = document.getElementById('close-reel-btn');
    const voiceReplayBtn = document.getElementById('voice-replay-btn');

    const speakIntro = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const textToSpeak = "Hi, I'm Sharvari. I'm a Data Analyst passionate about turning complex datasets into clear, actionable business insights. Welcome to my portfolio!";
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.rate = 0.95;
            utterance.pitch = 1.05;
            
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => (v.name.includes('Female') || v.name.includes('Google') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Natural')) && v.lang.startsWith('en'));
            if (preferredVoice) utterance.voice = preferredVoice;

            window.speechSynthesis.speak(utterance);
        }
    };

    const stopIntroVoice = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    };

    if (playReelBtn && reelModal) {
        playReelBtn.addEventListener('click', () => {
            reelModal.classList.add('active');
            bodyElement.style.overflow = 'hidden';
            speakIntro();
        });

        if (voiceReplayBtn) {
            voiceReplayBtn.addEventListener('click', speakIntro);
        }

        const closeReel = () => {
            reelModal.classList.remove('active');
            bodyElement.style.overflow = 'auto';
            stopIntroVoice();
        };

        if (closeReelBtn) closeReelBtn.addEventListener('click', closeReel);

        reelModal.addEventListener('click', (e) => {
            if (e.target === reelModal) closeReel();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && reelModal.classList.contains('active')) closeReel();
        });
    }

    // ==========================================================================
    // PROJECT SHOWCASE (TABS CONTROL)
    // ==========================================================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const contentPanes = document.querySelectorAll('.project-content-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            contentPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');

            const tabId = btn.getAttribute('data-tab');
            const targetPane = document.getElementById(tabId);
            if (targetPane) targetPane.classList.add('active');

            renderActiveProjectChart();
        });
    });

    function renderActiveProjectChart() {
        const activeTab = document.querySelector('.tab-btn.active');
        if (!activeTab) return;

        const tabId = activeTab.getAttribute('data-tab');
        if (tabId === 'fraud-project') {
            setTimeout(renderFraudChart, 80);
        } else if (tabId === 'ecommerce-project') {
            setTimeout(renderEcommerceChart, 80);
        } else if (tabId === 'facerec-project') {
            setTimeout(renderFaceRecVisual, 80);
        } else if (tabId === 'neuraltrade-project') {
            setTimeout(renderNeuralTradeChart, 80);
        }
    }

    // ==========================================================================
    // INTERACTIVE SVG CHARTS FOR PROJECTS
    // ==========================================================================

    // Chart 1: Credit Card Fraud Detection (Donut + KPI Metrics)
    function renderFraudChart() {
        const container = document.getElementById('fraud-chart-area');
        if (!container) return;

        const isDark = bodyElement.classList.contains('dark-theme');
        const colorIndigo = isDark ? '#6366F1' : '#4F46E5';
        const colorRed = '#EF4444';
        const colorGreen = '#10B981';
        const textColor = isDark ? '#94A3B8' : '#475569';

        container.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; gap: 16px;">
                <div style="display: flex; align-items: center; justify-content: space-around; gap: 20px; flex-wrap: wrap;">
                    <!-- Donut SVG -->
                    <div style="position: relative; width: 130px; height: 130px;">
                        <svg viewBox="0 0 36 36" style="width: 100%; height: 100%; transform: rotate(-90deg);">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${isDark ? '#1e293b' : '#e2e8f0'}" stroke-width="3.8"/>
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${colorGreen}" stroke-width="3.8" stroke-dasharray="99.8, 100"/>
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${colorRed}" stroke-width="4.2" stroke-dasharray="3, 100"/>
                        </svg>
                        <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                            <span style="font-size: 1.1rem; font-weight: 800; color: ${colorRed};">492</span>
                            <span style="font-size: 0.68rem; font-weight: 600; color: ${textColor};">Fraud Cases</span>
                        </div>
                    </div>

                    <!-- Metrics column -->
                    <div style="display: flex; flex-direction: column; gap: 10px; flex: 1; min-width: 150px;">
                        <div style="background: ${isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)'}; padding: 10px 14px; border-radius: 8px; border-left: 3px solid ${colorGreen};">
                            <span style="display: block; font-size: 0.75rem; color: ${textColor}; font-weight: 600;">Legitimate Transactions</span>
                            <span style="font-size: 1rem; font-weight: 800;">284,315 <span style="font-size: 0.75rem; color: ${colorGreen};">(99.83%)</span></span>
                        </div>
                        <div style="background: ${isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)'}; padding: 10px 14px; border-radius: 8px; border-left: 3px solid ${colorRed};">
                            <span style="display: block; font-size: 0.75rem; color: ${textColor}; font-weight: 600;">Fraudulent Transactions</span>
                            <span style="font-size: 1rem; font-weight: 800;">492 <span style="font-size: 0.75rem; color: ${colorRed};">(0.17%)</span></span>
                        </div>
                    </div>
                </div>

                <!-- Mini Sparkline for Fraud Spike Distribution -->
                <div style="background: ${isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.5)'}; border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}; border-radius: 8px; padding: 12px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 600; color: ${textColor}; margin-bottom: 6px;">
                        <span>Fraud Pattern Detection Timeline (Hour 0 - 48)</span>
                        <span style="color: ${colorIndigo};">DAX Flagged</span>
                    </div>
                    <svg viewBox="0 0 300 40" style="width: 100%; height: 40px;">
                        <path d="M 0 35 L 30 32 L 60 30 L 90 12 L 120 34 L 150 28 L 180 8 L 210 33 L 240 35 L 270 30 L 300 35" fill="none" stroke="${colorIndigo}" stroke-width="2.5" stroke-linecap="round"/>
                        <circle cx="90" cy="12" r="4" fill="${colorRed}"/>
                        <circle cx="180" cy="8" r="4" fill="${colorRed}"/>
                    </svg>
                </div>
            </div>
        `;
    }

    // Chart 2: E-commerce Return Sustainability (Horizontal Bar Chart)
    function renderEcommerceChart() {
        const container = document.getElementById('ecommerce-chart-area');
        if (!container) return;

        const isDark = bodyElement.classList.contains('dark-theme');
        const colorEmerald = isDark ? '#10B981' : '#059669';
        const colorMuted = isDark ? '#1e293b' : '#cbd5e1';
        const textColor = isDark ? '#94A3B8' : '#475569';

        const categories = [
            { name: 'Apparel & Fashion', loss: 38.5, returns: '1,850 orders' },
            { name: 'Electronics', loss: 24.2, returns: '1,120 orders' },
            { name: 'Footwear', loss: 18.4, returns: '890 orders' },
            { name: 'Home & Kitchen', loss: 12.1, returns: '640 orders' },
            { name: 'Beauty & Care', loss: 6.8, returns: '320 orders' }
        ];

        let html = `<div style="width: 100%; display: flex; flex-direction: column; gap: 12px;">`;
        categories.forEach((cat, idx) => {
            const delay = idx * 0.12;
            html += `
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 600; color: ${textColor};">
                        <span>${cat.name} <span style="font-size: 0.72rem; opacity: 0.7;">(${cat.returns})</span></span>
                        <span style="font-weight: 700; color: ${colorEmerald};">${cat.loss}% Return Loss</span>
                    </div>
                    <div style="width: 100%; height: 14px; background-color: ${colorMuted}; border-radius: 4px; overflow: hidden; position: relative;">
                        <div class="ecom-chart-bar" style="
                            position: absolute; top: 0; left: 0; bottom: 0; width: 0%;
                            background: linear-gradient(90deg, ${colorEmerald}, #06b6d4);
                            border-radius: 4px; transition: width 1.2s cubic-bezier(0.1, 1.0, 0.1, 1.0) ${delay}s;
                        "></div>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        container.innerHTML = html;

        requestAnimationFrame(() => {
            const bars = container.querySelectorAll('.ecom-chart-bar');
            categories.forEach((cat, idx) => {
                if (bars[idx]) bars[idx].style.width = `${cat.loss * 2.2}%`;
            });
        });
    }

    // Chart 3: Face Recognition Attendance System Visualizer
    function renderFaceRecVisual() {
        const container = document.getElementById('facerec-preview-area');
        if (!container) return;

        const isDark = bodyElement.classList.contains('dark-theme');
        const colorAmber = isDark ? '#F59E0B' : '#D97706';

        container.innerHTML = `
            <div style="position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;">
                <!-- Face Frame Simulation -->
                <div style="position: relative; width: 140px; height: 140px; border: 2px stroke ${colorAmber}; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: rgba(245, 158, 11, 0.05);">
                    <div style="position: absolute; top: -6px; left: -6px; width: 16px; height: 16px; border-top: 3px solid ${colorAmber}; border-left: 3px solid ${colorAmber};"></div>
                    <div style="position: absolute; top: -6px; right: -6px; width: 16px; height: 16px; border-top: 3px solid ${colorAmber}; border-right: 3px solid ${colorAmber};"></div>
                    <div style="position: absolute; bottom: -6px; left: -6px; width: 16px; height: 16px; border-bottom: 3px solid ${colorAmber}; border-left: 3px solid ${colorAmber};"></div>
                    <div style="position: absolute; bottom: -6px; right: -6px; width: 16px; height: 16px; border-bottom: 3px solid ${colorAmber}; border-right: 3px solid ${colorAmber};"></div>
                    
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="${colorAmber}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>

                    <!-- Scanning line animation -->
                    <div style="position: absolute; top: 0; left: 0; right: 0; height: 2px; background: ${colorAmber}; box-shadow: 0 0 8px ${colorAmber}; animation: scan-anim 2s ease-in-out infinite alternate;"></div>
                </div>

                <!-- Detection Telemetry Card -->
                <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; padding: 10px 16px; width: 100%; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background: #10B981; display: inline-block;"></span>
                        <span style="font-size: 0.82rem; font-weight: 700; color: #fff;">FACE MATCHED</span>
                    </div>
                    <span style="font-size: 0.8rem; font-weight: 600; color: ${colorAmber};">Conf: 98.4%</span>
                    <span style="font-size: 0.78rem; color: #94A3B8;">MySQL Logged ⚡</span>
                </div>
            </div>
        `;

        if (!document.getElementById('scan-anim-style')) {
            const style = document.createElement('style');
            style.id = 'scan-anim-style';
            style.textContent = `@keyframes scan-anim { 0% { top: 5%; } 100% { top: 92%; } }`;
            document.head.appendChild(style);
        }
    }

    // Chart 4: Neural Trade AI Stock Forecast
    function renderNeuralTradeChart() {
        const container = document.getElementById('neural-chart-area');
        if (!container) return;

        const isDark = bodyElement.classList.contains('dark-theme');
        const colorCyan = '#06B6D4';
        const colorGreen = '#10B981';
        const textColor = isDark ? '#94A3B8' : '#475569';

        container.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; gap: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary);">NIFTY 50 EQ</span>
                        <span style="background: rgba(16, 185, 129, 0.15); color: ${colorGreen}; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">BUY SIGNAL</span>
                    </div>
                    <span style="font-size: 0.82rem; font-weight: 600; color: ${colorCyan};">TensorFlow.js Model: 87.2%</span>
                </div>

                <!-- Candlestick SVG Simulation -->
                <svg viewBox="0 0 300 90" style="width: 100%; height: 90px;">
                    <path d="M 10 70 Q 50 30 100 55 T 190 25 T 290 15" fill="none" stroke="${colorCyan}" stroke-width="2.5" stroke-linecap="round"/>
                    <circle cx="290" cy="15" r="5" fill="${colorGreen}">
                        <animate attributeName="r" values="4;7;4" dur="1.5s" repeatCount="indefinite"/>
                    </circle>
                </svg>

                <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: ${textColor}; font-weight: 600; border-top: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}; padding-top: 6px;">
                    <span>Live Tick Rate: 500ms</span>
                    <span>50+ Equities Monitored</span>
                    <span>BUY / SELL / HOLD Engine</span>
                </div>
            </div>
        `;
    }

    // Initialize Active Project Chart
    renderActiveProjectChart();

    // ==========================================================================
    // CONTACT FORM VALIDATION & SIMULATED SENDING
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formSubmitBtn = document.getElementById('form-submit-btn');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const subject = document.getElementById('form-subject').value;
            const message = document.getElementById('form-message').value;

            if (!name || !email || !subject || !message) {
                showFeedback('Please fill out all required fields.', 'error');
                return;
            }

            formSubmitBtn.disabled = true;
            const origContent = formSubmitBtn.innerHTML;
            formSubmitBtn.innerHTML = `
                <span>Sending message...</span>
                <div class="loading-spinner" style="
                    width: 14px; height: 14px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                "></div>
            `;

            if (!document.getElementById('spin-keyframe')) {
                const spinnerStyle = document.createElement('style');
                spinnerStyle.id = 'spin-keyframe';
                spinnerStyle.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
                document.head.appendChild(spinnerStyle);
            }

            setTimeout(() => {
                formSubmitBtn.disabled = false;
                formSubmitBtn.innerHTML = origContent;
                showFeedback(`Thank you, ${name}! Your message has been delivered. Sharvari Sonawane will respond to you shortly.`, 'success');
                contactForm.reset();
            }, 1800);
        });
    }

    function showFeedback(message, type) {
        formFeedback.textContent = message;
        formFeedback.className = 'form-feedback-message';
        formFeedback.classList.add(type);
        formFeedback.style.display = 'block';
        
        setTimeout(() => {
            formFeedback.style.display = 'none';
        }, 6000);
    }
});
