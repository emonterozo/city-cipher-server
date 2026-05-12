const fs = require("fs");

const rawText = fs.readFileSync("words.txt", "utf8");
const DICTIONARY = rawText
  .split("\n")
  .map((w) => w.trim().toUpperCase())
  .filter((w) => {
    return w.length >= 3 && w.length <= 8 && /^[A-Z]+$/.test(w);
  });

class CityCipherEngine {
  constructor(internalSize = 25) {
    this.internalSize = internalSize;
    this.reset();
  }

  reset() {
    this.grid = [];
    this.cells = {};
  }

  findSubs(seed) {
    const getCounts = (str) => {
      const counts = {};
      for (const char of str.toUpperCase()) {
        counts[char] = (counts[char] || 0) + 1;
      }
      return counts;
    };
    const seedCounts = getCounts(seed);
    return DICTIONARY.filter((word) => {
      const w = word.toUpperCase();
      if (w.length < 3 || w === seed.toUpperCase()) return false;
      const wordCounts = getCounts(w);
      for (const char in wordCounts) {
        if (!seedCounts[char] || wordCounts[char] > seedCounts[char])
          return false;
      }
      return true;
    });
  }

  generate(id, seed) {
    this.reset();
    const subWords = this.findSubs(seed);
    const allWords = [
      seed.toUpperCase(),
      ...subWords.map((s) => s.toUpperCase()),
    ].sort((a, b) => b.length - a.length);

    if (this.solve(allWords, 0)) {
      return this.finalizeLevel(id, seed);
    }
    return null;
  }

  solve(words, index) {
    if (index === words.length) return true;
    const word = words[index];

    if (index === 0) {
      const entry = { word, x: 10, y: 10, dir: "h" };
      this.add(entry);
      if (this.solve(words, index + 1)) return true;
      this.remove();
      return false;
    }

    for (const placed of this.grid) {
      for (let i = 0; i < placed.word.length; i++) {
        for (let j = 0; j < word.length; j++) {
          if (placed.word[i] === word[j]) {
            const newDir = placed.dir === "h" ? "v" : "h";
            const ix = placed.dir === "h" ? placed.x + i : placed.x;
            const iy = placed.dir === "v" ? placed.y + i : placed.y;
            const nx = newDir === "h" ? ix - j : ix;
            const ny = newDir === "v" ? iy - j : iy;

            const entry = { word, x: nx, y: ny, dir: newDir };
            if (this.canPlace(entry)) {
              this.add(entry);
              if (this.solve(words, index + 1)) return true;
              this.remove();
            }
          }
        }
      }
    }
    return this.solve(words, index + 1);
  }

  canPlace(e) {
    // 1. DUPLICATE CHECK: Prevent two words starting at the same spot in the same direction
    if (this.grid.some((p) => p.x === e.x && p.y === e.y && p.dir === e.dir))
      return false;

    for (let i = 0; i < e.word.length; i++) {
      const x = e.dir === "h" ? e.x + i : e.x;
      const y = e.dir === "v" ? e.y + i : e.y;
      const char = e.word[i];
      const coord = `${x},${y}`;

      if (x < 0 || x >= this.internalSize || y < 0 || y >= this.internalSize)
        return false;
      if (this.cells[coord] && this.cells[coord] !== char) return false;

      // 2. OVERLAP CHECK: Prevent words from being buried inside each other (e.g., RED inside REDLINE)
      // If the cell is already taken by a word in the SAME direction, REJECT.
      const sameDirOccupied = this.grid.some((p) => {
        if (p.dir !== e.dir) return false;
        for (let k = 0; k < p.word.length; k++) {
          const px = p.dir === "h" ? p.x + k : p.x;
          const py = p.dir === "v" ? p.y + k : p.y;
          if (px === x && py === y) return true;
        }
        return false;
      });
      if (sameDirOccupied) return false;

      // 3. BUFFER CHECK: Neighbors
      const neighbors =
        e.dir === "h"
          ? [
              { dx: 0, dy: -1 },
              { dx: 0, dy: 1 },
            ]
          : [
              { dx: -1, dy: 0 },
              { dx: 1, dy: 0 },
            ];

      if (i === 0)
        neighbors.push(e.dir === "h" ? { dx: -1, dy: 0 } : { dx: 0, dy: -1 });
      if (i === e.word.length - 1)
        neighbors.push(e.dir === "h" ? { dx: 1, dy: 0 } : { dx: 0, dy: 1 });

      for (const n of neighbors) {
        if (this.cells[`${x + n.dx},${y + n.dy}`] && !this.cells[coord])
          return false;
      }
    }
    return true;
  }

