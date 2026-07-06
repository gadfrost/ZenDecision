// ============================================
// ZenDecision - Script Principal
// Gestion des sons, PWA et Mode Sombre
// ============================================

// Données des sons organisées par ambiance
const soundsData = {
    sommeil: [
        { name: 'Bruit Rose', icon: '🌙', file: 'pink_noise' },
        { name: 'Bruit Brun', icon: '🌊', file: 'brown_noise' },
        { name: 'Pluie Douce', icon: '🌧️', file: 'rain_ambient' },
        { name: 'Vagues Nocturnes', icon: '🌊', file: 'ocean_waves_night' },
    ],
    etude: [
        { name: 'Lo-Fi Study', icon: '📚', file: 'lofi_study' },
        { name: 'Forêt Calme', icon: '🌲', file: 'forest_calm' },
        { name: 'Pluie Fenêtre', icon: '🪟', file: 'rain_window' },
    ],
    joie: [
        { name: 'Oiseaux Matinaux', icon: '🐦', file: 'morning_birds' },
        { name: 'Forêt Printanière', icon: '🌸', file: 'forest_spring' },
    ],
    promenade: [
        { name: 'Vagues Océan', icon: '🌊', file: 'ocean_waves' },
        { name: 'Forêt Marche', icon: '🥾', file: 'forest_walk' },
    ],
};

// État de l'application
let appState = {
    currentCategory: 'sommeil',
    activeSounds: {},
    masterVolume: 70,
    installPrompt: null,
    darkMode: false
};

// Éléments du DOM
const soundGrid = document.getElementById('sound-grid');
const categoryButtons = document.querySelectorAll('.category-btn');
const masterVolumeSlider = document.getElementById('master-volume');
const activeSoundsList = document.getElementById('active-sounds-list');
const installBtn = document.getElementById('install-btn');
const themeToggle = document.getElementById('theme-toggle');

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeApp();
    setupInstallPrompt();
    setupThemeToggle();
});

// ============================================
// GESTION DU THÈME (Mode Sombre/Clair)
// ============================================

function initializeTheme() {
    // Vérifier les préférences sauvegardées
    const savedTheme = localStorage.getItem('zen-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    appState.darkMode = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    applyTheme(appState.darkMode);
}

function applyTheme(isDark) {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
    
    if (isDark) {
        body.classList.add('dark-mode');
        themeBtn.textContent = '☀️';
        localStorage.setItem('zen-theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        themeBtn.textContent = '🌙';
        localStorage.setItem('zen-theme', 'light');
    }
}

function setupThemeToggle() {
    themeToggle.addEventListener('click', () => {
        appState.darkMode = !appState.darkMode;
        applyTheme(appState.darkMode);
    });
}

// ============================================
// INITIALISATION DE L'APPLICATION
// ============================================

function initializeApp() {
    // Rendre les sons pour la catégorie actuelle
    renderSounds(appState.currentCategory);
    
    // Ajouter les écouteurs de catégories
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            appState.currentCategory = btn.dataset.category;
            renderSounds(appState.currentCategory);
        });
    });

    // Contrôle du volume général
    masterVolumeSlider.addEventListener('input', (e) => {
        appState.masterVolume = e.target.value;
        updateAllSoundVolumes();
    });

    // Initialiser le bouton aléatoire
    setupRandomSoundButton();
}

// ============================================
// GESTION DU BOUTON ALÉATOIRE
// ============================================

function setupRandomSoundButton() {
    const randomBtn = document.getElementById('random-sound-btn');
    if (!randomBtn) return;

    randomBtn.addEventListener('click', () => {
        randomBtn.classList.add('rolling');
        randomBtn.disabled = true;

        setTimeout(() => {
            randomBtn.classList.remove('rolling');
            randomBtn.disabled = false;
            playRandomSound();
        }, 800);
    });
}

function playRandomSound() {
    const categories = Object.keys(soundsData);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const sounds = soundsData[randomCategory];
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    
    if (appState.currentCategory !== randomCategory) {
        appState.currentCategory = randomCategory;
        categoryButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === randomCategory);
        });
        renderSounds(randomCategory);
    }
    
    const soundKey = `${randomCategory}-${randomSound.file}`;
    
    if (!appState.activeSounds[soundKey]) {
        const buttons = document.querySelectorAll('.sound-btn');
        let targetBtn = null;
        buttons.forEach(btn => {
            if (btn.querySelector('.label').textContent === randomSound.name) {
                targetBtn = btn;
            }
        });
        
        toggleSound(randomSound, randomCategory, targetBtn);
        
        if (targetBtn) {
            targetBtn.style.transform = 'scale(1.05)';
            setTimeout(() => targetBtn.style.transform = '', 300);
        }
    }
}

