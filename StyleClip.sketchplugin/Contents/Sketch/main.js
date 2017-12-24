@import 'ntc.js';
@import 'rgbtohex.js';

/**
 * Clips the raw CSS associated with an element to your clipboard
 *
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
 *
 * To run: CMD+Shift+U
 */
var createSCSSGlobals = function(context) {
  var doc = context.document;
  var pboard = NSPasteboard.generalPasteboard();
  [pboard clearContents];

  // Find all existing global and document colors
  var documentColors = context.document.documentData().assets().colors();

  // Run color generation from ntc to get semantic color names
  var rgba, r, g, b, hex, colorName, line, color;
  var toClip = [];
  for (var i = 0; i < documentColors.length; i++) { // TODO: extract this to a function
    rgba = documentColors[i].toString().replace('(', '').replace(')', '').split(' ');
    r = rgba[0].split(':')[1];
    g = rgba[1].split(':')[1];
    b = rgba[2].split(':')[1];
    a = rgba[3].split(':')[1];

    hex = convertRgbToHex(r, g, b);
    colorName = ntc.name(hex)[1].toLowerCase().replace('/', '').replace(' ', '-');

    if (a < 1) { // Handle non-opaque colors
      colorName = colorName + '-' + a.slice(2, 4);
      color = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    } else {
      color = hex;
    }
    line = '$' + colorName + ': ' + color + ';';
    toClip.push(line);
  }

  // TODO: create dialog box for SASS

  toClip = toClip.join('\n');

  // Copy to clipboard
  [pboard setString:toClip forType:NSPasteboardTypeString];

  doc.showMessage("StyleClip: SCSS Globals copied to clipboard!");
}

/**
 * Creates SCSS
 *
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

  // Find all used document colors
  var documentColors = context.document.documentData().assets().colors();
  var colorsMap = createRgbaToNameMap(documentColors);
  var hexToNamesMap = createHexToNameMap(documentColors);

  // Get styles
  // The slice is used to remove the default comment that comes with the rectangle
  var rawCssAttributes = selection[0].CSSAttributes().slice(1);

  // Replace variables
  var toClip = '';
  var color;
  for (var i = 0; i < rawCssAttributes.length; i++) {
    color = rawCssAttributes[i].split(': ')[1].slice(0, -1).toLowerCase();
    log(color);
    if (colorsMap[color]) {
      toClip = toClip + rawCssAttributes[i].split(': ')[0] + ': $' + colorsMap[color] + ';';
    } else if (hexToNamesMap[color]) {
      toClip = toClip + rawCssAttributes[i].split(': ')[0] + ': $' + hexToNamesMap[color] + ';';
    } else {
      toClip = toClip + rawCssAttributes[i];
    }
  }
  doc.showMessage("StyleClip: SCSS styles copied to clipboard!");

  [pboard setString:toClip forType:NSPasteboardTypeString];
}
