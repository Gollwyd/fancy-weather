import '../../../../../css/pages/games/savannah/savannah.scss';
import '../../../../../css/pages/games/allGames.scss';
import Utils from '../../../../services/Utils';
import Game from '../Game';

const Savannah = {

  beforeRender() {
    this.clearHeaderAndFooter();
  },

  clearHeaderAndFooter: () => {
    Utils.clearBlock('.header');
    Utils.clearBlock('.footer');
  },

  render: async () => {
    Savannah.beforeRender();

    const view = `
    <div class="savannah  allGames">
        <section class="savannah__startScreen  allGames__startScreen">
            <h1 class="allGames__heading">Саванна</h1>
            <p class="allGames__description">Тренировка Саванна развивает словарный запас. Чем больше слов ты
                знаешь, тем больше очков опыта получишь.</p>
            <button class="allGames__startBtn  btn">Начать</button>
        </section>

        <section class="savannah__timerScreen  allGames__timerScreen  allGames__timerScreen-hidden">
            <div class="allGames__timer">3</div>
            <div class="allGames__tip">Используй клавиши 1, 2, 3 и 4, чтобы дать быстрый ответ</div>
        </section>

        <section class="savannah__playScreen  allGames__playScreen  allGames__playScreen-hidden">
            <div>Let's play</div>
        </section>
    </div>
    `;

    return view;
  },

  afterRender: async () => {
    Game.startGame();
  },
};

export default Savannah;
