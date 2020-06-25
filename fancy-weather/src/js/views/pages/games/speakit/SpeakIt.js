import Utils from '../../../../services/Utils';
import '../../../../../css/pages/games/allGames.scss';
import '../../../../../css/pages/games/speakit/speakit.scss';
import Game from '../game';
import AppModel from '../../../../model/AppModel';

const SpeakIt = {

  beforeRender() {
    this.clearHeaderAndFooter();
  },

  clearHeaderAndFooter: () => {
    Utils.clearBlock('.header');
    Utils.clearBlock('.footer');
  },


  render: () => {
    SpeakIt.beforeRender();

    const view = `
    
    
    <div class="speak__container">
        
        <div class="allGames__startScreen start">
            <h1 class="allGames__heading">Speak It!</h1>
            <p class="allGames__description">Тренировка произношения слов</p>
            <div class="allGames__playMods">
              <div>
                <h2>Игра с новыми словами</h2>
                <div class="levels__container"></div>
                <button class="allGames__startBtn level__start__button">Начать</button>
              </div>
              <div>
                <h2>Игра с изученными словами</h2>
                <button class="allGames__startBtn start__button">Начать</button>
              </div>
            </div>
            
        </div>
        <div class="allGames__timerScreen allGames__timerScreen-hidden">
            <div class="allGames__timer">3</div>
            <div class="allGames__tip">Нажми «говорить» и произноси слова</div>
        </div>   
        <div class="game allGames__playScreen allGames__playScreen-hidden">
            
            
            <div class="pic__container">
                <div class="pic__image">
                    <img src="./src/img/games/speakit/dummy.jpg" alt="">
                </div>
                <!-- <div class="pic__translate">Cry</div> -->
                <div class="pic__translate"></div>

            </div>
            <div class="words__container">
                <div class="word"></div>
                <div class="word"></div>
                <div class="word"></div>
                <div class="word"></div>
                <div class="word"></div>
                <div class="word"></div>
                <div class="word"></div>
                <div class="word"></div>
                <div class="word"></div>
                <div class="word"></div>

                <!-- <div class="word">
                    <div class="word__icon"></div>
                    <div class="word__block">
                      <div class="word__english">test</div>
                      <div class="word__transcription">[test]</div>
                    </div>
                </div> -->

            </div>
            <div class="buttons__container">
                <div class="button button__restart">Заново</div>
                <div class="button button__speak">Говорить</div>
                <div class="button button__results">Результат</div>
                <div class="button button__startScreen2">К старту</div>
            </div>

        </div>
        <div class="results">
            <h2 class="results__header">Результаты последней игры</h2>
            <div class="results__errors"></div>
            <h3>Произнесённые верно слова</h3>
            <div class="results__words results__correct__words">
                    <!-- <div class="stat__word">
                    <div class="sound__icon" data-audio="files/27_0521.mp3"></div>
                    <div class="text">actually</div>
                    <div class="transcription">[ǽktʃuəli]</div>
                    <div class="translate">на самом деле</div>
                </div> -->
              </div>   
            <h3>Произнесённые неверно слова</h3>
            <div class="results__words results__uncorrect__words"></div>
            
            <div class="result__buttons">
                <div class="button button__restart">Повторить</div>
                <div class="button button__global">Глобальная статистика</div>
                <div class="button button__next">Продолжить</div>
                <div class="button button__startScreen">К старту</div>
            </div>
        </div>
        <div class="global">
            <div class="global__header">Stats for all FINISHED games</div>

            <div class="global__results">
                <table>
                    <tr>
                        <th class = "td__datetime">DateTime</th>
                        <th class = "td__words">Words</th>
                        <th class = "td__errors">Errors</th>
                    </tr>
                </table>
            </div>
            <div class="global__buttons">
                
                <div class="button button__stats">Назад к статистике</div>
            </div>
        </div>

    </div>
      `;
    return view;
  },

  afterRender: () => {
    const config = {
      wordsApiUrl: 'https://afternoon-falls-25894.herokuapp.com/words?',
      apiMaxPage: 29,
      repoUrl: 'https://raw.githubusercontent.com/irinainina/rslang-data/master/',
      YaTranslateApiUrl: 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200322T155651Z.de98a60e6a99185e.089aea4237b51c6db082c966f27a7895cd1e8b44&',
      pages: {
        startPage: 'start',
        gamePage: 'game',
        resultsPage: 'results',
        globalPage: 'global',
      },
      hiddenCssCLass: 'hidden',

    };
    let recognition = null;
    let gameInProcess = false;
    let words = [];
    let wordsArr = [];
    let correctWords = [];
    let unCorrectWords = [];
    let level = 0;
    let levels = {};
    let pages = {};
    let corrects = 0;
    let errors = 0;
    let page = 0;
    let mode = 'repeat';
    const correctAudio = new Audio('./src/audio/correct.mp3');
    const errorAudio = new Audio('./src/audio/error.mp3');


    // localStorage.setItem('games', null);
    async function getRepeatWords() {
      let repeatWords = [];
      repeatWords = await AppModel.getSetOfLearnedWords(10);

      return repeatWords;
    }

    function createLevels() {
      const levelsContainer = document.querySelector('.levels__container');
      levels = document.createElement('select');
      levels.name = 'levels';
      levels.id = 'levels';
      const levelsLable = document.createElement('label');
      levelsLable.textContent = 'Уровень:';
      levelsLable.for = 'levels';
      for (let i = 0; i < 6; i += 1) {
        const lev = document.createElement('option');
        lev.value = i;
        lev.innerHTML = i;
        levels.append(lev);
      }
      levelsContainer.append(levelsLable);
      levelsContainer.append(levels);

      pages = document.createElement('select');
      pages.name = 'pages';
      for (let i = 0; i < 60; i += 1) {
        const pag = document.createElement('option');
        pag.value = i;
        pag.innerHTML = i;
        pages.append(pag);
      }
      pages.id = 'pages';
      const pagesLable = document.createElement('label');
      pagesLable.textContent = 'Раунд:';
      pagesLable.for = 'pages';
      levelsContainer.append(pagesLable);
      levelsContainer.append(pages);
      setLastGame();
      pages.onchange = async () => {
        level = levels.value;
        page = pages.value;
        localStorage.setItem('speakItlevel', JSON.stringify({ levels: level, pages: page }));
      };
      levels.onchange = async () => {
        level = levels.value;
        page = pages.value;
        localStorage.setItem('speakItlevel', JSON.stringify({ levels: level, pages: page }));
      };
    }
    function setLastGame() {
      let lastGame = JSON.parse(localStorage.getItem('speakItlevel'));
      if (lastGame === null) {
        lastGame = { levels: 0, pages: 0 };
      }
      levels.value = lastGame.levels;
      pages.value = lastGame.pages;
      level = lastGame.levels;
      page = lastGame.pages;
      localStorage.setItem('speakItlevel', JSON.stringify(lastGame));
    }
    function start() { // страница "Старт"
      document.querySelector('.allGames__startScreen-hidden').classList.remove('allGames__startScreen-hidden');
      document.querySelector('.allGames__timer').textContent = 3;
      showPage('startPage');
    }

    async function game(words = null) { // страница "Игра"
      if (words === null) { // если не переданы слова, получить новые
        setLastGame();
        if (mode === 'repeat') { await getRepeatWords(); } else { await reloadWords(); }
      }
      await showPage('gamePage');
      resetGameCount();
      resetSpeak();
      clearWords();
      renderWords();
    }

    function resetGameCount() { // сбросить счет, остановить игру
      errors = 0;
      corrects = 0;
      correctWords = [];
      unCorrectWords = [];
      // this.wordsArr = [];
      wordsArr = words.map((wordObj) => wordObj.word.toLowerCase()); // массив слов игры
      gameInProcess = false;
    }

    function resetSpeak() { // убрать стиль с кнопки "speak", откл+вкл прослушивание кнопки
      const speakButton = document.querySelector('.button__speak');
      speakButton.classList.remove('activated');
    }

    async function clearWords() { // удалить все слова из блоков, заменить картинку на стандартную, удалить перевод
      const words = document.querySelectorAll('.words__container .word');
      words.forEach((word) => {
        clearContainer(word);
        word.classList.remove('pushed');
        word.classList.remove('correct');
      });

      // поставить стандартную картинку
      const imgContainer = document.querySelector('.pic__image img');
      imgContainer.src = './src/img/games/speakit/dummy.jpg';
      // imgContainer.src = dummyImg;

      // удалить последнее из поля слово и убрать стили (угадано/ошибка)
      const translateContainer = document.querySelector('.pic__translate');
      translateContainer.innerText = '';
      translateContainer.classList.remove('translation-correct');
      translateContainer.classList.remove('translation-error');
    }

    async function reloadWords() { // загрузить новые слова
      words = [];
      words = await getDataFromWordsApi();
    }

    function renderWords() { // отрисовать слова в контейнере
      const wordsContainer = document.querySelectorAll('.words__container .word');
      words.forEach((word, i) => renderWord(word, wordsContainer[i]));
    }

    function renderWord(word, container) { // отрисовать блок со словом
      container.dataset.word = word.word.toLowerCase();
      renderDiv('word__icon', '', container);
      const container2 = renderDiv('word__word', null, container);
      renderDiv('word__english', word.word, container2);
      renderDiv('word__transcription', word.transcription, container2);
    }

    function renderDiv(cssClass, text, container) {
      const el = document.createElement('div');
      el.classList.add(cssClass);
      el.innerText = text;
      container.append(el);
      return el;
    }

    async function getDataFromWordsApi() { // получить данные от API со словами
      // const page = Math.round(Math.random() * config.apiMaxPage);
      const polPage = Math.floor(page / 2);
      const url = `${config.wordsApiUrl}group=${level}&page=${polPage}`;
      const DatWords = await fetch(url);
      const json = await DatWords.json();
      if (page % 2) return shuffleWords(json.slice(10, 20));
      return shuffleWords(json.slice(0, 10));
      // this.words = this.shuffleWords(json).slice(0,10);
    }

    function showPage(page) { // скрыть все страницы, показать нужную
      hideAllPages();
      const pageClass = config.pages[page];
      const container = document.querySelector(`.${pageClass}`);
      container.classList.remove(config.hiddenCssCLass);
    }

    function addListeners() { // повесить слушатели событий
      // нажатие на "Старт"
      const startButton = document.querySelector('.start__button');
      startButton.addEventListener('click', startButtonClick);


      const startScreenButton = document.querySelector('.button__startScreen');
      startScreenButton.addEventListener('click', start);
      const startScreenButton2 = document.querySelector('.button__startScreen2');
      startScreenButton2.addEventListener('click', start);

      const levelStartButton = document.querySelector('.level__start__button');
      levelStartButton.addEventListener('click', LevelStartButtonClick);


      // переключение уровня сложности
      // const levelsContainer = document.querySelector('.levels__container');
      // levelsContainer.addEventListener('click', changeLevelClick);

      // клик по слову
      const wordsContainer = document.querySelector('.words__container');
      wordsContainer.addEventListener('click', wordClick);

      // клик по кнопке "Speak" (начать запись)
      const speakButton = document.querySelector('.button__speak');
      speakButton.addEventListener('click', speak);

      // клик по кнопке "Restart" в игре (сброс)
      const restartButton = document.querySelector('.button__restart');
      restartButton.addEventListener('click', restart);

      // клик по кнопке "Results" в игре (показать статистику)
      const resultsButton = document.querySelector('.button__results');
      resultsButton.addEventListener('click', results);

      // статистика
      const statsResultButtons = document.querySelector('.result__buttons');

      const statsRestartButton = statsResultButtons.querySelector('.button__restart');
      statsRestartButton.addEventListener('click', restart);

      // клик по кнопке "Results" в игре (показать статистику)
      const statsRepeatButton = statsResultButtons.querySelector('.button__next');
      statsRepeatButton.addEventListener('click', next);

      // проиграть произношение слова на статистике
      const statWordsContainer = document.querySelector('.results');
      statWordsContainer.addEventListener('click', statsWordClick);

      // показать глобальную статистику приложения
      const globalStatsButton = document.querySelector('.result__buttons .button__global');
      globalStatsButton.addEventListener('click', globalStatsClick);

      
      // вернуться из глобальной статистики к статистике последней игры
      const globalStatsButtonBack = document.querySelector('.global__buttons .button__stats');
      globalStatsButtonBack.addEventListener('click', results);
    }

    const globalStatsClick = () => {
      globalStats();
    };

    function globalStats() {
      showPage('globalPage');
      clearGlobalResults();
      renderGlobalResults();
    }

    function clearGlobalResults() {
      const resTable = document.querySelector('.global__results table');
      const tds = resTable.querySelectorAll('td');
      tds.forEach((td) => td.remove());
    }

    function renderGlobalResults() {
      const gamesInfo = getGamesFromLocalStorage();
      if (gamesInfo !== null) {
        gamesInfo.forEach((game) => renderGameRes(game));
      }
    }

    function renderGameRes(gameObj) {
      const globalResContainer = document.querySelector('.global__results table');

      const newTr = document.createElement('tr');

      const dateTd = document.createElement('td');
      dateTd.innerText = gameObj.date;
      newTr.append(dateTd);

      const wordsTd = document.createElement('td');
      wordsTd.innerText = gameObj.words.join(', ');
      newTr.append(wordsTd);

      const errorsTd = document.createElement('td');
      errorsTd.innerText = gameObj.errors;
      newTr.append(errorsTd);

      globalResContainer.append(newTr);
    }

    const statsWordClick = (e) => {
      const target = e.target.closest('.stat__word');
      if (!target) { // если это не слово со звуком
        return;
      }

      const audioIcon = target.querySelector('.sound__icon');
      const { audio } = audioIcon.dataset;
      playSound(audio);
      console.log(audio);
    };

    const results = (e) => { // страница "Результаты"
      showPage('resultsPage');
      renderResults();
    };

    function saveGameToLocalStorage() { // записать результаты игры в localStorage
      let gameInfo = JSON.parse(localStorage.getItem('speakItStat'));
      if (gameInfo === null) {
        gameInfo = [];
      }

      gameInfo.push({
        date: new Date().toLocaleString(),
        errors,
        words: wordsArr,
      });

      localStorage.setItem('speakItStat', JSON.stringify(gameInfo));
    }

    function getGamesFromLocalStorage() {
      return JSON.parse(localStorage.getItem('speakItStat'));
    }

    async function renderResults() { // вывести страницу с результатом
      const errorsContainer = document.querySelector('.results__errors');
      const correctWordsContainer = document.querySelector('.results__correct__words');
      const uncorrectWordsContainer = document.querySelector('.results__uncorrect__words');
      clearContainer(uncorrectWordsContainer);
      clearContainer(correctWordsContainer);

      errorsContainer.innerText = `Ошибок: ${errors}`;
      const correctDivListWords = document.querySelectorAll('.words__container .correct');
      const correctDivWords = Array.prototype.slice.call(correctDivListWords);
      correctWords = [];
      unCorrectWords = [];
      words.forEach((element) => {
        let isCorrect = false;
        correctDivWords.forEach((word) => {
          if (word.dataset.word === element.word) { correctWords.push(element); isCorrect = true; }
        });
        if (!isCorrect) unCorrectWords.push(element);
      });

      correctWords.forEach((word) => renderStatForWord(word, '.results__correct__words'));

      unCorrectWords.forEach((word) => renderStatForWord(word, '.results__uncorrect__words'));
    }

    async function renderStatForWord(wordObj, selector) { // вывести статистику для одного слова
      const wordsContainer = document.querySelector(selector);
      const newWord = document.createElement('div');
      newWord.classList.add('stat__word');

      const newWordSoundIcon = document.createElement('div');
      newWordSoundIcon.classList.add('sound__icon');
      newWordSoundIcon.dataset.audio = wordObj.audio;
      newWord.append(newWordSoundIcon);

      const newWordText = document.createElement('div');
      newWordText.classList.add('text');
      newWordText.innerText = wordObj.word;
      newWord.append(newWordText);

      const newWordTransciption = document.createElement('div');
      newWordTransciption.classList.add('transcription');
      newWordTransciption.innerText = wordObj.transcription;
      newWord.append(newWordTransciption);

      const newWordTranslate = document.createElement('div');
      newWordTranslate.classList.add('translate');
      const translated = await getTranslate(wordObj.word);
      newWordTranslate.innerText = translated;
      newWord.append(newWordTranslate);

      wordsContainer.append(newWord);
    }

    const restart = (e) => { // сброс игры
      game(words);
    };

    const next = async (e) => {
      if (page < 59) localStorage.setItem('speakItlevel', JSON.stringify({ levels: level, pages: Number(page) + 1 }));
      else localStorage.setItem('speakItlevel', JSON.stringify({ levels: Number(level) + 1, pages: 0 }));

      game();
    };

    const speak = (e) => { // начать игру о распознаванию слов
      if (gameInProcess === true) {
        return;
      }
      // сбросить игру

      const speakButton = document.querySelector('.button__speak');
      speakButton.classList.add('activated');

      gameInProcess = true;
      correctWords = [];
      unCorrectWords = [];

      // const correctWords = [];

      // const words = this.words.map(wordObj => wordObj.word); // массив слов игры
      // this.wordsArr = this.words.map(wordObj => wordObj.word); // массив слов игры
      const wordsContainer = document.querySelector('.words__container');
      const wordsDivs = document.querySelectorAll('.words__container .word');
      const imgContainer = document.querySelector('.pic__image img');
      const translateContainer = document.querySelector('.pic__translate');

      wordsDivs.forEach((wordDiv) => wordDiv.classList.remove('pushed'));
      wordsDivs.forEach((wordDiv) => wordDiv.classList.remove('correct'));

      if (recognition === null) {
        recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';

        recognition.addEventListener('result', (event) => {
          if (gameInProcess === true) {
            const speakedWord = event.results[0][0].transcript.toLowerCase();
            if (!correctWords.includes(speakedWord)) {
              translateContainer.classList.remove('translation-correct');
              translateContainer.classList.remove('translation-error');
              translateContainer.innerText = speakedWord;

              if (wordsArr.includes(speakedWord)) {
                const speakedWordDiv = wordsContainer.querySelector(`[data-word='${speakedWord}']`);
                correctWords.push(speakedWord);
                speakedWordDiv.classList.add('correct');
                translateContainer.classList.add('translation-correct');
                const { image } = words.filter((word) => word.word.toLowerCase() === speakedWord.toLowerCase())[0];
                correctAudio.play();
                imgContainer.src = config.repoUrl + image;
                corrects += 1;
                if (isGameIsEnd()) {
                  saveGameToLocalStorage();
                  results();
                }
              } else {
                errorAudio.play();
                errors += 1;
                translateContainer.classList.add('translation-error');
              }
            }
          }
        });

        recognition.addEventListener('end', recognition.start);

        recognition.start();
      } else {
        // this.recognition.start();
      }
    };

    function isGameIsEnd() {
      return corrects === words.length;
    }
    const LevelStartButtonClick = async () => {
      mode = 'level';
      game();
    };
    const startButtonClick = async () => { // обработчик нажатия на "Start"
      mode = 'repeat';
      words = await getRepeatWords();
      if (words.length === 0) { words = null; LevelStartButtonClick(); alert('Играй новыми'); } else { game(words); }
    };


    const wordClick = (e) => { // обработчик нажатия на слово
      const target = e.target.closest('.word');
      if (!target) { // если это не контейнер со словом
        return;
      }
      if (gameInProcess === true) { // если игра запущена
        return;
      }

      const wordsCl = document.querySelectorAll('.words__container .word');
      wordsCl.forEach((word) => word.classList.remove('pushed'));
      target.classList.add('pushed');
      const pushedWord = target.dataset.word;
      // let wordsArray = Array.prototype.slice.call(words);
      const pushedWordData = words.find((wordObj) => wordObj.word === pushedWord);

      processWord(pushedWordData);
    };

    function processWord(wordObj) { // вставить картинку, слово, проиграть звук
      const { image } = wordObj;
      const { audio } = wordObj;
      setImage(image);
      setTranslate(wordObj.word);
      playSound(audio);
    }

    function setImage(image) { // установить картинку
      const imgContainer = document.querySelector('.pic__image img');
      imgContainer.src = config.repoUrl + image;
    }

    async function setTranslate(word) { // получить перевод слова и вставить его на страницу
      const url = `${config.YaTranslateApiUrl}text=${word}&lang=en-ru`;
      const translationObj = await fetch(url);
      const json = await translationObj.json();
      const translation = json.text[0];

      const translateContainer = document.querySelector('.pic__translate');
      translateContainer.innerText = translation;
    }

    async function getTranslate(word) {
      const url = `${config.YaTranslateApiUrl}text=${word}&lang=en-ru`;
      const translationObj = await fetch(url);
      const json = await translationObj.json();
      const translation = json.text[0];
      return translation;
    }

    function playSound(sound) { // проиграть слово
      const soundPath = config.repoUrl + sound;

      const audio = new Audio(soundPath);
      audio.play();
    }

    /*
    const changeLevelClick = (e) => { // обработчик выбора уровня сложности
      const { target } = e;
      if (!target.classList.contains('lev')) {
        return;
      }
      const levs = document.querySelectorAll('.levels__container .lev');
      levs.forEach((lev) => lev.classList.remove('active'));

      target.classList.add('active');
      level = target.dataset.lev;
      game();
    };
    */

    function hideAllPages() { // скрыть все "страницы"
      const { pages } = config;
      for (const page in pages) {
        hidePage(config.pages[page]);
      }
    }

    function hidePage(page) { // скрыть одну страницу
      const pageSelector = document.querySelector(`.${page}`);
      if (pageSelector) {
        pageSelector.classList.add(config.hiddenCssCLass);
      }
    }

    function shuffleWords(wordsArr) { // перемешать слова в массиве
      for (let i = wordsArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wordsArr[i], wordsArr[j]] = [wordsArr[j], wordsArr[i]];
      }
      return wordsArr;
    }

    function clearContainer(container) { // очистить переданный контейнер
      container.innerHTML = '';
    }

    Game.startGame();
    addListeners();


    showPage('startPage');
    createLevels();
  },
};

export default SpeakIt;
