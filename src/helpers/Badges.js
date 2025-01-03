// export const Badges = [
//   {
//     id: 1,
//     title: "First Guess",
//     description: "Make your first guess",
//   },
//   {
//     id: 1,
//     title: "Bullseye",
//     description: "Make your first correct guess (<5% accuracy)",
//   },
//   {
//     id: 2,
//     title: "Wildfire",
//     description: "Get 5 correct guesses in a row",
//   },
//   {
//     id: 3,
//     title: "Double Ace",
//     description: "Guess within 1% of the actual population 10 times",
//   },
//   {
//     id: 4,
//     title: "Perfectionist",
//     description: "Guess the exact population number",
//   },
//   {
//     id: 5,
//     title: "Graveyard shift",
//     description: "Make a guess between 2 AM and 4 AM",
//   },
//   {
//     id: 6,
//     title: "Blind-shot",
//     description: "Make a guess that's off by more than 95%",
//   },
//   {
//     id: 7,
//     title: "Top Guesser",
//     description: "Have the highest score in your friend group",
//   },
//   {
//     id: 8,
//     title: "Friends...",
//     description: "Play a game with a friend",
//   },
//   {
//     id: 9,
//     title: "to Enemies",
//     description: "Beat your friend in a 1v1",
//   },
//   {
//     id: 10,
//     title: "Feedbacker",
//     description: "Suggest a new feature or improvement to the game developers",
//   },
//   {
//     id: 11,
//     title: "Rookie",
//     description: "Play 10 rounds",
//   },
//   {
//     id: 12,
//     title: "Broker",
//     description: "Play 50 rounds",
//   },
//   {
//     id: 13,
//     title: "Veteran",
//     description: "Play 100 rounds",
//   },
//   {
//     id: 14,
//     title: "No",
//     description: "Play 1337 rounds",
//   },
// ];

// First Guess: Make your first guess
// Bullseye: Make your first correct guess (<5% accuracy)
// Wildfire: Get 5 correct guesses in a row
// Double Ace: Guess within 1% of the actual population 10 times
// Perfectionist: Guess the exact population number
// Blind-shot: Make a guess that's off by more than 95%
// Graveyard shift:Make a guess between 2 AM and 4 AM
// Top Guesser: Have the highest score in your friend group
// Friends...: Play a game with a friend
// to Enemies: Beat your friend in a 1v1
// Feedbacker:Suggest a new feature or improvement to the game developers

// Rookie: Play 10 rounds
// Broker:Play 50 rounds
// Veteran: Play 100 rounds
// No: Play 1337 rounds

// Historical Buff:Guess populations from different historical eras correctly

import firstguessruleBadge from "../assets/achievements/First guess.svg";
import bullseyeBadge from "../assets/achievements/Bullseye.svg";
import doubleaceBadge from "../assets/achievements/Double ace.svg";
import blindshotBadge from "../assets/achievements/Blind shot.svg";
import rookieBadge from "../assets/achievements/Rookie.svg";
import brokerBadge from "../assets/achievements/Veteran.svg";
import veteranBadge from "../assets/achievements/Graveyard shift.svg";
import noBadge from "../assets/achievements/no.svg";
import bugBuster from "../assets/achievements/BugBuster.svg";

export const Badges = [
  {
    title: "First Guess Rule",
    id: 1,
    description: "Make your first guess",
    obtained: false,
    source: firstguessruleBadge,
  },
  {
    title: "Bullseye",
    id: 2,
    description: "Guess within 1% of the actual population for the first time",
    obtained: false,
    source: bullseyeBadge,
  },
  {
    title: "Double Ace",
    id: 3,
    description:
      "Guess within 5% of the actual population 10 times (10 perfect guesses)",
    obtained: false,
    source: doubleaceBadge,
  },
  {
    title: "Blind Shot",
    id: 4,
    description: "Make a guess that's off by more than 95% (get score 0)",
    obtained: false,
    source: blindshotBadge,
  },
  {
    title: "Rookie",
    id: 5,
    description: "Play 10 rounds",
    obtained: false,
    source: rookieBadge,
  },
  {
    title: "Sergeant",
    id: 6,
    description: "Play 50 rounds",
    obtained: false,
    source: brokerBadge,
  },
  {
    title: "Veteran",
    id: 7,
    description: "Play 100 rounds",
    obtained: false,
    source: veteranBadge,
  },
  {
    title: "No",
    id: 8,
    description: "Play 1337 rounds",
    obtained: false,
    source: noBadge,
  },
  {
    title: "Bug Buster",
    id: 9,
    description: "Report a bug to developers",
    obtained: false,
    source: bugBuster,
  },
];
