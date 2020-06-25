const Utils = {
  // --------------------------------
  //  Распарсить url на 3 составляющие - маршрут/id/действие
  // (например, post/1/update - маршрут для редактирования поста с id=1)
  //  Пример ближе к задаче - games/speakit (игры - SpeakIt)
  // --------------------------------
  parseRequestURL: () => {
    // получить из адресной строки всё после знака #, а затем разбить на массив по знаку /
    const url = window.location.hash.slice(1).toLowerCase() || '/';
    const r = url.split('/').slice(1);
    console.log('r array', r);
    const [resource, id, verb] = r;
    const request = {
      resource,
      id,
      verb,
    };

    return request;
  },

  /**
   * очистить блок с переданным селектором
   * @param string cssClass - селектор, который будет очищен
   */
  clearBlock: (cssClass) => {
    const element = document.querySelector(cssClass);
    element.innerHTML = '';
  },

  /**
   * удалить блок с переданным селектором
   * @param string cssClass - селектор, который будет удален
   */
  removeBlock: (cssClass) => {
    const element = document.querySelector(cssClass);
    element.remove();
  },

  /**
   * метод для создания html блоков
   *
   * @param {string} tagName - тега нового элемента (div, p, img, и т.д.)
   * @param {string|Array} cssClassArr - стиль (один или несколько) нового эл-та
   * @param {HTMLElement|null} container - контейнер, в котором нужно создать нов. элемент
   * @param {string} text - innerHTML нового эл-та
   * @param {Object} propsObj - объект с обычными атрибутами (src, href)
   * @param {Object} datasetObj - объект с data-атрибутами
   *
   * @return {HTMLElement} - новый созданный элемент
   */
  createBlockInside: (tagName, cssClassArr, container = null, text = '', propsObj = {}, datasetObj = {}) => {
    const blockName = document.createElement(tagName);

    // если стили пришли в массиве
    if (Array.isArray(cssClassArr) && cssClassArr.length !== 0) {
      cssClassArr.forEach((cssClass) => {
        blockName.classList.add(cssClass);
      });
    } else if ( // если стили пришли в непустой строке
      (typeof cssClassArr === 'string' || cssClassArr instanceof String)
      && cssClassArr.length > 0
    ) {
      blockName.classList.add(cssClassArr);
    }

    if (text) { // если передан текст
      blockName.innerHTML = text;
    }

    if (Object.keys(propsObj).length) { // если переданы свойства (src, href)
      Object.entries(propsObj).forEach(([key, value]) => {
        blockName[key] = value;
      });
    }

    if (Object.keys(datasetObj).length) { // если переданы data-атрибуты
      Object.entries(datasetObj).forEach(([key, value]) => {
        blockName.dataset[key] = value;
      });
    }

    if (container) { // если передан контейнер
      container.append(blockName);
    }

    return blockName;
  },
};

export default Utils;
