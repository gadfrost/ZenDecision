// ============================================
// ZenDecision - Script Définitif (Sons Stables)
// ============================================

const soundsData = {
    sommeil: [
        { name: 'Océan Nocturne', icon: '🌊', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Ocean_waves_on_shingle_beach.ogg' },
        { name: 'Pluie Douce', icon: '🌧️', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Rain_heavy_on_roof_and_thunder.ogg' },
        { name: 'Orage Lointain', icon: '⛈️', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Thunderstorm_in_the_woods.ogg' },
        { name: 'Bruit Blanc', icon: '🌙', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/White_noise.ogg' },
        { name: 'Vagues Calmes', icon: '🌊', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Ocean_waves_on_shingle_beach.ogg' }
    ],
    etude: [
        { name: 'Café Calme', icon: '☕', url: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg' },
        { name: 'Bibliothèque', icon: '📚', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Indoor_ambience_library.ogg' },
        { name: 'Forêt Calme', icon: '🌲', url: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Summer_forest_ambience.ogg' },
        { name: 'Vent Doux', icon: '🍃', url: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Wind_in_trees.ogg' },
        { name: 'Lo-Fi Ambiance', icon: '🎧', url: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg' }
    ],
    joie: [
        { name: 'Oiseaux Matin', icon: '🐦', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Early_morning_birds.ogg' },
        { name: 'Rivière Vive', icon: '💧', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Small_river_stream.ogg' },
        { name: 'Parc en Fleurs', icon: '🌸', url: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Summer_forest_ambience.ogg' },
        { name: 'Marché', icon: '🍎', url: 'https://actions.google.com/sounds/v1/ambiences/crowd_cheering.ogg' },
        { name: 'Campagne', icon: '☀️', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Early_morning_birds.ogg' }
    ],
    promenade: [
        { name: 'Vagues Plage', icon: '🏖️', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Ocean_waves_on_shingle_beach.ogg' },
        { name: 'Pas Gravier', icon: '🥾', url: 'https://actions.google.com/sounds/v1/human/footsteps_gravel.ogg' },
        { name: 'Ruelle', icon: '🏘️', url: 'https://actions.google.com/sounds/v1/ambiences/city_street.ogg' },
        { name: 'Montagne', icon: '🏔️', url: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Wind_in_trees.ogg' },
        { name: 'Bord de Lac', icon: '🛶', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Small_river_stream.ogg' }
    ]
};

let appState = { currentCategory: 'sommeil', activeSounds: {}, masterVolume: 70, installPrompt: null, darkMode: false };
const soundGrid = document.getElementById('sound-grid');
const categoryButtons = document.querySelectorAll('.category-btn');
const masterVolumeSlider = document.getElementById('master-volume');
const activeSoundsList = document.getElementById('active-sounds-list');
const installBtn = document.getElementById('install-btn');
const themeToggle = document.getElementById('theme-toggle');

document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeApp();
    setupInstallPrompt();
    setupThemeToggle();
});

function initializeTheme() {
    const savedTheme = localStorage.getItem('zen-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    appState.darkMode = savedTheme ? savedTheme === 'dark' : prefersDark;
    applyTheme(appState.darkMode);
}

function applyTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('zen-theme', isDark ? 'dark' : 'light');
}

function setupThemeToggle() {
    themeToggle.addEventListener('click', () => { appState.darkMode = !appState.darkMode; applyTheme(appState.darkMode); });
}

function initializeApp() {
    renderSounds(appState.currentCategory);
    categoryButtons.forEach(btn => btn.addEventListener('click', () => {
        categoryButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        appState.currentCategory = btn.dataset.category;
        renderSounds(appState.currentCategory);
    }));
    masterVolumeSlider.addEventListener('input', (e) => { appState.masterVolume = e.target.value; updateAllSoundVolumes(); });
}

function renderSounds(category) {
    soundGrid.innerHTML = '';
    soundsData[category].forEach((sound) => {
        const btn = document.createElement('button');
        btn.className = 'sound-btn';
        btn.innerHTML = `<span class="icon">${sound.icon}</span><span class="label">${sound.name}</span><span class="indicator"></span>`;
        btn.addEventListener('click', () => toggleSound(sound, category, btn));
        soundGrid.appendChild(btn);
    });
}

function toggleSound(sound, category, btn) {
    const soundKey = `${category}-${sound.name}`;
    if (appState.activeSounds[soundKey]) {
        appState.activeSounds[soundKey].audio.pause();
        delete appState.activeSounds[soundKey];
        btn.classList.remove('playing');
    } else {
        const audio = new Audio(sound.url);
        audio.loop = true;
        audio.volume = (appState.masterVolume / 100) * 0.8;
        audio.play().catch(e => console.error(e));
        appState.activeSounds[soundKey] = { audio, name: sound.name, icon: sound.icon };
        btn.classList.add('playing');
    }
    updateActiveSoundsList();
}

function updateAllSoundVolumes() {
    Object.keys(appState.activeSounds).forEach(key => appState.activeSounds[key].audio.volume = (appState.masterVolume / 100) * 0.8);
}

function updateActiveSoundsList() {
    activeSoundsList.innerHTML = '';
    Object.keys(appState.activeSounds).forEach(key => {
        const sound = appState.activeSounds[key];
        const tag = document.createElement('div');
        tag.className = 'active-sound-tag';
        tag.innerHTML = `<span>${sound.icon} ${sound.name}</span><span class="remove-sound">✕</span>`;
        tag.querySelector('.remove-sound').addEventListener('click', () => {
            sound.audio.pause();
            delete appState.activeSounds[key];
            updateActiveSoundsList();
            renderSounds(appState.currentCategory);
        });
        activeSoundsList.appendChild(tag);
    });
}

function setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        appState.installPrompt = e;
        installBtn.style.display = 'flex';
    });
    installBtn.addEventListener('click', async () => {
        if (!appState.installPrompt) return;
        appState.installPrompt.prompt();
        appState.installPrompt = null;
        installBtn.style.display = 'none';
    });
}
