import {isEscKey} from './util.js';

const TYPE_SUCCESS = 'success';
const TYPE_ERROR = 'error';

const body = document.querySelector('body');

/**
 * Close notice
 *
 * @param {string} type
 */
const closeNotice = (type) => {
  const messageElement = body.querySelector(`.${type}`);

  if (messageElement) {
    messageElement.remove();
  }

  document.removeEventListener('keydown', onEscKeydown, true);
  document.removeEventListener('click', onOutsideNoticeClick);
};

/**
 * Close success notice
 */
const closeSuccessNotice = () => {
  closeNotice(TYPE_SUCCESS);
};

/**
 * Close error notice
 */
const closeErrorNotice = () => {
  closeNotice(TYPE_ERROR);
};

/**
 * Show notice
 *
 * @param {string} type
 */
const showNotice = (type) => {
  const messageTemplate = document.querySelector(`#${type}`).cloneNode(true);
  body.append(messageTemplate.content);
  const successButton = document.querySelector(`.${type}__button`);

  switch (type) {
    case TYPE_SUCCESS:
      successButton.addEventListener('click', () => closeSuccessNotice());
      break;
    case TYPE_ERROR:
      successButton.addEventListener('click', () => closeErrorNotice());
      break;
  }

  document.addEventListener('keydown', onEscKeydown, true);
  document.addEventListener('click', onOutsideNoticeClick);
};

/**
 * Show success notice
 */
const showSuccessNotice = () => {
  showNotice(TYPE_SUCCESS);
};

/**
 * Show error notice
 */
const showErrorNotice = () => {
  showNotice(TYPE_ERROR);
};

/**
 * On escape keydown handler
 *
 * @param evt
 */
function onEscKeydown(evt) {
  if (isEscKey(evt)) {
    evt.stopPropagation();
    closeSuccessNotice();
    closeErrorNotice();
  }
}

/**
 * On click outside notice handler
 *
 * @param evt
 */
function onOutsideNoticeClick(evt) {
  if (!evt.target.closest('.success__inner') && document.querySelector('body .success')) {
    closeSuccessNotice();
  }

  if (!evt.target.closest('.error__inner') && document.querySelector('body .error')) {
    closeErrorNotice();
  }
}

export {showSuccessNotice, showErrorNotice};
