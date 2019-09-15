'use strict';

// Dynamic grid creation

const gridContainer = document.querySelector('.grid-container');

let gridSize = 8;

const createGrid = gridSize => {
    for(let i = 1; i <= (gridSize*gridSize); i++) {
        let gridBox = document.createElement('div');
        let gridBoxOverlay = document.createElement('div');
        let gridBoxContent = document.createElement('div');

        gridBox.classList.add('grid-box');
        
        gridBoxOverlay.classList.add('grid-box-overlay');
        gridBoxOverlay.classList.add('active');

        gridBoxContent.classList.add('grid-box-content');
        gridBoxContent.classList.add('box'+i);
        gridBoxContent.innerHTML = '?';

        if (gridSize == 10) {
            gridBox.style.width = '10%';
            gridBox.style.height = '10%';
        } else if (gridSize == 12) {
            gridBox.style.width = '8.33%';
            gridBox.style.height = '8.33%';
        } else {
            gridBox.style.width = '12.5';
            gridBox.style.height = '12.5%';
        }

        gridBox.appendChild(gridBoxOverlay);
        gridBox.appendChild(gridBoxContent);

        gridContainer.appendChild(gridBox);
    }
}

createGrid(gridSize);



//Diamond placement

const gridBoxes = document.getElementsByClassName('grid-box');
const gridBoxesOverlay = document.getElementsByClassName('grid-box-overlay');
const gridBoxesContent = document.getElementsByClassName('grid-box-content');

const diamond = `<i class="fas fa-gem"></i>`;
let randomPositions = [];

const generateRandomPositions = gridSize => {

    while(randomPositions.length < gridSize) {
        let pos = `box${ Math.floor(Math.random()*(gridSize*gridSize)) + 1}`;
        if(randomPositions.indexOf(pos) === -1) randomPositions.push(pos);
    }

    console.log(randomPositions);
}

const placeDiamonds = gridSize => {

    generateRandomPositions(gridSize);

    for(let element of randomPositions) {
        for(let i = 0; i < (gridSize*gridSize); i++)
            if(gridBoxesContent[i].classList.contains(element)) gridBoxesContent[i].innerHTML = diamond;
    }

}

placeDiamonds(gridSize);

//Score Keeper
let score = 0;
let diamondsCount = 0;

let diamondsFound = document.querySelector('.diamonds-found');
let gameScore = document.querySelector('.game-score');

diamondsFound.innerHTML = `Diamonds: ${diamondsCount}/${gridSize}`;

const diamondsCollected = () => {
    diamondsCount += 1;
    diamondsFound.innerHTML = `Diamonds: ${diamondsCount}/${gridSize}`;
}

const calculateScore = () => {
    for(let element of gridBoxesOverlay)
        if(element.classList.contains('active')) score+=1;
}

const gameOver = () => {
    gridContainer.style.opacity = '0.3';
    gridContainer.style.pointerEvents = 'none';

    calculateScore();
    gameScore.innerHTML = `Your Score: ${score}`;

}


//Hide overlay on click
const manageGameState = gridSize => {
    for(let element of gridBoxesOverlay) {
        element.addEventListener('click', () => {
            element.style.display = 'none';
            element.classList.remove('active');

            if(element.nextSibling.innerHTML === diamond) diamondsCollected();

            //gameOver
            if(diamondsCount === gridSize) gameOver();

        });
    }
}

manageGameState(gridSize);

//Reset game
const startAgainButton = document.querySelector('.start-again');

const gameReset = () => {
    score = 0;
    diamondsCount = 0;
    randomPositions = [];
    diamondsFound.innerHTML = `Diamonds: ${diamondsCount}/${gridSize}`;
    gameScore.innerHTML = '';

    gridContainer.innerHTML = '';
    gridContainer.style.pointerEvents = 'auto';
    gridContainer.style.opacity = '1';

    createGrid(gridSize);
    placeDiamonds(gridSize);
    manageGameState(gridSize);
}

startAgainButton.addEventListener('click', () => {
    gameReset();
});


//Change Game Level
const gameLevels = document.getElementsByClassName('game-level');

const chooseGameLevel = () => {
    for(let element of gameLevels) {
        element.addEventListener('click', () => {
            let siblings = element.parentNode.children;
            
            for(let sibling of siblings)
                sibling.classList.remove('active')

            element.classList.add('active');

            //get attribute returns string value. So covert it to no. for strict comparison with diamondsCount value
            gridSize = Number(element.getAttribute('value'));  

            gameReset();

        });
    }
}

chooseGameLevel();