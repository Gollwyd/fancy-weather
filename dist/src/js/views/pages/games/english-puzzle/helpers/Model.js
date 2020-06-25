const apiBackAddr = 'https://afternoon-falls-25894.herokuapp.com/words';
const apiGithubAddr = 'https://raw.githubusercontent.com/dispector/rslang-data/master/data/';

const Model = {
  getWordsFromBackend: async (group, page) => {
    try {
      const wordsPromise = await fetch(`${apiBackAddr}?page=${page}&group=${group}
      &wordsPerExampleSentenceLTE=10&wordsPerPage=10
        `,
      {});
      if (wordsPromise.status !== 200) {
        return null;
      }
      const words = await wordsPromise.json();
      return words;
    } catch (e) {
      console.log('Ошибка при получении слов', e.message);
      return null;
    }
  },

  /**
   * получить определенное количество слов с github
   *
   * @param {number} page - страница по сложности (от 1 до 6)
   * @param {number} count - количество слов, которое нужно вернуть
   * @param {number} offset - сдвиг слов от нуля
   *
   * @return {Object[]} - массив объектов со словами
   */
  getWordsFromGithub: async (page, count = 10, offset = 0) => {
    try {
      const wordsPromise = await fetch(`${apiGithubAddr}book${page}.json`);
      if (wordsPromise.status !== 200) {
        return null;
      }
      const words = await wordsPromise.json();
      const wordsLen = words.length;

      return ((wordsLen - offset) < count)
        ? null
        : words.slice(offset, count + offset);
    } catch (e) {
      console.log('Ошибка при получении слов', e.message);
      return null;
    }
  },
};

export default Model;
