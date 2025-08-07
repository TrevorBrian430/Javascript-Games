document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const gameContainer = document.getElementById('game-container');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');
    const farmScene = document.getElementById('farm-scene');
    const instructionText = document.getElementById('instruction-text');
    const progressList = document.getElementById('progress-list');
    const labelsContainer = document.getElementById('labels-container');
    const infoModal = document.getElementById('info-modal');
    const modalCloseBtn = document.querySelector('.close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalText = document.getElementById('modal-text');
    const promptQuestion = document.getElementById('prompt-question');
    const promptAnswerBtn = document.getElementById('prompt-answer-btn');
    const promptAnswer = document.getElementById('prompt-answer');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');

    // --- Game Data ---
    const soilMethods = [
        {
            id: 'stripCropping',
            name: 'Strip Cropping',
            description: 'Planting different crops in rows across a slope helps reduce water runoff and keeps soil from being washed away.',
            prompt: {
                question: 'Why do you think planting different crops in strips is helpful?',
                answer: 'The strips slow down water, and the different root systems help hold the soil together!'
            },
            coords: { top: '15%', left: '10%' },
            size: { width: '150px', height: '120px' },
            imgPath: 'assets/strip_cropping.gif'
        },
        {
            id: 'grassedWaterway',
            name: 'Grassed Waterway',
            description: 'It gently guides rainwater through the land without taking soil with it. Like a natural drain with grass for armor!',
            prompt: {
                question: 'Click to watch how water flows safely through this grassed path.',
                answer: 'The grass protects the channel from erosion while allowing water to flow through.'
            },
            coords: { top: '50%', left: '30%' },
            size: { width: '100px', height: '150px' },
            imgPath: 'assets/grassed_waterway.gif'
        },
        {
            id: 'soilBund',
            name: 'Soil Bund',
            description: 'These thick, curved ridges slow down water and hold soil in place during heavy rains.',
            prompt: {
                question: 'Can you guess why they follow the shape of the hill?',
                answer: 'To intercept water as it flows downhill, making it spread out and soak in.'
            },
            coords: { top: '60%', left: '5%' },
            size: { width: '200px', height: '80px' },
            imgPath: 'assets/soil_bund.gif'
        },
        {
            id: 'trashLine',
            name: 'Trash Line',
            description: 'Not garbage, but dried plant remains! These lines slow rainwater and protect loose soil after tilling.',
            prompt: {
                question: 'Click to see a real photo of a farmer using trash lines.',
                answer: 'These organic barriers also add nutrients back to the soil as they decompose.'
            },
            coords: { top: '25%', left: '65%' },
            size: { width: '180px', height: '90px' },
            imgPath: 'assets/trash_line.jpg'
        },
        {
            id: 'stoneLine',
            name: 'Stone Line',
            description: 'Stone lines are natural barriers. When laid across slopes, they slow down water and trap soil moving downhill.',
            prompt: {
                question: 'Tap to see how water slows behind the stones!',
                answer: 'The small dams created by the stones give water more time to soak into the ground.'
            },
            coords: { top: '70%', left: '75%' },
            size: { width: '150px', height: '100px' },
            imgPath: 'assets/stone_line.gif'
        }
    ];

    // --- Game State ---
    let gameState = {
        activity: 1,
        discovered: [],
        matched: []
    };

    // --- Functions ---

    function startGame() {
        startScreen.classList.remove('visible');
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        gameScreen.classList.add('visible');
        initActivity1();
    }

    function switchScreen(hide, show) {
        hide.classList.remove('visible');
        hide.classList.add('hidden');
        show.classList.remove('hidden');
        show.classList.add('visible');
    }

    function initActivity1() {
        instructionText.textContent = 'Welcome to the Smart Farm! 🌾 Click each area to uncover how farmers use clever methods to stop erosion.';
        farmScene.innerHTML = ''; // Clear previous elements
        progressList.innerHTML = '';

        soilMethods.forEach(method => {
            // Create hotspot
            const hotspot = document.createElement('div');
            hotspot.classList.add('hotspot');
            hotspot.dataset.id = method.id;
            hotspot.style.top = method.coords.top;
            hotspot.style.left = method.coords.left;
            hotspot.style.width = '100px'; // Standard size for hotspots
            hotspot.style.height = '100px';
            hotspot.addEventListener('click', () => onHotspotClick(method));
            farmScene.appendChild(hotspot);

            // Create progress list item
            const li = document.createElement('li');
            li.id = `progress-${method.id}`;
            li.textContent = method.name;
            progressList.appendChild(li);
        });
    }

    function onHotspotClick(method) {
        // Update game state
        if (!gameState.discovered.includes(method.id)) {
            gameState.discovered.push(method.id);
            document.getElementById(`progress-${method.id}`).classList.add('discovered');
            document.querySelector(`.hotspot[data-id="${method.id}"]`).classList.add('discovered');
        }

        // Show modal
        modalTitle.textContent = method.name;
        modalImage.src = method.imgPath;
        modalImage.alt = method.name;
        modalText.textContent = method.description;
        promptQuestion.textContent = method.prompt.question;
        promptAnswer.textContent = method.prompt.answer;
        promptAnswer.classList.add('hidden');
        promptAnswerBtn.onclick = () => promptAnswer.classList.toggle('hidden');

        infoModal.classList.remove('hidden');

        // Check for completion
        if (gameState.discovered.length === soilMethods.length) {
            instructionText.textContent = '🏅 Badge Unlocked: "Soil Spotter!" You\'ve found all the soil defenders. Now, let\'s test your knowledge!';
            setTimeout(initActivity2, 3000); // Wait 3 seconds before starting next activity
        }
    }

    function closeModal() {
        infoModal.classList.add('hidden');
    }

    function initActivity2() {
        gameState.activity = 2;
        farmScene.innerHTML = ''; // Clear hotspots
        labelsContainer.innerHTML = ''; // Clear old labels
        labelsContainer.style.display = 'flex';
        instructionText.textContent = 'Now, drag and drop each label to its correct place on the farm!';

        const shuffledMethods = [...soilMethods].sort(() => Math.random() - 0.5);

        shuffledMethods.forEach(method => {
            // Create Drop Zones
            const dropZone = document.createElement('div');
            dropZone.classList.add('drop-zone');
            dropZone.dataset.id = method.id;
            dropZone.style.top = method.coords.top;
            dropZone.style.left = method.coords.left;
            dropZone.style.width = method.size.width;
            dropZone.style.height = method.size.height;
            farmScene.appendChild(dropZone);

            // Create Draggable Labels
            const label = document.createElement('div');
            label.classList.add('draggable-label');
            label.dataset.id = method.id;
            label.textContent = method.name;
            label.draggable = true;
            labelsContainer.appendChild(label);
        });

        addDragAndDropListeners();
    }

    function addDragAndDropListeners() {
        const labels = document.querySelectorAll('.draggable-label');
        const dropZones = document.querySelectorAll('.drop-zone');

        labels.forEach(label => {
            label.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', e.target.dataset.id);
                setTimeout(() => label.classList.add('dragging'), 0);
            });
            label.addEventListener('dragend', () => label.classList.remove('dragging'));
        });

        dropZones.forEach(zone => {
            zone.addEventListener('dragover', e => {
                e.preventDefault();
                zone.classList.add('over');
            });
            zone.addEventListener('dragleave', () => zone.classList.remove('over'));
            zone.addEventListener('drop', e => {
                e.preventDefault();
                zone.classList.remove('over');
                const draggedId = e.dataTransfer.getData('text/plain');
                const droppedOnId = zone.dataset.id;

                if (draggedId === droppedOnId) {
                    // Correct match
                    zone.classList.add('correct');
                    zone.innerHTML = `<p>${draggedId}</p>`;
                    const draggedLabel = document.querySelector(`.draggable-label[data-id="${draggedId}"]`);
                    draggedLabel.style.display = 'none'; // Hide label
                    gameState.matched.push(draggedId);

                    // Make zone no longer a drop target
                    zone.removeEventListener('dragover', e);
                    zone.removeEventListener('dragleave', e);
                    zone.removeEventListener('drop', e);

                    if (gameState.matched.length === soilMethods.length) {
                        instructionText.textContent = '🏆 Bravo, Soil Saver! You’ve matched them all!';
                        setTimeout(endGame, 2000);
                    }
                } else {
                    // Incorrect match - maybe add a visual cue like a red flash
                    zone.style.animation = 'shake 0.5s';
                    setTimeout(() => zone.style.animation = '', 500);
                }
            });
        });
    }

    function endGame() {
        switchScreen(gameScreen, endScreen);
    }

    function restartGame() {
        gameState = { activity: 1, discovered: [], matched: [] };
        labelsContainer.style.display = 'none';
        switchScreen(endScreen, startScreen);
    }

    // --- Event Listeners ---
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', restartGame);
    modalCloseBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target == infoModal) {
            closeModal();
        }
    });

});

// Add shake animation to CSS if not there
const styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = `
@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}
`;
document.head.appendChild(styleSheet);
