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
    var cssAttributes = '' + selection[0].CSSAttributeString();
    doc.showMessage("StyleClip: Styles copied to clipboard!");
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
  // var globalColors = NSApp.delegate().globalAssets().colors();

  // Run color generation from ntc to get semantic color names
  var rgba, r, g, b, hex, colorName, line, color;
  var toClip = [];
  for (var i = 0; i < documentColors.length; i++) {
    rgba = documentColors[i].toString().replace('(', '').replace(')', '').split(' ');
    r = rgba[0].split(':')[1];
    g = rgba[1].split(':')[1];
    b = rgba[2].split(':')[1];

    hex = convertRgbToHex(r, g, b);
    colorName = ntc.name(hex)[1].toLowerCase().replace('/', '').replace(' ', '-');
    // var line = colorName + ': rgb(' + r + ',' + g + ',' + b + ');';
    line = colorName + ': ' + hex + ';';
    toClip.push(line);
  });

  // TODO: create dialog box for SASS

  toClip = toClip.join('\n');

  // Copy to clipboard
  [pboard setString:toClip forType:NSPasteboardTypeString];

  doc.showMessage("StyleClip: SCSS Globals copied to clipboard!");
}

/**
 * Creates SCSS
 */
var clipSCSS = function(context) {
  var doc = context.document;
  var selection = context.selection;
  var pboard = NSPasteboard.generalPasteboard();
  [pboard clearContents];

  // Get styles

  // Check if styles incorporate new global/document colors
}
