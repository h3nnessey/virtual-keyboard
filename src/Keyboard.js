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
      capsLockEnabled: false,
      shiftPressed: false,
      selection: {
        start: 0,
        end: 0,
      },
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

  saveTextAreaSelection() {
    this.props.selection.start = this.elements.textArea.selectionStart;
    this.props.selection.end = this.elements.textArea.selectionEnd;
  }

  setTextAreaValueAndSelection(selectionStart) {
    this.elements.textArea.value = this.props.value;
    this.elements.textArea.selectionStart = selectionStart;
    this.elements.textArea.selectionEnd = selectionStart;
  }

  insertKeyValue(keyValue) {
    this.saveTextAreaSelection();
    const { start, end } = this.props.selection;
    const { value } = this.props;
    const { length } = value;

    this.props.value = `${value.slice(0, start)}${keyValue}${value.slice(end, length)}`;
    this.setTextAreaValueAndSelection(start + 1);
  }

  deleteKeyboardValue(keyCode) {
    this.saveTextAreaSelection();
    const { start, end } = this.props.selection;
    const { value } = this.props;
    const { length } = value;
    const isEqualSelections = start === end;
    const selectionOffset = isEqualSelections ? 1 : 0;

    if (keyCode === 'Backspace') {
      const prevChar = value[start - 1] || null;

      if (isEqualSelections && !prevChar) return;

      this.props.value = `${value.slice(0, start - selectionOffset)}${value.slice(end, length)}`;
      this.setTextAreaValueAndSelection(start - selectionOffset);
    }

    if (keyCode === 'Delete') {
      this.props.value = `${value.slice(0, start)}${value.slice(end + selectionOffset, length)} `;
      this.setTextAreaValueAndSelection(start);
    }
  }

  handleKey(e) {
    const key = this.elements.keys.find((el) => el.classList.contains(e.code));
    const arrowsKeys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'];

    this.elements.textArea.focus();

    if (e.code === 'CapsLock') {
      this.toggleCapsLock(e);
    }

    if (arrowsKeys.includes(e.code)) {
      this.saveTextAreaSelection();
      if (e.type === 'keydown') {
        key.classList.add('keyboard__key_active');
      } else {
        key.classList.remove('keyboard__key_active');
      }
    } else {
      e.preventDefault();

      if (!key) return;

      if (e.type === 'keydown') {
        switch (e.code) {
          case 'Space': {
            this.insertKeyValue(' ');
            break;
          }
          case 'Enter': {
            this.insertKeyValue('\n');
            break;
          }
          case 'Tab': {
            this.insertKeyValue('\t');
            break;
          }
          case 'Backspace': {
            this.deleteKeyboardValue(e.code);
            break;
          }
          case 'Delete': {
            this.deleteKeyboardValue(e.code);
            break;
          }
          case 'CapsLock': {
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
          case 'MetaLeft': {
            break;
          }
          case 'ControlRight': {
            break;
          }
          case 'AltRight': {
            break;
          }
          default: {
            this.insertKeyValue(key.lastChild.textContent);
          }
        }
        key.classList.add('keyboard__key_active');
      }

      if (e.type === 'keyup') {
        key.classList.remove('keyboard__key_active');

        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
          this.toggleShift(e.type, e.repeat);
        }
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
    const isShouldBeUpperCase = () => {
      const isCapsLockEnabled = this.props.capsLockEnabled;
      const isShiftPressed = this.props.shiftPressed;
      return (isCapsLockEnabled && !isShiftPressed) || (!isCapsLockEnabled && isShiftPressed);
    };

    Object.entries(this.props.keysData.layout).forEach(([keyName, value]) => {
      const key = this.elements.keys.find((el) => el.classList.contains(keyName));
      const keyValue = value[this.props.lang].value;
      const shiftValue = value[this.props.lang].shift;
      const isUpperCase = isShouldBeUpperCase();

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

  toggleCapsLock(e) {
    const capsLockBtn = this.elements.keys.find((el) => el.classList.contains(e.code));
    const isOn = e.getModifierState('CapsLock');
    capsLockBtn.classList.toggle('keyboard__key_enabled', isOn);
    this.props.capsLockEnabled = isOn;
    this.changeKeysValues();
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
// todo: add cross-platform key gen
// todo: replace switch/case with obj
// todo: fix git usage of crlf under windows
