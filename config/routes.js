/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on routes, check out:
 * http://links.sailsjs.org/docs/config/routes
 */

module.exports.routes = {


  // Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, etc. depending on your
  // default view engine) your home page.
  //
  // (Alternatively, remove this and add an `index.html` file in your `assets` directory)
  '/':'HomeController.index',
  '/hpms':'HomeController.hpms',
  '/enforcement' :'HomeController.enforcement',
  '/station/:type/:id':'StationController.index',
  '/user/admin':'UserController.admin',
  '/agency/admin':'AgencyController.admin',
  '/user/db' : 'UserController.changeDatabase',
  '/upload' : 'DataLoaderController.index',
  '/upload/data' : 'FileController.upload',
  '/allStations' : 'bqController.allStations',
  '/stations/geo':{
    controller : 'StationsController',
    action : 'stationsGeo',
    cors: {
      origin: '*',
      methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      headers: 'content-type,X-Requested-With'
    }
  },
  '/stations/ClassGeo':{
    controller : 'StationsController',
    action : 'ClassStationsGeo',
    cors: {
      origin: '*',
      methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      headers: 'content-type,X-Requested-With'
    }
  },
    '/stations/allClassStations':{
    controller : 'StationsController',
    action : 'getAllClassStations',
    cors: {
      origin: '*',
      methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      headers: 'content-type,X-Requested-With'
    }
  },
    '/stations/allWIMStations':{
    controller : 'StationsController',
    action : 'getAllWimStations',
    cors: {
      origin: '*',
      methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      headers: 'content-type,X-Requested-With'
    }
  },
  '/stations/wim/:stateFips':{
    controller : 'StationsController',
    action : 'getStateWimStations',
    cors: {
      origin: '*',
      methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      headers: 'content-type,X-Requested-With'
    }
  },
  '/state/classStations':{
    controller : 'StationsController',
    action : 'getStateClassStations',
    cors: {
      origin: '*',
      methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      headers: 'content-type,X-Requested-With'
    }
  },
  '/station/graphwimData':{
    controller : 'StationsController',
    action : 'getWimStationData',
    cors: {
      origin: '*',
      methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      headers: 'content-type,X-Requested-With'
    }
  },
  '/station/graphclassData':{
    controller : 'StationsController',
    action : 'getClassStationData',
    cors: {
      origin: '*',
      methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      headers: 'content-type,X-Requested-With'
    }
  },
  '/state/allStationsGeo/':{
    controller : 'StationsController',
    action : 'getStationGeoForState',
    cors: {
      origin: '*',
      methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      headers: 'content-type,X-Requested-With'
    }
  },
  '/stations/timeLine/':{
    controller : 'StationsController',
    action : 'getStationTimeLine',
    cors: {
      origin: '*',
      methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      headers: 'content-type,X-Requested-With'
    }
  },  
  '/station/dailyWeights':{
    controller : 'StationsController',
    action : 'getDailyWeights',
    cors: {
      origin: '*',
      methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      headers: 'content-type,X-Requested-With'
    }
  },
  '/station/yearsActive':{
    controller : 'StationsController',
    action : 'getYearsActive',
    cors: {
      origin: '*',
      methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      headers: 'content-type,X-Requested-With'
    }

  },
  '/station/classAmounts':{
    controller : 'StationsController',
    action : 'getClassAmounts',
    cors: {
      origin: '*',
      methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      headers: 'content-type,X-Requested-With'
    }
  },
  '/station/stationInfo':{
    controller : 'StationsController',
    action : 'getStationInfo',
    cors: {
      origin: '*',
      methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      headers: 'content-type,X-Requested-With'
    }
  },
  '/stations/weight/':{
    controller : 'StationsController',
    action : 'getStateWeightStations',
    cors: {
      origin: '*',
      methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      headers: 'content-type,X-Requested-With'
    }
  },
  '/stations/overweight/':{
    controller : 'StationsController',
    action : 'getStateOverweightStations',
    cors: {
      origin: '*',
      methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      headers: 'content-type,X-Requested-With'
    }
  },
  '/stations/byWeightTableInfo/':{
    controller : 'StationsController',
    action : 'getWeightTableInfo',
    cors: {
      origin: '*',
      methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      headers: 'content-type,X-Requested-With'
    }
  },
  '/station/byTonageInfo/':{
    controller : 'StationsController',
    action : 'getTonageInfo',
    cors: {
      origin: '*',
      methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      headers: 'content-type,X-Requested-With'
    }
  },
  '/station/byTonageStations/':{
    controller : 'StationsController',
    action : 'getTonageStations',
    cors: {
      origin: '*',
      methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      headers: 'content-type,X-Requested-With'
    }
  },
  '/station/reportAmounts':{
    controller : 'StationsController',
    action : 'getReportAmounts',
    cors: {
      origin: '*',
      methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      headers: 'content-type,X-Requested-With'
    }
  },
  '/station/byMostRecentDate/':{
    controller : 'StationsController',
    action : 'getRecentDates',
    cors: {
      origin: '*',
      methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      headers: 'content-type,X-Requested-With'
    }
  },

  '/login':'UserController.login',
  '/login/auth':'UserController.auth',
  '/logout':'UserController.logout'

  // Custom routes here...


  // If a request to a URL doesn't match any of the custom routes above,
  // it is matched against Sails route blueprints.  See `config/blueprints.js`
  // for configuration options and examples.

};
