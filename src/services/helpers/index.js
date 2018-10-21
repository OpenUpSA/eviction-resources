function createArrayOfNumbers(props) {
  const {
    start = 0,
    times = 10,
    increment = 1,
    prefix = '',
    affix = '',
    reverse,
  } = props;

  const result = [];
  let value = start;

  for (let i = 0; i < times; i += 1) {
    result.push(prefix + value + affix);

    if (reverse) {
      value -= increment;
    } else {
      value += increment;
    }

  }

  return result;
}


function decodeUrlParams(url) {
  const splitUrl = url.split('+').join(' ');

  const params = {};
  let tokens = null;
  const re = /[?&]?([^=]+)=([^&]*)/g;

  while (tokens = re.exec(splitUrl)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }

  return params;
}


export { createArrayOfNumbers, decodeUrlParams };
