const Dictionary = {

  render: async (model) => {
    const view = /* html */`
    <section class="section dictionary--container">
      <button class="dictionary--getInfo__button">Получить словарь для текушего пользователя</button>
      <button class="dictionary--getNewInfo__button">Получить новые слова для текушего пользователя</button>
      <h1 class="dictionary--subheader">Словарь для пользователя 1</h1>
      <h2>Изучаемые слова</h2>
      <div class="dictionary--currentWords"></div>
      <h2>Сложные слова</h2>
      <div class="dictionary--hardWords"></div>
      <h2>Удалённые слова</h2>
      <div class="dictionary--deletedWords"></div>
    </section>
          `;

    console.log(await model.getSetOfWordsAndTranslations(1, 10, 20, 4));
    return view;
  },
  afterRender: async () => {
  },

};

export default Dictionary;
