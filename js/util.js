const DEFAULT_DEBOUNCE_DELAY = 500;

/**
 * Get random number in range
 *
 * @param {number} a - First number from range
 * @param {number} b - Last number from range
 * @returns {number}
 */
const getRandomNumber = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
};

/**
 * Get random element from array
 *
 * @param {array} array
 * @returns {*}
 */
const getRandomArrayElement = (array) => array[getRandomNumber(0, array.length - 1)];

/**
 * Get shuffled array
 *
 * @param array
 * @returns array
 */
const getShuffledArray = (array) => {
  const newArray = array.slice();

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
};

/**
 * Get an array with unique random elements from the passed array
 *
 * @param array
 * @param elementsCount
 * @returns array
 */
const getRandomArrayElements = (array, elementsCount) => {
  const uniqueArrayElements = Array.from(new Set(array));

  if (array.length === 0 || elementsCount === 0) {
    return [];
  }

  if (uniqueArrayElements.length < elementsCount) {
    elementsCount = uniqueArrayElements.length;
  }

  return getShuffledArray(uniqueArrayElements).slice(0, elementsCount);
};

/**
 * Create function ID generator
 *
 * @param {number} minId - Start ID
 * @param maxId - End ID
 * @returns {(function(): (null|number))|*}
 */
const createRandomIdGenerator = (minId, maxId) => {
  const createdIds = [];

  return function () {
    let currentIdValue = getRandomNumber(minId, maxId);

    if (createdIds.length >= (maxId - minId + 1)) {
      return null;
    }

    while (createdIds.includes(currentIdValue)) {
      currentIdValue = getRandomNumber(minId, maxId);
    }

    createdIds.push(currentIdValue);

    return currentIdValue;
  };
};

/**
 * Checks if a key is pressed escape
 *
 * @param evt
 * @returns {boolean}
 */
const isEscKey = (evt) => evt.key === 'Escape';

/**
 * Debounce function
 *
 * @param callback
 * @param timeoutDelay
 * @returns {(function(...[*]): void)|*}
 */
const debounce = (callback, timeoutDelay = DEFAULT_DEBOUNCE_DELAY) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

export {getRandomNumber, getRandomArrayElement, createRandomIdGenerator, isEscKey, getRandomArrayElements, debounce};
