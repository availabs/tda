/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */



// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
  'css/application.css',
  '/css/trafficanalytics.css',
  '/css/AVAILmap.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

    "/js/dependencies/sails.io.js",
    "lib/angular/angular.min.js",
    "lib/jquery/jquery-2.0.3.min.js",
    "lib/jquery-pjax/jquery.pjax.js",


    //<!-- jquery plugins -->
    "lib/icheck.js/jquery.icheck.js",
    "lib/sparkline/jquery.sparkline.js",
    "lib/jquery-ui-1.10.3.custom.js",
    "lib/jquery.slimscroll.js",

    //<!-- d3, nvd3-->
    "lib/nvd3/lib/d3.v3.min.js",
    
    //<!--backbone and friends -->
    "lib/backbone/underscore-min.js",
    "lib/backbone/backbone-min.js",
    "lib/backbone/backbone.localStorage-min.js",

    //<!-- bootstrap default plugins -->
    "lib/bootstrap/transition.js",
    "lib/bootstrap/collapse.js",
    "lib/bootstrap/alert.js",
    "lib/bootstrap/tooltip.js",
    "lib/bootstrap/popover.js",
    "lib/bootstrap/button.js",
    "lib/bootstrap/tab.js",
    "lib/bootstrap/dropdown.js",
    "lib/bootstrap/affix.js",

    //<!-- basic application js-->
    "js/app.js",
    "js/settings.js",

    
    "lib/AVAILmap.js"


    // <!-- page specific -->
];

// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  'templates/**/*.html'
];



// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(path) {
  return 'assets/' + path;
});
