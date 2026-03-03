/**
 * CONFIGURATION DU JEU
 * On regroupe les images et les textes pour faciliter les futures modifications.
 */
const config = {
    forest: 'images/do-pixel-tileset-for-game-or-map.jpg',
    found: 'images/draw-pixel-art-sprites.jpg',
    kitty: 'images/kittysleeping.gif',
    kittyAwake: 'images/kittyawake.gif',
    hints: [
        "Rien ici, juste le vent...", 
        "Le ruisseau est désert...", 
        "Trop sombre par ici..."
    ]
};

// ÉTAT DU JEU : Variables qui changent pendant la partie
let winningIndex = Math.floor(Math.random() * 3); // Détermine aléatoirement où est le chat
let attempts = 0;           // Compteur d'essais
let isAwake = false;        // État du chat (dort ou réveillé)
let zInterval;              // Stocke l'intervalle des "Zzz" pour pouvoir l'arrêter

// RÉFÉRENCES DOM : Liens vers les éléments HTML
const diag = document.getElementById('dialogue');
const startBtn = document.getElementById('start-btn');
const dirBox = document.querySelector('.direction-box');
const scene = document.querySelector('.scene');
const overlay = document.getElementById('overlay');

/**
 * 1. LOGIQUE DE DÉPART
 * Cache le bouton "Start" et affiche les commandes de direction.
 */
startBtn.onclick = () => {
    startBtn.style.display = 'none';
    dirBox.style.display = 'block';
    diag.innerText = "Par où commencer la recherche ?";
};

/**
 * 2. LES BOUTONS DE DIRECTION
 * On écoute le clic sur chaque bouton pour vérifier si le joueur a trouvé le chat.
 */
document.querySelectorAll('.btn-dir').forEach((btn, index) => {
    btn.onclick = () => {
        attempts++;
        if (index === winningIndex) {
            victory(); // Gagné !
        } else {
            // Perdu : on affiche un indice au hasard et on joue un son
            diag.innerText = config.hints[index] + ` (Essai : ${attempts})`;
            document.getElementById('typeSound').play();
        }
    };
});

/**
 * 3. GESTION DE LA VICTOIRE
 * Déclenche l'écran noir, change le décor et fait apparaître le chaton.
 */
function victory() {
    overlay.classList.add('active'); // Effet de transition (fondu au noir)
    
    setTimeout(() => {
        // Changement de décor et nettoyage de l'interface
        scene.style.backgroundImage = `url('${config.found}')`;
        dirBox.style.display = 'none';
        overlay.classList.remove('active');
        
        document.getElementById('meowSound').play();
        diag.innerText = `TROUVÉ ! Clique sur lui pour le réveiller...`;

        // Création dynamique du chaton
        const kitty = document.createElement('img');
        kitty.src = config.kitty;
        kitty.className = 'kitty';
        scene.appendChild(kitty);

        // Démarre l'animation des bulles de sommeil "Zzz"
        zInterval = setInterval(createZ, 1000);

        // Événement pour réveiller le chaton au clic
        kitty.onclick = () => {
            if (!isAwake) {
                wakeUp(kitty);
            }
        };
    }, 700); // Délai calé sur la transition CSS
}

/**
 * 4. ANIMATION DES "Zzz"
 * Crée un petit 'z' qui s'envole au-dessus du chat toutes les secondes.
 */
function createZ() {
    const kitty = document.querySelector('.kitty');
    if (!kitty) return;

    const z = document.createElement('span');
    z.className = 'zzz';
    z.innerText = 'z';
    
    // Placement aléatoire autour de la tête du chat
    z.style.left = (Math.random() * 10 + 48) + '%'; 
    z.style.top = '45%'; 
    
    scene.appendChild(z);
    
    // On supprime l'élément après l'animation (2s) pour libérer la mémoire
    setTimeout(() => z.remove(), 2000);
}

/**
 * 5. RÉVEIL DU CHAT
 * Change l'image et prépare l'interaction avec le poisson.
 */
function wakeUp(kittyElement) {
    isAwake = true;
    clearInterval(zInterval); // Arrête définitivement les "Zzz"
    
    kittyElement.src = config.kittyAwake; // Change le GIF (yeux ouverts)
    diag.innerText = "Oh ! Tu m'as réveillé ! Donne-moi le poisson ! 🐟🐾";
    
    // Petite animation de "secousse" visuelle pour le réveil
    kittyElement.style.animation = "none";
    setTimeout(() => {
        kittyElement.style.animation = "bounceIn 0.5s ease";
    }, 10);

    // Création de l'inventaire et du poisson à glisser
    const inventory = document.createElement('div');
    inventory.className = 'inventory';
    
    const fish = document.createElement('span');
    fish.className = 'fish-drag';
    fish.innerText = '🐟';
    
    inventory.appendChild(fish);
    document.querySelector('.txt-box').appendChild(inventory);

    // Active la mécanique de Drag & Drop sur le poisson
    makeFishDraggable(fish);
    
    // Ajout du bouton pour recommencer la partie
    const restart = document.createElement('button');
    restart.innerText = "Rejouer ✨";
    restart.style.marginLeft = "10px";
    restart.onclick = () => location.reload();
    document.querySelector('.txt-box').appendChild(restart);
}

/**
 * 6. SYSTÈME DE DRAG & DROP (GLISSER-DÉPOSER)
 * Permet de déplacer le poisson et de détecter s'il touche le chat.
 */
function makeFishDraggable(fishElement) {
    let shiftX, shiftY;

    fishElement.onmousedown = function(event) {
        // Calcule l'endroit précis où on a cliqué sur le poisson
        shiftX = event.clientX - fishElement.getBoundingClientRect().left;
        shiftY = event.clientY - fishElement.getBoundingClientRect().top;

        // On passe en 'fixed' pour pouvoir le bouger partout sur l'écran
        fishElement.style.position = 'fixed';
        fishElement.style.zIndex = 1000;
        document.body.append(fishElement);

        moveAt(event.clientX, event.clientY);

        function moveAt(clientX, clientY) {
            fishElement.style.left = clientX - shiftX + 'px';
            fishElement.style.top = clientY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.clientX, event.clientY);
        }

        // Écoute les mouvements de la souris
        document.addEventListener('mousemove', onMouseMove);

        // Quand on lâche le poisson
        fishElement.onmouseup = function(event) {
            document.removeEventListener('mousemove', onMouseMove);
            fishElement.onmouseup = null;

            // Détection de collision : on regarde ce qu'il y a sous le curseur
            fishElement.hidden = true; // On cache le poisson brièvement
            let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
            fishElement.hidden = false;

            let kittyHit = elemBelow ? elemBelow.closest('.kitty') : null;

            if (kittyHit) {
                // COLLISION RÉUSSIE : Le chat mange le poisson
                diag.innerText = "Miam ! Trop bon ! 🐟✨";
                fishElement.remove(); 
                document.getElementById('meowSound').play();
                
                // Effet de zoom de contentement
                kittyHit.style.transform = "translate(-50%, -50%) scale(1.3)";
                setTimeout(() => {
                    kittyHit.style.transform = "translate(-50%, -50%) scale(1)";
                }, 300);
            } else {
                // ÉCHEC : Le poisson retourne sagement dans l'inventaire
                fishElement.style.position = 'static';
                document.querySelector('.inventory').appendChild(fishElement);
            }
        };
    };

    // Désactive le drag natif du navigateur qui pourrait entrer en conflit
    fishElement.ondragstart = function() { return false; };
}