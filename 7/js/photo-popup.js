import { isEscKey } from './util.js';

const photoPopupTemplate = document.querySelector('.big-picture');
const commentTemplate = document.querySelector('.social__comment');
const closeElement = photoPopupTemplate.querySelector('#picture-cancel');

/**
 * Prepare comment elements
 *
 * @param comments
 * @returns {DocumentFragment}
 */
const prepareComments = (comments) => {
  const commentsFragment = document.createDocumentFragment();

  comments.forEach((comment) => {
    const commentElement = commentTemplate.cloneNode(true);
    const userAvatar = commentElement.querySelector('.social__picture');

    userAvatar.src = comment.avatar;
    userAvatar.alt = comment.name;
    commentElement.querySelector('.social__text').innerText = comment.message;

    commentsFragment.append(commentElement);
  });

  return commentsFragment;
};

/**
 * Close full photo popup
 */
const closeFullPhoto = () => {
  photoPopupTemplate.classList.add('hidden');
  closeElement.removeEventListener('click', closeFullPhoto);
  document.querySelector('body').classList.remove('modal-open');
};

/**
 * Open full photo popup
 *
 * @param thumb
 */
const openFullPhoto = (thumb) => {
  document.querySelector('body').classList.add('modal-open');
  photoPopupTemplate.classList.remove('hidden');
  photoPopupTemplate.querySelector('.social__comment-count').classList.add('hidden');
  photoPopupTemplate.querySelector('.comments-loader').classList.add('hidden');
  closeElement.addEventListener('click', closeFullPhoto);

  const image = photoPopupTemplate.querySelector('.big-picture__img img');
  const comments = photoPopupTemplate.querySelector('.social__comments');

  photoPopupTemplate.querySelector('.social__caption').innerText = thumb.description;
  photoPopupTemplate.querySelector('.likes-count').innerText = thumb.likes;
  photoPopupTemplate.querySelector('.comments-count').innerText = thumb.comments.length;
  comments.innerHTML = '';
  comments.append(prepareComments(thumb.comments));
  image.alt = thumb.description;
  image.src = thumb.url;
};

/**
 * Escape keydown event handler
 *
 * @param evt
 */
const onPopupEscKeydown = (evt) => {
  if (isEscKey(evt)) {
    evt.preventDefault();
    closeFullPhoto();
  }
};

document.addEventListener('keydown', onPopupEscKeydown);

export { openFullPhoto };
