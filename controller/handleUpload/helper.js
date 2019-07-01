/* eslint-disable no-restricted-properties */
/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
/* eslint-disable no-bitwise */
const stringFromCharCode = String.fromCharCode;

// Taken from https://mths.be/punycode
function ucs2decode(string) {
  const output = [];
  let counter = 0;
  const { length } = string;
  let value;
  let extra;
  while (counter < length) {
    value = string.charCodeAt(counter++);
    if (value >= 0xd800 && value <= 0xdbff && counter < length) {
      // high surrogate, and there is a next character
      extra = string.charCodeAt(counter++);
      if ((extra & 0xfc00) == 0xdc00) {
        // low surrogate
        output.push(((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000);
      } else {
        // unmatched surrogate; only append this code unit, in case the next
        // code unit is the high surrogate of a surrogate pair
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
}

function checkScalarValue(codePoint) {
  if (codePoint >= 0xd800 && codePoint <= 0xdfff) {
    throw Error(`Lone surrogate U+${codePoint.toString(16).toUpperCase()} is not a scalar value`);
  }
}
/*--------------------------------------------------------------------------*/

function createByte(codePoint, shift) {
  return stringFromCharCode(((codePoint >> shift) & 0x3f) | 0x80);
}

function encodeCodePoint(codePoint) {
  if ((codePoint & 0xffffff80) == 0) {
    // 1-byte sequence
    return stringFromCharCode(codePoint);
  }
  let symbol = '';
  if ((codePoint & 0xfffff800) == 0) {
    // 2-byte sequence
    symbol = stringFromCharCode(((codePoint >> 6) & 0x1f) | 0xc0);
  } else if ((codePoint & 0xffff0000) == 0) {
    // 3-byte sequence
    checkScalarValue(codePoint);
    symbol = stringFromCharCode(((codePoint >> 12) & 0x0f) | 0xe0);
    symbol += createByte(codePoint, 6);
  } else if ((codePoint & 0xffe00000) == 0) {
    // 4-byte sequence
    symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xf0);
    symbol += createByte(codePoint, 12);
    symbol += createByte(codePoint, 6);
  }
  symbol += stringFromCharCode((codePoint & 0x3f) | 0x80);
  return symbol;
}

function utf8encode(string) {
  const codePoints = ucs2decode(string);
  const { length } = codePoints;
  let index = -1;
  let codePoint;
  let byteString = '';
  while (++index < length) {
    codePoint = codePoints[index];
    byteString += encodeCodePoint(codePoint);
  }
  return byteString;
}

function getLuaCharCode(string) {
  if (string) {
    const encoded = utf8encode(string);
    const byte = encoded[0].charCodeAt(0);
    return byte;
  }
  return false;
}

// hash function
Math.fmod = function fmod(x, y) {
  //  discuss at: http://locutus.io/php/fmod/
  // original by: Onno Marsman (https://twitter.com/onnomarsman)
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  //   example 1: fmod(5.7, 1.3)
  //   returns 1: 0.5

  let tmp;
  let p = 0;
  let pY = 0;
  let l = 0.0;
  let l2 = 0.0;

  tmp = x.toExponential().match(/^.\.?(.*)e(.+)$/);
  p = parseInt(tmp[2], 10) - `${tmp[1]}`.length;
  tmp = y.toExponential().match(/^.\.?(.*)e(.+)$/);
  pY = parseInt(tmp[2], 10) - `${tmp[1]}`.length;

  if (pY > p) {
    p = pY;
  }

  const tmp2 = x % y;

  if (p < -100 || p > 20) {
    // toFixed will give an out of bound error so we fix it like this:
    l = Math.round(Math.log(tmp2) / Math.log(10));
    l2 = Math.pow(10, l);

    return (tmp2 / l2).toFixed(l - p) * l2;
  }
  p = p > 0 ? 0 : p;
  return parseFloat(tmp2.toFixed(-p));
};

function StringHash(str) {
  let counter = 1;
  const len = str.length;
  for (let i = 1; i <= len; i += 3) {
    counter =
      Math.fmod(counter * 8161, 4294967279) +
      getLuaCharCode(str[i - 1]) * 16776193 +
      (getLuaCharCode(str[i]) || len - i + 256) * 8372226 +
      (getLuaCharCode(str[i + 1]) || len - i + 256) * 3932164;
  }
  return Math.fmod(counter, 4294967291);
}

module.exports = { StringHash };
