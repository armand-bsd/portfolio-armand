// TRADUCTION INTÉGRALE
const langBtn = document.getElementById('lang-btn');
let currentLang = 'fr';
langBtn.onclick = () => {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    langBtn.textContent = currentLang.toUpperCase();
    
    // Traduire le contenu texte
    document.querySelectorAll('[data-en]').forEach(el => {
        if(currentLang === 'en') {
            if(!el.dataset.fr) el.dataset.fr = el.innerHTML;
            el.innerHTML = el.dataset.en;
        } else {
            el.innerHTML = el.dataset.fr;
        }
    });

    // Traduire les placeholders des formulaires
    document.querySelectorAll('[data-en-placeholder]').forEach(el => {
        if(currentLang === 'en') {
            if(!el.dataset.frPlaceholder) el.dataset.frPlaceholder = el.placeholder;
            el.placeholder = el.dataset.enPlaceholder;
        } else {
            el.placeholder = el.dataset.frPlaceholder;
        }
    });

    updateThemeElements(); // Met à jour le message d'accueil contact selon la langue
};

// GSAP + LENIS
gsap.registerPlugin(ScrollTrigger);
const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// ANIMATION TIMELINE & GLOW
const initTimeline = (triggerId, progressId) => {
    gsap.to(progressId, { height: "100%", ease: "none", scrollTrigger: { trigger: triggerId, start: "top 40%", end: "bottom 60%", scrub: 1 }});
    document.querySelectorAll(`${triggerId} .timeline-item`).forEach((item) => {
        ScrollTrigger.create({ trigger: item, start: "top 60%", end: "bottom 40%", toggleClass: "active-glow" });
    });
};
initTimeline("#experience", "#progress-pro");
initTimeline("#formation", "#progress-edu");

// REVEAL ANIMATIONS
document.querySelectorAll('.reveal').forEach(el => {
    gsap.to(el, { scrollTrigger: { trigger: el, start: "top 85%" }, opacity: 1, y: 0, duration: 1, ease: "power3.out" });
});

// THEME TOGGLE & CONTACT INTELLIGENT
const themeBtn = document.getElementById('theme-btn');
const themeIcon = document.getElementById('theme-icon');
const smartGreeting = document.getElementById('smart-greeting');

function updateThemeElements() {
    const isDark = document.body.classList.contains('dark');
    if (isDark) {
        themeIcon.className = 'fas fa-sun';
        smartGreeting.innerHTML = currentLang === 'fr' ? "> Mode Sombre détecté. Prêt pour une mission furtive ?" : "> Dark Mode detected. Ready for a stealth mission?";
    } else {
        themeIcon.className = 'fas fa-moon';
        smartGreeting.innerHTML = currentLang === 'fr' ? "> Mode Clair activé. Prêt à mettre vos projets en lumière ?" : "> Light Mode active. Ready to highlight your projects?";
    }
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark');
}
updateThemeElements();

themeBtn.onclick = () => {
    document.body.classList.toggle('dark');
    updateThemeElements();
};

// 3D TILT EFFECT SUR HERO
const heroSection = document.getElementById('hero-section');
const tiltElements = document.querySelectorAll('.tilt-element');

