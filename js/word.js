const MOVEMENT_EFFECTS = ['breathing', 'bobbing', 'warping', 'rotate'];//, 'skew', 'melt'];
const SPELLING_EFFECTS = ['lengthen', 'removeVowels', 'splitUp', 'capitalization', 'punctuation'];
const STYLE_EFFECTS = ['bold', 'italics'];
// const SPECIAL_WORDS = ['death', 'chaos', 'love', 'shatter'];

const MOVEMENT_EFFECTS_ODDS = 4;
const SPELLING_EFFECTS_ODDS = 3;
const STYLE_EFFECTS_ODDS = 3;

let isFirstWord = false;
let testSpellingMode = "";
let testMovementMode = "";
let testStyleMode = "";
let delay = 60;
// if death is typed drop everything


// class to hold word objects
class Word {
  constructor(x, y, message, isRemake) {

      // Defines word positions and message information
      this.x = x;
      this.y = y;
      this.message = message;
      this.movementEffect = "";
      this.spellingEffect = "";
      this.styleEffect = "";
      this.specialEffect = "";
      this.isRemake = isRemake || false;

      // Varibles more special words
      this.xVelocity = 0;
      this.yVelocity = 0;
      this.terminalXVelocity = 2;
      this.terminalYVelocity = 12;
      this.acceleration = 0.1;
      this.gravity = 0.3;
      this.targetX = 0;
      this.targetY = 0;

      // Modifiers that any effect can use
      this.effectModifier1 = random(1);
      this.effectModifier2 = random(1);
      this.effectModifier3 = random(1);

      this.effectVariable1 = 0;
      this.effectVariable2 = 0;
      this.effectVariable3 = 0;

      this.effectDirection = random([-1,1]);




      // Adds random movement effects
      if (int(floor(random(MOVEMENT_EFFECTS_ODDS))) === 0 || isFirstWord == false || this.isRemake === true) {
        isFirstWord = true;
        this.movementEffect = random(MOVEMENT_EFFECTS);
      }

      // Adds random spelling effects
      if (int(floor(random(SPELLING_EFFECTS_ODDS))) === 0 && this.isRemake === false) {
        this.spellingEffect = random(SPELLING_EFFECTS);
      }

      // Adds random style effects
      if (int(floor(random(STYLE_EFFECTS_ODDS))) === 0) {
        this.styleEffect = random(STYLE_EFFECTS);
      }

      // For testing
      if (testSpellingMode != "") {
        this.spellingEffect = testSpellingMode;
      }
      if (testMovementMode != "") {
        this.movementEffect = testMovementMode;
      }
      if (testStyleMode != "") {
        this.styleEffect = testStyleMode;
      }

      // Edits the text if effects are applied
      let vowelsList = ['a', 'e', 'i', 'o', 'u'];
      let puncuationList = [',', '.', '?', '!', ';'];
      let newWord = "";

      switch (this.spellingEffect) {

        // Lengthens the word
        case 'lengthen':
          newWord += this.message[0];
          for (var i = 1; i < this.message.length; i++) {
            var loopSize = 1 + int(random(3));
            for (var j = 0; j < loopSize; j++) {
              // Adds letters to the modified word
              newWord += this.message[i];
            }
          }
          break;

        // Warp effects
        case 'removeVowels':
          // Loops through and removes certain vowels
          for (var i = 0; i < this.message.length; i++) {
            var hasVowel = false;

            // Checks if the current letter is a vowel
            for (var j = 0; j < vowelsList.length; j++) {
              if (this.message.toLowerCase().charAt(i) === vowelsList[j]) {
                hasVowel = true;
              }
            }
            // Adds letters to the modified word
            if (hasVowel === false || i === this.message.length-1 || i === 0) {
              newWord += this.message[i];
            } else {
              newWord += "\'";
            }
          }
          break;

        // Splits up text into 2 words
        case 'splitUp':
          var hasSplit = false;
          for (var i = 0; i < this.message.length; i++) {
            var hasVowel = false;

            // Splits the word into 2 given the right situation
            for (var j = 0; j < vowelsList.length; j++) {
              if (this.message.toLowerCase().charAt(i) === vowelsList[j] ) {
                hasVowel = true;
                if (i > 2 && hasSplit === false) {
                  hasSplit = true;
                  newWord += ' ';
                }
              }
            }
            // Adds letters to the modified word
            newWord += this.message[i];
          }
          break;

        // Capitalizes all the letters
        case "capitalization":
          if (this.message.length >= 3) {
            newWord = this.message.toUpperCase();
          }
          break;

        // Adds random punctuation
        case "punctuation":
          newWord = this.message + random(puncuationList);
          break;
      }

      // Makes the current word the transformed version
      if (newWord != "") {
        this.message = newWord;
        newWord = "";
      }
    }

