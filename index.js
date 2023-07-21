let deckId;
let computerScore = 0;
let myScore = 0;

let cardsDiv = document.querySelector('#cards');
let remainingCards = document.querySelector('#remaining');
let newDeckBtn = document.querySelector("#new-deck");
let drawCardsBtn = document.querySelector('#draw-cards');
let computerScoreEl = document.querySelector('#computer-score');
let myScoreEl = document.querySelector('#my-score');

async function handleClick() {
    const response = await fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/");
    const data = await response.json();
    deckId = data.deck_id;
    computerScore = 0;
    myScore = 0;

    remainingCards.textContent = data.remaining;
    drawCardsBtn.disabled = false;
    header.textContent = 'Game of war';
    computerScoreEl.textContent = computerScore;
    myScoreEl.textContent = myScore;
    cardsDiv.children[0].innerHTML = '';
    cardsDiv.children[1].innerHTML = '';
}

function displayImage(url) {
    let cardSlot = document.createElement('div');
    cardSlot.classList.add('card-slot');

    let img = document.createElement('img');
    img.classList.add('card');
    img.setAttribute('src', url);
    cardSlot.appendChild(img);

    cardsDiv.appendChild(cardSlot);
}

async function drawCards() {
    const response = await fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`);
    const data = await response.json();
    remainingCards.textContent = data.remaining;
    cardsDiv.innerHTML = '';
    displayImage(data.cards[0].image);
    displayImage(data.cards[1].image);
    const winnerText = determineCardWinner(data.cards[0], data.cards[1]);
    header.textContent = winnerText;
    computerScoreEl.textContent = computerScore;
    myScoreEl.textContent = myScore;

    if (data.remaining === 0) {
        drawCardsBtn.disabled = true;
        if (computerScore > myScore) {
            header.textContent = "The computer won the game!"
        } 
        else if (myScore > computerScore) {
            header.textContent = "You won the game!"
        } 
        else {
            header.textContent = "It's a tie game!"
        }
    }
}

function determineCardWinner(card1, card2) {
    const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", 
    "10", "JACK", "QUEEN", "KING", "ACE"];
    const card1ValueIndex = valueOptions.indexOf(card1.value);
    const card2ValueIndex = valueOptions.indexOf(card2.value);
    
    if (card1ValueIndex > card2ValueIndex) {
        ++computerScore;
        return "Computer wins!";
    } 
    else if (card1ValueIndex < card2ValueIndex) {
        ++myScore;
        return "You win!";
    } 
    else {
        return "War!";
    }
}

newDeckBtn.addEventListener("click", handleClick);

drawCardsBtn.addEventListener("click", drawCards);