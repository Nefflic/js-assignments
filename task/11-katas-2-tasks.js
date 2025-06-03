"use strict";

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
  const DIGITS = {
    " _ | ||_|": "0",
    "     |  |": "1",
    " _  _||_ ": "2",
    " _  _| _|": "3",
    "   |_|  |": "4",
    " _ |_  _|": "5",
    " _ |_ |_|": "6",
    " _   |  |": "7",
    " _ |_||_|": "8",
    " _ |_| _|": "9",
  };

  let lines = bankAccount.split("\n");
  if (lines.length < 3) return NaN;

  let result = "";

  for (let i = 0; i < 27; i += 3) {
    let digitString =
      lines[0].slice(i, i + 3) +
      lines[1].slice(i, i + 3) +
      lines[2].slice(i, i + 3);

    result += DIGITS[digitString] || "?";
  }

  return result.includes("?") ? NaN : Number(result);
}

/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
  if (columns >= Number.MAX_SAFE_INTEGER) {
    yield text;
    return;
  }

  let words = text.split(" ");
  let line = "";

  for (let word of words) {
    if (line.length + word.length + (line.length > 0 ? 1 : 0) > columns) {
      yield line;
      line = word;
    } else {
      line += (line.length > 0 ? " " : "") + word;
    }
  }

  if (line) {
    yield line;
  }
}

/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
  StraightFlush: 8,
  FourOfKind: 7,
  FullHouse: 6,
  Flush: 5,
  Straight: 4,
  ThreeOfKind: 3,
  TwoPairs: 2,
  OnePair: 1,
  HighCard: 0,
};

function compareCards(hand) {
  let cardMap = new Map(),
    result = "";
  hand.forEach((value) => {
    let prev = cardMap.get(value.dig);

    cardMap.set(value.dig, prev == undefined ? 1 : prev + 1);
  });

  cardMap.forEach((value) => {
    if (value > 1) result += value;
  });

  return result;
}

function isStraight(hand) {
  let lowest = Math.min.apply(
    null,
    hand.map((value) => value.dig)
  );

  return hand.reduce((previous, current, index) => {
    return previous && current.dig - lowest == index;
  }, true);
}

function isAceStraight(hand) {
  hand = hand.map((value) => (value.dig == 14 ? 1 : value.dig)).sort();
  let lowest = Math.min.apply(null, hand);

  return hand.reduce((previous, current, index) => {
    return previous && current - lowest == index;
  }, true);
}

function isFlush(hand) {
  hand = hand.map((value) => value.mask);

  return hand[0] == (hand[1] | hand[2] | hand[3] | hand[4]);
}

function getPokerHandRank(hand) {
  hand = hand
    .map((value) => {
      let sec = value.length == 2 ? 1 : 2,
        dig = value.substr(0, sec),
        masks = new Map([
          ["♠", 1],
          ["♣", 2],
          ["♥", 4],
          ["♦", 8],
        ]),
        cards = new Map([
          ["J", 11],
          ["Q", 12],
          ["K", 13],
          ["A", 14],
        ]);

      if (cards.has(dig)) dig = cards.get(dig);

      return { dig: Number(dig), mask: masks.get(value.substr(sec)) };
    })
    .sort((a, b) => a.dig - b.dig);

  let rank = 0;

  switch (compareCards(hand)) {
    case "4":
      rank = PokerRank.FourOfKind;
      break;

    case "23":
    case "32":
      rank = PokerRank.FullHouse;
      break;

    case "22":
      rank = PokerRank.TwoPairs;
      break;

    case "3":
      rank = PokerRank.ThreeOfKind;
      break;

    case "2":
      rank = PokerRank.OnePair;
      break;

    default:
      if (isStraight(hand) || isAceStraight(hand)) rank = PokerRank.Straight;
  }

  if (isFlush(hand))
    if (rank == 0) rank = PokerRank.Flush;
    else rank = PokerRank.StraightFlush;

  return rank;
}

/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 *
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 *
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
  const lines = figure.split("\n");
  const height = lines.length;
  const width = lines[0].length;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (lines[y][x] === "+") {
        for (let bottomY = y + 1; bottomY < height; bottomY++) {
          if (lines[bottomY][x] === "+") {
            for (let rightX = x + 1; rightX < width; rightX++) {
              if (lines[y][rightX] === "+") {
                if (lines[bottomY][rightX] === "+") {
                  if (isRectangle(lines, x, y, rightX, bottomY)) {
                    yield drawRectangle(rightX - x + 1, bottomY - y + 1);
                    rightX = width;
                    bottomY = height;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

function isRectangle(lines, startX, startY, endX, endY) {
  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      if (y === startY || y === endY) {
        if ((x === startX || x === endX) && lines[y][x] !== "+") {
          return false;
        }
      } else {
        if (lines[y][x] === "+") {
          return false;
        }
        if ((x === startX || x === endX) && lines[y][x] !== "|") {
          return false;
        }
      }
    }
  }
  return true;
}

function drawRectangle(width, height) {
  let rectangle = "+" + "-".repeat(width - 2) + "+\n";
  for (let y = 1; y < height - 1; y++) {
    rectangle += "|" + " ".repeat(width - 2) + "|\n";
  }
  rectangle += "+" + "-".repeat(width - 2) + "+\n";
  return rectangle;
}

module.exports = {
  parseBankAccount: parseBankAccount,
  wrapText: wrapText,
  PokerRank: PokerRank,
  getPokerHandRank: getPokerHandRank,
  getFigureRectangles: getFigureRectangles,
};
