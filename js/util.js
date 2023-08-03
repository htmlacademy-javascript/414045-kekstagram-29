const DEFAULT_DEBOUNCE_DELAY = 500;

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
 * Checks if a key is pressed escape
 *
 * @param evt
 * @returns {boolean}
 */
const isEscKey = (evt) => evt.key === 'Escape';

/**
 * Get debounce function
 *
 * @param callback
 * @param timeoutDelay
 * @returns {(function(...[*]): void)|*}
 */
const getDebounceFunction = (callback, timeoutDelay = DEFAULT_DEBOUNCE_DELAY) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

export {isEscKey, getRandomArrayElements, getDebounceFunction};
