/**
Ropes in Absolutism
Jackson Dunnigan
*/

"use strict";

// Constant variables
const MARGIN_LEFT = 1/6;
const MARGIN_RIGHT = 5/6;
const MARGIN_TOP = 1/6;
const MARGIN_BOTTOM = 2/3;
const SPACE_SCALE = 2/5;
const NEW_LINE_SCALE = 1.5;
const TEXT_SIZE = 18;
const BLINK_RANGE = 40;
const NEW_LINE_ODDS = 10;

// Arrays to hold words
let wordArray = [];
let currentWord = "";
let cursorPosition = {x: 0, y: 0, defaultX: 0, defaultY: 0};
let blinkTimer = 0;
let specialEffect = null;
let newWord;

// Loads assets
function preload() {

}

// Sets up the canvas
function setup() {
  createCanvas(windowWidth * .75, windowHeight * .75);
  cursorPosition.x = width * MARGIN_LEFT;
  cursorPosition.y = height * MARGIN_TOP;
  cursorPosition.defaultX = cursorPosition.x;
  cursorPosition.defaultY = cursorPosition.y;
}

// Displays the content
function draw() {
  background(255);
  fill(0);
  textSize(TEXT_SIZE);
  textAlign(LEFT);

  // Draws the completed words
  for (var i = 0; i < wordArray.length; i++){
    wordArray[i].move();
    wordArray[i].display();
  }

  var canDelete = true

  // Adds special effects
  switch (specialEffect) {
    case 'love':
    var canDelete = true;
      for (var i = 0; i < wordArray.length - 1; i ++) {
        // if (wordArray[i].message != 'love' &&

        if (dist(wordArray[i].x, wordArray[i].y, wordArray[i].targetX, wordArray[i].targetY) < 30) {
          wordArray.splice(i, 1);
        }
      }

      // Deletes the word array
      if (wordArray.length <= 1) {
        // console.log(1);
        wordArray = [];
        cursorPosition.x = cursorPosition.defaultX;
        cursorPosition.y = cursorPosition.defaultY;
        specialEffect = null;
      }

    break;
    case 'death':
      // Checks if the array can be deleted
      var canDelete = true;
      for (var i = 0; i < wordArray.length; i ++) {
        if (wordArray[i].y < height){
         canDelete = false
        }
      }

      // Deletes the word array
      if (canDelete === true) {
        // console.log(1);
        wordArray = [];
        cursorPosition.x = cursorPosition.defaultX;
        cursorPosition.y = cursorPosition.defaultY;
        specialEffect = null;
      }
    break;
  }
  // switch (currentWord.toLowerCase()) {
  //
  //   // Adds the love effect
  //   case 'love':
  //     // Gives every word the special effect
  //     if (specialEffect != 'love') {
  //       specialEffect = 'love';
  //       for (var i = 0; i < wordArray.length; i ++) {
  //         wordArray[i].specialEffect = 'love';
  //         wordArray[i].targetX = newWord.x;
  //         wordArray[i].targetY = newWord.y;
  //       }
  //     }
  //     specialEffect = 'love';
  //     break;
  //
  //   // Adds the death effect
  //   case 'death':
  //   case 'die':
  //   case 'dead':
  //   case 'dying':
  //     if (specialEffect != 'death') {
  //       specialEffect = 'death';
  //       for (var i = 0; i < wordArray.length; i ++) {
  //         wordArray[i].specialEffect = 'death';
  //       }
  //     }
  //
  //     // Checks if the array can be deleted
  //     var canDelete = true;
  //     for (var i = 0; i < wordArray.length; i ++) {
  //       if (wordArray[i].y < height){
  //        canDelete = false
  //       }
  //     }
  //
  //     // Deletes the word array
  //     if (canDelete === true) {
  //       console.log(1);
  //       wordArray = [];
  //       cursorPosition.x = cursorPosition.defaultX;
  //       cursorPosition.y = cursorPosition.defaultY;
  //       specialEffect = null;
  //     }
  //   break;
  // }


  // Draws the current word being typed
  if (currentWord.length > 0) {
    text(currentWord, cursorPosition.x, cursorPosition.y);
  }

  // Draws the blink
  blinkTimer += 1;
  if (blinkTimer >= BLINK_RANGE / 2) {
    text("_", cursorPosition.x + textWidth(currentWord), cursorPosition.y);
    if (blinkTimer >= BLINK_RANGE) {
      blinkTimer = 0;
    }
  }
}

