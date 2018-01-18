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
var createColorToNameMap = function(documentColors) {
  var rgba, r, g, b, hex, colorName, color;
  var colorsMap = {};

  // System to store color usages in case two similar colors are used
  // with conflicting names
  var colorsUsage = {};

  for (var i = 0; i < documentColors.length; i++) {
    color = documentColors[i].toString();
    rgba = color.slice(1, -1).split(' ');

    r = rgba[0].split(':')[1];
    g = rgba[1].split(':')[1];
    b = rgba[2].split(':')[1];
    a = rgba[3].split(':')[1];

    // Use hex if opaque, rgba if not opaque
    hex = convertRgbToHex(r, g, b).toUpperCase();
    colorName = ntc.name(hex)[1].toUpperCase().replace('/', '').replace(' ', '-');
    if (a != 1) {
      // Temporary map color name to test usage, as we need to create the string differently
      mapColorName = colorName + '-' + a.slice(2, 4);
      color = generateRgbaString(r, g, b, a);
      // If name for color has been used before, postfix with an index
      if (colorsUsage[mapColorName]) {
        colorName = colorName + colorsUsage[mapColorName] + '-' + a.slice(2, 4);
      } else {
        colorName = mapColorName;
        colorsUsage[mapColorName] = 1;
      }
    } else { // Opaque color
      color = hex;
      // If name for color has been used before, postfix with an index
      if (colorsUsage[colorName]) {
        colorName = colorName + colorsUsage[colorName]++;
      } else {
        colorsUsage[colorName] = 1;
      }
    }

    colorsMap[color] = colorName;
  }
  return colorsMap;
}
