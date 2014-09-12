/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://links.sailsjs.org/docs/config/http
 */

module.exports.http = {

  middleware: {

    // The order in which middleware should be run for HTTP request.
    // (the Sails router is invoked by the "router" middleware below.)
    order: [
      'startRequestTimer',
      'cookieParser',
      'session',
      'bodyParser',
      'handleBodyParserError',
      'compress',
      'methodOverride',
      'poweredBy',
      '$custom',
      'router',
      'www',
      'favicon',
      '404',
      '500'
    ],

    // The body parser that will handle incoming multipart HTTP requests.
    // By default as of v0.10, Sails uses [skipper](http://github.com/balderdashy/skipper).
    // See http://www.senchalabs.org/connect/multipart.html for other options.
    // bodyParser: require('skipper')

    //Below should initiate

    // loadMiddleware: function(app, defaultMiddleware, sails) {

    //     // Use the middleware in the correct order
    //     app.use(defaultMiddleware.startRequestTimer);
    //     app.use(defaultMiddleware.cookieParser);
    //     app.use(defaultMiddleware.session);
    //     // Insert upload file handler
    //     app.use('/data/gtfs/upload', upload.fileHandler());
    //     app.use(defaultMiddleware.bodyParser);
    //     app.use(defaultMiddleware.handleBodyParserError);
    //     app.use(defaultMiddleware.methodOverride);
    //     app.use(defaultMiddleware.poweredBy);
    //     app.use(defaultMiddleware.router);
    //     app.use(defaultMiddleware.www);
    //     app.use(defaultMiddleware.favicon);
    //     app.use(defaultMiddleware[404]);
    //     app.use(defaultMiddleware[500]);
    // },

  

  },

  // The number of seconds to cache flat files on disk being served by
  // Express static middleware (by default, these files are in `.tmp/public`)
  //
  // The HTTP static cache is only active in a 'production' environment,
  // since that's the only time Express will cache flat-files.
  cache: 31557600000
};