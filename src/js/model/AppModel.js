/* eslint-disable max-len */
export default class AppModel {
  constructor() {
    this.searchString = 'https://afternoon-falls-25894.herokuapp.com/words?';
    this.contentURL = 'https://raw.githubusercontent.com/dispector/rslang-data/master/data/book';
    this.userName = 'defaultUser';
    this.maxDictionaryLength = 3600;
    this.learnedWordsCounter = 100;
    this.learnedWords = [];
    this.newWords = [];
    this.difficultWords = [];
    this.deletedWords = [];
    this.dailyQuote = 20;
    this.maxWordsPerExampleSentence = 50;
    this.wordSetLength = 600;
    this.numberOfDifficulties = 6;
    this.currentWordSet = [];
    this.gameStatistics = {
      englishPuzzle: {},
      savannah: {},
      speakIt: {},
      sprint: {},
      square: {},
    };
  }

  // change current user to new one
  changeUser(userName) {
    this.userName = userName;
  }

  // return array of words, which user learned before. NOT FINISHED!!!!
  async getLearnedWords() {
    const UserData = localStorage.getItem(this.userName);
    if (UserData) {
      this.learnedWordsCounter = UserData.learnedWordsCounter;
      const url = 'https://afternoon-falls-25894.herokuapp.com/words?group=1&page=1';
      const responce = await fetch(url);
      const data = await responce.json();
      this.learnedWords = [];
      for (let i = 0; i < data.length; i += 1) {
        this.learnedWords.push(data[i].word);
      }
    } else {
      this.setDefaultUserData(this.userName);
      this.learnedWords = [];
    }
    return this.learnedWords;
  }

  // get a single learned word
  async getRandomLearnedWord() {
    const randomIndex = Math.floor(Math.random() * Math.floor(this.learnedWordsCounter));
    // console.log(this.learnedWordsCounter);
    return this.getWordDataByIndex(randomIndex);
  }

  // get a single unknown word
  async getNewUnknownWord() {
    this.learnedWordsCounter += 1;
    return this.getWordDataByIndex(this.learnedWordsCounter);
  }

  // get a single random word with set difficulty and round
  async getRandomWordByDifficulty(difficulty, round, roundLength) {
    if (difficulty > 5 || difficulty < 0) {
      return null;
    }
    const startOfDifficultyGroup = Math.floor(difficulty * 600);
    const startOfRound = startOfDifficultyGroup + Math.floor((600 / roundLength) * round);
    const index = startOfRound + Math.floor(Math.random() * roundLength);
    const result = await this.getWordDataByIndex(index);
    // console.log(startOfDifficultyGroup, startOfRound, index, result);
    return result;
  }

  // initialize user data for the first load
  setDefaultUserData(userName) {
    this.userName = userName;
    this.learnedWordsCounter = 100;
    this.difficultWords = [];
    this.deletedWords = [];
    localStorage.setItem(this.userName, {
      learnedWordsCounter: this.learnedWordsCounter,
      difficultWords: [],
      deletedWords: [],
      gameStatistics: {
        englishPuzzle: {
          level: 0,
          page: 0,
          round: 0,
        },
        savannah: {},
        speakIt: {},
        sprint: {},
        square: {},
      },
    });
  }

  // save current user data in local storage(on document.unload)
  saveUserData() {
    localStorage.setItem('defaultUser', {
      learnedWordsCounter: this.learnedWordsCounter,
      difficultWords: this.difficultWords,
      deletedWords: this.deletedWords,
      gameStatistics: this.gameStatistics,
    });
  }

  // load user data from local storage(currently happens on document.load)
  loadUserData() {
    const UserData = localStorage.getItem('defaultUser');
    // console.log(UserData);
    if (!UserData) {
      this.setDefaultUserData();
    } else {
      this.learnedWordsCounter = UserData.learnedWordsCounter ? UserData.learnedWordsCounter : 100;
      this.difficultWords = UserData.difficultWords ? UserData.difficultWords : []; // ?? check this
      this.deletedWords = UserData.deletedWords ? UserData.deletedWords : [];
      this.gameStatistics = UserData.gameStatistics ? UserData.gameStatistics : {
        englishPuzzle: {
          level: 0,
          page: 0,
          round: 0,
        },
        savannah: {},
        speakIt: {},
        sprint: {},
        square: {},
      };
    }
  }

  // manually set counter for learned words, supposed to be used only for debugging!!
  setLearnedWords(num) {
    this.learnedWordsCounter = num;
  }

