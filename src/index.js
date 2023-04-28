import keys from './keys.js';

window.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  const keyboard = document.createElement('div');

  container.classList.add('container');
  keyboard.classList.add('keyboard');

  Object.entries(keys).forEach(([key, value]) => {
    const button = document.createElement('button');
    button.classList.add('keyboard__key', key);
    button.textContent = value;
    keyboard.appendChild(button);
  });
  container.appendChild(keyboard);
  document.body.appendChild(container);

  window.addEventListener('keydown', (e) => {
    e.preventDefault();
    const { code } = e;
    const button = document.querySelector(`.${code}`);
    button.classList.add('keyboard__key_active');
  });

  window.addEventListener('keyup', (e) => {
    e.preventDefault();
    const { code } = e;
    const button = document.querySelector(`.${code}`);
    button.classList.remove('keyboard__key_active');
  });

  window.addEventListener('blur', () => {
    document
      .querySelectorAll('.keyboard__key')
      .forEach((key) => key.classList.remove('keyboard__key_active'));
  });
});
