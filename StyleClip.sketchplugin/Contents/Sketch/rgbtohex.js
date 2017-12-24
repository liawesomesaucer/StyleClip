/**
 * Converts rgb decinal to hex code
 */
var rgbDecimalToHex = function (rgbDecimal) { 
  var hex = Number(Math.floor(rgbDecimal * 256)).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  if (hex.length > 2) {
    hex = 'FF';
  }
  return hex;
};

var convertRgbToHex = function(r, g, b) {
  return '#' + [r, g, b].map(function(el) { return rgbDecimalToHex(el) }).join('');
}

/**
 * Converts an array of document colors to a mapping from rgba string to colorName
 */
var createRgbaToNameMap = function(documentColors) {
  var rgba, r, g, b, hex, colorName, color;
  var colorsMap = {};
  for (var i = 0; i < documentColors.length; i++) {
    color = documentColors[i].toString();
    rgba = color.slice(1, -1).split(' ');
    r = rgba[0].split(':')[1];
    g = rgba[1].split(':')[1];
    b = rgba[2].split(':')[1];
    a = rgba[3].split(':')[1];

    hex = convertRgbToHex(r, g, b);
    colorName = ntc.name(hex)[1].toLowerCase().replace('/', '').replace(' ', '-');

    colorsMap[color] = colorName;
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
    r = rgba[0].split(':')[1];
    g = rgba[1].split(':')[1];
    b = rgba[2].split(':')[1];
    a = rgba[3].split(':')[1];

    hex = convertRgbToHex(r, g, b);
    colorName = ntc.name(hex)[1].toLowerCase().replace('/', '').replace(' ', '-');

    colorsMap[hex] = colorName;
    log(hex);
  }
  return colorsMap;
}
