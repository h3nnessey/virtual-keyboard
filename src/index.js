import keysData from './keys.js';
import Keyboard from './Keyboard.js';

window.addEventListener('DOMContentLoaded', () => {
  const keyboard = new Keyboard(keysData);
  keyboard.init();
});