  // Applies effects
  move() {

    // Death effect
    if (this.specialEffect === 'death') {
      if (this.xVelocity === 0 && this.yVelocity === 0) {
        var tempVelocity = random(this.terminalXVelocity);
        this.yVelocity = - tempVelocity * 3;
        this.xVelocity = tempVelocity * random([-1,1]);
      }
      this.yVelocity += this.gravity;

    // Love effect
    } else if (this.specialEffect === 'love') {
      // Initial burst of energy
      if (this.xVelocity === 0 && this.yVelocity === 0) {
          var tempVelocity = random(this.terminalXVelocity);
          this.yVelocity = tempVelocity * random([-1,1]);
          // this.xVelocity = tempVelocity * random([-1,1]);

          console.log(1)
          // this.xVelocity = tempVelocity * random([-1,1]);

      }

      if (this.x < this.targetX) {
        this.xVelocity += this.acceleration;
      } else if (this.x > this.targetX) {
        this.xVelocity -= this.acceleration;
      }

      if (this.y < this.targetY) {
        this.yVelocity += this.acceleration;
      } else if (this.y > this.targetY) {
        this.yVelocity -= this.acceleration;
      }
//
      // if (this.xVelocity === 0 && this.yVelocity === 0) {
      //   var tempVelocity = random(this.terminalXVelocity);
      //   this.yVelocity = - tempVelocity * 3;
      //   this.xVelocity = tempVelocity * random([-1,1]);
      // }
      // this.yVelocity += this.gravity;
    }


    // Updates the position
    this.y += this.yVelocity;
    this.x += this.xVelocity;

  }

  // Displays the word
  display() {

    // Universal text effects
    fill(0);
    textAlign(LEFT);
    textSize(TEXT_SIZE);

    // Adds style effects
    switch (this.styleEffect) {
      case 'bold':
        textStyle(BOLD);
        break;
      case 'italics':
        textStyle(ITALIC);
        break;
      default:
        textStyle(NORMAL);
        break;

    }

    // Draws the current effect
    if (this.specialEffect === "") {
      switch (this.movementEffect) {

        // Breathing effect
        case 'breathing':
          push();
          textAlign(CENTER);
          translate(this.x + textWidth(this.message) / 2, this.y);
          this.effectVariable1 = -cos(frameCount/60 * this.effectModifier1);
          scale(this.effectVariable1);
          // this.effectVariable1 = (this.effectModifier1 * 4 * sin(frameCount * this.effectModifier1 / 16)) * this.effectDirection + this.effectModifier1;
          text(this.message, 0, 0);
          pop();
          break;

        // Bobbing effect
        case 'bobbing':
          this.effectVariable1 = (this.effectModifier1 * 4 * sin(frameCount * this.effectModifier1 / 16)) * this.effectDirection + this.effectModifier1;
          text(this.message, this.x, this.y + this.effectVariable1);
          break;

        // Warp effect
        case 'warping':
          push();
          translate(this.x, this.y);
          this.effectVariable1 = this.effectModifier1 / 4 * cos(frameCount / 12);
          scale(1, this.effectVariable1 + 1);
          text(this.message, 0, 0);
          pop();
          break;

        // Rotate effect
        case 'rotate':
          push();
          textAlign(CENTER);
          translate(this.x + textWidth(this.message)/2, this.y);
          rotate(this.effectModifier1 * 0.25 * sin(frameCount/24 + this.effectModifier2 * 10)) + this.effectModifier2 * 5;
          text(this.message, 0, 0);
          pop();
          break;

        // Draws text without effects
        default:
          push();
          fill(0);
          textSize(TEXT_SIZE);
          textAlign(LEFT);
          text(this.message, this.x, this.y );
          pop();
          break;
      }
    // when a special effect is applied
    } else {
      push();
      fill(0);
      textSize(TEXT_SIZE);
      textAlign(CENTER);
      translate(this.x, this.y);
      rotate(this.yVelocity/5);
      text(this.message, 0,0);
      pop();
    }
  }
}