  // increase counter forlearned words by 1
  increaseLearnedWordsBy1() {
    this.learnedWordsCounter += 1;
  }

  // decrease counter forlearned words by 1
  decreaseLearnedWordsBy1() {
    this.learnedWordsCounter -= 1;
  }

  // utility function, cuts useless word data and sets correct paths for img/mp3 assets
  reformatWordData(wordData) {
    return {
      id: wordData.id,
      textExample: wordData.textExample,
      textExampleTranslate: wordData.textExampleTranslate,
      textMeaning: wordData.textMeaning,
      textMeaningTranslate: wordData.textMeaningTranslate,
      word: wordData.word,
      wordTranslate: wordData.wordTranslate,
      transcription: wordData.transcription,
      audio: `${this.contentURL}${wordData.audio}`,
      audioMeaning: `${this.contentURL}${wordData.audioMeaning}`,
      audioExample: `${this.contentURL}${wordData.audioExample}`,
      image: `${this.contentURL}${wordData.image}`,
      difficulty: wordData.group,
    };
  }

  // utilty function, gets word data from API by its index
  async getWordDataByIndex(index) {
    // console.log(index);
    const group = Math.floor(index / 600);
    const page = Math.floor((index - group * 600) / 20);
    const wordIndex = index - (group * 600) - (page * 20);
    const url = `https://afternoon-falls-25894.herokuapp.com/words?group=${group}&page=${page}`;
    const responce = await fetch(url);
    const data = await responce.json();
    const result = this.reformatWordData(data[wordIndex]);
    return result;
  }

  async getFivePossibleTranslations() {
    const correctWordData = await this.getNewUnknownWord();
    const incorrectTranslation1Promise = this.getRandomLearnedWord();
    const incorrectTranslation2Promise = this.getRandomLearnedWord();
    const incorrectTranslation3Promise = this.getRandomLearnedWord();
    const incorrectTranslation4Promise = this.getRandomLearnedWord();
    const incorrectTranslation1 = await incorrectTranslation1Promise;
    const incorrectTranslation2 = await incorrectTranslation2Promise;
    const incorrectTranslation3 = await incorrectTranslation3Promise;
    const incorrectTranslation4 = await incorrectTranslation4Promise;
    return {
      correct: correctWordData,
      incorrect: [
        incorrectTranslation1,
        incorrectTranslation2,
        incorrectTranslation3,
        incorrectTranslation4,
      ],
    };
  }

  async getTwoPossibleTranslations() {
    const correctWordDataPromise = this.getRandomLearnedWord();
    const incorrectTranslationPromise = this.getRandomLearnedWord();
    const correctWordData = await correctWordDataPromise;
    const incorrectTranslation = await incorrectTranslationPromise;
    return {
      correct: correctWordData,
      incorrect: incorrectTranslation.wordTranslate,
    };
  }

  async getSetOfWords(group, page) {
    const url = `https://afternoon-falls-25894.herokuapp.com/words?group=${group}&page=${page}`;
    const responce = await fetch(url);
    const data = await responce.json();
    const result = data.map((x) => this.reformatWordData(x));
    return result;
  }

  async getSetOfWordsCustomLength(group, page, wordsPerPage) {
    const url = `${this.searchString}group=${group}&page=${page}&wordsPerExampleSentenceLTE=${this.maxWordsPerExampleSentence}&wordsPerPage=${wordsPerPage}`;
    const responce = await fetch(url);
    const data = await responce.json();
    const result = data.map((x) => this.reformatWordData(x));
    return result;
  }

  async getSetOfWordsByDifficulty(difficulty, round, roundLength) {
    let resultArr = [];
    let firstPage = [];
    let secondPage = [];
    let transformedRound;
    switch (roundLength) {
      case 10:
        firstPage = await this.getSetOfWords(difficulty, Math.floor(round / 2));
        if (round % 2 === 0) {
          resultArr = firstPage.slice(0, 10);
        } else {
          resultArr = firstPage.slice(10);
        }
        break;
      case 20:
        resultArr = await this.getSetOfWords(difficulty, round);
        break;
      case 30:
        transformedRound = round * 1.5;
        if (round % 2 === 0) {
          firstPage = await this.getSetOfWords(difficulty, transformedRound);
          secondPage = await this.getSetOfWords(difficulty, transformedRound + 1);
          resultArr = firstPage.concat(secondPage.slice(0, 10));
        } else {
          transformedRound = Math.floor(transformedRound);
          firstPage = await this.getSetOfWords(difficulty, transformedRound);
          secondPage = await this.getSetOfWords(difficulty, transformedRound + 1);
          resultArr = firstPage.slice(10).concat(secondPage);
        }
        break;
      default:
        return null;
    }
    return resultArr;
  }

