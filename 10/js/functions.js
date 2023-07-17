const DECIMAL_SYSTEM = 10;
const MINUTES_IN_HOUR = 60;

/**
 * @param string
 * @param maxLength
 * @returns {boolean}
 */
function isStringLengthValid(string, maxLength) {
  return string.length <= maxLength;
}

/**
 * @param string
 * @returns {boolean}
 */
function isStringPalindrome(string) {
  string = string.replaceAll(' ', '').toLowerCase();
  const reverseString = string.split('').reverse().join('');

  return string === reverseString;
}

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

isStringLengthValid('какая-то строка', 10);
isStringPalindrome('Лёша на полке клопа нашёл ');
getConcatNumberFromString(' string 1- 0 text 1.3');

/**
 * @param startWork
 * @param endWork
 * @param startMeeting
 * @param meetingTimeMinutes
 * @returns {boolean}
 */
function checkMeetingTime(startWork, endWork, startMeeting, meetingTimeMinutes) {
  const getMinutes = (timeString) => {
    const time = timeString.split(':');

    return Number(time[0]) * MINUTES_IN_HOUR + Number(time[1]);
  };

  const startWorkMinutes = getMinutes(startWork);
  const endWorkMinutes = getMinutes(endWork);
  const startMeetingMinutes = getMinutes(startMeeting);

  return startMeetingMinutes >= startWorkMinutes && startMeetingMinutes + meetingTimeMinutes <= endWorkMinutes;
}

checkMeetingTime('05:30', '18:00', '05:30', 50);
