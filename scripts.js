// set global values
var randVal;
var input;
var won = false;
var lost = false;
var totalGuesses = 5;
var guessesLeft = totalGuesses;
var guesses = [];
var message = $('<div role="alert" style="margin-top: 25px"></div>');
var compMessage = $('<h3></h3>');

// when loaded, initialize the randVal and the guesses, and focus on the input bar
$(document).ready(function () {
	setRandVal();
	setGuesses();
	$('#playersGuess').focus();

	// new game button listener
	$('#newGame').on('click', playAgain);

	// hint button listener
	$('#hint').on('click', function () {
		alert('The number is: '+ randVal);
	});

	// submit key click listener
	$('#submit').on('click', runGame);

	// input bar enter key listener
	$('#playersGuess').keypress(function (e) {
		if (e.which === 13)
			runGame();
	});

	// submit button / input bar script
	function runGame() {
		// store the input and reset the input field
		var input = parseInt($('#playersGuess').val());
		$('#playersGuess').val('');

		// check if guess is valid
		if (!isValid(input)) {
			alert("Please enter a value between 1 and 100");
			return;
		}

		// check if already guessed this value
		if (isRepeat(input)) {
			alert("You have already guessed that number");
			return;
		}

		// add the guess to array
		guesses.push(input);

		// update guesses left
		guessesLeft -= 1;
		setGuesses();

		// compare to old guess
		$('#input-container').append(compMessage);
		if (guesses.length > 1)
			isCloser(input) ? compMessage.text('Getting warmer!') : compMessage.text('Getting colder');

		// replace old comparison message
		message.removeClass();
		$('#input-container').append(message);

		// update record of old guesses and update comparison message, with appropriate colors
		var guessLog = $("<li class='list-group-item'><span id='val'></span><span id='comp'></span></li>");
		var closeness = howClose(input);
		var tooLow = randVal > input;
		// add new log onto the list of past guesses
		$('.list-group').prepend(guessLog);
		$('#val').text(input);
		// set colors and messages based on how close the guess is
		if (randVal === input) {
			// set entry color to green and update its text
			guessLog.addClass('list-group-item-success');
			$('#comp').text(' - correct!');
			// run game won script
			gameWon();
			return;
		}
		else if (closeness === 'hot') {
			// set color to red
			guessColor('red', guessLog);
			// if too low
			if (tooLow) {
				message.text('Really close - Guess a little higher!');
				$('#comp').text(' - a little too low');
			}
			// if too high
			else {
				message.text('Really close - Guess a little lower!');
				$('#comp').text(' - a little too high');
			}
		}
		// if within 5
		else if (closeness === 'warm') {
			// set color to yellow
			guessColor('yellow', guessLog);
			// if too low
			if (tooLow) {
				message.text('Warm - Guess higher!');
				$('#comp').text(' - too low');
			}
			// if too high
			else {
				message.text('Warm - Guess lower!');
				$('#comp').text(' - too high');
			}
		}
		// if within 50
		else if (closeness === "cold") {
			// set color to blue
			guessColor('blue', guessLog);
			// if too low
			if (tooLow) {
				message.text('Cold - Guess higher!');
				$('#comp').text(' - too low');
			}
			// if too high
			else {
				message.text('Cold - Guess lower!');
				$('#comp').text(' - too high');
			}
		}
		// if not within 50
		else {
			// set color to blue
			guessColor('blue', guessLog);
			// if too low
			if (tooLow) {
				message.text('Very Cold - Guess much higher!');
				$('#comp').text(' - way too low');
			}
			// if too high
			else {
				message.text('Very Cold - Guess much lower!');
				$('#comp').text(' - way too high');
			}
		}

		// check for Game Over
		if (guessesLeft === 0) {
			// run game over script
			gameOver();
			return;
		}
	};

	// resets page and the necessary variables
	function playAgain() {
		// reset random value, number of guesses, and list of previous guesses
		setRandVal();
		guessesLeft = totalGuesses;
		guesses = [];
		setGuesses();
		// remove images, if displayed
		if (won) {
			toggleSuccessImage();
			won = false;
		}
		if (lost) {
			toggleFailureImage();
			lost = false;
		}
		// remove comparison messages
		message.remove();
		compMessage.text('').remove();
		// remove list of old guesses
		$('.list-group').empty();
		// reset title and lead text
		$('.title').text("Try to guess the number!");
		$('.lead').text("Input a number between 1 and 100 in the field below, then update your guess based on the given feedback.");
		// enable submit button and input field, and focus on the input field
		$('#submit').prop('disabled', false);
		$('#playersGuess').prop('disabled', false).focus();
	};

	// triggered when the guess is correct
	function gameWon() {
		// display success image
		toggleSuccessImage();
		// disable submit options
		disableSubmit();
		// update comparison message
		messageUpdate('green', 'You got it!!');
		// update title and lead text
		$('.title').text("You won!");
		$('.lead').text("Congratulations! Press the 'Play Again' button to try again.");	
	};

	// triggered when the user runs out of guesses
	function gameOver() {
		// display failure image
		toggleFailureImage();
		// disable submit options
		disableSubmit();
		// update comparison message
		messageUpdate('blue', 'You ran out of guesses. Don\'t give up - try again!');
		// update title and lead text
		$('.title').text("Game Over");
		$('.lead').text("Press 'Play Again' button to try again.");
	};

	// returns how hot or cold the guess is
	function howClose(val) {
		var dif = Math.abs(randVal - val);
		if (dif === 0)
			return 'correct';
		else if (dif <= 5)
			return 'hot';
		else if (dif <= 20)
			return 'warm';
		else if (dif <= 50)
			return 'cold';
		else
			return 'very cold';
	};

	// resets the message color, and updates its text
	function messageUpdate(color, text) {
		message.removeClass();
		if (color === 'blue')
			message.addClass('alert alert-info');
		else if (color === 'green')
			message.addClass('alert alert-success');
		else if (color === 'red')
			message.addClass('alert alert-danger');
		else
			message.addClass('alert alert-warning');
		message.text(text);
	};

	// sets the comparison message and guess entry color
	function guessColor(color, guessLog) {
		if (color === 'blue') {
			message.addClass('alert alert-info');
			guessLog.addClass('list-group-item-info');
		}
		else if (color === 'green') {
			message.addClass('alert alert-success');
			guessLog.addClass('list-group-item-success');
		}
		else if (color === 'red') {
			message.addClass('alert alert-danger');
			guessLog.addClass('list-group-item-danger');
		}
		else {
			message.addClass('alert alert-warning');
			guessLog.addClass('list-group-item-warning');
		}
	};

	// true if val is in the prev array
	function isRepeat(val) {
		return (guesses.indexOf(val) !== -1);
	};

	// returns true if the input is valid
	function isValid(val) {
		return $.isNumeric(val) && val <= 100 && val >= 1;
	};

	// disables the submit button and focuses on Play Again button
	function disableSubmit() {
		$('#submit').prop('disabled', true);
		$('#playersGuess').prop('disabled', true);
		$('#newGame').focus();
	};

	// true if current guess is closer to randVal
	function isCloser(val) {
		return (Math.abs(randVal - val) < Math.abs(randVal - guesses[guesses.length-2]));
	};

	// sets a new random value
	function setRandVal() {
		randVal = Math.ceil(Math.random() * 100);
	};

	// updates the displayed number of guesses left
	function setGuesses() {
		$('#guessesRemaining').text(guessesLeft);
	};

	// toggles display of success image, and updates won state
	function toggleSuccessImage() {
		$('.success').find('img').slideToggle();
		won = true;
	};

	// toggles display of failure image, and updates lost state
	function toggleFailureImage() {
		$('.failure').find('img').slideToggle();
		lost = true;
	};
});