class Keyboard {
  constructor(keysData) {
    this.elements = {
      container: null,
      textArea: null,
      keyboard: null,
      keys: [],
    };
    this.props = {
      keysData,
      lang: localStorage.getItem('lang') || 'en',
      value: '',
      capsLock: {
        enabled: false,
        keyUppedCount: 0,
      },
      shiftPressed: false,
    };
  }

  init() {
    this.elements.container = document.createElement('div');
    this.elements.textArea = document.createElement('textarea');
    this.elements.keyboard = document.createElement('div');
    this.initKeyboardKeys(this.props.keysData.layout);

    this.elements.container.classList.add('container');
    this.elements.textArea.classList.add('keyboard-value');
    this.elements.keyboard.classList.add('keyboard');

    this.elements.keyboard.append(...this.elements.keys);
    this.elements.container.append(this.elements.textArea, this.elements.keyboard);
    document.body.appendChild(this.elements.container);

    ['keydown', 'keyup'].forEach((eventType) => {
      window.addEventListener(eventType, (e) => this.handleKey(e, eventType));
    });
  }

  initKeyboardKeys(keysObject) {
    Object.entries(keysObject).forEach(([key, value]) => {
      const button = document.createElement('button');
      const span = document.createElement('span');
      const keyValue = value[this.props.lang].value;
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
      switch (e.code) {
        case 'Space': {
          this.props.value += ' ';
          break;
        }
        case 'Enter': {
          this.props.value += '\n';
          break;
        }
        case 'Backspace': {
          this.props.value = this.props.value.slice(0, -1);
          break;
        }
        case 'Delete': {
          break;
        }
        case 'Tab': {
          this.props.value += '\t';
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
          if (this.props.shiftPressed) return;
          this.toggleShift(e.type, e.repeat);
          break;
        }
        case 'AltLeft': {
          this.changeKeyboardLanguage(e);
          break;
        }
        case 'ControlLeft': {
          this.changeKeyboardLanguage(e);
          break;
        }
        case 'ControlRight': {
          break;
        }
        case 'AltRight': {
          break;
        }
        default: {
          this.props.value += key.lastChild.textContent;
        }
      }
      key.classList.add('keyboard__key_active');
      this.elements.textArea.value = this.props.value;
    }

    if (e.type === 'keyup') {
      key.classList.remove('keyboard__key_active');
      if (e.code === 'CapsLock') {
        this.toggleCapsLock(e.type);
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.toggleShift(e.type, e.repeat);
      }
    }
  }

  isServiceKey(key) {
    let isService = false;
    this.props.keysData.serviceKeys.forEach((serviceKey) => {
      if (key.classList.contains(serviceKey)) {
        isService = true;
      }
    });
    return isService;
  }

  isShouldBeUpperCase() {
    const isCapsLockEnabled = this.props.capsLock.enabled;
    const isShiftPressed = this.props.shiftPressed;
    return (isCapsLockEnabled && !isShiftPressed) || (!isCapsLockEnabled && isShiftPressed);
  }

  changeKeyboardLanguage(e) {
    if (e.code === 'AltLeft' && e.ctrlKey && !e.repeat) {
      if (this.props.lang === 'en') {
        this.props.lang = 'ru';
      } else {
        this.props.lang = 'en';
      }
    }

    if (e.code === 'ControlLeft' && e.altKey && !e.repeat) {
      if (this.props.lang === 'en') {
        this.props.lang = 'ru';
      } else {
        this.props.lang = 'en';
      }
    }
    localStorage.setItem('lang', this.props.lang);
    this.changeKeysValues();
  }

  changeKeysValues() {
    Object.entries(this.props.keysData.layout).forEach(([keyName, value]) => {
      const key = this.elements.keys.find((el) => el.classList.contains(keyName));
      const keyValue = value[this.props.lang].value;
      const shiftValue = value[this.props.lang].shift;
      const isUpperCase = this.isShouldBeUpperCase();

      if (!key || this.isServiceKey(key)) return;

      if (!shiftValue) {
        key.lastChild.textContent = isUpperCase ? keyValue.toUpperCase() : keyValue.toLowerCase();
      } else if (this.props.shiftPressed) {
        key.lastChild.textContent = isUpperCase
          ? shiftValue.toUpperCase()
          : shiftValue.toLowerCase();
      } else {
        key.lastChild.textContent = isUpperCase ? keyValue.toUpperCase() : keyValue.toLowerCase();
      }
    });
  }

  toggleCapsLock(eventType, isRepeat) {
    const capsLockBtn = this.elements.keys.find((el) => el.classList.contains('CapsLock'));

    if (eventType === 'keydown' && !isRepeat) {
      this.props.capsLock.enabled = true;
      capsLockBtn.classList.add('keyboard__key_enabled');
      this.changeKeysValues();
    }

    if (eventType === 'keyup') {
      if (this.props.capsLock.keyUppedCount > 0) {
        capsLockBtn.classList.remove('keyboard__key_enabled');
        this.props.capsLock.enabled = false;
        this.props.capsLock.keyUppedCount = 0;
        this.changeKeysValues();
      } else {
        this.props.capsLock.keyUppedCount += 1;
      }
    }
  }

  toggleShift(eventType, isRepeat) {
    if (eventType === 'keydown' && !isRepeat) {
      this.props.shiftPressed = true;
    }

    if (eventType === 'keyup') {
      this.props.shiftPressed = false;
    }
    this.changeKeysValues();
  }
}

export default Keyboard;

// todo: resolve alt gr problem (since it emmit key press ctrL+altR at the same time)
// todo: remove unnecessary vars from constructor (like global container)
// todo: add clicks handlers
// todo: add cursor in textarea handler & arrows logic
// todo: add cross-platform key gen
// todo: replace switch/case with obj
