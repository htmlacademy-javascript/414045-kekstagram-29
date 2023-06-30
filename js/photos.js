import { generatePhotos } from './mock.js';

/**
 * Prepare photos DocumentFragment
 *
 * @returns {DocumentFragment}
 */
const preparePhotos = () => {
  const picturesFragment = document.createDocumentFragment();
  const photoData = generatePhotos();
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

  return picturesFragment;
};

/**
 * Insert user photos to page
 */
const insertUserPhotosToPage = () => {
  const photos = preparePhotos();
  document.querySelector('.pictures').append(photos);
};

export { insertUserPhotosToPage };
