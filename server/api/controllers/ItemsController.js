/**
 * ItemsControllerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const csv = require('csvtojson');
const fs = require('fs');
const lineByLine = require('n-readlines');

const pathGames = './../../wikipedia/words/Games';
const pathProgramming = './../../wikipedia/words/programming';
const FileObject = (function() {
  return function FileObject(fileName, words) {
    this.fileName = fileName;
    this.words = words;
  };
})();

var fileWordMap = new Map();


module.exports = {

  wordOne: async function(req, res) {
    let search = req.param('search');
    let array = search.split(' ');  // only allow one word
    search = array[0];

    let allFileObjects = await getFileObjects();

    let filesToGet = fileWordMap.get(search);

    let currentSearchFiles = allFileObjects.filter(file => {
      return filesToGet.includes(file.fileName);
    });

    let results = [];

    currentSearchFiles.forEach(file =>{
      results.push({page: file, score: getWordFrequency(file, search)});
    });

    results.sort((a, b) => {
      return (a.fileName < b.fileName) ? 1 : -1;
    });
    results.sort((a, b) => {
      return (a.score < b.score) ? 1 : -1;
    });

    results = results.slice(0,5);

    normalizeSortedWordFreqScore(results);

    return res.status(200).json(results);
  },

  wordMore: async function(req, res) {
    let search = req.param('search');
    console.log('word more');
    search+='wm';
    return res.status(200).json(search);
  },

  pageRank: async function(req, res) {
    let search = req.param('search');
    console.log('page rank');
    search+='pr';
    return res.status(200).json(search);
  }
};

async function getFileObjects() {
  let gameFiles = fs.readdirSync(__dirname + pathGames);
  let programmingFiles = fs.readdirSync(__dirname + pathProgramming);
  let files = await Promise.all(gameFiles.map(async (file, index) => {
    let words = await readFileToWordCountObject(__dirname + pathGames + '/' + file, file);
    let fileObject = new FileObject(file, words);
    return fileObject;
  }));
  let files2 = await Promise.all(programmingFiles.map(async (file, index) => {
    let words = await readFileToWordCountObject(__dirname + pathProgramming + '/' + file, file);
    let fileObject = new FileObject(file, words);
    return fileObject;
  }));

  return [...files, ...files2];
}

function normalizeSortedWordFreqScore(files) {
  let maxScore = files[0].score;
  files.forEach(file => {
    file.score = Math.round(file.score/maxScore * 100) / 100;
  });
}

function getWordFrequency(fileObject, searchString) {
  let searchWords = searchString.split(' ');
  let score = 0;
  searchWords.forEach(word => {
    score += fileObject.words[word].count;
  });
  return score;
}

async function readFileToWordCountObject(path, file) {
  var words='';
  var liner = new lineByLine(path);
  // read the file, line by line so that the whole file is not stored in memory.
  while(line = liner.next()){
    if (words.length > 0) {
      words + ' ' + line;
    } else {
      words += line;
    }
  }
  words = words.split(' ');
  let length = words.length;
  let count = 0;
  let wordCount = {};
  while(count < length){
    // if new word shows up. its count is 1
    if (wordCount[words[count]] === undefined) {
      let word = {};
      word.count = 1;
      word.firstIndex = count;
      wordCount[words[count]] = word;
    } else {
      // if word already exists. update its count;
      wordCount[words[count]].count = wordCount[words[count]].count + 1;
    }
    let valueToSet = getValueToSet(words[count], file);
    if (valueToSet) {
      fileWordMap.set(words[count], valueToSet);
    }
    count++;
  }
  return wordCount;
}

function getValueToSet(word, file) {
  valueToSet = word;
  if (fileWordMap.get(word) !== undefined) {
    let arrayOfFiles = fileWordMap.get(word);
    if (arrayOfFiles.includes(file)) {
      return null;
    } else {
      return [...fileWordMap.get(word), file];
    }
  } else {
    let array = [];
    array.push(file);
    return array;
  }
}
