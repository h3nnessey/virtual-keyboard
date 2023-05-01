import keysData from './keys.js';
import Keyboard from './Keyboard.js';

window.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  const description = `<div class="description">
          <ul class="list">
            <li class="list__item"><span class="list-item__title">This keyboard was created on <span class="text-primary">Windows 10</span></span></li>
            <li class="list__item"><span class="list-item__title">Language switch: left <span class="text-primary">Ctrl + Alt</span></span></li>
          </ul>
         </div>`;
  container.classList.add('container');

  const keyboard = new Keyboard(keysData, container);
  keyboard.init();

  container.insertAdjacentHTML('beforeend', description);
});
