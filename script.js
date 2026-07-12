// ============================================
// ZenDecision - Script Corrigé (Optimisé)
// ============================================

const soundsData = {
    sommeil: [
        { name: 'Bruit Rose', icon: '🌙', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }, // Remplace ces URLs par tes liens favoris
        { name: 'Pluie Douce', icon: '🌧️', url: 'https://actions.google.com/sounds/v1/weather/rain_heavy_with_thunder.ogg' },
    ],
    etude: [
        { name: 'Forêt Calme', icon: '🌲', url: 'https://actions.google.com/sounds/v1/nature/forest_bird_call.ogg' },
    ],
    // ... tu peux ajouter tes autres sons ici avec le même format
};

// MODIFICATION CRITIQUE : Dans toggleSound, on change le chargement
function toggleSound(sound, category, btn) {
    const soundKey = `${category}-${sound.name}`;
    
    if (appState.activeSounds[soundKey]) {
        appState.activeSounds[soundKey].audio.pause();
        delete appState.activeSounds[soundKey];
        btn.classList.remove('playing');
    } else {
        // Chargement depuis une URL externe directe
        const audio = new Audio(sound.url); 
        audio.loop = true;
        audio.volume = (appState.masterVolume / 100) * 0.8;
        audio.play();
        
        appState.activeSounds[soundKey] = { audio, name: sound.name, icon: sound.icon };
        btn.classList.add('playing');
    }
    updateActiveSoundsList();
}
