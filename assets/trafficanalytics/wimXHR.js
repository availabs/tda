(function() {
	var wimXHR = {
		version: '0.2.1'
	}
	// variable to hold the database name that the client
	// will be querying from
	var _DATABASE = 'allWim';

	// domain where API is located
	//var _URLbase = 'http://lor.availabs.org:50000';
	//var _URLbase = 'http://localhost:1338';


	wimXHR.setDatabase = function(database){
		_DATABASE = database;
	}

	// AJAX get request convenience method
	// simple redirects to the post method
	wimXHR.get = function(url, callback) {
		wimXHR.post(url, {database: _DATABASE}, callback);
	}

	// AJAX post request
	// callback is optional
	// url should not contain a domain name, just a route
	// data shoud be contained within a json
	wimXHR.post = function(url, data, callback,test) {
		data.database = _DATABASE;

// 		if(url === 'demo'){
// 			_getXHR('http://localhost:1338/state/32/allStationsGeo/').post(JSON.stringify(data), function(error, data) {
// 			if (typeof callback !== undefined)
// 				callback(error, data);
// //				console.log(data)
// 		})
// 		}	
		
		//else{
		_getXHR(url).post(JSON.stringify(data), function(error, data) {
			if (typeof callback !== undefined)
				callback(error, data);
		
		});
		//}
		
	}

	function _getXHR(url) {
		return d3.xhr(url).response(function(request) {
                    return JSON.parse(request.responseText);
                })
	}
	// retrieves client database name from file 'session.conf'
	// d3.json('/session.conf', function(error, config) {
 //        if (error) {
 //          console.log('Could not load config file', error);
 //          return;
 //        }
 //        _DATABASE = config.database;
 //        _URLbase = _URLbase || config.urlbas
 //    })

	this.wimXHR = wimXHR;
}) ()