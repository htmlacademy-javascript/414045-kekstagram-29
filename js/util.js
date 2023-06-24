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

export {getRandomNumber, getRandomArrayElement, createRandomIdGenerator};