  add(e) {
    this.grid.push(e);
    for (let i = 0; i < e.word.length; i++) {
      const x = e.dir === "h" ? e.x + i : e.x;
      const y = e.dir === "v" ? e.y + i : e.y;
      this.cells[`${x},${y}`] = e.word[i];
    }
  }

  remove() {
    this.grid.pop();
    this.cells = {};
    const temp = [...this.grid];
    this.grid = [];
    temp.forEach((e) => this.add(e));
  }

  finalizeLevel(id, seed) {
    let minX = 25,
      maxX = 0,
      minY = 25,
      maxY = 0;
    this.grid.forEach((e) => {
      const ex = e.dir === "h" ? e.x + e.word.length - 1 : e.x;
      const ey = e.dir === "v" ? e.y + e.word.length - 1 : e.y;
      minX = Math.min(minX, e.x);
      maxX = Math.max(maxX, ex);
      minY = Math.min(minY, e.y);
      maxY = Math.max(maxY, ey);
    });

    const finalGrid = this.grid.map((e) => ({
      word: e.word,
      x: e.x - minX + 1,
      y: e.y - minY + 1,
      dir: e.dir,
    }));

    return {
      level: id,
      letters: seed.toUpperCase().split("").sort(),
      rows: maxY - minY + 1 + 2,
      cols: maxX - minX + 1 + 2,
      grid: finalGrid,
    };
  }
}

const engine = new CityCipherEngine();
const finalLevels = [];
let levelCounter = 1;

// 2. Loop until we hit 1,600 levels
while (finalLevels.length < 20) {
  // --- NEW: PROGRESSION LOGIC ---
  let minLen, maxLen;
  let minWords, maxWords;

  if (levelCounter <= 200) {
    // Rank 1: Tutorial / Very Easy
    minLen = 3;
    maxLen = 4;
    minWords = 3;
    maxWords = 4;
  } else if (levelCounter <= 600) {
    // Rank 2: Easy
    minLen = 4;
    maxLen = 5;
    minWords = 4;
    maxWords = 5;
  } else if (levelCounter <= 1000) {
    // Rank 3: Medium
    minLen = 4;
    maxLen = 6;
    minWords = 5;
    maxWords = 6;
  } else {
    // Rank 4: Hard / Expert
    minLen = 5;
    maxLen = 7;
    minWords = 6;
    maxWords = 8;
  }

  // Filter the dictionary for the CURRENT level difficulty
  const currentDifficultySeeds = DICTIONARY.filter(
    (w) => w.length >= minLen && w.length <= maxLen,
  );

  const randomSeed =
    currentDifficultySeeds[
      Math.floor(Math.random() * currentDifficultySeeds.length)
    ];

  // Try to generate the level
  const level = engine.generate(levelCounter, randomSeed, DICTIONARY);

  if (level && level.grid.length >= minWords && level.grid.length <= maxWords) {
    finalLevels.push(level);
    console.log(
      `Level ${levelCounter} [${randomSeed.length} letters]: ${randomSeed}`,
    );
    levelCounter++;
  }
}

// 3. Save to your Flutter-ready JSON file
fs.writeFileSync("levels.json", JSON.stringify(finalLevels, null, 2));

const generateDartFile = (levels) => {
  let dartCode = "import 'package:flutter/material.dart';\n\n";

  // Define the class in the same file or ensure it's imported
  dartCode += `class GameLevel {
  final List<String> letters;
  final List<Map<String, dynamic>> grid;
  final int rows;
  final int cols;
  final List<Offset>? preFilled;

  GameLevel({
    required this.letters,
    required this.grid,
    required this.rows,
    required this.cols,
    this.preFilled,
  });
}\n\n`;

  dartCode += "final List<GameLevel> allLevels = [\n";

  levels.forEach((level, index) => {
    // Convert the letters array to a clean Dart list string
    const lettersList = JSON.stringify(level.letters);

    dartCode += `  // LEVEL ${index + 1}
  GameLevel(
    letters: ${lettersList},
    rows: ${level.rows},
    cols: ${level.cols},
    grid: [\n`;

    level.grid.forEach((item) => {
      dartCode += `      {"word": "${item.word}", "x": ${item.x}, "y": ${item.y}, "dir": "${item.dir}"},\n`;
    });

    dartCode += `    ],
  ),\n`;
  });

  dartCode += "];\n";

  return dartCode;
};

// Execution:
// const dartContent = generateDartFile(finalLevels);
// fs.writeFileSync("game_data.dart", dartContent);
// console.log(`Generated all_levels.dart with ${finalLevels.length} levels!`);
