// Données des sons par catégorie
const soundsData = {
    nature: [
        { name: 'Pluie', icon: '🌧️', file: 'rain' },
        { name: 'Vent', icon: '🌬️', file: 'wind' },
        { name: 'Forêt', icon: '🌲', file: 'forest' },
        { name: 'Oiseaux', icon: '🐦', file: 'birds' },
        { name: 'Tonnerre', icon: '⛈️', file: 'thunder' },
        { name: 'Vagues', icon: '🌊', file: 'waves' },
        { name: 'Ruisseau', icon: '💧', file: 'stream' },
    ],
    ambiance: [
        { name: 'Café', icon: '☕', file: 'cafe' },
        { name: 'Bibliothèque', icon: '📚', file: 'library' },
        { name: 'Bureau', icon: '🏢', file: 'office' },
        { name: 'Restaurant', icon: '🍽️', file: 'restaurant' },
        { name: 'Feu', icon: '🔥', file: 'fireplace' },
        { name: 'Marché', icon: '🛒', file: 'market' },
    ],
    urbain: [
        { name: 'Ville', icon: '🏙️', file: 'city' },
        { name: 'Trafic', icon: '🚗', file: 'traffic' },
        { name: 'Pluie urbaine', icon: '🌧️', file: 'rain-city' },
        { name: 'Métro', icon: '🚇', file: 'metro' },
        { name: 'Gare', icon: '🚉', file: 'station' },
    ],
    relaxation: [
        { name: 'Méditation', icon: '🧘', file: 'meditation' },
        { name: 'Spa', icon: '🛀', file: 'spa' },
        { name: 'Chants tibétains', icon: '🎵', file: 'tibetan' },
        { name: 'Bol chantant', icon: '🎶', file: 'singing-bowl' },
        { name: 'Bruit blanc', icon: '🌫️', file: 'white-noise' },
    ]
};

// État de l'application
let appState = {
    currentCategory: 'nature',
    activeSounds: {},
    masterVolume: 70,
    installPrompt: null
};

// Éléments du DOM
const soundGrid = document.getElementById('sound-grid');
const categoryButtons = document.querySelectorAll('.category-btn');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const masterVolumeSlider = document.getElementById('master-volume');
const activeSoundsList = document.getElementById('active-sounds-list');
const installBtn = document.getElementById('install-btn');

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupInstallPrompt();
});

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

function setupRandomSoundButton() {
    const randomBtn = document.getElementById('random-sound-btn');
    if (!randomBtn) return;

    randomBtn.addEventListener('click', () => {
        // Animation de roulement
        randomBtn.classList.add('rolling');
        
        // Désactiver temporairement pour éviter le spam
        randomBtn.disabled = true;

        setTimeout(() => {
            randomBtn.classList.remove('rolling');
            randomBtn.disabled = false;
            
            playRandomSound();
        }, 1000);
    });
}

function playRandomSound() {
    // Récupérer toutes les catégories
    const categories = Object.keys(soundsData);
    // Choisir une catégorie aléatoire
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    // Récupérer les sons de cette catégorie
    const sounds = soundsData[randomCategory];
    // Choisir un son aléatoire
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    
    // Changer de catégorie visuellement si nécessaire
    if (appState.currentCategory !== randomCategory) {
        appState.currentCategory = randomCategory;
        categoryButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === randomCategory);
        });
        renderSounds(randomCategory);
    }
    
    // Trouver le bouton du son dans la grille et simuler un clic
    // (ou appeler toggleSound directement)
    const soundKey = `${randomCategory}-${randomSound.file}`;
    
    // Si le son est déjà actif, on ne fait rien ou on le relance ? 
    // L'utilisateur veut "choisir un son", donc on va s'assurer qu'il joue.
    if (!appState.activeSounds[soundKey]) {
        // On cherche le bouton correspondant dans le DOM pour l'effet visuel
        const buttons = document.querySelectorAll('.sound-btn');
        let targetBtn = null;
        buttons.forEach(btn => {
            if (btn.querySelector('.label').textContent === randomSound.name) {
                targetBtn = btn;
            }
        });
        
        toggleSound(randomSound, targetBtn);
        
        // Petit effet visuel sur le bouton sélectionné
        if (targetBtn) {
            targetBtn.style.transform = 'scale(1.1)';
            setTimeout(() => targetBtn.style.transform = '', 300);
        }
    }
}

function renderSounds(category) {
    soundGrid.innerHTML = '';
    const sounds = soundsData[category];
    
    sounds.forEach(sound => {
        const btn = document.createElement('button');
        btn.className = 'sound-btn';
        btn.innerHTML = `
            <div class="sound-btn-bg"></div>
            <span class="icon">${sound.icon}</span>
            <span class="label">${sound.name}</span>
            <input type="range" class="volume-control-mini" min="0" max="100" value="70" style="display: none;">
            <span class="indicator"></span>
        `;
        
        btn.addEventListener('click', () => {
            toggleSound(sound, btn);
        });
        
        soundGrid.appendChild(btn);
    });
}

function toggleSound(sound, btn) {
    const soundKey = `${appState.currentCategory}-${sound.file}`;
    
    if (appState.activeSounds[soundKey]) {
        // Arrêter le son
        appState.activeSounds[soundKey].audio.pause();
        delete appState.activeSounds[soundKey];
        btn.classList.remove('playing');
    } else {
        // Démarrer le son
        const audio = new Audio(`assets/sounds/${sound.file}.mp3`);
        audio.loop = true;
        audio.volume = (appState.masterVolume / 100) * 0.7; // 70% du volume général
        
        audio.play().catch(err => {
            console.log("Audio play error:", err);
            // Si le son ne peut pas être lu, on informe l'utilisateur discrètement
            const indicator = btn.querySelector('.indicator');
            if (indicator) {
                indicator.style.backgroundColor = '#ff4b2b';
                setTimeout(() => indicator.style.backgroundColor = '', 2000);
            }
        });
        
        appState.activeSounds[soundKey] = {
            audio: audio,
            name: sound.name,
            icon: sound.icon
        };
        
        btn.classList.add('playing');
    }
    
    updateActiveSoundsList();
}

function updateAllSoundVolumes() {
    Object.keys(appState.activeSounds).forEach(key => {
        const sound = appState.activeSounds[key];
        sound.audio.volume = (appState.masterVolume / 100) * 0.7;
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
                // Mettre à jour l'apparence du bouton
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



// --- Installation PWA ---
function setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        appState.installPrompt = e;
        installBtn.style.display = 'block';
    });

    installBtn.addEventListener('click', async () => {
        if (!appState.installPrompt) return;
        
        appState.installPrompt.prompt();
        const { outcome } = await appState.installPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('PWA installée');
        }
        
        appState.installPrompt = null;
        installBtn.style.display = 'none';
    });

    window.addEventListener('appinstalled', () => {
        console.log('PWA a été installée');
        installBtn.style.display = 'none';
    });
}
