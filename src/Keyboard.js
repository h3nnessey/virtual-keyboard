class Keyboard {
  constructor(keysData, container) {
    this.elements = {
      container,
      textArea: null,
      keyboard: null,
      keys: [],
    };
    this.props = {
      keysData,
      lang: localStorage.getItem('lang-key') || 'en',
      value: '',
      capsLock: {
        enabled: false,
        keyUppedCount: 0,
      },
      shiftPressed: false,
      selection: {
        start: 0,
        end: 0,
      },
    };
  }

  init() {
    this.elements.textArea = document.createElement('textarea');
    this.elements.keyboard = document.createElement('div');
    this.initKeyboardKeys(this.props.keysData.layout);

    this.elements.textArea.classList.add('keyboard-value');
    this.elements.keyboard.classList.add('keyboard');

    this.elements.keyboard.append(...this.elements.keys);
    this.elements.container.append(this.elements.textArea, this.elements.keyboard);
    document.body.appendChild(this.elements.container);

    ['keydown', 'keyup'].forEach((eventType) => {
      window.addEventListener(eventType, (e) => this.handleKey(e, eventType));
    });

    window.addEventListener('click', (e) => {
      this.handleClick(e);
    });
  }

  initKeyboardKeys(keysObject) {
    Object.entries(keysObject).forEach(([key, value]) => {
      const button = document.createElement('button');
      const span = document.createElement('span');
      const keyValue = value[this.props.lang].value;
      button.classList.add('keyboard__key', key);
      button.dataset.key = key;
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
    this.elements.textArea.setSelectionRange(selectionStart, selectionStart);
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

  handleArrowClick(arrow) {
    if (arrow === 'ArrowLeft') {
      const prev = this.props.value[this.props.selection.start - 1] || null;
      if (!prev) return;
      this.elements.textArea.selectionStart -= 1;
    }
    if (arrow === 'ArrowRight') {
      this.elements.textArea.selectionStart += 1;
    }
    this.elements.textArea.selectionEnd = this.elements.textArea.selectionStart;
    this.saveTextAreaSelection();
  }

  handleClick(e) {
    const key = e.target.closest('.keyboard__key');

    if (key) {
      const code = key.dataset.key;
      this.elements.textArea.focus();

      switch (code) {
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
          this.deleteKeyboardValue(code);
          break;
        }
        case 'Delete': {
          this.deleteKeyboardValue(code);
          break;
        }
        case 'ShiftLeft':
        case 'ShiftRight': {
          this.toggleShift(e);
          break;
        }
        case 'ArrowLeft':
        case 'ArrowRight': {
          this.handleArrowClick(code);
          break;
        }
        case 'AltLeft':
        case 'AltRight':
        case 'ControlLeft':
        case 'ControlRight':
        case 'CapsLock':
        case 'MetaLeft': {
          break;
        }
        default: {
          this.insertKeyValue(key.lastChild.textContent);
        }
      }
    }
  }

  handleArrowPress(e, arrow) {
    this.elements.textArea.focus();
    this.saveTextAreaSelection();
    if (e.type === 'keydown') {
      arrow.classList.add('keyboard__key_active');
    } else {
      arrow.classList.remove('keyboard__key_active');
    }
  }

  handleKey(e) {
    const key = this.elements.keys.find((el) => el.classList.contains(e.code));
    if (!key) return;

    this.elements.textArea.focus();

    if (this.props.keysData.arrows.includes(e.code)) {
      this.handleArrowPress(e, key);
      return;
    }

    e.preventDefault();

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
        case 'ShiftLeft':
        case 'ShiftRight': {
          this.toggleShift(e);
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
        case 'CapsLock': {
          this.toggleCapsLock(e);
          break;
        }
        case 'MetaLeft':
        case 'ControlRight':
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
        this.toggleShift(e);
      }
      if (e.code === 'CapsLock') {
        this.toggleCapsLock(e);
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
    localStorage.setItem('lang-key', this.props.lang);
    this.changeKeysValues();
  }

  changeKeysValues() {
    const isShouldBeUpperCase = () => {
      const isCapsLockEnabled = this.props.capsLock.enabled;
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
    const capsLockBtn = this.elements.keys.find((el) => el.classList.contains('CapsLock'));

    if (e.type === 'keydown' && !e.repeat) {
      this.props.capsLock.enabled = true;
      capsLockBtn.classList.add('keyboard__key_enabled');
      this.changeKeysValues();
    }

    if (e.type === 'keyup') {
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

  toggleShift(e) {
    if (e.type === 'keydown') {
      this.props.shiftPressed = true;
    }

    if (e.type === 'keyup') {
      const shiftKeys = this.elements.keys.filter(
        (el) => el.classList.contains('ShiftLeft') || el.classList.contains('ShiftRight'),
      );
      shiftKeys.forEach((key) => key.classList.remove('keyboard__key_active'));

      this.props.shiftPressed = false;
    }

    this.changeKeysValues();
  }
}

export default Keyboard;
