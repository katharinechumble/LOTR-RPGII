// const sequelize = require("../../config/connection");
// const { Character } = require("../../models");

const textElement = document.getElementById("question-text");
const optionButtonsElement = document.getElementById("options");
const scoreDisplayElement = document.getElementById("score-display");

let state = {};
let health = 20;

function startGame() {
  //   state = {};
  showTextNode(1);
}

function showTextNode(textNodeIndex) {
  const textNode = textNodes.find((textNode) => textNode.id === textNodeIndex);
  textElement.innerText = textNode.text;
  textElement.classList.add("fs-3");
  while (optionButtonsElement.firstChild) {
    optionButtonsElement.removeChild(optionButtonsElement.firstChild);
  }

  textNode.options.forEach((option) => {
    if (showOption(option)) {
      const button = document.createElement("button");
      button.innerText = option.text;
      button.classList.add("btn", "fs-4");
      button.addEventListener("click", () => selectOption(option));
      optionButtonsElement.appendChild(button);
    }
  });
}

function deductHealth() {
  console.log("deduct health has been called");
  //plays error sound when the wrong choice is selected.
  let errorMusic = new Howl({
    src: ["/music/327737__distillerystudio__error-02.wav"],
    volume: 0.1,
  });

  errorMusic.play();
  //passes the incremented health to the updateScoreDisplay function.
  updateScoreDisplay(--health);
  //can I push the values here as well to the "end game" function to it
  //pushes the score to the character table on the char_health for the current
  //character?
}

//plays correct sound when the right choice is made.
function correctChoice() {
  let correctMusic = new Howl({
    src: ["/music/415762__thebuilder15__notification-correct.wav"],
    volume: 0.2,
  });

  correctMusic.play();
}

function updateScoreDisplay(val) {
  document.getElementById("score-display").innerHTML = "Your score: " + val;
}

async function endgame() {
  // STUCK HERE.  1) How do we know which character id to update.  2) get char_health undefined because we can't
  //import sequelize for our tables.
  const response = await fetch(`/api/character/`, {
    method: "PUT",
    body: JSON.stringify({
      health,
    }),

    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data);
  if (response.ok) {
    console.log("Health Updated!");
  } else {
    alert(response.statusText);
  }
  document.location.replace("/scores");
  // getId();
}

function showOption(option) {
  return option.requiredState == null || option.requiredState(state);
}

function selectOption(option) {
  console.log(option);
  const nextTextNodeId = option.nextText;
  // if (nextTextNodeId <= 0) {
  //   return startGame();
  // }
  //   state = Object.assign(state, option.setState);
  if (option.damage) {
    deductHealth();
  } else {
    correctChoice();
  }
  if (option.endgame) {
    endgame();
  }
  showTextNode(nextTextNodeId);
}

//write function to increase or decrease their health based on the option they chose.

const textNodes = [
  {
    id: 1,
    text: "Your relative has just left you his magic ring.  It may not be what it appears to be.  You:",
    options: [
      {
        text: "Try it on.  Magic rings do something, right?",
        damage: true,
        nextText: 2,
      },

      {
        text: "Put it away for later, there???s something about it you don???t like.",
        nextText: 2,
      },
    ],
  },
  {
    id: 2,
    text: "Your wizard friend Gandalf has just shown up and proven that your magic ring is the One Ring, an ancient artifact of doom that the Dark Lord Sauron needs to restore his full power.  He suggests you leave immediately to avoid the evil forces looking for you.  You:",
    options: [
      {
        text: "Pack your bags and set out.",
        nextText: 3,
      },
      {
        text: "Stay put.  If I don???t put the ring on, they won???t notice me.",
        damage: true,
        nextText: 3,
      },
    ],
  },
  {
    id: 3,
    text: "You arrive at the town you are supposed to meet Gandalf in, but he isn???t there.  Instead, a rough-looking Man tells you Gandalf won???t be meeting you and to follow him to Rivendell.",
    options: [
      {
        text: "No thanks, I???ll make my own way to Rivendell.",
        damage: true,
        nextText: 4,
      },
      {
        text: "Nice to have you along, Mr. Strider.",
        nextText: 4,
      },
    ],
  },
  {
    id: 4,
    text: "In Rivendell, it is decided the Ring must be destroyed.  You volunteer to undertake the perilous journey into the heart of Mordor in order to do this.  Saruman the White shows his true colors as a servant of Sauron and blocks the path you planned to take over the Misty Mountains.  Now you must find a way around.",
    options: [
      {
        text: "Go through the Gap of Rohan, it will take you close to Saruman???s stronghold in Isengard, but you may be able to pass through unnoticed, and you can find help in Rohan.",
        damage: true,
        nextText: 11,
      },
      {
        text: "Go through the kingdom of Moria.  The ancient Dwarven city has long been abandoned and houses unknown dangers, but it???s far from Saruman???s citadel.",
        nextText: 11,
      },
    ],
  },
  {
    id: 11,
    text: "With a roar, the entire land of Mordor seems to collapse around you.  The last things you see before all goes black is the tower of Barad-d??r falling, the Eye of Sauron staring around wildly, and the distant forms of eagles flying towards where you and Sam are trapped on an outcropping.  When you awake, you are in Minas Tirith, Strider, now using his true name of Aragon, Gandalf, and the rest of your companions are waiting for you.  The evil plaguing the land has been vanquished once and for all and everyone is ready to celebrate in your honor.  You watch the coronation of Aragon as the rightful King of Gondor only for him to turn to you and bow as the savior of all the free peoples of Middle Earth.  You are rewarded by the elves with passage to the Undying Lands, but your legend lives on long after you leave Middle Earth.  You have come to the end of your journey, thanks for playing!",
    options: [
      {
        text: "Congratulations!!  Now Click Here to Checkout your score!",
        endgame: true,
        nextText: -1,
      },
    ],
  },
];

startGame();
