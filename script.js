// === CAROUSEL ===
const track = document.getElementById('carouselTrack');
const total = track.children.length;
const dotsEl = document.getElementById('carouselDots');
const counter = document.getElementById('carouselCounter');
let current = 0;

for (let i = 0; i < total; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.onclick = () => goTo(i);
    dotsEl.appendChild(d);
}

function goTo(n) {
    current = (n + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    document.querySelectorAll('.dot').forEach((d, i) =>
        d.classList.toggle('active', i === current)
    );
    counter.textContent = `${current + 1} / ${total}`;
}

document.getElementById('prevBtn').onclick = () => goTo(current - 1);
document.getElementById('nextBtn').onclick = () => goTo(current + 1);

// === CONTADOR ANIMADO (métricas) ===
function animarContador(el, target, suffix) {
    const duracao = 1800;
    let inicio = null;
    function step(ts) {
        if (!inicio) inicio = ts;
        const p = Math.min((ts - inicio) / duracao, 1);
        el.textContent = Math.floor(p * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const observerMetricas = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animado) {
            entry.target.dataset.animado = 'true';
            const el = entry.target.querySelector('.metrica-numero');
            animarContador(el, +entry.target.dataset.target, entry.target.dataset.suffix);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.metrica-card').forEach(c => observerMetricas.observe(c));

// === NAVBAR SCROLL ===
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            document.getElementById('mainNavbar')
                .classList.toggle('scrolled', window.scrollY > 20);
            ticking = false;
        });
        ticking = true;
    }
});

document.querySelectorAll('#navbarMain .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const collapseEl = document.getElementById('navbarMain');
        const bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
        if (bsCollapse) bsCollapse.hide();
    });
});

// ============================================================
// FUNCIONALIDADE 1 — MODO CLARO / ESCURO
// Conceitos JS: eventos DOM, localStorage, classList, operador ternário
// ============================================================
function initTheme() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    // Persiste preferência entre sessões
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light');
    }
    atualizarIcone();

    btn.addEventListener('click', () => {
        document.body.classList.toggle('light');
        const isLight = document.body.classList.contains('light');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        atualizarIcone();
    });

    function atualizarIcone() {
        btn.textContent = document.body.classList.contains('light') ? '🌙' : '☀️';
    }
}

// ============================================================
// FUNCIONALIDADE 2 — ANIMAÇÃO AO SCROLL (Scroll Reveal)
// Conceitos JS: IntersectionObserver, querySelectorAll, classList,
//               insertAdjacentElement, criação de elementos DOM
// ============================================================
function initScrollReveal() {
    // Adiciona classe reveal automaticamente nos elementos-alvo
    const seletores = [
        'section:not(#home) h2',
        'section:not(#home) h4',
        '.servico',
        '.metrica-card',
        '.flip-card',
        '.container-sobre img',
        '.container-sobre .texto',
        '.video-wrapper',
        '.tabela-wrapper',
        '.carousel-wrapper',
        'form'
    ];

    document.querySelectorAll(seletores.join(', ')).forEach(el => {
        el.classList.add('reveal');
    });

    // Delay escalonado para itens em grid
    ['servico', 'metrica-card', 'flip-card'].forEach(cls => {
        document.querySelectorAll('.' + cls).forEach((el, i) => {
            if (i % 3 === 1) el.classList.add('reveal-d1');
            if (i % 3 === 2) el.classList.add('reveal-d2');
        });
    });

    // Insere linha decorativa embaixo de cada h2
    document.querySelectorAll('main section h2').forEach(h2 => {
        const div = document.createElement('div');
        div.className = 'section-divider reveal';
        h2.insertAdjacentElement('afterend', div);
    });

    // Observer dispara quando elemento entra na viewport
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target); // anima só uma vez
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// === FLIP CARDS — suporte a toque mobile ===
document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
});

// === INIT ===
initTheme();
initScrollReveal();
