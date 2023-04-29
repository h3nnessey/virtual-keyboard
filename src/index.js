import keys from './keys.js';

class Keyboard {
  static init() {
    this.container = document.createElement('div');
    this.keyboard = document.createElement('div');
    this.container.classList.add('container');
    this.keyboard.classList.add('keyboard');
    this.keyboard.appendChild(this.createKeyboardKeys(keys));
    this.container.appendChild(this.keyboard);
    document.body.appendChild(this.container);

    window.addEventListener('keydown', (e) => {
      const button = this.getPressedKey(e);
      button.classList.add('keyboard__key_active');
    });

    window.addEventListener('keyup', (e) => {
      const button = this.getPressedKey(e);
      button.classList.remove('keyboard__key_active');
    });
  }

  static createKeyboardKeys(keysObject) {
    const documentFragment = document.createDocumentFragment();

    Object.entries(keysObject).forEach(([key, value]) => {
      const button = document.createElement('button');
      button.classList.add('keyboard__key', key);
      button.textContent = value;
      documentFragment.appendChild(button);
    });

    return documentFragment;
  }

  static getPressedKey(e) {
    e.preventDefault();
    const { code } = e;
    return document.querySelector(`.${code}`);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  Keyboard.init();
});
