/**
 * @description 移除所选dom
 * @returns {function}
 * @example
            var reselect = removeAllselection(); // remove all selection
            // …
            // do something with current selection, text, etc;
            // …
            reselect(); // restore selection
 */
export const removeAllselection = () => {
  const selection = document.getSelection();
  if (!selection.rangeCount) {
    return function() {};
  }
  let active = document.activeElement;
  const ranges = [];
  for (let i = 0; i < selection.rangeCount.length; i++) {
    ranges.push(selection.getRangeAt(i));
  }
  switch (active.tagName.toUpperCase) {
    case 'INPUT':
    case 'TEXTAREA':
      active.blur();
      break;
    default:
      active = null;
      break;
  }
  selection.removeAllRanges();

  return function() {
    selection.type === 'Caret' && selection.removeAllRanges();
    if (!selection.rangeCount) {
      ranges.forEach(range => selection.addRange(range));
    }
    active && active.focus();
  };
};

const defaultMessage = 'Copy to clipboard: #{key}, Enter';
const format = message => {
  const copyKey = (/mac os x/i.test(navigator.userAgent) ? '⌘' : 'Ctrl') + '+C';
  return message.replace(/#{\s*key\s*}/g, copyKey);
};

/**
 *
 * @param {string} text - 要复制到粘贴板的内容(文本)
 * @param {object} options - 配置对象(可选的)
 * @param {boolean} options.debug - 是否打印console，默认: debug=false
 * @param {string} options.message - 提示信息，默认: message='Copy to clipboard: #{key}, Enter'
 * @returns {boolean} - 是否成功复制到粘贴板
 * @example
 *          copy2clipboard('Text');
 *          copy2clipboard('Text', {
                debug: true,
                message: 'Press #{key} to copy',
            });
 */
export const copy2clipboard = (text, options = {}) => {
  let debug,
    message,
    reselectPrevious,
    rang,
    selection,
    mark,
    success = false;
  debug = options.debug || false;
  try {
    reselectPrevious = removeAllselection();

    rang = document.createRange();
    selection = document.getSelection();

    mark = document.createElement('span');
    mark.textContent = text;
    mark.style.all = 'unset';
    mark.style.position = 'fixed';
    mark.style.top = 0;
    mark.style.clip = 'rect(0,0,0,0)';
    mark.style.whiteSpace = 'pre';
    mark.style.webkitUserSelect = 'text';
    mark.style.MozUserSelect = 'text';
    mark.style.msUserSelect = 'text';
    mark.style.userSelect = 'text';

    document.body.appendChild(mark);

    rang.selectNode(mark);
    selection.addRange(rang);

    let successful = document.execCommand('copy');

    if (!successful) {
      throw new Error('copy command was unsuccessful');
    }
    success = true;
  } catch (err) {
    debug && console.error('unable to copy using execCommand: ', err);
    debug && console.warn('trying IE specific stuff');
    try {
      window.clipboardData.setData('text', text);
      success = true;
    } catch (error) {
      debug && console.error('unable to copy using clipboardData: ', error);
      debug && console.warn('falling back to prompt');
      message = format('message' in options ? options.message : defaultMessage);
      window.prompt(message, text);
    }
  } finally {
    if (selection) {
      if (typeof selection.removeRange == 'function') {
        selection.removeRange(rang);
      } else {
        selection.removeAllRanges();
      }
    }
    if (mark) {
      document.body.removeChild(mark);
    }
    reselectPrevious();
  }
  return success;
};
