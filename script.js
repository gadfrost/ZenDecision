document.addEventListener('DOMContentLoaded', () => {
    // --- Gestion des Onglets ---
    const tabFocus = document.getElementById('tab-focus');
    const tabDecision = document.getElementById('tab-decision');
    const sectionFocus = document.getElementById('section-focus');
    const sectionDecision = document.getElementById('section-decision');

    tabFocus.addEventListener('click', () => {
        tabFocus.classList.add('active');
        tabDecision.classList.remove('active');
        sectionFocus.classList.remove('hidden');
        sectionDecision.classList.add('hidden');
    });

    tabDecision.addEventListener('click', () => {
        tabDecision.classList.add('active');
        tabFocus.classList.remove('active');
        sectionDecision.classList.remove('hidden');
        sectionFocus.classList.add('hidden');
    });

    // --- Gestion des Sons ---
    const soundBtns = document.querySelectorAll('.sound-btn');
    const audioElements = {};

    // Initialisation des éléments audio
    soundBtns.forEach(btn => {
        const soundType = btn.getAttribute('data-sound');
        const audio = new Audio(`assets/sounds/${soundType}.mp3`);
        audio.loop = true;
        audioElements[soundType] = audio;

        btn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().catch(err => console.log("Audio play blocked by browser", err));
                btn.classList.add('playing');
            } else {
                audio.pause();
                btn.classList.remove('playing');
            }
        });
    });

    // --- Gestion de la Décision ---
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

        // Ajouter les écouteurs pour supprimer
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                options.splice(index, 1);
                updateOptionsList();
            });
        });
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
            resultDisplay.style.color = "#e74c3c";
            return;
        }

        resultDisplay.textContent = "Tirage en cours...";
        resultDisplay.style.color = "#f1c40f";
        resultDisplay.classList.remove('animate-pop');

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * options.length);
            const winner = options[randomIndex];
            resultDisplay.textContent = `Résultat : ${winner}`;
            resultDisplay.style.color = "#2ecc71";
            resultDisplay.classList.add('animate-pop');
        }, 800);
    });
});
