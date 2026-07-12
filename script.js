// ========================================================
// ZenDecision - Version Optimisée avec 20 ambiances
// ========================================================

const soundsData = {
    sommeil: [
        { name: 'Océan Nocturne', icon: '🌊', file: 'ocean_night' },
        { name: 'Pluie sous Tente', icon: '⛺', file: 'rain_tent' },
        { name: 'Orage Lointain', icon: '⛈️', file: 'distant_storm' },
        { name: 'Bruit Rose', icon: '🌙', file: 'pink_noise' },
        { name: 'Bruit Brun', icon: '🤎', file: 'brown_noise' }
    ],
    etude: [
        { name: 'Café Calme', icon: '☕', file: 'coffee_shop' },
        { name: 'Bibliothèque', icon: '📚', file: 'library' },
        { name: 'Forêt Profonde', icon: '🌲', file: 'deep_forest' },
        { name: 'Vent Doux', icon: '🍃', file: 'soft_wind' },
        { name: 'Lo-Fi Study', icon: '🎧', file: 'lofi_study' }
    ],
    joie: [
        { name: 'Oiseaux Matin', icon: '🐦', file: 'morning_birds' },
        { name: 'Rivière Vive', icon: '💧', file: 'river_flow' },
        { name: 'Parc en Fleurs', icon: '🌸', file: 'spring_park' },
        { name: 'Marché Local', icon: '🍎', file: 'market' },
        { name: 'Campagne', icon: '☀️', file: 'countryside' }
    ],
    promenade: [
        { name: 'Vagues Plage', icon: '🏖️', file: 'beach_waves' },
        { name: 'Pas sur Gravier', icon: '🥾', file: 'gravel_walk' },
        { name: 'Ruelle Ancienne', icon: '🏘️', file: 'old_street' },
        { name: 'Montagne', icon: '🏔️', file: 'mountain' },
        { name: 'Bord de Lac', icon: '🛶', file: 'lake_shore' }
    ]
};

// État de l'app
let appState = {
    currentCategory: 'sommeil',
    activeSounds: {},
    masterVolume: 70
};

// Fonction pour toggle les sons
function toggleSound(sound, category, btn) {
    const soundKey = `${category}-${sound.file}`;
    
    if (appState.activeSounds[soundKey]) {
        appState.activeSounds[soundKey].audio.pause();
        delete appState.activeSounds[soundKey];
        btn.classList.remove('playing');
    } else {
        // Chemin vers tes fichiers sur GitHub
        const audio = new Audio(`assets/sounds/${sound.file}.mp3`);
        audio.loop = true;
        audio.volume = (appState.masterVolume / 100) * 0.8;
        audio.play().catch(e => console.error("Erreur lecture:", e));
        
        appState.activeSounds[soundKey] = { audio, name: sound.name, icon: sound.icon };
        btn.classList.add('playing');
    }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    // Appel des fonctions de rendu (renderSounds existant)
    renderSounds(appState.currentCategory);
});