  // Deprecated!!!
  /* async getSetOfWordsAndTranslationsOld(difficulty, round, roundLength, numberOfTranslations) {
    const correctResults = await this.getSetOfWordsByDifficulty(difficulty, round, roundLength);
    const incorrectTranslationsPromises = [];
    let incorrectTranslations = [];
    let incorrectTranslationsSubArray = [];
    const finalArray = [];
    let usableDifficulties = [0, 1, 2, 3, 4, 5].filter((x) => x !== difficulty);
    usableDifficulties = usableDifficulties.slice(0, numberOfTranslations);
    for (let i = 0; i < numberOfTranslations; i += 1) {
      incorrectTranslationsPromises.push(this.getSetOfWordsByDifficulty(usableDifficulties[i], round, roundLength));
    }
    incorrectTranslations = await Promise.all(incorrectTranslationsPromises);
    for (let i = 0; i < roundLength; i += 1) {
      incorrectTranslationsSubArray = [];
      for (let j = 0; j < numberOfTranslations; j += 1) {
        incorrectTranslationsSubArray.push(incorrectTranslations[j][i]);
      }
      finalArray.push({ correct: correctResults[i], incorrect: incorrectTranslationsSubArray });
    }
    return finalArray;
  } */

  // служебная функция, записывающая массив слов данной сложности из гитхаба в модель
  async getWordsDataFromGithub(difficulty) {
    const url = `${this.contentURL}${difficulty}.json`;
    const responce = await fetch(url);
    const data = await responce.json();
    this.currentWordSet = await data;
  }

  // служебная ф-я, достающая из данных модели набор слов для указанного раунда
  getRoundDataFromModel(round, roundLength) {
    return this.currentWordSet.slice(round * roundLength, (round + 1) * roundLength);
  }

  // предполагается что это будет основная ф-я для получения слов из бекенда в миниигры
  // на входе: difficulty - сложность (от 1 до 6)
  // round - номер раунда. в зависимости от длины раунда может быть  0 - 29, 0-19 или 0-59.
  // roundLength - количество слов в раунде игры. допустимые значения 10/20/30
  // numberOfTranslations - количество НЕПРАВИЛЬНЫХ переводов идущих вместе с правильным (от 1 до 5)
  async getSetOfWordsAndTranslations(difficulty, round, roundLength, numberOfTranslations) {
    const incorrectTranslationsRounds = [];
    const incorrectTranslations = [];
    let incorrectTranslationsSubArray = [];
    let numberOfCurrentRound;
    const finalArray = [];
    const totalNumberOfRounds = this.wordSetLength / roundLength;
    await this.getWordsDataFromGithub(difficulty);
    const correctResults = this.getRoundDataFromModel(round, roundLength);
    do {
      numberOfCurrentRound = Math.floor(Math.random() * totalNumberOfRounds);
      if (!incorrectTranslationsRounds.includes(numberOfCurrentRound) && numberOfCurrentRound !== round) {
        incorrectTranslationsRounds.push(numberOfCurrentRound);
      }
    } while (incorrectTranslationsRounds.length < numberOfTranslations);
    for (let i = 0; i < numberOfTranslations; i += 1) {
      incorrectTranslations[i] = this.getRoundDataFromModel(incorrectTranslationsRounds[i], roundLength);
    }
    for (let i = 0; i < roundLength; i += 1) {
      incorrectTranslationsSubArray = [];
      for (let j = 0; j < numberOfTranslations; j += 1) {
        incorrectTranslationsSubArray.push(incorrectTranslations[j][i]);
      }
      finalArray.push({ correct: correctResults[i], incorrect: incorrectTranslationsSubArray });
    }
    return finalArray;
  }

  // выдает рандомный массив выученных слов заданной длины
  async getSetOfLearnedWords(numberOfWords) {
    let startIndex = 0;
    if (numberOfWords > this.learnedWordsCounter) {
      return null;
    }
    const randomSeed = Math.floor(Math.random() * (this.learnedWordsCounter - numberOfWords));
    const randomDifficulty = Math.floor(randomSeed / this.wordSetLength) + 1;
    await this.getWordsDataFromGithub(randomDifficulty);
    startIndex = randomSeed - randomDifficulty * this.wordSetLength;
    return this.currentWordSet.slice(startIndex, startIndex + numberOfWords);
  }
}
