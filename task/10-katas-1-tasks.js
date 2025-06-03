"use strict";

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
  function* directCoors(from, to, dir) {
    let result = [
      `${from}b${to}`,
      `${from}${from}${to}`,
      `${from}${to}b${from}`,
      `${from}${to}`,
      `${from}${to}b${to}`,
      `${to}${from}${to}`,
      `${to}b${from}`,
    ];

    if (dir == "f") result.reverse();

    for (let i of result) {
      yield i;
    }
  }

  let result = [],
    azimuth = 0,
    items = [
      { dir: "N", func: directCoors("N", "E", "d") },
      { dir: "E", func: directCoors("S", "E", "f") },
      { dir: "S", func: directCoors("S", "W", "d") },
      { dir: "W", func: directCoors("N", "W", "f") },
    ];

  items.forEach((item) => {
    result.push({ abbreviation: item.dir, azimuth: azimuth });
    azimuth += 11.25;

    for (let i = 0; i < 7; i++) {
      result.push({ abbreviation: item.func.next().value, azimuth: azimuth });
      azimuth += 11.25;
    }
  });

  return result;
}

/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
  const arr = [],
    regex = new RegExp("{([0-9a-zA-Z.,]+)}", "i"),
    set = new Set();

  arr.push(str);

  while (arr.length) {
    let item = arr.shift();
    let matches = item.match(regex);

    if (matches != null) {
      let array = matches[1].split(",");

      array.forEach((current) => {
        arr.push(item.replace(matches[0], current));
      });
    } else if (!set.has(item)) {
      set.add(item);
      yield item;
    }
  }
}
/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
  let matrix = Array.from({ length: n }, () => Array(n).fill(0));

  let row = 0,
    col = 0,
    value = 0;
  for (let i = 0; i < n * n; i++) {
    matrix[row][col] = value++;

    if ((row + col) % 2 === 0) {
      if (col === n - 1) {
        row++;
      } else if (row === 0) {
        col++;
      } else {
        row--;
        col++;
      }
    } else {
      if (row === n - 1) {
        col++;
      } else if (col === 0) {
        row++;
      } else {
        row++;
        col--;
      }
    }
  }

  return matrix;
}

/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
  if (dominoes.length === 0) return true;

  let adjacency = new Map();

  for (let [a, b] of dominoes) {
    adjacency.set(a, (adjacency.get(a) || 0) + 1);
    adjacency.set(b, (adjacency.get(b) || 0) + 1);
  }
  let oddCount = 0;
  for (let count of adjacency.values()) {
    if (count % 2 !== 0) oddCount++;
  }
  if (oddCount > 2) return false;
  let visited = new Set();
  let nodes = [...adjacency.keys()];

  function dfs(node) {
    if (visited.has(node)) return;
    visited.add(node);
    for (let [a, b] of dominoes) {
      if (a === node && !visited.has(b)) dfs(b);
      if (b === node && !visited.has(a)) dfs(a);
    }
  }

  dfs(nodes[0]);

  return visited.size === nodes.length;
}

/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
  if (nums.length === 0) return "";

  let result = [];
  let start = nums[0],
    end = nums[0];

  for (let i = 1; i <= nums.length; i++) {
    if (i < nums.length && nums[i] === end + 1) {
      end = nums[i];
    } else {
      if (end - start >= 2) {
        result.push(`${start}-${end}`);
      } else {
        result.push(start.toString());
        if (start !== end) result.push(end.toString());
      }
      start = nums[i];
      end = nums[i];
    }
  }
  return result.join(",");
}

module.exports = {
  createCompassPoints: createCompassPoints,
  expandBraces: expandBraces,
  getZigZagMatrix: getZigZagMatrix,
  canDominoesMakeRow: canDominoesMakeRow,
  extractRanges: extractRanges,
};