// ============================================
// RENDU DES SONS
// ============================================

function renderSounds(category) {
    soundGrid.innerHTML = '';
    const sounds = soundsData[category];
    
    sounds.forEach((sound, index) => {
        const btn = document.createElement('button');
        btn.className = 'sound-btn';
        btn.innerHTML = `
            <span class="icon">${sound.icon}</span>
            <span class="label">${sound.name}</span>
            <span class="indicator"></span>
        `;
        
        btn.style.animation = `fadeIn 0.6s ease ${index * 0.05}s both`;
        
        btn.addEventListener('click', () => {
            toggleSound(sound, category, btn);
        });
        
        soundGrid.appendChild(btn);
    });
}

// ============================================
// GESTION DES SONS
// ============================================

function toggleSound(sound, category, btn) {
    const soundKey = `${category}-${sound.file}`;
    
    if (appState.activeSounds[soundKey]) {
        // Arrêter le son
        appState.activeSounds[soundKey].audio.pause();
        delete appState.activeSounds[soundKey];
        btn.classList.remove('playing');
    } else {
        // Démarrer le son
        const audio = new Audio(`assets/sounds/${sound.file}.mp3`);
        audio.loop = true;
        audio.volume = (appState.masterVolume / 100) * 0.8;
        
        audio.play().catch(err => {
            console.log("Erreur de lecture audio:", err);
            const indicator = btn.querySelector('.indicator');
            if (indicator) {
                indicator.style.backgroundColor = '#ef4444';
                setTimeout(() => indicator.style.backgroundColor = '', 2000);
            }
        });
        
        appState.activeSounds[soundKey] = {
            audio: audio,
            name: sound.name,
            icon: sound.icon,
            category: category
        };
        
        btn.classList.add('playing');
    }
    
    updateActiveSoundsList();
}

function updateAllSoundVolumes() {
    Object.keys(appState.activeSounds).forEach(key => {
        const sound = appState.activeSounds[key];
        sound.audio.volume = (appState.masterVolume / 100) * 0.8;
    });
}

function updateActiveSoundsList() {
    activeSoundsList.innerHTML = '';
    
    const activeSounds = Object.keys(appState.activeSounds);
    
    if (activeSounds.length === 0) {
        activeSoundsList.innerHTML = '<span class="empty-message">Aucun son actif</span>';
    } else {
        activeSounds.forEach(key => {
            const sound = appState.activeSounds[key];
            const tag = document.createElement('div');
            tag.className = 'active-sound-tag';
            tag.innerHTML = `
                <span>${sound.icon} ${sound.name}</span>
                <span class="remove-sound">✕</span>
            `;
            
            tag.querySelector('.remove-sound').addEventListener('click', () => {
                sound.audio.pause();
                delete appState.activeSounds[key];
                updateActiveSoundsList();
                
                const buttons = document.querySelectorAll('.sound-btn.playing');
                buttons.forEach(btn => {
                    if (btn.querySelector('.label').textContent === sound.name) {
                        btn.classList.remove('playing');
                    }
                });
            });
            
            activeSoundsList.appendChild(tag);
        });
    }
}

// ============================================
// GESTION PWA (Installation Progressive Web App)
// ============================================

function setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        appState.installPrompt = e;
        if (installBtn) {
            installBtn.style.display = 'flex';
        }
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (!appState.installPrompt) return;
            
            appState.installPrompt.prompt();
            const { outcome } = await appState.installPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('PWA installée avec succès');
            }
            
            appState.installPrompt = null;
            installBtn.style.display = 'none';
        });
    }

    window.addEventListener('appinstalled', () => {
        console.log('PWA a été installée');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    });
}

// ============================================
// GESTION DE LA VISIBILITÉ
// ============================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Réduire le volume quand l'app est en arrière-plan
        Object.keys(appState.activeSounds).forEach(key => {
            appState.activeSounds[key].audio.volume = (appState.masterVolume / 100) * 0.4;
        });
    } else {
        // Restaurer le volume quand l'app revient au premier plan
        Object.keys(appState.activeSounds).forEach(key => {
            appState.activeSounds[key].audio.volume = (appState.masterVolume / 100) * 0.8;
        });
    }
});
