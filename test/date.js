/* eslint-disable no-unused-vars */
const dateFormat = (date, mask = 'yyyy-MM-dd HH:mm:ss') => {
  const d = typeof date !== 'object' ? new Date(date) : date;
  const zeroize = (value, length = 2) => {
    value = String(value);
    let zeros = '';
    for (let i = 0, len = length - value.length; i < len; i++) {
      zeros += '0';
    }
    return zeros + value;
  };
  return mask.replace(
    /"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g,
    function($0) {
      switch ($0) {
        case 'd':
          return d.getDate();
        case 'dd':
          return zeroize(d.getDate());
        case 'ddd':
          return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
        case 'dddd':
          return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
            d.getDay()
          ];
        case 'M':
          return d.getMonth() + 1;
        case 'MM':
          return zeroize(d.getMonth() + 1);
        case 'MMM':
          return [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ][d.getMonth()];
        case 'MMMM':
          return [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ][d.getMonth()];
        case 'yy':
          return String(d.getFullYear()).substr(2);
        case 'yyyy':
          return d.getFullYear();
        case 'h':
          return d.getHours() % 12 || 12;
        case 'hh':
          return zeroize(d.getHours() % 12 || 12);
        case 'H':
          return d.getHours();
        case 'HH':
          return zeroize(d.getHours());
        case 'm':
          return d.getMinutes();
        case 'mm':
          return zeroize(d.getMinutes());
        case 's':
          return d.getSeconds();
        case 'ss':
          return zeroize(d.getSeconds());
        case 'l':
          return zeroize(d.getMilliseconds(), 3);
        case 'L':
          var m = d.getMilliseconds();
          if (m > 99) m = Math.round(m / 10);
          return zeroize(m);
        case 'tt':
          return d.getHours() < 12 ? 'am' : 'pm';
        case 'TT':
          return d.getHours() < 12 ? 'AM' : 'PM';
        case 'Z':
          return d.toUTCString().match(/[A-Z]+$/);
        // Return quoted strings with the surrounding quotes removed
        default:
          return $0.substr(1, $0.length - 2);
      }
    }
  );
};

const UTCTimestamp = (date = new Date(), timezone = new Date().getTimezoneOffset()) => {
  return new Date(date).getTime() + timezone * 60 * 1000;
};

const UTC2Target = (
  date,
  timezone = new Date().getTimezoneOffset(),
  mask = 'yyyy-MM-dd HH:mm:ss'
) => {
  const utcTimestamp = new Date(date).getTime();
  date = dateFormat(new Date(utcTimestamp - timezone * 60 * 1000), mask);
  return date;
};

const Target2UTC = (
  date,
  timezone = new Date().getTimezoneOffset(),
  mask = 'yyyy-MM-dd HH:mm:ss'
) => {
  let targetTimestamp = new Date(date).getTime();
  date = dateFormat(new Date(targetTimestamp + timezone * 60 * 1000), mask);
  return date;
};

const bj = '2019-01-01 08:00:00';
const ist = '2019-01-01 05:30:00';
const utc = '2019-01-01 00:00:00';
