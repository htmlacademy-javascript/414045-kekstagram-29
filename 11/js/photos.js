import {openFullPhoto} from './photo-popup.js';
import {getPhotoData} from './api.js';

/**
 * Render photos DocumentFragment
 *
 * @returns {DocumentFragment}
 */
const renderPhotoThumbs = (photoData) => {
  const picturesFragment = document.createDocumentFragment();
  const photoTemplate = document.querySelector('#picture').content.querySelector('.picture');

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
 * Init module
 */
const init = () => {
  getPhotoData(renderPhotoThumbs);
};

export {init};
