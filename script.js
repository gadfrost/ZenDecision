// ============================================
// ZenDecision - Code complet avec 20 sons inclus
// ============================================

const soundsData = {
    sommeil: [
        { name: 'Océan Nocturne', icon: '🌊', url: 'https://actions.google.com/sounds/v1/water/ocean_waves.ogg' },
        { name: 'Pluie Douce', icon: '🌧️', url: 'https://actions.google.com/sounds/v1/weather/rain_light.ogg' },
        { name: 'Orage Lointain', icon: '⛈️', url: 'https://actions.google.com/sounds/v1/weather/thunderstorm.ogg' },
        { name: 'Bruit Blanc', icon: '🌙', url: 'https://actions.google.com/sounds/v1/ambiences/white_noise.ogg' },
        { name: 'Vagues Calmes', icon: '🌊', url: 'https://actions.google.com/sounds/v1/water/waves_crashing.ogg' }
    ],
    etude: [
        { name: 'Café Calme', icon: '☕', url: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg' },
        { name: 'Bibliothèque', icon: '📚', url: 'https://actions.google.com/sounds/v1/ambiences/library.ogg' },
        { name: 'Forêt Calme', icon: '🌲', url: 'https://actions.google.com/sounds/v1/nature/forest_bird_call.ogg' },
        { name: 'Vent Doux', icon: '🍃', url: 'https://actions.google.com/sounds/v1/nature/wind_rustling_leaves.ogg' },
        { name: 'Lo-Fi Ambiance', icon: '🎧', url: 'https://actions.google.com/sounds/v1/ambiences/city_street_traffic.ogg' }
    ],
    joie: [
        { name: 'Oiseaux Matin', icon: '🐦', url: 'https://actions.google.com/sounds/v1/animals/bird_chirping.ogg' },
        { name: 'Rivière Vive', icon: '💧', url: 'https://actions.google.com/sounds/v1/water/stream_water.ogg' },
        { name: 'Parc en Fleurs', icon: '🌸', url: 'https://actions.google.com/sounds/v1/nature/insect_buzz.ogg' },
        { name: 'Marché', icon: '🍎', url: 'https://actions.google.com/sounds/v1/ambiences/crowd_cheering.ogg' },
        { name: 'Campagne', icon: '☀️', url: 'https://actions.google.com/sounds/v1/nature/crickets_at_night.ogg' }
    ],
    promenade: [
        { name: 'Vagues Plage', icon: '🏖️', url: 'https://actions.google.com/sounds/v1/water/waves_crashing_beach.ogg' },
        { name: 'Pas Gravier', icon: '🥾', url: 'https://actions.google.com/sounds/v1/human/footsteps_gravel.ogg' },
        { name: 'Ruelle', icon: '🏘️', url: 'https://actions.google.com/sounds/v1/ambiences/city_street.ogg' },
        { name: 'Montagne', icon: '🏔️', url: 'https://actions.google.com/sounds/v1/nature/wind_high_altitude.ogg' },
        { name: 'Bord de Lac', icon: '🛶', url: 'https://actions.google.com/sounds/v1/water/lake_waves.ogg' }
    ]
};

// Fonction de lecture corrigée pour utiliser les URLs
function toggleSound(sound, category, btn) {
    const soundKey = `${category}-${sound.name}`;
    
    if (appState.activeSounds[soundKey]) {
        appState.activeSounds[soundKey].audio.pause();
        delete appState.activeSounds[soundKey];
        btn.classList.remove('playing');
    } else {
        // Utilisation directe de l'URL fournie dans soundsData
        const audio = new Audio(sound.url);
        audio.loop = true;
        audio.volume = (appState.masterVolume / 100) * 0.8;
        audio.play().catch(e => console.error("Erreur de lecture:", e));
        
        appState.activeSounds[soundKey] = { audio, name: sound.name, icon: sound.icon };
        btn.classList.add('playing');
    }
    updateActiveSoundsList();
}

// (Garde le reste de ton fichier script.js original ici : 
// initializeApp, renderSounds, etc. car ils restent fonctionnels)
