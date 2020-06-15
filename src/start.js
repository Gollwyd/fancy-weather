import './start.css';
import getWords from './getWords';

export default function (content) {
  localStorage.setItem('token', content.token);
  console.log(content);
  document.body.innerHTML = '';
  const startScreen = document.createElement('div');
  startScreen.innerHTML = '<h1>ENGLISH PUZZLE</h1><p>Click on words, collect phrases</p>';
  startScreen.classList.add('start');
  const startButton = document.createElement('button');
  startButton.innerText = 'Start';
  startScreen.appendChild(startButton);
  document.body.appendChild(startScreen);

  startButton.onclick = () => getWords();
}
