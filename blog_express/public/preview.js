// This file defines the client-side 'preview' functionality
// Because we want to use a npm package (marked) inside it,
// we must compile it with Browserify
// This can be done at the command line with:
// > browserify preveiw.js -o bundle.js
// which compiles this file, plus any required libraries
// and pushes the resulting code to bundle.js, which
// we include in a script tag in our main pages
var marked = require('marked');

// We only want to run this code once the page has finished
// loading, so we wrap it in an DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function() {
  var input = document.getElementById('body');
  var pane = document.getElementById('pane');
  var btn = document.getElementById('display-btn');
  btn.addEventListener("click", function(event) {
    // We don't want the form to submit, so prevent this
    // default button action
    event.preventDefault();
    // Set the preview pane to display the processed markdown
    pane.innerHTML = marked(input.value);
  });
});
