import {isEscKey} from './util.js';

const MAX_COMMENT_LENGTH = 140;
const MAX_HASHTAGS_COUNT = 5;
const COMMENT_LENGTH_ERROR_MESSAGE = 'Комментарий должен быть не длиннее 140 символов';
const HASHTAGS_COUNT_ERROR_MESSAGE = 'Можно указать не более 5 хештегов';
const HASHTAGS_COUNT_ERROR_DUPLICATE = 'Не должно быть повторяющихся хештегов';
const HASHTAGS_COUNT_ERROR_TEMPLATE = 'Хештег должен начинаться с символа #, содержать только буквы и цифры, и быть не длиннее 20 символов';

const uploadField = document.querySelector('.img-upload__input');
const uploadForm = document.querySelector('.img-upload__form');
const uploadFormOverlay = document.querySelector('.img-upload__overlay');
const uploadFormCloseElement = document.querySelector('#upload-cancel');

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper'
});

/**
 * Check if the array has duplicates
 *
 * @param array
 * @returns {boolean}
 */
const hasDuplicate = (array) => array.filter((item, index) => array.indexOf(item) !== index).length > 0;

/**
 * Validate hashtags by regular expression template
 *
 * @param value
 * @returns {boolean|boolean}
 */
const validateHashtagsTemplate = (value) => {
  const hashtags = value.trim().split(' ');
  const exp = /^#([a-zа-яё0-9]){1,20}$/i;

  return value.trim().length ? hashtags.every((hashtag) => hashtag.match(exp)) : true;
};

/**
 * Validation of hashtags for duplicates
 *
 * @param value
 * @returns {boolean}
 */
const validateHashtagsDuplicate = (value) => !hasDuplicate(value.trim().toLowerCase().split(' '));

/**
 * Validate hashtags count
 *
 * @param value
 * @returns {boolean}
 */
const validateHashtagsCount = (value) => value.trim().split(' ').length <= MAX_HASHTAGS_COUNT;

/**
 * Validate comment length
 *
 * @param value
 * @returns {boolean}
 */
const validateCommentLength = (value) => value.length <= MAX_COMMENT_LENGTH;

/**
 * Submit button click handler
 *
 * @param evt
 */
const onSubmitButtonClick = (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (isValid) {
    uploadForm.submit();
  }
};

/**
 * Close upload photo form
 */
const closeUploadForm = () => {
  uploadForm.reset();
  pristine.reset();
  uploadFormOverlay.classList.add('hidden');
  document.querySelector('body').classList.remove('modal-open');
  uploadFormCloseElement.removeEventListener('click', onCloseElementClick);
  document.removeEventListener('keydown', onEscKeydown);
  uploadForm.removeEventListener('submit', onSubmitButtonClick);
};

/**
 * Open upload photo form
 */
const openUploadForm = () => {
  uploadFormOverlay.classList.remove('hidden');
  document.querySelector('body').classList.add('modal-open');
  uploadFormCloseElement.addEventListener('click', onCloseElementClick);
  document.addEventListener('keydown', onEscKeydown);
  uploadForm.addEventListener('submit', onSubmitButtonClick);
};

/**
 * File input change handler
 */
const onFileInputChange = () => {
  openUploadForm();
};

/**
 * Check if text inputs are in focus
 *
 * @returns {boolean}
 */
const isTextFieldsFocus = () => {
  const hashtagsInput = uploadForm.querySelector('.text__hashtags');
  const commentInput = uploadForm.querySelector('.text__description');

  return document.activeElement === hashtagsInput || document.activeElement === commentInput;
};

uploadField.addEventListener('change', onFileInputChange);
pristine.addValidator(uploadForm.querySelector('.text__description'), validateCommentLength, COMMENT_LENGTH_ERROR_MESSAGE);
pristine.addValidator(uploadForm.querySelector('.text__hashtags'), validateHashtagsCount, HASHTAGS_COUNT_ERROR_MESSAGE);
pristine.addValidator(uploadForm.querySelector('.text__hashtags'), validateHashtagsDuplicate, HASHTAGS_COUNT_ERROR_DUPLICATE);
pristine.addValidator(uploadForm.querySelector('.text__hashtags'), validateHashtagsTemplate, HASHTAGS_COUNT_ERROR_TEMPLATE);

/**
 * Esc click handler
 *
 * @param evt
 */
function onEscKeydown (evt) {
  if (isEscKey(evt) && !isTextFieldsFocus()) {
    evt.preventDefault();
    closeUploadForm();
  }
}

/**
 * Close element click handler
 */
function onCloseElementClick () {
  closeUploadForm();
}
