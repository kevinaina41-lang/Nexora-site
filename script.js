// MENU MOBILE
function toggleMenu() {
    const nav = document.getElementById('nav');
    if (nav.style.display === 'flex') {
        nav.style.display = '';
    } else {
        nav.style.display = 'flex';
        nav.style.flexDirection = 'column';
        nav.style.position = 'absolute';
        nav.style.top = '70px';
        nav.style.right = '20px';
        nav.style.left = '20px';
        nav.style.background = 'rgba(20,20,24,0.95)';
        nav.style.backdropFilter = 'blur(20px)';
        nav.style.padding = '20px';
        nav.style.borderRadius = '16px';
        nav.style.border = '1px solid rgba(255,255,255,0.08)';
        nav.style.gap = '16px';
        nav.style.zIndex = '100';
    }
}

// HEADER SCROLL
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});

// ANIMATIONS AU SCROLL
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// CHAT
function toggleChat() {
    const widget = document.getElementById('chat-widget');
    widget.classList.toggle('show');
}

// ENVOYER MESSAGE CHAT
async function envoyerChat() {
    const input = document.getElementById('chat-input');
    const body = document.getElementById('chat-body');
    const message = input.value.trim();
    if (!message) return;
    
    // Ajouter le message utilisateur
    body.innerHTML += `<div class="chat-message user">${message}</div>`;
    input.value = '';
    body.scrollTop = body.scrollHeight;
    
    // Indicateur de chargement (3 points animés)
    const loadingId = 'loading-' + Date.now();
    body.innerHTML += `
        <div class="chat-message bot" id="${loadingId}">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
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
- Détecte automatiquement la langue et réponds dedans

TON RÔLE :
- Répondre UNIQUEMENT aux questions sur les services de Nexora MDG
- Convaincre le client avec des arguments pertinents et chiffrés
- Toujours proposer de remplir le formulaire de devis pour un prix précis
- Ne JAMAIS donner de prix fixes, seulement des estimations
- Refuser poliment les questions hors sujet (maths, vie personnelle, actualités, etc.) en disant dans la langue de l'utilisateur : "Je suis uniquement là pour vous renseigner sur les services de Nexora MDG."

FORMAT DE TES RÉPONSES :
- Utilise le markdown : **gras**, listes avec -, tableaux avec |
- Structure avec des titres (##)
- Sois clair, concis, professionnel
- Utilise des tableaux pour comparer

ARGUMENTS DE CONVICTION :
- Gain de temps : jusqu'à 10h/semaine
- Augmentation des ventes : +30%
- Satisfaction client : réponses 24h/24
- Prix adaptés : à partir de 300 000 Ar
- Garantie 30 jours
- 2 révisions gratuites
- Support 24/7

EXEMPLE DE RÉPONSE POUR "Combien coûte un chatbot ?" :

## Nos tarifs

Nos prix sont adaptés au marché malgache, **à partir de 300 000 Ar**.

| Type de chatbot | Prix estimé | Délai |
|---|---|---|
| Chatbot simple | 300 000 - 500 000 Ar | 1 semaine |
| Chatbot avancé | 500 000 - 1 000 000 Ar | 2 semaines |
| Chatbot + site | 1 000 000 - 2 000 000 Ar | 3 semaines |

**Pourquoi nous choisir ?**
- Réponses 24h/24
- Gain de temps : **10h/semaine**
- Augmentation des ventes : **+30%**
- Garantie 30 jours
- 2 révisions gratuites

Remplissez notre **formulaire de devis** pour un prix précis !`
            })
        });
        const data = await response.json();
        
        // Afficher en HTML (markdown rendu)
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) {
            if (typeof marked !== 'undefined') {
                loadingEl.innerHTML = marked.parse(data.reply);
            } else {
                loadingEl.innerText = data.reply;
            }
        }
    } catch (e) {
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) {
            loadingEl.innerText = "Désolé, une erreur est survenue. Contactez-nous directement par téléphone ou email.";
        }
    }
    
    body.scrollTop = body.scrollHeight;
}

// SCROLL FLUIDE
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            const nav = document.getElementById('nav');
            if (window.innerWidth <= 768) nav.style.display = '';
        }
    });
});