// Mouse input
function mousePressed() {
  // Remakes the word if clicked by the mouse
  for (var i = 0; i < wordArray.length; i ++) {
    var tempWord = wordArray[i];
    if (mouseX > tempWord.x
    && mouseX < tempWord.x + textWidth(tempWord.message)
    && mouseY > tempWord.y - textAscent(tempWord.message)
    && mouseY < tempWord.y) {
      wordArray[i] = new Word(tempWord.x, tempWord.y, tempWord.message, true);
    }
  }
}

// Keyboard input
function keyPressed() {

  if (specialEffect === null) {

    // Adds the current key pressed into the word being built
    if ((event.keyCode >= 48 && event.keyCode <= 90) ||
        (event.keyCode >= 186 && event.keyCode <= 223)) {
      currentWord += event.key;

    // Turns the current word into an object when its done being typed
    } else if (event.keyCode === 32) {
        if (currentWord.length > 0) {

          // Random chance of a new line being created
          if (int(random(NEW_LINE_ODDS)) === 0) {
            newLine();
          // Adds the word to the list
          } else {
            pushWord();
            // Moves the cursor to the end of the word just added
            if (wordArray.length > 0) {
              cursorPosition.x += textWidth(wordArray[wordArray.length - 1].message) + textWidth(" ");
            }
            // Resets the current word
            currentWord = "";
          }
      }
    // Creates a new line when enter is clicked
    } else if (event.keyCode === 13) {
      newLine();

    // Deletes the previous letter
    } else if (event.keyCode === 8) {
      if (currentWord.length > 0) {
        currentWord = currentWord.slice(0, -1);
      } else {
        if (wordArray.length > 0){
          currentWord = wordArray[wordArray.length - 1].message;
          cursorPosition.x -= textWidth(wordArray[wordArray.length - 1].message) + textWidth(" ");
          wordArray.pop();
        }
      }
    }

    // Formats the text
    formatText();
  }
}

// Formats the text
function formatText() {
  if (cursorPosition.x + textWidth(currentWord) >= width * MARGIN_RIGHT ) {
    cursorPosition.x = cursorPosition.defaultX;
    cursorPosition.y += textAscent() * NEW_LINE_SCALE;
  }
}


// Makes a new line
function newLine() {
  pushWord();
  currentWord = "";
  cursorPosition.x = cursorPosition.defaultX;
  cursorPosition.y += textAscent() * NEW_LINE_SCALE;
}

// Adds the current word to the word list
function pushWord() {
  if (currentWord.length > 0) {
    newWord = new Word(cursorPosition.x, cursorPosition.y, currentWord);
    wordArray.push(newWord);
  }
  // Adds special effects
  switch (currentWord.toLowerCase()) {

    // Adds the love effect
    case 'love':
    case 'loving':
    case 'luv':
    case 'luv':

      // Gives every word the special effect
      if (specialEffect != 'love') {
        specialEffect = 'love';
        for (var i = 0; i < wordArray.length; i ++) {
          wordArray[i].specialEffect = 'love';
          wordArray[i].targetX = newWord.x;
          wordArray[i].targetY = newWord.y;
        }
      }
      break;

    // Adds the death effect
    case 'death':
    case 'die':
    case 'dead':
    case 'dying':
      if (specialEffect != 'death') {
        specialEffect = 'death';
        for (var i = 0; i < wordArray.length; i ++) {
          wordArray[i].specialEffect = 'death';
        }
      }
    break;
  }
}
