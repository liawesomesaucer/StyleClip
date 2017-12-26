/**
 * Generates an rgba string from hundredths precision given
 * Used since Sketch's global colors functionality uses
 * [0, 1] but rgb CSS standards use 0-255 for r, g, & b
 * r, g, b, a
 * @param r - Number between 0 and 1, inclusive
 * @param g - Number between 0 and 1, inclusive
 * @param b - Number between 0 and 1, inclusive
 * @param a - Number between 0 and 1, inclusive
 * @returns an rgba string
 */
var generateRgbaString = function(r, g, b, a) {
  return 'rgba(' +
            Math.round(r * 255) + ',' +
            Math.round(g * 255) + ',' +
            Math.round(b * 255) + ',' +
            a.slice(0, 4) + ')';
}

/**
 * Converts rgb decinal to hex code
 */
var rgbDecimalToHex = function (rgbDecimal) { 
  var hex = Math.round(rgbDecimal * 255).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
};

/**
 * Converts an rgb string to hexcode
 */
var convertRgbToHex = function(r, g, b) {
  return '#' + [r, g, b].map(function(el) { return rgbDecimalToHex(el) }).join('');
}

/**
 * Converts an array of document colors to a mapping from rgba string to colorName
 */
var createRgbaToNameMap = function(documentColors) {
  var rgba, r, g, b, hex, colorName, color;
  var colorsMap = {};
  log('createRgbaToNameMap');
  for (var i = 0; i < documentColors.length; i++) {
    color = documentColors[i].toString();
    rgba = color.slice(1, -1).split(' ');
    a = rgba[3].split(':')[1];

    // Skip colors that are opaque (would be hex)
    // Implicit type cast used due to string
    if (a == 1) {
      continue;
    }

    r = rgba[0].split(':')[1];
    g = rgba[1].split(':')[1];
    b = rgba[2].split(':')[1];

    hex = convertRgbToHex(r, g, b);
    colorName = ntc.name(hex)[1].toUpperCase().replace('/', '').replace(' ', '-');
    if (a < 1) { // Handle non-opaque colors
      colorName = colorName + '-' + a.slice(2, 4);
    }
    color = generateRgbaString(r, g, b, a);
    colorsMap[color] = colorName;
    // log(color + ': ' + colorName);
    log('key: ' + color);
  }
  return colorsMap;
}

/**
 * Converts an array of document colors to mapping from hex string to colorName
 */
var createHexToNameMap = function(documentColors) {
  var rgba, r, g, b, hex, colorName, color;
  var colorsMap = {};
  for (var i = 0; i < documentColors.length; i++) {
    color = documentColors[i].toString();
    rgba = color.slice(1, -1).split(' ');
    a = rgba[3].split(':')[1];
    
    // Skip colors that are not opaque (would be rgba)
    // Implicit type cast used due to string
    if (a != 1) {
      continue;
    }

    r = rgba[0].split(':')[1];
    g = rgba[1].split(':')[1];
    b = rgba[2].split(':')[1];

    hex = convertRgbToHex(r, g, b).toUpperCase();
    colorName = ntc.name(hex)[1].toUpperCase().replace('/', '').replace(' ', '-');
    colorsMap[hex] = colorName;
  }
  return colorsMap;
}
