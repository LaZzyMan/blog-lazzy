/* eslint-disable prefer-rest-params */
export default function group(array, subGroupLength) {
  let index = 0;
  const newArray = [];

  while (index < array.length) {
    newArray.push(array.slice(index, index += subGroupLength));
  }

  return newArray;
}

export function throttle(fn, ms) {
  let isThrottled = false;
  let savedThis;
  let savedArg;
  function wrapper() {
    if (!isThrottled) {
      fn.apply(this, arguments);
      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
        if (!savedArg) {
          fn.apply(savedThis, savedArg);
          savedArg = null;
          savedThis = null;
        }
      }, ms);
    }
    savedArg = arguments;
    savedThis = this;
  }
  return wrapper;
}