heroSection.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth / 2 - e.pageX) / 25;
    const y = (window.innerHeight / 2 - e.pageY) / 25;
    tiltElements.forEach(el => el.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`);
});
heroSection.addEventListener('mouseleave', () => {
    tiltElements.forEach(el => el.style.transform = `rotateY(0deg) rotateX(0deg)`);
});

// SONDAGE SIGNATURE CONFETTIS
const pollFeedback = document.getElementById('poll-feedback');

document.getElementById('poll-oui').addEventListener('click', () => {
    pollFeedback.innerHTML = currentLang === 'fr' ? "Excellent ! N'hésitez pas à me contacter. 🚀" : "Excellent! Don't hesitate to contact me. 🚀";
    pollFeedback.style.color = "#4ade80";
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.8 }, colors: ['#D4AF37', '#ffffff', '#4ade80'] });
});

document.getElementById('poll-bof').addEventListener('click', () => {
    pollFeedback.innerHTML = currentLang === 'fr' ? "Challenge accepted. Lancez sudo matrix dans la console pour changer d'avis ! 👀" : "Challenge accepted. Run sudo matrix in the console to change your mind! 👀";
    pollFeedback.style.color = "#fbbf24";
});

document.getElementById('poll-non').addEventListener('click', () => {
    pollFeedback.innerHTML = currentLang === 'fr' ? "Erreur 404 : Appréciation introuvable. On en rediscute autour d'un café ? ☕" : "Error 404: Appreciation not found. Let's talk over coffee? ☕";
    pollFeedback.style.color = "#ef4444";
});

// FORMULAIRE DE CONTACT (Intégration Web3Forms)
document.getElementById('smart-contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const contactSuccess = document.getElementById('contact-success');
    const form = e.target;
    const button = form.querySelector('button');
    const originalBtnText = button.innerHTML;

    // Animation de chargement sur le bouton
    button.innerHTML = currentLang === 'fr' ? "Envoi en cours..." : "Transmitting...";
    button.disabled = true;

    const formData = new FormData(form);
    // On ajoute manuellement l'Access Key de Web3Forms
    formData.append("access_key", "49b27977-0e55-406e-9113-345b874e22ba"); 

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            // Animation de succès
            contactSuccess.classList.remove('translate-y-full');
            contactSuccess.classList.add('translate-y-0');
            form.reset();
        } else {
            alert("Erreur lors de l'envoi. Veuillez réessayer.");
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
        alert("Impossible de contacter le serveur.");
    } finally {
        button.innerHTML = originalBtnText;
        button.disabled = false;
        
        // Cacher le message de succès après 5 secondes
        setTimeout(() => {
            contactSuccess.classList.remove('translate-y-0');
            contactSuccess.classList.add('translate-y-full');
        }, 5000);
    }
});

// TERMINAL ET EASTER EGG MATRIX
const tInput = document.getElementById('terminal-input');
const tContent = document.getElementById('terminal-content');

function activateMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.opacity = '1';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*'.split('');
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    };
    
    const interval = setInterval(draw, 33);
    setTimeout(() => {
        canvas.style.opacity = '0';
        setTimeout(() => clearInterval(interval), 1000);
    }, 6000);
}

tInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const cmd = tInput.value.toLowerCase().trim();
        if (!cmd) return;
        
        const p = document.createElement('p');
        p.className = 'mt-1';
        p.innerHTML = `<span class="text-white">root@abrossard:~$</span> `;
        p.appendChild(document.createTextNode(cmd)); // Protège contre la faille XSS
        tContent.insertBefore(p, tInput.parentElement);

        const response = document.createElement('p');
        response.className = 'mt-1 opacity-80';
        
        if(cmd === 'help') {
            response.innerHTML = "Commands: <span class='gold-text'>info, skills, cv, clear, sudo matrix</span>";
        } else if(cmd === 'info') {
            response.innerHTML = "[USER] Armand Brossard - Ingénieur Systèmes & Réseaux";
        } else if(cmd === 'skills') {
            response.innerHTML = `> HARD: Admin Sys, Réseaux, Sécu, Scripting<br>> SOFT: Rigueur, Équipe, Adaptabilité`;
        } else if(cmd === 'cv') {
            // TÉLÉCHARGEMENT DU CV ICI
            response.innerHTML = "<span class='gold-text'>[DOWNLOAD]</span> Initialisation du téléchargement...";
            const a = document.createElement('a');
            a.href = 'assets/cv.pdf'; // Chemin vers le PDF
            a.download = 'CV_Armand_Brossard.pdf'; // Nom du fichier téléchargé
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else if(cmd === 'sudo matrix') {
            response.innerHTML = "<span class='text-green-400'>Wake up, Neo...</span>";
            activateMatrix();
        } else if(cmd === 'clear') { 
            while (tContent.children.length > 2) tContent.removeChild(tContent.firstChild);
            tInput.value = ''; return; 
        } else {
            response.textContent = `bash: ${cmd}: command not found`; // Protégé !
        }
        
        tContent.insertBefore(response, tInput.parentElement);
        tInput.value = '';
        tContent.scrollTop = tContent.scrollHeight;
    }
});

// JEU CYBER AVANCÉ
let secretPin = Math.floor(1000 + Math.random() * 9000);
let maxAttempts = 15;
let attemptsLeft = maxAttempts;
let timeLeft = 99;
let gameActive = false;
let timerInterval;

const pinInput = document.getElementById('pin-input');
const pinBtn = document.getElementById('pin-btn');
const gameMsg = document.getElementById('game-msg');
const gameDisplay = document.getElementById('game-display');
const resetBtn = document.getElementById('reset-game-btn');
const healthBar = document.getElementById('health-bar');
const timerDisplay = document.getElementById('timer-display');
const lockIcon = document.getElementById('lock-icon');
const gameBox = document.getElementById('game-box');

function startTimer() {
    if(gameActive) return;
    gameActive = true;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = currentLang === 'fr' ? `TEMPS: ${timeLeft}s` : `TIME: ${timeLeft}s`;
        if(timeLeft <= 10) timerDisplay.classList.add('animate-ping', 'text-red-500');
        if (timeLeft <= 0) gameOver(currentLang === 'fr' ? "TEMPS ÉCOULÉ. VERROUILLAGE." : "TIME OUT. LOCKDOWN.");
    }, 1000);
}

function gameOver(msg) {
    clearInterval(timerInterval);
    gameActive = false;
    gameMsg.textContent = msg;
    gameMsg.className = "text-sm mono text-red-500 font-bold";
    pinInput.disabled = true;
    pinBtn.disabled = true;
    lockIcon.className = "fas fa-lock text-4xl text-red-500";
    gameBox.classList.add('border-red-500');
    resetBtn.classList.remove('hidden');
}

function checkPin() {
    if(!gameActive && timeLeft === 60) startTimer();
    if(!gameActive) return;

    const guess = parseInt(pinInput.value);
    if (isNaN(guess) || guess < 1000 || guess > 9999) {
        gameMsg.textContent = currentLang === 'fr' ? "Erreur: Entrez 4 chiffres." : "Error: Enter 4 digits.";
        return;
    }
    
    attemptsLeft--;
    const healthPercent = (attemptsLeft / maxAttempts) * 100;
    healthBar.style.width = `${healthPercent}%`;
    
    if(healthPercent <= 30) healthBar.className = "h-full w-full transition-all bg-red-500";
    else if(healthPercent <= 60) healthBar.className = "h-full w-full transition-all bg-yellow-500";

    if (guess === secretPin) {
        clearInterval(timerInterval);
        gameActive = false;
        gameMsg.innerHTML = currentLang === 'fr' ? "ACCÈS AUTORISÉ <i class='fas fa-check-circle ml-2'></i>" : "ACCESS GRANTED <i class='fas fa-check-circle ml-2'></i>";
        gameMsg.className = "text-sm mono text-green-400 font-bold";
        gameDisplay.textContent = secretPin;
        gameDisplay.className = "text-5xl tracking-[0.4em] mb-8 font-bold text-green-400 drop-shadow-[0_0_15px_#4ade80]";
        lockIcon.className = "fas fa-unlock-alt text-4xl text-green-400";
        pinInput.disabled = true;
        pinBtn.disabled = true;
        resetBtn.classList.remove('hidden');
    } else if (attemptsLeft <= 0) {
        gameOver(currentLang === 'fr' ? "INTÉGRITÉ À 0%. VERROUILLAGE." : "INTEGRITY 0%. LOCKDOWN.");
    } else {
        gameBox.classList.add('animate-[shake_0.5s_ease-in-out]');
        setTimeout(() => gameBox.classList.remove('animate-[shake_0.5s_ease-in-out]'), 500);
        
        const isHigher = guess < secretPin;
        if(currentLang === 'fr') {
            gameMsg.textContent = `Échec. Le code est ${isHigher ? 'PLUS GRAND' : 'PLUS PETIT'}. (${attemptsLeft} essais restants)`;
        } else {
            gameMsg.textContent = `Failed. Code is ${isHigher ? 'HIGHER' : 'LOWER'}. (${attemptsLeft} tries left)`;
        }
    }
    pinInput.value = '';
    pinInput.focus();
}

pinInput.addEventListener('focus', () => { if(!gameActive && timeLeft === 60) startTimer(); });
pinBtn.addEventListener('click', checkPin);
pinInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') checkPin(); });

resetBtn.addEventListener('click', () => {
    secretPin = Math.floor(1000 + Math.random() * 9000);
    attemptsLeft = maxAttempts;
    timeLeft = 60;
    gameActive = false;
    clearInterval(timerInterval);
    timerDisplay.textContent = currentLang === 'fr' ? `TEMPS: 60s` : `TIME: 60s`;
    timerDisplay.classList.remove('animate-ping', 'text-red-500');
    healthBar.style.width = "100%";
    healthBar.className = "h-full bg-green-500 w-full transition-all";
    pinInput.disabled = false;
    pinBtn.disabled = false;
    lockIcon.className = "fas fa-lock text-4xl text-green-400";
    gameBox.classList.remove('border-red-500');
    gameMsg.textContent = currentLang === 'fr' ? "Système réinitialisé. En attente..." : "System rebooted. Awaiting...";
    gameMsg.className = "text-sm mono text-green-400";
    gameDisplay.textContent = "****";
    gameDisplay.className = "text-5xl tracking-[0.4em] mb-8 font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]";
    resetBtn.classList.add('hidden');
});