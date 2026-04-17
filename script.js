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

    // Ajouter les écouteurs des onglets
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`section-${tabName}`).classList.add('active');
        });
    });

    // Contrôle du volume général
    masterVolumeSlider.addEventListener('input', (e) => {
        appState.masterVolume = e.target.value;
        updateAllSoundVolumes();
    });

    // Initialiser la section Décision
    initializeDecisionSection();
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
            console.log("Audio play blocked:", err);
            alert('Impossible de lire le son. Vérifiez votre connexion.');
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

// --- Section Décision ---
function initializeDecisionSection() {
    const optionInput = document.getElementById('option-input');
    const addOptionBtn = document.getElementById('add-option');
    const optionsList = document.getElementById('options-list');
    const drawBtn = document.getElementById('draw-btn');
    const resultDisplay = document.getElementById('result-display');

    let options = [];

    function updateOptionsList() {
        optionsList.innerHTML = '';
        options.forEach((opt, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${opt}</span>
                <button class="remove-btn" data-index="${index}">&times;</button>
            `;
            optionsList.appendChild(li);
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                options.splice(index, 1);
                updateOptionsList();
            });
        });

        drawBtn.disabled = options.length < 2;
    }

    addOptionBtn.addEventListener('click', () => {
        const val = optionInput.value.trim();
        if (val) {
            options.push(val);
            optionInput.value = '';
            updateOptionsList();
        }
    });

    optionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addOptionBtn.click();
    });

    drawBtn.addEventListener('click', () => {
        if (options.length < 2) {
            resultDisplay.textContent = "Ajoutez au moins 2 options !";
            resultDisplay.classList.remove('success');
            resultDisplay.classList.add('error');
            return;
        }

        resultDisplay.textContent = "Tirage en cours...";
        resultDisplay.classList.remove('success', 'error');

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * options.length);
            const winner = options[randomIndex];
            resultDisplay.textContent = `🎉 ${winner}`;
            resultDisplay.classList.add('success');
        }, 800);
    });
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
