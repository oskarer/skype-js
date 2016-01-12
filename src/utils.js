export function getCurrentTime() {
  return (new Date().getTime()) / 1000;
}
export function getTimezone() {
  const pad = function (n, c) {
    if ((n = n + "").length < c) {
      return new Array(++c - n.length).join('0') + n;
    } else {
      return n;
    }
  };
  let sign;
  let timezone = new Date().getTimezoneOffset() * (-1);
  if (timezone >= 0) {
    sign = '+';
  } else {
    sign = '-';
  }
  timezone = Math.abs(timezone);
  let minutes = timezone % 60;
  let hours = (timezone - minutes) / 60;
  minutes = pad(minutes, 2);
  hours = pad(hours, 2);
  return sign + hours + '|' + minutes;
}
