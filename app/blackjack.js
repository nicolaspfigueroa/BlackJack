// reference: (1) https://www.thatsoftwaredude.com/content/6417/how-to-code-blackjack-using-javascript
//			  (2) https://medium.com/front-end-weekly/remove-all-children-of-the-node-in-javascript-968ad8f120eb#:~:text=Remove%20all%20Children%20of%20a%20Node%20in%20JavaScript,%28%29%20method%20to%20delete%20the%20nodes%20See%20More.
//			  (3) https://www.codecademy.com/learn/learn-html?__s=sl7sfj7hjq3nwplfspm9
//			  (4) https://www.codecademy.com/learn/learn-css?__s=sl7sfj7hjq3nwplfspm9
//    		  (5) https://developer.chrome.com/docs/devtools/
//			  (6) https://www.khanacademy.org/computing/computer-programming/html-js-jquery?__s=sl7sfj7hjq3nwplfspm9

let playerHand = [];
let playerTotalValue = 0;
let dealerHand = [];
let dealerTotalValue = 0;
let deck = [];
let message = '';
let breakFlag = false;
let playerTotalValueEl = document.getElementById("playerTotalValue-el");
let playerHandEl = document.getElementById("playerHand-el");
let dealerTotalValueEl = document.getElementById("dealerTotalValue-el");
let dealerHandEl = document.getElementById("dealerHand-el");
let messageEl = document.getElementById("message-el");
let hitEl = document.getElementById("hit-el");
let stayEl = document.getElementById("stay-el");
let cardSlotPlayer = document.getElementById("cardSlotPlayer-el");
let cardSlotDealer = document.getElementById("cardSlotDealer-el");
hitEl.style.visibility = 'hidden';
stayEl.style.visibility = 'hidden';

//class for each card in the deck to represent the value and suit of each card;
class Card{
	constructor(number, suit){
		this._number = number;
		this._suit = suit;
	}
	get name(){
		return this._number + ' of ' + this._suit;
	}

	get number(){
		return this._number;
	}

	get suit(){
		return this._suit;
	}

	get value(){
		if(this._number === 'J' || this._number === 'Q' || this._number === 'K'){
			return 10;
		}
		if(this._number === 'A'){
			return 11;
		}
		return this._number;
	}
}


//function to create a standard 52 card deck
//Reference 1
function createDeck(){
	let allCards = [];
	let deck = []
	let x = 0;
	let suits = ['Hearts', 'Spades', 'Clovers', 'Diamonds'];
	let numbers = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
	for(let i=0; i<numbers.length; i++){
		for(let j=0; j<suits.length; j++){
			deck[x] = new Card(numbers[i], suits[j]);
			x++;
		}
	}
	return deck;
}

//function that generates a random number between 1 and 52 to draw from the deck
function drawCard(){
	return Math.floor(Math.random() * 52) + 1;
}

//function to deal the first two cards to both the player and dealer
function deal(deck){
	let hand = [];

	let num1 = drawCard();
	let num2 = drawCard();

	hand[0] = deck[num1];
	hand[1] = deck[num2];

	return hand;
}

//function to add the total value of a hand
function addCards(hand){
	let totalValue = 0;
	for(let i=0; i<hand.length; i++){
		totalValue += parseInt(hand[i].value);
	}
	return totalValue;
}

//function to begin the game
function startGame(){
	clearTable();
	hitEl.style.visibility = 'visible';
	stayEl.style.visibility = 'visible';
	playerHandEl.textContent = '';
	dealerHandEl.textContent = '';
	playerTotalValueEl.textContent = '';
	dealerTotalValueEl.textContent = '';
	messageEl.textContent = '';
	breakFlag = false;
	deck = createDeck();
	playerHand = deal(deck);
	playerTotalValue = addCards(playerHand);
	if(playerTotalValue === 22){
		playerTotalValue -= 10;
	}
	dealerHand = deal(deck);
	dealerTotalValue = addCards(dealerHand);
	if(dealerTotalValue === 22){
		dealerTotalValue -= 10;
	}
	gameUI();
	renderPlayer();
	renderDealer();
}

//function to display game status
//Reference 1
function gameUI(){
	playerTotalValueEl.textContent = playerTotalValue;
	dealerTotalValueEl.textContent = dealerTotalValue;
	let stringAdd = '';
	let stringAdd2 = '';

	for(let i=0; i < playerHand.length; i++){
		stringAdd = stringAdd + playerHand[i].name + " | ";
	}

	playerHandEl.textContent = stringAdd;
	
	for(let i=0; i< dealerHand.length; i++){
		stringAdd2 = stringAdd2 + dealerHand[i].name + " | ";
	}
	dealerHandEl.textContent = stringAdd2;

}

