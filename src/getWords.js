/* eslint-disable no-use-before-define */
import './getWords.css';


function shuffle(arr) {
  const array = arr;
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i
    // поменять элементы местами
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


export default async function getWords(group = 0, page = 0) {
  document.body.innerHTML = '';

  const level = document.createElement('select');
  level.name = 'level';
  for (let i = 0; i < 7; i += 1) {
    const lev = document.createElement('option');
    lev.value = i;
    lev.innerHTML = i;
    level.appendChild(lev);
  }
  document.body.appendChild(level);

  const pages = document.createElement('select');
  pages.name = 'Page';
  for (let i = 0; i < 31; i += 1) {
    const lev = document.createElement('option');
    lev.value = i;
    lev.innerHTML = i;
    pages.appendChild(lev);
  }
  document.body.appendChild(pages);
  pages.onchange = () => {
    getWords(level.value, pages.value);
  };
  level.value = group;
  pages.value = page;


  const response = await fetch(`https://afternoon-falls-25894.herokuapp.com/words?page=${page}&group=${group}`);
  const words = await response.json();


  const text = document.createElement('div');
  text.classList.add('text');
  document.body.appendChild(text);

  const translate = document.createElement('button');
  translate.innerText = 'Показать/скрыть перевод';
  document.body.appendChild(translate);
  translate.onclick = () => {
    text.classList.toggle('unvisible');
  };

  const startField = document.createElement('div');
  startField.classList.add('startField');
  document.body.appendChild(startField);

  const buttons = document.createElement('div');
  buttons.classList.add('buttons');
  document.body.appendChild(buttons);


  setString(0);

  async function setString(i) {
    const checkButton = document.createElement('button');
    checkButton.innerHTML = 'Check';
    buttons.appendChild(checkButton);

    const iDKButton = document.createElement('button');
    iDKButton.innerHTML = 'I d\'t know';
    buttons.appendChild(iDKButton);


    // window.console.log(words[i].word);
    // window.console.log(words[i].textExample);

    let string = words[i].textExample.replace(/\.$/, '');
    let array = string.split(' ');
    string = string.replace(/<b>|<\/b>/g, '');
    text.textContent = words[i].textExampleTranslate;
    const oldArray = string.split(' ');
    const oldString = string.replace(/\s/g, '');

    array = shuffle(array);
    const endField = document.createElement('div');
    endField.classList.add('endField');
    document.body.appendChild(endField);

    const space0 = document.createElement('div');
    space0.classList.add(`droppable${words[i].word}`);
    space0.classList.add('space0');
    endField.append(space0);
    space0.style.order = 100;

    checkButton.onclick = () => {
      const list = document.querySelectorAll(`div.droppable${words[i].word}`);
      for (let u = 0; u < list.length - 1; u += 1) {
        if (list[u].textContent === oldArray[u]) { list[u].style.backgroundColor = 'green'; } else { list[u].style.backgroundColor = 'red'; }
      }
      if (endField.textContent === oldString) {
        endField.style.backgroundColor = 'green';
        buttons.innerHTML = '';
        const cont = document.createElement('button');
        cont.innerHTML = 'Continue';
        cont.onclick = () => {
          if (i < 9) {
            buttons.innerHTML = '';
            setString(i + 1);
          } else if (page < 30) {
            getWords(group, page + 1);
          } else if (group < 6) { getWords(group + 1, 0); } else alert('Доигрался. Конец.');
        };
        buttons.appendChild(cont);
      }
    };
    iDKButton.onclick = () => {
      endField.textContent = string;
      startField.innerHTML = '';

      buttons.innerHTML = '';
      const cont = document.createElement('button');
      cont.innerHTML = 'Continue';
      cont.onclick = () => { if (i < 9) { buttons.innerHTML = ''; setString(i + 1); } };
      buttons.appendChild(cont);
    };
    startField.onclick = (e) => {
      if (e.target !== space0 && e.target.classList.contains(`droppable${words[i].word}`)) space0.before(e.target);
    };

    array.forEach((element) => {
      const word = document.createElement('div');
      word.innerHTML = element;
      word.classList.add('word');
      startField.appendChild(word);


      let currentDroppable = null;


      word.onmousedown = (event) => {
        event.preventDefault();
        const shiftX = event.clientX - word.getBoundingClientRect().left;
        const shiftY = event.clientY - word.getBoundingClientRect().top;


        word.style.position = 'absolute';
        word.style.zIndex = 1000;


        function moveAt(pageX, pageY) {
          word.style.left = `${pageX - shiftX}px`;
          word.style.top = `${pageY - shiftY}px`;
        }
        function enterDroppable(e) {
          e.style.paddingLeft = '40px';
        }

        function leaveDroppable(e) {
          e.style.paddingLeft = '';
        }

        word.ondragstart = () => false;
        moveAt(event.pageX, event.pageY);

        function onMouseMove(e) {
          moveAt(e.pageX, e.pageY);

          word.hidden = true;
          const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
          word.hidden = false;

          if (!elemBelow) return;

          const droppableBelow = elemBelow.closest(`.droppable${words[i].word}`);
          if (currentDroppable !== droppableBelow) {
            if (currentDroppable) leaveDroppable(currentDroppable);
            currentDroppable = droppableBelow;
            if (currentDroppable) enterDroppable(currentDroppable);
          }
        }

        document.addEventListener('mousemove', onMouseMove);

        word.onmouseup = () => {
          document.removeEventListener('mousemove', onMouseMove);
          word.style.position = '';
          word.style.left = '';
          word.style.top = '';
          word.style.zIndex = '';
          word.onmouseup = null;
          word.classList.add(`droppable${words[i].word}`);
          currentDroppable.before(word);


          leaveDroppable(currentDroppable);
        };
      };
    });
  }

  // endField.textContent
}
