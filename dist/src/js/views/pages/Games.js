import Utils from '../../services/Utils';
// import Audition from './games/english-puzzle/Audition';
import EnglishPuzzle from './games/english-puzzle/EnglishPuzzle';
import SpeakIt from './games/speakit/SpeakIt';
import Savannah from './games/savannah/Savannah';
// import Sprint from './games/english-puzzle/Sprint';
// import Square from './games/english-puzzle/Square';
import Error404 from './Error404';

const gameList = {
  // 'audition'        : Audition,
  'english-puzzle': EnglishPuzzle,
  speakit         : SpeakIt,
  savannah: Savannah,
  // 'sprint'          : Sprint,
  // 'square'          : Square,
};

const Games = {
  currentGame: null,

  render: async (model) => {
    Games.beforeRender();

    const view = /* html */ await Games.currentGame.render(model);
    return view;
  },

  beforeRender() { // установить игру
    this.setGame();
  },

  afterRender: async () => {
    await Games.currentGame.afterRender();
  },

  setGame() { // распарсить url, установить игру в св-во объекта
    const request = Utils.parseRequestURL();
    const { id: gameId } = request;
    const game = gameList[gameId];
    const page = (game) ? gameList[gameId] : Error404;
    this.currentGame = page;
  },

};

export default Games;
