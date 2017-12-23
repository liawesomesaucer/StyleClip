var rgbDecimalToHex = function (rgbDecimal) { 
  var hex = Number(Math.round(rgbDecimal * 100)).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
};

var convertRgbToHex = function(r, g, b) {
  return '#' + [r, g, b].map(function(el) { return rgbDecimalToHex(el) }).join('');
}
