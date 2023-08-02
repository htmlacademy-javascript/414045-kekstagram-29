import {openFullPhoto} from './photo-popup.js';
import {getPhotoData} from './api.js';
import {getRandomArrayElements, debounce} from './util.js';

const RANDOM_PHOTO_COUNT = 10;

const photoFilter = {
  DEFAULT: 'default',
  RANDOM: 'random',
  DISCUSSED: 'discussed'
};

/**
 * Get sorted photo data by comments count
 *
 * @param photoData
 * @returns Array
 */
const getSortedPhotoDataByCommentsCount = (photoData) => photoData.slice().sort((a, b) => b.comments.length - a.comments.length);

/**
 * Get filtered photo data
 *
 * @param photoData
 * @param filter
 * @returns Array
 */
const getPhotoDataByFilter = (photoData, filter) => {
  switch (filter) {
    case photoFilter.RANDOM:
      return getRandomArrayElements(photoData, RANDOM_PHOTO_COUNT);
    case photoFilter.DISCUSSED:
      return getSortedPhotoDataByCommentsCount(photoData);
    case photoFilter.DEFAULT:
      return photoData;
  }
};

/**
 * Prepare photos by passed filter
 *
 * @param photoData
 * @param filter
 */
const preparePhotosByFilter = (photoData, filter = photoFilter.DEFAULT) => {
  const picturesFragment = document.createDocumentFragment();
  const photoTemplate = document.querySelector('#picture').content.querySelector('.picture');

  photoData = getPhotoDataByFilter(photoData, filter);

  photoData.forEach((item) => {
    const photoElement = photoTemplate.cloneNode(true);
    const image = photoElement.querySelector('.picture__img');
    photoElement.href = item.url;
    image.src = item.url;
    image.alt = item.description;
    photoElement.querySelector('.picture__likes').innerText = item.likes;
    photoElement.querySelector('.picture__comments').innerText = item.comments.length;
    picturesFragment.append(photoElement);
  });

  document.querySelector('.pictures').append(picturesFragment);
};

/**
 * Get filter button click handler
 *
 * @param photoData
 * @param callback
 * @returns {(function(*): void)|*}
 */
const getFilterButtonClickHandler = (photoData, callback) => (evt) => {
  const filterName = evt.target.id.replace('filter-', '');
  const filterButtons = document.querySelector('.img-filters__form').children;

  if (evt.target.classList.contains('img-filters__button--active')) {
    return;
  }

  for (const item of filterButtons) {
    item.classList.remove('img-filters__button--active');
  }

  const button = document.querySelector(`#filter-${filterName}`);
  button.classList.add('img-filters__button--active');
  callback(photoData, filterName);
};

/**
 * Reload photo thumbs on page
 *
 * @param photoData
 * @param filterName
 */
const reloadPhotoThumbs = (photoData, filterName) => {
  document.querySelectorAll('.picture').forEach((photo) => photo.remove());
  preparePhotosByFilter(getPhotoDataByFilter(photoData, filterName));
};

/**
 * Prepare photos DocumentFragment
 *
 * @returns {DocumentFragment}
 */
const preparePhotoThumbs = (photoData) => {
  preparePhotosByFilter(photoData);

  const debounceReloadPhotoThumbs = debounce(reloadPhotoThumbs);
  const onFilterButtonClick = getFilterButtonClickHandler(photoData, debounceReloadPhotoThumbs);

  document.querySelector('.img-filters').classList.remove('img-filters--inactive');
  document.querySelector('#filter-default').addEventListener('click', onFilterButtonClick);
  document.querySelector('#filter-random').addEventListener('click', onFilterButtonClick);
  document.querySelector('#filter-discussed').addEventListener('click', onFilterButtonClick);
  document.querySelector('.pictures').addEventListener('click', (evt) => {
    if (evt.target.closest('.picture')) {
      evt.preventDefault();
    }

    if (evt.target.matches('.picture__img')) {
      const thumb = photoData.find((item) => item.url === evt.target.attributes.src.value);

      openFullPhoto(thumb);
    }
  });
};

/**
 * Render photo thumbs on page
 */
const renderPhotoThumbs = () => {
  getPhotoData(preparePhotoThumbs);
};

export {renderPhotoThumbs};