//function to generate card graphics
//Reference 1
function cardUI(card){
	let cardDiv = document.createElement('div');
    let symbol = '';
    if (card.suit === 'Hearts'){
    symbol ='&hearts;';
	}
    else if (card.suit === 'Spades'){
    symbol = '&spades;';
	}
    else if (card.suit === 'Diamonds'){
    symbol = '&diams;';
	}
    else if (card.suit === 'Clovers'){
    symbol = '&clubs;';
	}

	cardDiv.className = "card";
	cardDiv.innerHTML = card.number + '<br/>' + symbol;
	return cardDiv;
}

//function to add each player card to the HTML document
function renderCardPlayer(card){
	cardSlotPlayer.appendChild(cardUI(card));
}

//function to add each dealer card to the HTML document
function renderCardDealer(card){
	cardSlotDealer.appendChild(cardUI(card));
}

//function to render the player cards onto the screen
function renderPlayer(){
	for(let i=0; i<playerHand.length; i++){
		renderCardPlayer(playerHand[i]);
	}
}

//function to render the dealer cards onto the screen
function renderDealer(){
	for(let i=0; i<dealerHand.length; i++){
		renderCardDealer(dealerHand[i]);
	}
}

//removes all cards from the table
//Reference 2
function clearTable(){
	while(cardSlotPlayer.firstChild){
		cardSlotPlayer.removeChild(cardSlotPlayer.firstChild);
	}
	while(cardSlotDealer.firstChild){
		cardSlotDealer.removeChild(cardSlotDealer.firstChild);
	}
}

//function to check if either the player or dealer broke
function checkBreak(){
	if(playerTotalValue > 21){
		breakFlag = true;
		messageEl.textContent = "You broke! Press 'Start' to play again.";
		startOver();
		hitEl.style.visibility = 'hidden';
		stayEl.style.visibility = 'hidden';

	}
	if(dealerTotalValue > 21){
		breakFlag = true;
		messageEl.textContent = "The dealer broke. You win! Press 'Start' to play again";
		startOver()
		hitEl.style.visibility = 'hidden';
		stayEl.style.visibility = 'hidden';
	}
}


//function to allow the player to "hit" and obtain an additional card
function playerHit(){
	let cardIndex = drawCard();
	playerHand.push(deck[cardIndex]);
	let aceCounter = -1;
	playerTotalValue = addCards(playerHand);
	if(playerTotalValue > 21){
		for(let i=0; i<playerHand.length; i++){
			if(playerHand[i].number === 'A'){
				aceCounter += 1;
			}
		}
		if(aceCounter === 0){
			playerTotalValue -= 10
		}
		else if(aceCounter > 0){
			playerTotalValue -= aceCounter * 10;
		}
	}

	gameUI();
	renderCardPlayer(playerHand[playerHand.length-1])
	checkBreak();
}

//function to allow the dealer to "hit" and obtain an additional card
function dealerHit(){
	let cardIndex = drawCard();
	dealerHand.push(deck[cardIndex]);
	let aceCounter = -1;
	dealerTotalValue = addCards(dealerHand);
	if(dealerTotalValue > 21){
		for(let i=0; i<dealerHand.length; i++){
			if(dealerHand[i].number === 'A'){
				aceCounter += 1;
			}
		}
		if(aceCounter === 0){
			dealerTotalValue -= 10
		}
		else if(aceCounter > 0){
			dealerTotalValue -= aceCounter * 10;
		}
	}

	gameUI();
	renderCardDealer(dealerHand[dealerHand.length-1])
	checkBreak();
}

//once the player is satisfied with their score, they can "stay" and allow the dealer to take his turn
function stand(){
	hitEl.style.visibility = 'hidden';
	stayEl.style.visibility = 'hidden';
	if(playerTotalValue > dealerTotalValue){
		while(playerTotalValue > dealerTotalValue){
			dealerHit();
		}
	}
	endGame();
}

//functin to reset game values for next game
function startOver(){
	playerHand = [];
	playerTotalValue = 0;
	dealerHand = [];
	dealerTotalValue = 0;
}

//function to display the message for each end game scenario, if neither the player or dealer breaks
function endGame(){
	if(breakFlag === false){
		if(playerTotalValue > dealerTotalValue){
			messageEl.textContent = "You won! Press 'Start' to play again";
		}
		else if(playerTotalValue < dealerTotalValue){
			messageEl.textContent = "You lost! Press 'Start' to play again";
		}
		else if(playerTotalValue === dealerTotalValue){
			messageEl.textContent = "It's a tie. Neither you or the dealer win.";
		}
	}

}





