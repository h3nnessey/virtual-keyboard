import keys from './keys.js';

window.addEventListener('DOMContentLoaded', () => {
  const div = document.createElement('div');
  div.classList.add('container');

  Object.entries(keys).forEach(([key, value]) => {
    const button = document.createElement('button');
    button.classList.add('keyboard__key', key);
    button.textContent = value;
    div.appendChild(button);
  });

  document.body.appendChild(div);

  window.addEventListener('keydown', (e) => {
    e.preventDefault();
    const { code } = e;
    const button = document.querySelector(`.${code}`);
    button.classList.add('active');
  });

  window.addEventListener('keyup', (e) => {
    e.preventDefault();
    const { code } = e;
    const button = document.querySelector(`.${code}`);
    button.classList.remove('active');
  });
});
