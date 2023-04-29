import keys from './keys.js';

class Keyboard {
  constructor() {
    this.elements = {
      container: null,
      textArea: null,
      keyboard: null,
      keys: [],
    };
    this.lang = 'en';
    this.value = '';
    this.capsLock = {
      enabled: false,
      keyUppedCount: 0,
    };
    this.eventTypes = ['keydown', 'keyup'];
  }

  init() {
    this.elements.container = document.createElement('div');
    this.elements.textArea = document.createElement('textarea');
    this.elements.keyboard = document.createElement('div');
    this.initKeyboardKeys(keys.layout);

    this.elements.container.classList.add('container');
    this.elements.textArea.classList.add('keyboard-value');
    this.elements.keyboard.classList.add('keyboard');

    this.elements.keyboard.append(...this.elements.keys);
    this.elements.container.append(this.elements.textArea, this.elements.keyboard);
    document.body.appendChild(this.elements.container);

    this.eventTypes.forEach((eventType) => {
      window.addEventListener(eventType, (e) => this.handleKey(e, eventType));
    });
  }

  initKeyboardKeys(keysObject) {
    Object.entries(keysObject).forEach(([key, value]) => {
      const button = document.createElement('button');
      const span = document.createElement('span');
      const keyValue = value[this.lang].value;
      button.classList.add('keyboard__key', key);
      span.textContent = keyValue;
      button.appendChild(span);
      this.elements.keys.push(button);
    });
  }

  handleKey(e) {
    e.preventDefault();
    const key = this.elements.keys.find((el) => el.classList.contains(e.code));

    if (!key) return;

    if (e.type === 'keydown') {
      key.classList.add('keyboard__key_active');
      switch (e.code) {
        case 'Space': {
          this.value += ' ';
          break;
        }
        case 'Enter': {
          this.value += '\n';
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
          this.toggleCapsLock(e.type, e.repeat);
          break;
        }
        case 'MetaLeft': {
          break;
        }
        case 'ShiftLeft':
        case 'ShiftRight': {
          break;
        }
        case 'AltLeft':
        case 'AltRight': {
          if (e.ctrlKey && !e.repeat) {
            if (this.lang === 'en') {
              this.lang = 'ru';
            } else {
              this.lang = 'en';
            }
            this.changeKeysLanguage(keys.layout);
          }
          break;
        }
        case 'ControlLeft':
        case 'ControlRight': {
          if (e.altKey && !e.repeat) {
            if (this.lang === 'en') {
              this.lang = 'ru';
            } else {
              this.lang = 'en';
            }
            this.changeKeysLanguage(keys.layout);
          }
          break;
        }
        default: {
          this.value += key.lastChild.textContent;
        }
      }
      this.elements.textArea.value = this.value;
    }

    if (e.type === 'keyup') {
      key.classList.remove('keyboard__key_active');
      if (e.code === 'CapsLock') {
        this.toggleCapsLock(e.type);
      }
    }
  }

  isServiceKey(key) {
    let isService = false;
    keys.serviceKeys.forEach((serviceKey) => {
      if (key.classList.contains(serviceKey)) {
        isService = true;
      }
    });
    return isService;
  }

  changeKeysLanguage() {
    Object.entries(keys.layout).forEach(([keyName, value]) => {
      const key = this.elements.keys.find((el) => el.classList.contains(keyName));
      const keyValue = value[this.lang].value;
      if (!key || this.isServiceKey(key)) return;
      key.lastChild.textContent = this.capsLock.enabled
        ? keyValue.toUpperCase()
        : keyValue.toLowerCase();
    });
  }

  changeKeyboardCase() {
    this.elements.keys.forEach((key) => {
      if (this.isServiceKey(key)) return;
      const { textContent } = key.lastChild;
      const span = document.createElement('span');

      if (this.capsLock.enabled) {
        span.textContent = textContent.toUpperCase();
      } else {
        span.textContent = textContent.toLowerCase();
      }

      key.lastChild.replaceWith(span);
    });
  }

  toggleCapsLock(eventType, isRepeat) {
    const capsLockBtn = this.elements.keys.find((key) => key.classList.contains('CapsLock'));

    if (eventType === 'keydown' && !isRepeat) {
      this.capsLock.enabled = true;
      capsLockBtn.classList.add('keyboard__key_enabled');
      this.changeKeyboardCase();
    }

    if (eventType === 'keyup') {
      if (this.capsLock.keyUppedCount > 0) {
        capsLockBtn.classList.remove('keyboard__key_enabled');
        this.capsLock.enabled = false;
        this.capsLock.keyUppedCount = 0;
        this.changeKeyboardCase();
      } else {
        this.capsLock.keyUppedCount += 1;
      }
    }
  }
}

export default Keyboard;
