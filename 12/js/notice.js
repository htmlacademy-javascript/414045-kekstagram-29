import {isEscKey} from './util.js';

const TYPE_SUCCESS = 'success';
const TYPE_ERROR = 'error';

/**
 * Close notice
 *
 * @param {string} type
 */
const closeNotice = (type) => {
  const messageElement = document.querySelector('body').querySelector(`.${type}`);

  if (messageElement) {
    messageElement.remove();
  }

  document.removeEventListener('keydown', onEscKeydown);
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
  document.querySelector('body').append(messageTemplate.content);
  const successButton = document.querySelector(`.${type}__button`);

  switch (type) {
    case TYPE_SUCCESS:
      successButton.addEventListener('click', () => closeSuccessNotice());
      break;
    case TYPE_ERROR:
      successButton.addEventListener('click', () => closeErrorNotice());
      break;
  }

  document.addEventListener('keydown', onEscKeydown);
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
    evt.preventDefault();
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
  if (!evt.target.closest('.success__inner')) {
    closeSuccessNotice();
    closeErrorNotice();
  }
}

export {showSuccessNotice, showErrorNotice};
