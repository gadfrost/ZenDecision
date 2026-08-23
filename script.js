// ZenDecision — gestionnaire audio robuste
// Les sons distants sont utilisés quand ils répondent correctement ; un fallback Web Audio
// permet à l’interface de rester fonctionnelle si un hébergeur renvoie une erreur.

const soundsData = {
    sommeil: [
        { id: 'ocean', name: 'Océan Nocturne', icon: '🌊', url: 'https://actions.google.com/sounds/v1/ambiences/outside_night.ogg' },
        { id: 'rain', name: 'Pluie Douce', icon: '🌧️', url: 'https://actions.google.com/sounds/v1/ambiences/crickets_with_distant_traffic.ogg' },
        { id: 'storm', name: 'Orage Lointain', icon: '⛈️', url: 'https://actions.google.com/sounds/v1/ambiences/daytime_forrest_bonfire.ogg' },
        { id: 'white-noise', name: 'Bruit Blanc', icon: '🌙', url: 'https://actions.google.com/sounds/v1/ambiences/ambient_hum_air_conditioner.ogg' },
        { id: 'calm-waves', name: 'Vagues Calmes', icon: '🌊', url: 'https://actions.google.com/sounds/v1/ambiences/warm_evening_outdoors.ogg' }
    ],
    etude: [
        { id: 'coffee', name: 'Café Calme', icon: '☕', url: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg' },
        { id: 'library', name: 'Bibliothèque', icon: '📚', url: 'https://actions.google.com/sounds/v1/ambiences/convention_hall_ambience_noise.ogg' },
        { id: 'forest', name: 'Forêt Calme', icon: '🌲', url: 'https://actions.google.com/sounds/v1/ambiences/spring_day_forest.ogg' },
        { id: 'wind', name: 'Vent Doux', icon: '🍃', url: 'https://actions.google.com/sounds/v1/ambiences/warm_afternoon_outdoors.ogg' },
        { id: 'lofi', name: 'Lo-Fi Ambiance', icon: '🎧', url: 'https://actions.google.com/sounds/v1/ambiences/arcade_room.ogg' }
    ],
    joie: [
        { id: 'birds', name: 'Oiseaux Matin', icon: '🐦', url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_summer_ambience.ogg' },
        { id: 'river', name: 'Rivière Vive', icon: '💧', url: 'https://actions.google.com/sounds/v1/ambiences/jungle_small_rapids.ogg' },
        { id: 'flower-park', name: 'Parc en Fleurs', icon: '🌸', url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_suburb_ambience.ogg' },
        { id: 'market', name: 'Marché', icon: '🍎', url: 'https://actions.google.com/sounds/v1/ambiences/small_outdoor_marketplace.ogg' },
        { id: 'countryside', name: 'Campagne', icon: '☀️', url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_farm_sounds.ogg' }
    ],
    promenade: [
        { id: 'beach-waves', name: 'Vagues Plage', icon: '🏖️', url: 'https://actions.google.com/sounds/v1/ambiences/summer_beach_parking_lot.ogg' },
        { id: 'gravel', name: 'Pas Gravier', icon: '🥾', url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_sounds_with_whirr.ogg' },
        { id: 'street', name: 'Ruelle', icon: '🏘️', url: 'https://actions.google.com/sounds/v1/ambiences/distant_highway.ogg' },
        { id: 'mountain', name: 'Montagne', icon: '🏔️', url: 'https://actions.google.com/sounds/v1/ambiences/jungle_atmosphere_night.ogg' },
        { id: 'lake', name: 'Bord de Lac', icon: '🛶', url: 'https://actions.google.com/sounds/v1/ambiences/lake_wind_ambience.ogg' }
    ]
};

let appState = { currentCategory: 'sommeil', activeSounds: {}, masterVolume: 70, installPrompt: null, darkMode: false };
let audioContext = null;
const soundGrid = document.getElementById('sound-grid');
const categoryButtons = document.querySelectorAll('.category-btn');
const masterVolumeSlider = document.getElementById('master-volume');
const activeSoundsList = document.getElementById('active-sounds-list');
const installBtn = document.getElementById('install-btn');
const themeToggle = document.getElementById('theme-toggle');
const randomSoundBtn = document.getElementById('random-sound-btn');

window.addEventListener('DOMContentLoaded', () => {
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
    themeToggle.addEventListener('click', () => {
        appState.darkMode = !appState.darkMode;
        applyTheme(appState.darkMode);
    });
}

function initializeApp() {
    renderSounds(appState.currentCategory);
    categoryButtons.forEach(btn => btn.addEventListener('click', () => {
        categoryButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        appState.currentCategory = btn.dataset.category;
        renderSounds(appState.currentCategory);
    }));
    masterVolumeSlider.addEventListener('input', event => {
        appState.masterVolume = Number(event.target.value);
        updateAllSoundVolumes();
    });
    randomSoundBtn.addEventListener('click', () => {
        const sounds = soundsData[appState.currentCategory];
        const sound = sounds[Math.floor(Math.random() * sounds.length)];
        const button = soundGrid.querySelector(`[data-sound-id="${sound.id}"]`);
        toggleSound(sound, appState.currentCategory, button);
    });
}

function renderSounds(category) {
    soundGrid.replaceChildren();
    soundsData[category].forEach(sound => {
        const btn = document.createElement('button');
        btn.className = 'sound-btn';
        btn.dataset.soundId = sound.id;
        btn.innerHTML = `<span class="icon">${sound.icon}</span><span class="label">${sound.name}</span><span class="indicator"></span>`;
        if (appState.activeSounds[makeKey(category, sound)]) btn.classList.add('playing');
        btn.addEventListener('click', () => toggleSound(sound, category, btn));
        soundGrid.appendChild(btn);
    });
}

function makeKey(category, sound) {
    return `${category}:${sound.id}`;
}

function getVolume() {
    return (appState.masterVolume / 100) * 0.8;
}

async function toggleSound(sound, category, btn) {
    const soundKey = makeKey(category, sound);
    const current = appState.activeSounds[soundKey];
    if (current) {
        stopSound(soundKey);
        if (btn) btn.classList.remove('playing');
    } else {
        // Réserver la clé avant play() : les clics rapides ne peuvent plus créer deux lecteurs.
        const entry = { audio: null, fallback: null, name: sound.name, icon: sound.icon, loading: true };
        appState.activeSounds[soundKey] = entry;
        if (btn) btn.classList.add('playing');
        updateActiveSoundsList();
        await startSound(soundKey, sound, entry);
    }
    updateActiveSoundsList();
}

async function startSound(soundKey, sound, entry) {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.loop = true;
    audio.volume = getVolume();
    entry.audio = audio;
    const failed = () => {
        if (appState.activeSounds[soundKey] !== entry) return;
        entry.loading = false;
        entry.error = true;
        startFallback(soundKey, entry);
        updateActiveSoundsList();
    };
    audio.addEventListener('error', failed, { once: true });
    audio.src = sound.url;
    try {
        await audio.play();
        if (appState.activeSounds[soundKey] !== entry) {
            audio.pause();
            audio.removeAttribute('src');
            return;
        }
        entry.loading = false;
    } catch (error) {
        failed();
    }
}

function startFallback(soundKey, entry) {
    if (entry.fallback || appState.activeSounds[soundKey] !== entry) return;
    try {
        audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') audioContext.resume();
        const source = audioContext.createBufferSource();
        const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.12;
        source.buffer = buffer;
        source.loop = true;
        const gain = audioContext.createGain();
        gain.gain.value = getVolume() * 0.35;
        source.connect(gain).connect(audioContext.destination);
        source.start();
        entry.fallback = { source, gain };
    } catch (error) {
        console.error('Fallback audio indisponible', error);
    }
}

function stopSound(soundKey) {
    const entry = appState.activeSounds[soundKey];
    if (!entry) return;
    if (entry.audio) {
        entry.audio.pause();
        entry.audio.currentTime = 0;
        entry.audio.removeAttribute('src');
        entry.audio.load();
    }
    if (entry.fallback) {
        try { entry.fallback.source.stop(); } catch (_) { /* déjà arrêté */ }
        entry.fallback.source.disconnect();
        entry.fallback.gain.disconnect();
    }
    delete appState.activeSounds[soundKey];
}

function updateAllSoundVolumes() {
    Object.values(appState.activeSounds).forEach(entry => {
        if (entry.audio) entry.audio.volume = getVolume();
        if (entry.fallback) entry.fallback.gain.gain.value = getVolume() * 0.35;
    });
}

function updateActiveSoundsList() {
    activeSoundsList.replaceChildren();
    Object.entries(appState.activeSounds).forEach(([key, sound]) => {
        const tag = document.createElement('div');
        tag.className = 'active-sound-tag';
        const label = sound.loading ? `${sound.icon} ${sound.name} — chargement…` : `${sound.icon} ${sound.name}${sound.error ? ' — mode de secours' : ''}`;
        tag.innerHTML = `<span>${label}</span><span class="remove-sound" role="button" tabindex="0" aria-label="Arrêter ${sound.name}">✕</span>`;
        const remove = tag.querySelector('.remove-sound');
        const stop = () => { stopSound(key); updateActiveSoundsList(); renderSounds(appState.currentCategory); };
        remove.addEventListener('click', stop);
        remove.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') stop(); });
        activeSoundsList.appendChild(tag);
    });
}

function setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', event => {
        event.preventDefault();
        appState.installPrompt = event;
        installBtn.style.display = 'flex';
    });
    installBtn.addEventListener('click', async () => {
        if (!appState.installPrompt) return;
        appState.installPrompt.prompt();
        await appState.installPrompt.userChoice;
        appState.installPrompt = null;
        installBtn.style.display = 'none';
    });
}
