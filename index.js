const fs = require("fs");
const path = require("path");

const suits = ["spade", "club", "cup", "gold"];
let deck = buildDeck();
const permaDeck = buildDeck();
let resets = 0;
let shuffles = 1;
let hit = 0;
let highestHit = 0;
load();
deck = shuffle(deck);
while (!isEqualArrays(deck, permaDeck)) {
  deck = shuffle(deck);
  shuffles++;
  hit = hitCount(deck, permaDeck);
  highestHit = hit > highestHit ? hit : highestHit;
  if (shuffles % 1_000_000 === 0) {
    let hitPercent = (highestHit * 100) / deck.length;
    console.table({ resets, shuffles, hitPercent });
    save();
  }
  if (shuffles >= Number.MAX_SAFE_INTEGER) {
    console.log(`Resetting...`);
    resets++;
    shuffles = 1;
  }
}
console.log(`Done after ${shuffles} shuffles`);
console.table({ resets, shuffles });

function load() {
  console.log("Loading...");
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "state.json"), "utf-8")
  );
  resets = data.resets ?? 0;
  shuffles = data.shuffles ?? 1;
  highestHit = data.highestHit ?? 0;
  deck = data.deck ?? buildDeck();
}

function save() {
  const data = {
    resets,
    shuffles,
    highestHit,
    deck,
  };
  fs.writeFileSync(path.join(__dirname, "state.json"), JSON.stringify(data));
}

function isEqualArrays(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].value !== arr2[i].value || arr1[i].suit !== arr2[i].suit)
      return false;
  }
  return true;
}

function hitCount(arr1, arr2) {
  let hit = 0;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].value == arr2[i].value && arr1[i].suit == arr2[i].suit) hit++;
  }
  return hit;
}

function buildDeck() {
  const deck = [];
  suits.forEach((suit) => {
    for (let i = 1; i <= 12; i++) {
      deck.push({ value: i, suit: suit });
    }
  });
  deck.push(
    ...[
      { value: 0, suit: "joker" },
      { value: 0, suit: "joker" },
    ]
  );
  return deck;
}

function shuffle(deck) {
  const hand = [];
  while (deck.length > 0) {
    const spliceSize = Math.round(Math.random() * deck.length);
    hand.unshift(...deck.splice(0, spliceSize));
  }
  return hand;
}
