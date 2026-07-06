# ZenDecision

Une Progressive Web App (PWA) pour créer votre ambiance sonore parfaite. Mélangez plusieurs sons pour une expérience personnalisée et apaisante.

## Fonctionnalités

- 🎵 **Mélange de sons** : Combinez plusieurs sons pour créer votre ambiance idéale
- 🌙 **Mode sombre/clair** : Interface adaptée à votre préférence
- 📱 **PWA** : Installez l'application sur votre appareil
- 🎲 **Sélection aléatoire** : Découvrez de nouveaux sons
- 🔊 **Contrôle de volume** : Gérez le volume global et individuel
- ⚡ **Offline** : Fonctionne sans connexion internet

## Catégories de sons

### 🌙 Sommeil
- Bruit Rose
- Bruit Brun
- Pluie Douce
- Vagues Nocturnes

### 📚 Étude
- Lo-Fi Study
- Forêt Calme
- Pluie Fenêtre

### 😊 Joie
- Oiseaux Matinaux
- Forêt Printanière

### 🥾 Promenade
- Vagues Océan
- Forêt Marche

## Installation

### Depuis le web
1. Ouvrez [ZenDecision](https://votre-domaine.com)
2. Cliquez sur le bouton "Installer" dans l'en-tête
3. Confirmez l'installation

### Développement local
```bash
# Cloner le dépôt
git clone https://github.com/gadfrost/ZenDecision.git
cd ZenDecision

# Servir localement avec Python
python3 -m http.server 8000

# Ou avec Node.js
npx http-server
```

Accédez à `http://localhost:8000`

## Technologies

- HTML5
- CSS3 (avec variables CSS)
- JavaScript vanilla
- Service Worker (PWA)
- Web Audio API

## Structure du projet

```
ZenDecision/
├── index.html           # Page principale
├── style.css            # Styles
├── script.js            # Logique applicative
├── sw.js                # Service Worker
├── manifest.json        # Manifeste PWA
├── README.md            # Documentation
├── .gitignore           # Fichiers ignorés par Git
└── assets/
    ├── icon-192.png     # Icône PWA (192x192)
    ├── icon-512.png     # Icône PWA (512x512)
    └── sounds/          # Fichiers audio
        ├── brown_noise.mp3
        ├── forest_calm.mp3
        ├── forest_spring.mp3
        ├── forest_walk.mp3
        ├── lofi_study.mp3
        ├── morning_birds.mp3
        ├── ocean_waves.mp3
        ├── ocean_waves_night.mp3
        ├── pink_noise.mp3
        ├── rain_ambient.mp3
        └── rain_window.mp3
```

## Améliorations récentes

- ✅ Correction du Service Worker avec les vrais noms de fichiers audio
- ✅ Suppression du script de monétisation malveillant
- ✅ Amélioration de la gestion des erreurs audio
- ✅ Nettoyage des ressources au déchargement de la page
- ✅ Suppression du code hérité
- ✅ Meilleure gestion de la visibilité de la page

## Licence

MIT

## Auteur

Créé avec ❤️ pour votre bien-être
