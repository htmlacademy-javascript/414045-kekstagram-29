import {isEscKey} from './util.js';
import {sendData} from './api.js';
import {showErrorNotice, showSuccessNotice} from './notice.js';

const MAX_COMMENT_LENGTH = 140;
const MAX_HASHTAGS_COUNT = 5;
const COMMENT_LENGTH_ERROR_MESSAGE = 'Комментарий должен быть не длиннее 140 символов';
const HASHTAGS_COUNT_ERROR_MESSAGE = 'Можно указать не более 5 хештегов';
const HASHTAGS_COUNT_ERROR_DUPLICATE = 'Не должно быть повторяющихся хештегов';
const HASHTAGS_COUNT_ERROR_TEMPLATE = 'Хештег должен начинаться с символа #, содержать только буквы и цифры, и быть не длиннее 20 символов';
const SCALE_STEP = 25;
const SCALE_MAX = 100;
const SCALE_MIN = 25;

const EFFECT_SETTINGS = {
  chrome: {
    styleFilterName: 'grayscale',
    options: {
      min: 0,
      max: 1,
      step: 0.1,
      units: ''
    }
  },
  sepia: {
    styleFilterName: 'sepia',
    options: {
      min: 0,
      max: 1,
      step: 0.1,
      units: ''
    },
  },
  marvin: {
    styleFilterName: 'invert',
    options: {
      min: 0,
      max: 100,
      step: 1,
      units: '%'
    },
  },
  phobos: {
    styleFilterName: 'blur',
    options: {
      min: 0,
      max: 3,
      step: 0.1,
      units: 'px'
    },
  },
  heat: {
    styleFilterName: 'brightness',
    options: {
      min: 1,
      max: 3,
      step: 0.1,
      units: ''
    },
  },
};

const uploadForm = document.querySelector('.img-upload__form');
const uploadFormOverlay = document.querySelector('.img-upload__overlay');
const uploadFormCloseElement = document.querySelector('#upload-cancel');
const image = uploadForm.querySelector('.img-upload__preview');
const photoScaleInput = uploadForm.querySelector('.scale__control--value');
const slider = uploadForm.querySelector('.effect-level__slider');
const filter = uploadForm.querySelector('.img-upload__effects');

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper'
});

/**
 * Show slider
 */
const showSlider = () => uploadForm.querySelector('.img-upload__effect-level').classList.remove('hidden');

/**
 * Hide slider
 */
const hideSlider = () => uploadForm.querySelector('.img-upload__effect-level').classList.add('hidden');

/**
 * Destroy NoUiSlider
 */
const destroyNoUiSlider = () => {
  if (slider.noUiSlider) {
    slider.noUiSlider.destroy();
  }
};

/**
 * Reset filter effects from image
 */
const resetFilterEffects = () => {
  image.style.filter = null;
  image.style.scale = null;
};

/**
 * Reset effect and hide slider
 */
const resetEffect = () => {
  hideSlider();
  destroyNoUiSlider();
  resetFilterEffects();
};

/**
 * Photo scale up button click handler
 */
const onPhotoScaleUpButtonClick = () => {
  const currentValue = Number(photoScaleInput.value.slice(0, -1));

  if (currentValue <= SCALE_MAX - SCALE_STEP) {
    const newValue = currentValue + SCALE_STEP;
    photoScaleInput.value = `${newValue}%`;
    image.style.scale = newValue / 100;
  }
};

/**
 * Photo scale down button click handler
 */
const onPhotoScaleDownButtonClick = () => {
  const currentValue = Number(photoScaleInput.value.slice(0, -1));

  if (currentValue >= SCALE_MIN + SCALE_STEP) {
    const newValue = currentValue - SCALE_STEP;
    photoScaleInput.value = `${newValue}%`;
    image.style.scale = newValue / 100;
  }
};

/**
 * Get style filter with value
 *
 * @param {object} effect
 * @param {number|float} value
 * @returns {string}
 */
const getEffectStyleFilter = (effect, value = null) => value
  ? `${effect.styleFilterName}(${value}${effect.options.units})`
  : `${effect.styleFilterName}(${effect.options.max + effect.options.units}})`;

/**
 * Apply effect filter on image
 *
 * @param {object} currentEffect
 */
const applyEffect = (currentEffect) => {
  const effect = EFFECT_SETTINGS[currentEffect];

  destroyNoUiSlider();

  noUiSlider.create(slider, {
    range: {
      min: effect.options.min,
      max: effect.options.max
    },
    start: effect.options.max,
    step: effect.options.step,
    connect: 'lower'
  });

  image.style.filter = getEffectStyleFilter(effect);
  slider.noUiSlider.on('update', () => {
    const value = slider.noUiSlider.get();

    image.style.filter = getEffectStyleFilter(effect, value);
    uploadForm.querySelector('.effect-level__value').value = value;
  });
};

/**
 * Filter change handler
 */
const onFilterChange = () => {
  const currentEffect = filter.querySelector('input:checked').value;

  if (currentEffect === 'none') {
    resetEffect();

    return;
  }

  showSlider();
  applyEffect(currentEffect);
};

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
 * Close upload photo form
 */
const closeUploadForm = () => {
  uploadForm.reset();
  pristine.reset();
  resetEffect();
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

/**
 * On success upload handler
 */
const onSuccessUpload = () => {
  closeUploadForm();
  showSuccessNotice();
};

/**
 * On error upload handler
 */
const onErrorUpload = () => {
  showErrorNotice();
};

/**
 * Init module
 */
const init = () => {
  const hashtagsInput = uploadForm.querySelector('.text__hashtags');
  const commentInput = uploadForm.querySelector('.text__description');
  const uploadField = document.querySelector('.img-upload__input');
  const photoScaleUpButton = uploadForm.querySelector('.scale__control--bigger');
  const photoScaleDownButton = uploadForm.querySelector('.scale__control--smaller');

  hideSlider();
  uploadField.addEventListener('change', onFileInputChange);
  photoScaleUpButton.addEventListener('click', onPhotoScaleUpButtonClick);
  photoScaleDownButton.addEventListener('click', onPhotoScaleDownButtonClick);
  filter.addEventListener('change', onFilterChange);
  pristine.addValidator(commentInput, validateCommentLength, COMMENT_LENGTH_ERROR_MESSAGE);
  pristine.addValidator(hashtagsInput, validateHashtagsCount, HASHTAGS_COUNT_ERROR_MESSAGE);
  pristine.addValidator(hashtagsInput, validateHashtagsDuplicate, HASHTAGS_COUNT_ERROR_DUPLICATE);
  pristine.addValidator(hashtagsInput, validateHashtagsTemplate, HASHTAGS_COUNT_ERROR_TEMPLATE);
};

/**
 * Submit button click handler
 *
 * @param evt
 */
function onSubmitButtonClick (evt) {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (isValid) {
    const formData = new FormData(evt.target);
    sendData(formData, onSuccessUpload, onErrorUpload);
  }
}

/**
 * Esc click handler
 *
 * @param evt
 */
function onEscKeydown(evt) {
  if (isEscKey(evt) && !isTextFieldsFocus()) {
    evt.preventDefault();
    closeUploadForm();
  }
}

/**
 * Close element click handler
 */
function onCloseElementClick() {
  closeUploadForm();
}

export {init};
