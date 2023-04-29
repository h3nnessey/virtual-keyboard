import keys from './keys.js';

class Keyboard {
  constructor() {
    this.elements = {
      container: null,
      textArea: null,
      keyboard: null,
      keys: [],
    };
    this.value = '';
    this.capsLock = {
      enabled: false,
      keyUppedCount: 0,
      keyDownedCount: 0,
    };
    this.eventTypes = ['keydown', 'keyup'];
  }

  init() {
    this.elements.container = document.createElement('div');
    this.elements.textArea = document.createElement('textarea');
    this.elements.keyboard = document.createElement('div');
    this.createKeyboardKeys(keys.layout);

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

  createKeyboardKeys(keysObject) {
    Object.entries(keysObject).forEach(([key, value]) => {
      const button = document.createElement('button');
      const span = document.createElement('span');
      button.classList.add('keyboard__key', key);
      span.textContent = value;
      button.appendChild(span);
      this.elements.keys.push(button);
    });
  }

  handleKey(e) {
    e.preventDefault();
    const { code, type } = e;
    const button = this.elements.keys.find((key) => key.classList.contains(code));
    if (!button) return;

    if (type === 'keydown') {
      // todo: need current cursor position in textarea
      button.classList.add('keyboard__key_active');
      switch (code) {
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
          this.toggleCapsLock(type, button);
          break;
        }
        default: {
          this.value += button.lastChild.textContent;
        }
      }
      this.elements.textArea.value = this.value;
    }

    if (type === 'keyup') {
      button.classList.remove('keyboard__key_active');
      if (code === 'CapsLock') {
        this.toggleCapsLock(e.type);
      }
    }
  }

  changeKeysCase() {
    function isServiceKey(key) {
      let isService = false;
      keys.serviceKeys.forEach((serviceKey) => {
        if (key.classList.contains(serviceKey)) {
          isService = true;
        }
      });
      return isService;
    }

    this.elements.keys.forEach((key) => {
      if (isServiceKey(key)) return;
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

  toggleCapsLock(eventName) {
    const capsLockBtn = this.elements.keys.find((key) => key.classList.contains('CapsLock'));

    if (eventName === 'keydown') {
      this.capsLock.enabled = true;
      this.capsLock.keyDownedCount += 1;
      if (this.capsLock.keyDownedCount === 1) {
        capsLockBtn.classList.add('keyboard__key_enabled');
        this.changeKeysCase();
      }
    }

    if (eventName === 'keyup') {
      if (this.capsLock.keyUppedCount > 0) {
        capsLockBtn.classList.remove('keyboard__key_enabled');
        this.capsLock.enabled = false;
        this.capsLock.keyUppedCount = 0;
        this.capsLock.keyDownedCount = 0;
        this.changeKeysCase();
      } else {
        this.capsLock.keyUppedCount += 1;
      }
    }
  }
}

export default Keyboard;
