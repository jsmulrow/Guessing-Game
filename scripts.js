// set global values
var randVal;
var input;
var guessesLeft = 5;
var guesses = [];
var message = $('<div role="alert" style="margin-top: 25px"></div>');

// when loaded, initialize the randVal
$(document).ready(function () {
	randVal = Math.ceil(Math.random() * 100);
});

// sets random value for Guessing Game
function playAgain() {
	randVal = Math.floor(Math.random() * 100);
	guessesLeft = 5;
	message.remove();
	$('.list-group').empty();
	$('#guessesRemaining').text(guessesLeft);
	$('.title').text("Try to guess the number!");
	$('.lead').text("Input a number between 1 and 100 in the field below, then update your guess based on the given feedback.");
};

function showHint() {
	alert('This is the value: '+randVal);
};

// submit button script
function runGame() {
	// store the input
	input = parseInt($('#playersGuess').val());

	// check if guess is valid
	if (!isValid(input)) {
		alert("Please enter a value between 1 and 100");
		return;
	}

	// add the guess to array
	guesses.push(input);

	// update guesses left
	guessesLeft -= 1;
	$('#guessesRemaining').text(guessesLeft);

	// update record of old guesses, with appropriate colors
	var oldG = $("<li class='list-group-item'></li>");
	if (isWarm(guesses[guesses.length-1])) {
		if (isHot(guesses[guesses.length-1])) 
			oldG.addClass('list-group-item-danger');
		else
			oldG.addClass('list-group-item-warning');
	}
	else {
		oldG.addClass('list-group-item-info');
	}
	$('.list-group').prepend(oldG.text(guesses[guesses.length-1]));

	// replace old alert
	message.removeClass();
	$('#input-container').append(message);

	// compare guess to randVal
	if (input === randVal) {
		// set alert to Green and say you won!!
		message.text('You got it!!');
		message.addClass('alert alert-success');
		$('.title').addClass("color:red").text("You won!");
		$('.lead').text("Congratulations!");
		return;
	}
	else if (Math.abs(randVal - input) <= 5) {
		// set alert to Red and say you are very hot
		message.addClass('alert alert-danger');
		if (randVal > input)
			message.text('Really close - Guess a little higher!');
		else
			message.text('Really close - Guess a little lower!');
	}
	else if (Math.abs(randVal - input) <= 20) {
		// change alert color to yellow and say you are close
		message.addClass('alert alert-warning');
		if (randVal > input)
			message.text('Warm - Guess higher!');
		else
			message.text('Warm - Guess lower!');
	}
	else if (Math.abs(randVal - input) <= 50) {
		// change alert to blue and say you are cold
		message.addClass('alert alert-info');
		if (randVal > input)
			message.text('Cold - Guess higher!');
		else
			message.text('Cold - Guess lower!');
	}
	else {
		message.addClass('alert alert-info');
		if (randVal > input)
			message.text('Very Cold - Guess much higher!');
		else
			message.text('Very Cold - Guess much lower!');
	}

	// check for Game Over
	if (guessesLeft === 0) {
		$('.title').text("Game Over");
		$('.lead').text("Press 'Play Again' button to try again");
	}
};

function oldGuesses() {
	var output = '';
	guesses.forEach(function(i) {
		output += guesses[i] + ' ';
	});
	return output;
};

// returns true if the val was "warm" and false otherwise
function isWarm(val) {
	if (Math.abs(randVal - input) <= 20)
		return true;
	return false;
};

// returns true if the val was "hot" and false otherwise
function isHot(val) {
	if (Math.abs(randVal - input) <= 5)
		return true;
	return false;
};

// true if val is in the prev array
function isRepeat(val, prev) {
	val in prev;
}

// returns true if the input is valid
function isValid(val) {
	return Number.isInteger(val) && val <= 100 && val >= 1;
}