import keys from './keys.js';

class Keyboard {
  static init() {
    this.container = document.createElement('div');
    this.keyboard = document.createElement('div');
    this.container.classList.add('container');
    this.keyboard.classList.add('keyboard');
    this.keyboard.appendChild(this.createKeyboardKeys(keys));
    this.container.appendChild(this.keyboard);

    this.value = '';
    this.capsLock = {
      enabled: false,
      keyUppedCount: 0,
    };

    document.body.appendChild(this.container);

    ['keydown', 'keyup'].forEach((eventType) => {
      window.addEventListener(eventType, (e) => this.handleKey(e, eventType));
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

  static handleKey(e, eventName) {
    e.preventDefault();
    const { code } = e;
    const button = document.querySelector(`.${code}`);
    if (!button) return;

    if (eventName === 'keydown') {
      // todo: need current cursor position in textarea
      button.classList.add('keyboard__key_active');
      switch (code) {
        case 'Space': {
          this.value += ' ';
          break;
        }
        case 'Backspace': {
          this.value = this.value.slice(0, -1);
          break;
        }
        case 'Delete': {
          break;
        }
        case 'Tab': {
          this.value += ' '.repeat(4);
          break;
        }
        case 'CapsLock': {
          this.capsLock.enabled = true;
          button.classList.add('keyboard__key_enabled');
          console.log(this.capsLock.enabled);
          break;
        }
        default: {
          this.value += button.textContent;
        }
      }
      console.log(this.value);
    }

    if (eventName === 'keyup') {
      button.classList.remove('keyboard__key_active');
      if (code === 'CapsLock') {
        if (this.capsLock.keyUppedCount > 0) {
          this.capsLock.enabled = false;
          this.capsLock.keyUppedCount = 0;
          button.classList.remove('keyboard__key_enabled');
          console.log(this.capsLock.enabled);
        } else {
          this.capsLock.keyUppedCount += 1;
          console.log(this.capsLock.enabled);
        }
      }
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  Keyboard.init();
});
