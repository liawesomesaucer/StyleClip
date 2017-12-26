@import 'ntc.js';
@import 'rgbtohex.js';

/**
 * Clips the raw CSS associated with an element to your clipboard
 * To run: CMD+Shift+Y
 */
var clipRawCSS = function(context) {  
  var doc = context.document;
  var selection = context.selection;
  var pboard = NSPasteboard.generalPasteboard();
  [pboard clearContents];

  if(selection.count() == 0) {
    doc.showMessage("StyleClip: Please select an element");
  } else if (selection.count() > 1) {
    doc.showMessage("StyleClip: Please select a single element, not a group");
  } else {
    var cssAttributes = '' + selection[0].CSSAttributes().slice(1).join('\n');
    doc.showMessage("StyleClip: CSS Styles copied to clipboard!");
    [pboard setString:cssAttributes forType:NSPasteboardTypeString];
  }
}

/**
 * Creates global and document SCSS variable definitions
 * To run: CMD+Shift+U
 */
var createSCSSGlobals = function(context) {
  var doc = context.document;
  var pboard = NSPasteboard.generalPasteboard();
  [pboard clearContents];

  // Find all existing global and document colors
  var documentColors = context.document.documentData().assets().colors();

  // System to store color usages in case two similar colors are used
  // with conflicting names
  var colorsUsage = {};

  // Run color generation from ntc to get semantic color names
  var rgba, r, g, b, hex, colorName, line, color;
  var toClip = [];
  for (var i = 0; i < documentColors.length; i++) {
    rgba = documentColors[i].toString().replace('(', '').replace(')', '').split(' ');
    r = rgba[0].split(':')[1];
    g = rgba[1].split(':')[1];
    b = rgba[2].split(':')[1];
    a = rgba[3].split(':')[1];

    hex = convertRgbToHex(r, g, b).toUpperCase();
    colorName = ntc.name(hex)[1].toUpperCase().replace('/', '').replace(' ', '-');

    // Use hex if opaque, rgba if not opaque
    // Implicit type cast used due to string
    if (a != 1) {
      colorName = colorName + '-' + a.slice(2, 4);
      color = generateRgbaString(r, g, b, a);
    } else { // Opaque color
      color = hex;
    }
    // If name for color has been used before, postfix with an index
    if (colorsUsage[colorName]) {
      colorName = colorName + colorsUsage[colorName]++;
    } else {
      colorsUsage[colorName] = 1;
    }
    line = '$' + colorName + ': ' + color + ';';
    toClip.push(line);
  }

  toClip = toClip.join('\n');

  // Copy to clipboard
  [pboard setString:toClip forType:NSPasteboardTypeString];

  doc.showMessage("StyleClip: SCSS Globals copied to clipboard!");
}

/**
 * Creates SCSS
 * To run: CMD+Shift+I
 */
var clipSCSS = function(context) {
  var doc = context.document;
  var selection = context.selection;

  if(selection.count() == 0) {
    doc.showMessage("StyleClip: Please select an element");
    return;
  } else if (selection.count() > 1) {
    doc.showMessage("StyleClip: Please select a single element, not a group");
    return;
  }

  var pboard = NSPasteboard.generalPasteboard();
  [pboard clearContents];

  // Create mapping for document colors
  var documentColors = context.document.documentData().assets().colors();
  var colorToNameMap = createColorToNameMap(documentColors);

  // Get styles
  // The slice is used to remove the default comment that comes with the rectangle
  var rawCssAttributes = selection[0].CSSAttributes().slice(1);

  // Match and replace hex and rgba values
  var hexRegex = new RegExp('#[a-fA-F0-9]{6}');
  var rgbaRegex = new RegExp('rgba(.*,.*,.*,.*)');
  var matchedHex, hexColor, processedRgba;
  for (var i = 0; i < rawCssAttributes.length; i++) {
    matchedHex = rawCssAttributes[i].match(hexRegex);
    matchedRgba = rawCssAttributes[i].match(rgbaRegex);

    if (matchedHex) {
      hexColor = matchedHex[0].toUpperCase();
      if (colorToNameMap[hexColor]) {
        rawCssAttributes[i] = rawCssAttributes[i].replace(hexColor, '$' + colorToNameMap[hexColor]);
      }
    }
    if (matchedRgba) {
      // Slice to remove semicolon
      rgbaColor = matchedRgba[0].slice(0, -1);
      if (colorToNameMap[rgbaColor]) {
        rawCssAttributes[i] = rawCssAttributes[i].replace(rgbaColor, '$' + colorToNameMap[rgbaColor]);
      }
    }
  }

  toClip = rawCssAttributes.join('\n');

  [pboard setString:toClip forType:NSPasteboardTypeString];
  doc.showMessage("StyleClip: SCSS styles copied to clipboard!");
}
