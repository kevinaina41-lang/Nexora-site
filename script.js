// ============================================
// NEXORA MDG — script.js
// ============================================

// ============ MENU MOBILE ============
function toggleMenu() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    nav.classList.toggle('open');
}

// Fermer le menu mobile au clic sur un lien
document.addEventListener('click', function (e) {
    const nav = document.getElementById('nav');
    if (!nav) return;
    if (e.target.closest('#nav a') && window.innerWidth <= 768) {
        nav.classList.remove('open');
    }
});

// ============ HEADER SCROLL ============
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (!header) return;
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});

// ============ ANIMATIONS AU SCROLL ============
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
    // Fallback : tout afficher direct
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

// ============ CHAT ============
function toggleChat() {
    const widget = document.getElementById('chat-widget');
    if (!widget) return;
    widget.classList.toggle('show');
}

// Protection XSS : échappe le HTML avant insertion
function escapeHTML(str) {
    return String(str ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

// ============ ENVOYER MESSAGE CHAT ============
async function envoyerChat() {
    const input = document.getElementById('chat-input');
    const body = document.getElementById('chat-body');
    if (!input || !body) return;

    const message = input.value.trim();
    if (!message) return;

    // Ajouter le message utilisateur (échappé)
    body.innerHTML += `<div class="chat-message user">${escapeHTML(message)}</div>`;
    input.value = '';
    body.scrollTop = body.scrollHeight;

    // Indicateur de chargement
    const loadingId = 'loading-' + Date.now();
    body.innerHTML += `
        <div class="chat-message bot" id="${loadingId}">
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    body.scrollTop = body.scrollHeight;

    try {
        const response = await fetch('https://nexa-ia-pjza.onrender.com/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                historique: [],
                persona: `Tu es l'assistant commercial officiel de Nexora MDG, une entreprise malgache spécialisée dans les solutions d'intelligence artificielle et le développement de logiciels.

NOS SERVICES :
- Chatbot IA (à partir de 300 000 Ar)
- Développement de logiciels et applications web/mobiles
- Création de sites web (vitrines, e-commerce, portails)
- Automatisation de tâches et processus
- Formation à l'intelligence artificielle
- Conseil en transformation digitale
- Maintenance et support technique

LANGUE (TRÈS IMPORTANT) :
- Réponds TOUJOURS dans la même langue que l'utilisateur
- Français → réponds en français
- English → réponds en anglais
- Malagasy → réponds en malgache
- 中文 → réponds en chinois
- Español, Deutsch, Italiano, etc. → réponds dans cette langue

TON RÔLE :
- Répondre UNIQUEMENT aux questions sur les services de Nexora MDG
- Convaincre le client avec des arguments pertinents et chiffrés
- Toujours proposer de remplir le formulaire de devis pour un prix précis
- Ne JAMAIS donner de prix fixes, seulement des estimations
- Refuser poliment les questions hors sujet

FORMAT :
- Utilise le markdown : **gras**, listes avec -, tableaux avec |
- Structure avec des titres (##)
- Sois clair, concis, professionnel

ARGUMENTS DE CONVICTION :
- Gain de temps : jusqu'à 10h/semaine
- Augmentation des ventes : +30%
- Satisfaction client : réponses 24h/24
- Prix adaptés : à partir de 300 000 Ar
- Garantie 30 jours
- 2 révisions gratuites
- Support 24/7

Remplissez notre formulaire de devis pour un prix précis !`
            })
        });

        if (!response.ok) {
            throw new Error('Erreur HTTP ' + response.status);
        }

        const data = await response.json();
        const loadingEl = document.getElementById(loadingId);
        if (!loadingEl) return;

        const reply = data.reply || data.message || 'Désolé, je n\'ai pas de réponse.';

        if (typeof marked !== 'undefined' && marked.parse) {
            // marked.parse produit du HTML → on l'insère tel quel
            loadingEl.innerHTML = marked.parse(reply);
        } else {
            loadingEl.textContent = reply;
        }
    } catch (e) {
        console.error('Erreur chat:', e);
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) {
            loadingEl.textContent = "Désolé, une erreur est survenue. Contactez-nous directement par téléphone ou email.";
        }
    }

    body.scrollTop = body.scrollHeight;
}

// ============ SCROLL FLUIDE ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
            const nav = document.getElementById('nav');
            if (window.innerWidth <= 768 && nav) nav.classList.remove('open');
        }
    });
});

// ============ INITIALISATION DES ICÔNES ============
if (window.lucide) lucide.createIcons();
