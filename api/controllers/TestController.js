/**
 * TestControllerController
 *
 * @description :: Server-side logic for managing testcontrollers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var googleapis = require('googleapis');
var jwt = new googleapis.auth.JWT(
		'424930963222-s59k4k5usekp20guokt0e605i06psh0d@developer.gserviceaccount.com', 
		'availwim.pem', 
		'3d161a58ac3237c1a1f24fbdf6323385213f6afc', 
		['https://www.googleapis.com/auth/bigquery']
	);
jwt.authorize();	
var bigQuery = googleapis.bigquery('v2');


module.exports = {
	getWimStationData:function(req,res){
 		console.log('getWimStationData');
 		if(typeof req.param('id') == 'undefined'){
 			res.send('{status:"error",message:"station_id required"}',500);
 			return;
 		}
 		var station_id = req.param('id'),
 			depth = req.param('depth'),
 			database = req.param('database');

 		var select = {
 			1: 'year',
 			2: 'month',
 			3: 'day',
 			4: 'hour'
 		};

 		var SQL = generateSQL();
 		console.time('getWimStationDataQuery')
 		console.log("wimstation ",SQL)

 		var request = bigQuery.jobs.query({
	    	kind: "bigquery#queryRequest",
	    	projectId: 'avail-wim',
	    	timeoutMs: '10000',
	    	resource: {query:SQL,projectId:'avail-wim'},
	    	auth: jwt
	    },

		function(err, response) {
      		if (err) console.log('Error:',err);
      		console.timeEnd('getWimStationDataQuery')
      		console.time('getWimStationDataSend')
      		res.json(response)
      		console.timeEnd('getWimStationDataSend')
	    });
 		function generateSQL() {
 			var sql	= "SELECT " + select[depth.length] + ", class, total_weight AS weight, count(*) AS amount "
 				+ "FROM [tmasWIM12."+database+"] "
 				+ "WHERE station_id = '"+station_id+"' "
 				+ addPredicates()
 				+ "GROUP BY " + select[depth.length] + ", class, weight "
 				+ "ORDER BY " + select[depth.length] + ";";
 			return sql;
 		}
 		function addPredicates() {
 			var preds = '';
 			for (var i = 1; i < depth.length; i++) {
 				preds += 'AND ' + select[i] + ' = ' + depth[i] + ' ';
 			}
 			return preds;
 		}
	},

	/**
   * Overrides for the settings in `config/controllers.js`
   * (specific to StationsController)
   */
  _config: {}
};

