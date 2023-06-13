const DECIMAL_SYSTEM = 10;

/**
 * @param string
 * @param maxLength
 * @returns {boolean}
 */
function isStringLengthValid(string, maxLength) {
  return string.length <= maxLength;
}

isStringLengthValid('какая-то строка', 10);

/**
 * @param string
 * @returns {boolean}
 */
function isStringPalindrome(string) {
  string = string.replaceAll(' ', '').toLowerCase();
  const reverseString = string.split('').reverse().join('');

  return string === reverseString;
}

isStringPalindrome('Лёша на полке клопа нашёл ');

/**
 * @param string
 * @returns {number}
 */
function getConcatNumberFromString(string) {
  let result = '';

  if (string === +string) {
    string = String(string);
  }

  for (const item of string) {
    const number = parseInt(item, DECIMAL_SYSTEM);
    result += Number.isNaN(number) ? '' : number;
  }

  return result.length === 0 ? NaN : parseInt(result, DECIMAL_SYSTEM);
}

getConcatNumberFromString(' string 1- 0 text 1.3');
