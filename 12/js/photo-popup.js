import { isEscKey } from './util.js';

const DEFAULT_SHOW_COMMENTS_COUNT = 5;

const photoPopupTemplate = document.querySelector('.big-picture');
const commentTemplate = document.querySelector('.social__comment');
const closeElement = photoPopupTemplate.querySelector('#picture-cancel');
const comments = photoPopupTemplate.querySelector('.social__comments');

let thumbComments;
let showCountComments;

/**
 * Prepare comment elements
 *
 * @param startComment
 * @param count
 * @returns {DocumentFragment}
 */
const prepareComments = (startComment = 0, count = DEFAULT_SHOW_COMMENTS_COUNT) => {
  const commentsFragment = document.createDocumentFragment();

  for (let i = startComment; i < thumbComments.length && i < startComment + count; i++) {
    const comment = thumbComments[i];
    const commentElement = commentTemplate.cloneNode(true);
    const userAvatar = commentElement.querySelector('.social__picture');

    userAvatar.src = comment.avatar;
    userAvatar.alt = comment.name;
    commentElement.querySelector('.social__text').innerText = comment.message;
    commentsFragment.append(commentElement);
  }

  return commentsFragment;
};

/**
 * Close full photo popup
 */
const closeFullPhoto = () => {
  photoPopupTemplate.classList.add('hidden');
  closeElement.removeEventListener('click', onCloseElementClick);
  document.querySelector('body').classList.remove('modal-open');
  document.removeEventListener('keydown', onPopupEscKeydown);
  photoPopupTemplate.querySelector('.comments-loader').removeEventListener('click', onMoreCommentsButtonClick);
};

/**
 * Update current show comments counter
 *
 * @param showCommentsCount
 */
const updateShowCommentCounter = (showCommentsCount) => {
  document.querySelector('.social__comment-count').firstChild.textContent = `${showCommentsCount} из `;
};

/**
 * Switches upload comments button according to the condition
 *
 * @param currentShowCommentsCount
 * @param allCommentsCount
 */
const updateUploadCommentsButton = (currentShowCommentsCount, allCommentsCount) => {
  if (currentShowCommentsCount === allCommentsCount) {
    document.querySelector('.comments-loader').classList.add('hidden');
  }
};

/**
 * Open full photo popup
 *
 * @param thumb
 */
const openFullPhoto = (thumb) => {
  document.querySelector('body').classList.add('modal-open');
  photoPopupTemplate.classList.remove('hidden');
  closeElement.addEventListener('click', onCloseElementClick);
  document.addEventListener('keydown', onPopupEscKeydown);

  thumbComments = thumb.comments;

  const image = photoPopupTemplate.querySelector('.big-picture__img img');
  const uploadMoreCommentButton = photoPopupTemplate.querySelector('.comments-loader');
  const preparedComments = prepareComments();

  showCountComments = preparedComments.childElementCount;

  photoPopupTemplate.querySelector('.social__caption').innerText = thumb.description;
  photoPopupTemplate.querySelector('.likes-count').innerText = thumb.likes;
  photoPopupTemplate.querySelector('.comments-count').innerText = thumb.comments.length;
  comments.innerHTML = '';
  comments.append(preparedComments);
  image.alt = thumb.description;
  image.src = thumb.url;

  updateShowCommentCounter(showCountComments);
  updateUploadCommentsButton(showCountComments, thumbComments.length);

  uploadMoreCommentButton.addEventListener('click', onMoreCommentsButtonClick);
};

/**
 * Escape keydown event handler
 *
 * @param evt
 */
function onPopupEscKeydown (evt) {
  if (isEscKey(evt)) {
    evt.preventDefault();
    closeFullPhoto();
  }
}

/**
 * Close element click handler
 */
function onCloseElementClick() {
  closeFullPhoto();
}

/**
 * More comments button click handler
 */
function onMoreCommentsButtonClick() {
  const addComments = prepareComments(showCountComments);
  showCountComments += addComments.childElementCount;

  updateShowCommentCounter(showCountComments);
  updateUploadCommentsButton(showCountComments, thumbComments.length);

  comments.append(addComments);
}

export { openFullPhoto };
