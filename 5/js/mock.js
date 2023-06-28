import {getRandomNumber, getRandomArrayElement, createRandomIdGenerator} from './util.js';

const COUNT_PHOTOS = 25;
const USER_NAMES = [
  'Антон',
  'Игорь',
  'Олег',
  'Станислав',
  'Владимир',
  'Александр'
];
const PHOTO_DESCRIPTIONS = [
  'Мы в горах',
  'Отдыхаем на море',
  'В походе',
  'Яркий зимний день'
];
const PHOTO_COMMENTS = [
  'Классная фотка',
  'Ух, сейчас бы на море',
  'Горизонт завален...',
  'Снимок переэкспонирован!'
];

/**
 * Generate Photo ID
 *
 * @type {(function(): (number|null))|*}
 */
const generatePhotoId = createRandomIdGenerator(1, 25);

/**
 * Generate Comment ID
 *
 * @type {(function(): (number|null))|*}
 */
const generateCommentId = createRandomIdGenerator(1, 1000);

/**
 * Generate photo description
 *
 * @returns {*}
 */
const generateDescription = () => getRandomArrayElement(PHOTO_DESCRIPTIONS);

/**
 * Generate photo url by ID
 *
 * @param {number} photoId
 * @returns {`photos/${string}.jpg`}
 */
const generateUrl = (photoId) => `photos/${photoId}.jpg`;

/**
 * Generate random count likes
 *
 * @returns {number}
 */
const generateLikes = () => getRandomNumber(15, 200);

/**
 * Generate random avatar url
 *
 * @returns {`img/avatar-${number}.svg`}
 */
const generateAvatarUrl = () => `img/avatar-${getRandomNumber(1, 200)}.svg`;

/**
 * Generate Comment object
 *
 * @returns {{name: *, id: (number|null), avatar: `img/avatar-${number}.svg`, message: *}}
 */
const generateComment = () => ({
  id: generateCommentId(),
  avatar: generateAvatarUrl(),
  message: getRandomArrayElement(PHOTO_COMMENTS),
  name: getRandomArrayElement(USER_NAMES)
});

/**
 * Generate Comments collection
 *
 * @returns {{name: *, id: number|null, avatar: `img/avatar-${number}.svg`, message: *}[]}
 */
const generateComments = () => Array.from({length: getRandomNumber(0, 30)}, generateComment);

/**
 * Generate Photo object
 *
 * @returns {{comments: {name: *, id: (number|null), avatar: `img/avatar-${number}.svg`, message: *}[], description: *, id: (number|null), url: `photos/${string}.jpg`, likes: number}}
 */
const generatePhoto = () => {
  const id = generatePhotoId();

  return {
    id: id,
    url: generateUrl(id),
    description: generateDescription(),
    likes: generateLikes(),
    comments: generateComments()
  };
};

/**
 * Generate Photos Collection
 *
 * @returns {{comments: {name: *, id: (number|null), avatar: `img/avatar-${number}.svg`, message: *}[], description: *, id: number|null, url: `photos/${string}.jpg`, likes: number}[]}
 */
const generatePhotos = () => Array.from({length: COUNT_PHOTOS}, generatePhoto);

export {generatePhotos};
