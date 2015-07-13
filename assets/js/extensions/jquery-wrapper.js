// To fix https://github.com/atom/electron/issues/254
if (!window.jQuery && typeof require !== 'undefined') {
  var path = require('path');
  window.$ = window.jQuery = require(path.join(process.cwd(), 'bower_components', 'jquery', 'dist', 'jquery.js'));
}
