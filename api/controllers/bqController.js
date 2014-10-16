/**
 * TestControllerController
 *
 * @description :: Server-side logic for managing testcontrollers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var bq = require('bigquery')
  , fs = require('fs')
  , prjId = 'avail-wim'; //you need to modify this

bq.init({
  client_secret: 'availwim.json',
  key_pem: 'availwim.pem'
});


module.exports = {

  allStations:function(req,res){
     
    
    //console.log("wimstation ",SQL)

    //d is the value to be returned
    var output= [];
    var dumper = [];
    var rowNames = 'res_type,state_fips,station_id,direct_of_travel,lane_of_travel,year,func_class_code,num_lanes_direc_indicated,sample_type_for_traffic_vol,num_lanes_monitored_for_traffic_vol,method_of_traffic_vol_counting,sample_type_for_vehicle_class,num_lanes_monitored_for_vehicle_class,method_of_vehicle_class,alg_for_vehicle_class,class_sys_for_vehicle_class,sample_type_for_truck_weight,num_lanes_monitored_for_truck_weight,method_of_truck_weighing,calibration_of_weighing_sys,method_of_data_retrieval,type_of_sensor,second_type_of_sensor,primary_purpose,lrs_identification,lrs_location_point,latitude,longitude,shrp_site_identification,prev_station_id,year_station_established,year_station_discontinued,fips_county_code,hpms_sample_type,hpms_sample_identifier,national_highway_sys,posted_route_sign,posted_sign_route_num,concurrent_route_signing,concurrent_signed_route_num,station_location'.split(',');
    var SQL = 'Select * FROM [tmasWIM12.allStations]';
    var check = [];
    bq.job.query(prjId, SQL, function(e,r,d){
      if(e) console.log("This is your error! It was made for you! ",e);
      
        console.log('data1 loaded');
        console.log('Totalrows',d.totalRows);
        d.rows.forEach(function(d){
          var row = {};
          d.f.forEach(function(f,i){
            row[rowNames[i]] = f.v;
          });
          if(check.indexOf(row.state_fips+' '+row.station_id) === -1){
            check.push(row.state_fips+' '+row.station_id);
            output.push(row);  
          }
          dumper.push(1);
        });
        
        console.log(output.length,dumper.length);
        if(dumper.length < d.totalRows){
          getMoreRows(d.jobReference.jobId,dumper.length)
        }else{
          console.log("finished");
          res.json(output);
        }

        function getMoreRows(jobid,startLine){

          console.log('get more rows',jobid,startLine);
          bq.job.getQueryResults(prjId,jobid,startLine,function(b,r,data){

            data = JSON.parse(data);
            console.log('get more rows/data returned');
            if(typeof data.rows == 'undefined'){
              console.log('error probably',data);
            }
            
            //console.log(data);
            console.log('data2',data.rows.length,data.pageToken,data.jobReference);
            data.rows.forEach(function(data){
              var row = {};
              data.f.forEach(function(f,i){
                row[rowNames[i]] = f.v;
              });
              if(check.indexOf(row.state_fips+' '+row.station_id) === -1){
                check.push(row.state_fips+' '+row.station_id);
                output.push(row);  
              }
              dumper.push(1);
            });
            if(dumper.length < d.totalRows){
            
              getMoreRows(jobid,dumper.length)
            
            }else{
        
              console.log('finished');
        
              //voterCache.addData(campaign,output);
              res.json(output);
            }

          });
        }
    
    });    

  },
	getWimStationData:function(req,res){
 		console.log('getWimStationData -- bq');
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
 		//console.log("wimstation ",SQL)

 		//d is the value to be returned

 		bq.job.query(prjId, SQL, function(e,r,d){
 		  if(e) console.log("This is your error! It was made for you! ",e);
 		  console.timeEnd('getWimStationDataQuery')
		  res.json(d)
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

