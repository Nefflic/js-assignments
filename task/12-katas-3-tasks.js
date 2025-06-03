"use strict";

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ];
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
  const rows = puzzle.length;
  const cols = puzzle[0].length;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  function dfs(x, y, index, visited) {
    if (index === searchStr.length) return true;
    for (let [dx, dy] of directions) {
      let newX = x + dx,
        newY = y + dy;
      if (
        newX >= 0 &&
        newX < rows &&
        newY >= 0 &&
        newY < cols &&
        puzzle[newX][newY] === searchStr[index] &&
        !visited.has(`${newX},${newY}`)
      ) {
        visited.add(`${newX},${newY}`);
        if (dfs(newX, newY, index + 1, visited)) return true;
        visited.delete(`${newX},${newY}`);
      }
    }
    return false;
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (puzzle[i][j] === searchStr[0]) {
        let visited = new Set();
        visited.add(`${i},${j}`);
        if (dfs(i, j, 1, visited)) return true;
      }
    }
  }

  return false;
}

/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 *
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars, prefix = "") {
  if (chars.length === 0) {
    yield prefix;
  } else {
    for (let i = 0; i < chars.length; i++) {
      let remaining = chars.slice(0, i) + chars.slice(i + 1);
      yield* getPermutations(remaining, prefix + chars[i]);
    }
  }
}

/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing.
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 *
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
  let maxPrice = 0;
  let profit = 0;

  for (let i = quotes.length - 1; i >= 0; i--) {
    if (quotes[i] > maxPrice) {
      maxPrice = quotes[i];
    }
    profit += maxPrice - quotes[i];
  }
  return profit;
}

/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 *
 * @class
 *
 * @example
 *
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 *
 */
function UrlShortener() {
  this.urlMap = [];
  this.base62chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
}

UrlShortener.prototype = {
  encode: function (url) {
    let id = this.urlMap.length; 
    this.urlMap.push(url);
    return this.encodeBase62(id);
  },

  decode: function (code) {
    let id = this.decodeBase62(code);
    return this.urlMap[id] || null; 
  },

  encodeBase62: function (num) {
    let result = "";
    do {
      result = this.base62chars[num % 62] + result;
      num = Math.floor(num / 62);
    } while (num > 0);
    return result;
  },

  decodeBase62: function (str) {
    let num = 0;
    for (let char of str) {
      num = num * 62 + this.base62chars.indexOf(char);
    }
    return num;
  },
};

module.exports = {
  findStringInSnakingPuzzle: findStringInSnakingPuzzle,
  getPermutations: getPermutations,
  getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
  UrlShortener: UrlShortener,
};
