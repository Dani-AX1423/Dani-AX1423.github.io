/* ─────────────────────────────────────────────
   Daniel Raj V Portfolio — script.js
   Deployment Interactive & Presentation Logic
───────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

    /* ── 1. SCROLL PROGRESS BAR ──────────────────── */
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        if (scrollProgress) {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }
    }, { passive: true });

    /* ── 2. BACK TO TOP BUTTON ───────────────────── */
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (backToTopBtn) {
            backToTopBtn.classList.toggle('visible', window.scrollY > 350);
        }
    }, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ── 3. MOBILE HAMBURGER MENU DRAWER ─────────── */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMobileMenu() {
        if (mobileMenuBtn && mobileDrawer) {
            mobileMenuBtn.classList.toggle('active');
            mobileDrawer.classList.toggle('active');
            document.body.style.overflow = mobileDrawer.classList.contains('active') ? 'hidden' : '';
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileDrawer && mobileDrawer.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    /* ── 4. CUSTOM CURSOR ───────────────────────── */
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mouseX = -200, mouseY = -200;
    let ringX = -200, ringY = -200;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        if (dot && ring) {
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';

            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const interactiveEls = document.querySelectorAll(
        'a, button, .btn, .card-hoverable, .step-card, .impl-card, .mobile-link'
    );
    interactiveEls.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    /* ── 5. CARD MOUSE SPOTLIGHT ─────────────────── */
    const hoverCards = document.querySelectorAll('.card-hoverable');
    hoverCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });

    /* ── 6. AMBIENT BACKGROUND CANVAS ────────────── */
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = Array.from({ length: 35 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            radius: Math.random() * 2 + 1,
            alpha: Math.random() * 0.4 + 0.15
        }));

        function renderCanvas() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 102, 0, ${p.alpha})`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(255, 102, 0, ${0.12 * (1 - dist / 110)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(renderCanvas);
        }
        renderCanvas();
    }

    /* ── 7. NAV & SCROLL REVEAL OBSERVERS ────────── */
    const nav = document.getElementById('main-nav');
    const navAs = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    const sectionEls = document.querySelectorAll('div[id], section[id]');
    const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navAs.forEach(a => a.classList.remove('active'));
                const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                if (match) match.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sectionEls.forEach(s => navObserver.observe(s));

    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });
    revealEls.forEach(el => revealObserver.observe(el));

    /* ── 8. LYTRIX PIPELINE VISUALIZER ───────────── */
    const stepCards = document.querySelectorAll('.step-card');
    const pipelineCodeDisplay = document.getElementById('pipeline-code-display');
    const pipelineStageTag = document.getElementById('pipeline-stage-tag');

    const pipelineData = [
        {
            stage: "STAGE 01 — SOURCE CODE",
            code: `LTProgramFileCode main() {\n    LTGlobalVar x = 10 + 20;\n    BackLine(x);\n}`
        },
        {
            stage: "STAGE 02 — LEXER TOKENS",
            code: `[LTProgramFileCode, "LTProgramFileCode"] [IDENT, "main"] [LPAREN, "("] [RPAREN, ")"] [LBRACE, "{"]\n[LTGlobalVar, "LTGlobalVar"] [IDENT, "x"] [ASSIGN, "="] [INT, 10] [PLUS, "+"] [INT, 20] [SEMICOLON, ";"]\n[BackLine, "BackLine"] [LPAREN, "("] [IDENT, "x"] [RPAREN, ")"] [SEMICOLON, ";"] [RBRACE, "}"]`
        },
        {
            stage: "STAGE 03 — PARSER AST (ABSTRACT SYNTAX TREE)",
            code: `FunctionDecl {\n  name: "main",\n  body: [\n    VarDeclStmt { identifier: "x", value: BinaryExpr(10 + 20) },\n    ReturnStmt  { expression: Identifier("x") }\n  ]\n}`
        },
        {
            stage: "STAGE 04 — QBE BACKEND IR (LyTrix-Q Compiler)",
            code: `export function w $main() {\n@start\n    %x =w add 10, 20\n    ret %x\n}`
        },
        {
            stage: "STAGE 05 — EXECUTION OUTPUT",
            code: `[LyTrix-R Virtual Environment Execution Output]\n\nReturn value: 30\nProcess finished with exit code 0.`
        }
    ];

    stepCards.forEach(card => {
        card.addEventListener('click', () => {
            stepCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const stepIdx = parseInt(card.getAttribute('data-step') || '0', 10);
            const data = pipelineData[stepIdx];
            if (data && pipelineCodeDisplay && pipelineStageTag) {
                pipelineStageTag.textContent = data.stage;
                pipelineCodeDisplay.textContent = data.code;
            }
        });
    });

    /* ── 9. TOAST NOTIFICATIONS & COPY EMAIL ─────── */
    function showToast(msg) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = `✓ ${msg}`;

        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = "fortunebros86@gmail.com";
            navigator.clipboard.writeText(email).then(() => {
                showToast("Email address copied to clipboard!");
            }).catch(() => {
                showToast(`Email: ${email}`);
            });
        });
    }

});