/**
 * FileController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var http = require('https');
var googleapis = require('googleapis');
		var jwt = new googleapis.auth.JWT(
				'424930963222-s59k4k5usekp20guokt0e605i06psh0d@developer.gserviceaccount.com', 
				'availwim.pem', 
				'3d161a58ac3237c1a1f24fbdf6323385213f6afc', 
				['https://www.googleapis.com/auth/bigquery']
			);
jwt.authorize();	
var bigQuery = googleapis.bigquery('v2');

var newDataUploadChecker = function(newData,typeD,dataHolder,lines,fs,files,terminal,notNewTable) {
		
 		var database = "UltimateTestTable2" //figure out how to get this...
 		var data = newData
 		if(typeD === "class"){
 			database = database+"Class"
 		}
 		/*In the future, may need to edit total weight formula*/
 		var sql = 'SELECT state_fips,station_id,year,month FROM [tmasWIM12.'+database+'] where '
 		for(var i = 0;i<data.length;i++){
 			sql = sql + "(state_fips = '"+data[i].state+"' and station_id = '"+data[i].station+"' and year = "+data[i].year+" and month = "+data[i].month+" ) "
 			if((i+1) != data.length){
 				sql = sql + "or "
 			}
 		}
 		sql = sql+"group by state_fips,station_id,year,month"
 		var request = bigQuery.jobs.query({
	    	kind: "bigquery#queryRequest",
	    	projectId: 'avail-wim',
	    	timeoutMs: '30000',
	    	resource: {query:sql,projectId:'avail-wim'},
	    	auth: jwt
	    },

		function(err, response) {
			if (err && notNewTable) {
					console.log('Error:',err);
					console.log('Ending terminal session.');
					terminal.stdin.write('rm ' + "/home/evan/code/tda/.tmp/uploads/assets/data/"+files[0].filename +'\n');
					terminal.stdin.write('rm ' + files[0].fd +'\n');
				    terminal.stdin.end();
				}
			else{

			//if data doesn't exist, remove from dataHolder
				if(response != null || !(notNewTable)){
					if(response != null){
						if(response.rows != undefined){
			    			response.rows.forEach(function(row){
				    			if(parseInt(row.f[2].v) < 10){
				    				row.f[2].v = "0"+row.f[2].v
				    			}
				    			if(parseInt(row.f[3].v) < 10){
				    				row.f[3].v = "0"+row.f[3].v
				    			}
				    			if(dataHolder.map(function(el) {return el.key;}).indexOf(row.f[0].v+row.f[1].v+row.f[2].v+row.f[3].v) != -1){
				    				dataHolder.splice(dataHolder.map(function(el) {return el.key;}).indexOf(row.f[0].v+row.f[1].v+row.f[2].v+row.f[3].v),1)
				    			}
							});
		    			}
		    		}
		    	
	    		//Filter out existing data. May able to be handled differently
	    		//create new file to be inserted.

	    		var wstream = fs.createWriteStream("/home/evan/code/tda/.tmp/uploads/assets/data/"+files[0].filename,{ flags: 'w',encoding: null,mode: 0666 });
	    		for(var j = 0;j<lines.length;j++){
	    			if(dataHolder.map(function(el) {return el.key;}).indexOf(lines[j][1]+lines[j][2]+lines[j][3]+lines[j][4]+lines[j][5]+lines[j][6]+lines[j][7]+lines[j][8]+lines[j][11]+lines[j][12]+lines[j][13]+lines[j][14]) != -1 && (lines[j][0] === 'W' ||lines[j][0] === 'C')){
						var x = 0
						//below is for constructing json row object to be inserted into table
						if(lines[j][x] === 'W'){
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var rec = lines[j][x]
									x++
								}
								else{
									var rec = ' '
									x++
								}
							}
							else{
								var rec = ' '
							}

							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var state = lines[j][x]+lines[j][x+1]
									x = 3
								}
								else{
									var state = '  '
									x = 3
								}
							}
							else{
								var state = '  '
								x = 3
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var station = lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4]+lines[j][x+5]
									x = 9
								}
								else{
									var station = '      '
									x = 9
								}
							}
							else{
								var station = '      '
								x = 9
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var dir = lines[j][x]
									x = 10
								}
								else{
									var dir = "-1"
									x = 10
								}
							}
							else{
								var dir = "-1"
								x = 10
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var lane = lines[j][x]
									x = 11
								}
								else{
									var lane = "-1"
									x = 11
								}
							}
							else{
								var lane = "-1"
								x = 11
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var year = lines[j][x]+lines[j][x+1]
									x = 13
								}
								else{
									var year = "-1"
									x = 13
								}
							}
							else{
								var year = "-1"
								x = 13
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var month = lines[j][x]+lines[j][x+1]
									x = 15
								}
								else{
									var month = "-1"
									x = 15
								}
							}
							else{
								var month = "-1"
								x = 15
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var day = lines[j][x]+lines[j][x+1]
									x = 17
								}
								else{
									var day = "-1"
									x = 17
								}
							}
							else{
								var day = "-1"
								x = 17
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var hour = lines[j][x]+lines[j][x+1]
									x = 19
								}
								else{
									var hour = "-1"
									x = 19
								}
							}
							else{
								var hour = "-1"
								x = 19
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var vehicleClass = lines[j][x]+lines[j][x+1]
									x = 21
								}
								else{
									var vehicleClass = "-1"
									x = 21
								}
							}
							else{
								var vehicleClass = "-1"
								x = 21
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var open = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 24
								}
								else{
									var open = "-1"
									x = 24
								}
							}
							else{
								var open = "-1"
								x = 24
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var totalWeight = lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]
									x = 28
								}
								else{
									var totalWeight = "0"
									x = 28
								}
							}
							else{
								var totalWeight = "0"
								x = 28
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var numAxles = lines[j][x]+lines[j][x+1]
									x = 30
								}
								else{
									var numAxles = "0"
									x = 30
								}
							}
							else{
								var numAxles = "0"
								x = 30
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleWeightA = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 33
								}
								else{
									var axleWeightA = "0"
									x = 33
								}
							}
							else{
								var axleWeightA = "0"
								x = 33
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleSpacingA = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 36
								}
								else{
									var axleSpacingA = "0"
									x = 36
								}
							}
							else{
								var axleSpacingA = "0"
								x = 36
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleWeightB = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 39
								}
								else{
									var axleWeightB = "0"
									x = 39
								}
							}
							else{
								var axleWeightB = "0"
								x = 39
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleSpacingB = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 42
								}
								else{
									var axleSpacingB = "0"
									x = 42
								}
							}
							else{
								var axleSpacingB = "0"
								x = 42
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleWeightC = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 45
								}
								else{
									var axleWeightC = "0"
									x = 45
								}
							}
							else{
								var axleWeightC = "0"
								x = 45
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleSpacingC = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 48
								}
								else{
									var axleSpacingC = "0"
									x = 48
								}
							}
							else{
								var axleSpacingC = "0"
								x = 48
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleWeightD = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 51
								}
								else{
									var axleWeightD = "0"
									x = 51
								}
							}
							else{
								var axleWeightD = "0"
								x = 51
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleSpacingD = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 54
								}
								else{
									var axleSpacingD = "0"
									x = 54
								}
							}
							else{
								var axleSpacingD = "0"
								x = 54
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleWeightE = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 57
								}
								else{
									var axleWeightE = "0"
									x = 57
								}
							}
							else{
								var axleWeightE = "0"
								x = 57
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleSpacingE = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 60
								}
								else{
									var axleSpacingE = "0"
									x = 60
								}
							}
							else{
								var axleSpacingE = "0"
								x = 60
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleWeightF = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 63
								}
								else{
									var axleWeightF = "0"
									x = 63
								}
							}
							else{
								var axleWeightF = "0"
								x = 63
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleSpacingF = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 66
								}
								else{
									var axleSpacingF = "0"
									x = 66
								}
							}
							else{
								var axleSpacingF = "0"
								x = 66
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleWeightG = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 69
								}
								else{
									var axleWeightG = "0"
									x = 69
								}
							}
							else{
								var axleWeightG = "0"
								x = 69
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleSpacingG = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 72
								}
								else{
									var axleSpacingG = "0"
									x = 72
								}
							}
							else{
								var axleSpacingG = "0"
								x = 72
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleWeightH = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 75
								}
								else{
									var axleWeightH = "0"
									x = 75
								}
							}
							else{
								var axleWeightH = "0"
								x = 75
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleSpacingH = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 78
								}
								else{
									var axleSpacingH = "0"
									x = 78
								}
							}
							else{
								var axleSpacingH = "0"
								x = 78
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleWeightI = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 81
								}
								else{
									var axleWeightI = "0"
									x = 81
								}
							}
							else{
								var axleWeightI = "0"
								x = 81
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleSpacingI = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 84
								}
								else{
									var axleSpacingI = "0"
									x = 84
								}
							}
							else{
								var axleSpacingI = "0"
								x = 84
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleWeightJ = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 87
								}
								else{
									var axleWeightJ = "0"
									x = 87
								}
							}
							else{
								var axleWeightJ = "0"
								x = 87
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleSpacingJ = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 90
								}
								else{
									var axleSpacingJ = "0"
									x = 90
								}
							}
							else{
								var axleSpacingJ = "0"
								x = 90
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleWeightK = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 93
								}
								else{
									var axleWeightK = "0"
									x = 93
								}
							}
							else{
								var axleWeightK = "0"
								x = 93
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleSpacingK = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 96
								}
								else{
									var axleSpacingK = "0"
									x = 96
								}
							}
							else{
								var axleSpacingK = "0"
								x = 96
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleWeightL = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 99
								}
								else{
									var axleWeightL = "0"
									x = 99
								}
							}
							else{
								var axleWeightL = "0"
								x = 99
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleSpacingL = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 102
								}
								else{
									var axleSpacingL = "0"
									x = 102
								}
							}
							else{
								var axleSpacingL = "0"
								x = 102
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var axleWeightM = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 105
								}
								else{
									var axleWeightM = "0"
									x = 105
								}
							}
							else{
								var axleWeightM = "0"
								x = 105
							}
							//wstream.write(rec+","+state+","+station+","+dir+","+lane+","+year+","+month+","+day+","+hour+","+vehicleClass+","+open+","+totalWeight+","+numAxles+","+axleWeightA+","+axleSpacingA+","+axleWeightB+","+axleSpacingB+","+axleWeightC+","+axleSpacingC+","+axleWeightD+","+axleSpacingD+","+axleWeightE+","+axleSpacingE+","+axleWeightF+","+axleSpacingF+","+axleWeightG+","+axleSpacingG+","+axleWeightH+","+axleSpacingH+","+axleWeightI+","+axleSpacingI+","+axleWeightJ+","+axleSpacingJ+","+axleWeightK+","+axleSpacingK+","+axleWeightL+","+axleSpacingL+","+axleWeightM+"\n")
							
						}

						//If data is class data
						else if(lines[j][x] === 'C'){
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var rec = lines[j][x]
									x++
								}
								else{
									var rec = ' '
									x++
								}
							}
							else{
								var rec = ' '
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var state = lines[j][x]+lines[j][x+1]
									x = 3
								}
								else{
									var state = '  '
									x = 3
								}
							}
							else{
								var state = '  '
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var station = lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4]+lines[j][x+5]
									x = 9
								}
								else{
									var station = '      '
									x = 9
								}
							}
							else{
								var station = '      '
									
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var dir = lines[j][x]
									x = 10
								}
								else{
									var dir = "-2"
									x = 10
								}
							}
							else{
								var dir = "-2"
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var lane = lines[j][x]
									x = 11
								}
								else{
									var lane = "-2"
									x = 11
								}
							}
							else{
								var lane = "-2"
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var year = lines[j][x]+lines[j][x+1]
									x = 13
								}
								else{
									var year = "-2"
									x = 13
								}
							}
							else{
								var year = "-2"
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var month = lines[j][x]+lines[j][x+1]
									x = 15
								}
								else{
									var month = "-2"
									x = 15
								}
							}
							else{
								var month = "-2"
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var day = lines[j][x]+lines[j][x+1]
									x = 17
								}
								else{
									var day = "-2"
									x = 17
								}
							}
							else{
								var day = "-2"
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var hour = lines[j][x]+lines[j][x+1]
									x = 19
								}
								else{
									var hour = "-2"
									x = 19
								}
							}
							else{
								var hour = "-2"
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var volume = lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4]
									x = 24
								}
								else{
									var volume = "-2"
									x = 24
								}
							}
							else{
								var volume = "-2"
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var class1 = lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4]
									x = 29
								}
								else{
									var class1 = "-2"
									x = 29
								}
							}
							else{
								var class1 = "-2"
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var class2 = lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4]
									x = 34
								}
								else{
									var class2 = "-2"
									x = 34
								}
							}
							else{
								var class2 = "-2"
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var class3 = lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4]
									x = 39
								}
								else{
									var class3 = "-2"
									x = 39
								}
							}
							else{
								var class3 = "-2"
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var class4 = lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4]
									x = 44
								}
								else{
									var class4 = "-2"
									x = 44
								}
							}
							else{
								var class4 = "-2"
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var class5 = lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4]
									x = 49
								}
								else{
									var class5 = "-2"
									x = 49
								}
							}
							else{
								var class5 = "-2"
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var class6 = lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4]
									x = 54
								}
								else{
									var class6 = "-2"
									x = 54
								}
							}
							else{
								var class6 = "-2"
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var class7 = lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4]
									x = 59
								}
								else{
									var class7 = "-2"
									x = 59
								}
							}
							else{
								var class7 = "-2"
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var class8 = lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4]
									x = 64
								}
								else{
									var class8 = "-2"
									x = 64
								}
							}
							else{
								var class8 = "-2"
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var class9 = lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4]
									x = 69
								}
								else{
									var class9 = "-2"
									x = 69
								}
							}
							else{
								var class9 = "-2"
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var class10 = lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4]
									x = 74
								}
								else{
									var class10 = "-2"
									x = 74
								}
							}
							else{
								var class10 = "-2"
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var class11 = lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4]
									x = 79
								}
								else{
									var class11 = "-2"
									x = 79
								}
							}
							else{
								var class11 = "-2"
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var class12 = lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4]
									x = 84
								}
								else{
									var class12 = "-2"
									x = 84
								}
							}
							else{
								var class12 = "-2"
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var class13 = lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4]
									x = 89
								}
								else{
									var class13 = "-2"
									x = 89
								}
							}
							else{
								var class13 = "-2"
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var class14 = lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4]
									x = 94
								}
								else{
									var class14 = "-2"
									x = 94
								}
							}
							else{
								var class14 = "-2"
							}
							if(x < lines[j].length){
								if((x+1) != lines[j].length){
									var class15 = lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4]
									x = 99
								}
								else{
									var class15 = "-2"
									x = 99
								}
							}
							else{
								var class15 = "-2"
							}
							//wstream.write(rec +","+state+","+station+","+dir+","+lane+","+year+","+month+","+day+","+hour+","+volume+","+class1+","+class2+","+class3+","+class4+","+class5+","+class6+","+class7+","+class8+","+class9+","+class10+","+class11+","+class12+","+class13+","+class14+","+class15+"\n");
						}
							//End class data management

	    			}
				}
				fs.chmodSync("/home/evan/code/tda/.tmp/uploads/assets/data/"+files[0].filename,0777)
				fs.chmodSync(files[0].fd,0777)
				if(lines[0][0] === 'W'){
					var schema = "'record_type:string,state_fips:string,station_id:string,dir:integer,lane:integer,year:integer,month:integer,day:integer,hour:integer,class:integer,open:string,total_weight:integer,numAxles:integer,axle1:integer,axle1sp:integer,axle2:integer,axle2sp:integer,axle3:integer,axle3sp:integer,axle4:integer,axle4sp:integer,axle5:integer,axle5sp:integer,axle6:integer,axle6sp:integer,axle7:integer,axle7sp:integer,axle8:integer,axle8sp:integer,axle9:integer,axle9sp:integer,axle10:integer,axle10sp:integer,axle11:integer,axle11sp:integer,axle12:integer,axle12sp:integer,axle13:integer'"
					var database2 = "UltimateTestTable2"
					terminal.stdin.write("sed 's/\\r$//' '"+files[0].fd+"' > '/home/evan/code/tda/.tmp/uploads/assets/data/"+files[0].filename+"'\n")
					terminal.stdin.write("awk -v FIELDWIDTHS='1 2 6 1 1 2 2 2 2 2 3 4 2 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3' -v OFS=',' '{ $1=$1 \"\"; print }' '/home/evan/code/tda/.tmp/uploads/assets/data/"+files[0].filename+"' > '"+files[0].fd+"'\n")
					
				}
				else if(lines[0][0] === 'C'){
					var schema = "'record_type:string,state_fips:string,station_id:string,dir:integer,lane:integer,year:integer,month:integer,day:integer,hour:integer,total_vol:integer,class1:integer,class2:integer,class3:integer,class4:integer,class5:integer,class6:integer,class7:integer,class8:integer,class9:integer,class10:integer,class11:integer,class12:integer,class13:integer,class14:integer,class15:integer'"
					var database2 = "TestDataClass"
					terminal.stdin.write("sed 's/\\r$//' '"+files[0].fd+"' > '/home/evan/code/tda/.tmp/uploads/assets/data/"+files[0].filename+"'\n")
					terminal.stdin.write("awk -v FIELDWIDTHS='1 2 6 1 1 2 2 2 2 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5' -v OFS=',' '{ $1=$1 \"\"; print }' '/home/evan/code/tda/.tmp/uploads/assets/data/"+files[0].filename+"' > '"+files[0].fd+"'\n")
				}
				else{
					console.log("oh no!")
					var schema = ""
				}

/*
Class awk script

awk -v FIELDWIDTHS='1 2 6 1 1 2 2 2 2 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5' -v OFS=',' '                                                                    
    { $1=$1 ""; print }                                                                                                                               
' 'mClass.CLA'

wgt awk script

awk -v FIELDWIDTHS='1 2 6 1 1 2 2 2 2 2 3 4 2 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3' -v OFS=',' '                                            
    { $1=$1 ""; print }                                                                                                                                
' 'allWim.WGT'


*/

				//wstream.on('finish', function() {
					// //From here on, may need to do callback handling, awk handling?, bigquery data insertion
					// //Update the User
					// var blastBackData = []
					// for(var i = 0;i<dataHolder.length;i++){
		   //              blastBackData.push("StateFips Code: "+data[i].state+" Station: "+data[i].station+" Month: "+data[i].month+" Year: "+data[i].year);
		   //          }
					// sails.sockets.blast('file_parsed',blastBackData);

					//removes junk data
					console.log('Ending terminal session success.');
					wstream.end();					
					terminal.stdin.write("bq --project_id=avail-wim query 'SELECT state_fips,count(state_fips) FROM [tmasWIM12."+database2+"] group by state_fips'"+'\n');
					terminal.stdin.write("bq --project_id=avail-wim load --max_bad_records=10 tmasWIM12."+database2+" "+files[0].fd+" "+schema+" \n");
					terminal.stdin.write("bq --project_id=avail-wim query 'SELECT state_fips,count(state_fips) FROM [tmasWIM12."+database2+"] group by state_fips'"+'\n');
					terminal.stdin.write('rm ' + "/home/evan/code/tda/.tmp/uploads/assets/data/"+files[0].filename +'\n');
					terminal.stdin.write('rm ' + files[0].fd +'\n');
					terminal.stdin.end();
					//});
				}
				else{
					console.log("Job couldn't complete, but somehow this isn't an error...")
					console.log('Ending terminal session Unknown error.');
					terminal.stdin.write('rm ' + "/home/evan/code/tda/.tmp/uploads/assets/data/"+files[0].filename +'\n');
					terminal.stdin.write('rm ' + files[0].fd +'\n');
					terminal.stdin.end();
				}
      		}
      		//return response
	    });
 	}

module.exports = {
 

  //Below should upload the file
  upload: function  (req, res) {
  	req.file('files').upload(
    	{dirname:'assets/data/',
    	 maxBytes:500000000},
      function (err, files) {
      if (err){
      	console.log("Error")
      	return res.serverError(err); //This probably crashes server? Testing seemed to vary...
      }

    //    { fd: '/home/evan/code/tda/.tmp/uploads/assets/data/',
		  // size: 5454000,
		  // type: 'text/x-tex',
		  // filename: 'de_jun_2013.CLS',
		  // status: 'bufferingOrWriting',
		  // field: 'files',
		  // extra: undefined }

    else {
    	//file management code below

    	/*
		How to awk and other things.

		1. Make sure file is valid through first letter? If not, remove from server.

		2. awk file and put result into object

		3. ?????

		4. run query and compare results with previously created object


    	*/

    	//file validation

    	var buffer=new Buffer(1)
 		var fs=require('fs')
 		fs.open(files[0].fd,'r',function(err,fd){
	 		fs.read(fd, buffer, 0, 1, 0, function(e,l,b){
		     res.write(b.toString('utf8',0,l))
		     console.log("The value: "+b.toString('utf8',0,l))
		    })
		    fs.close(fd,function(){})
	 	})



    	//Where file management code will go. At this point in code, files have been successfully added to the server.
    	//If file contains already added in data, the file will need to be manually removed.
       var terminal = require('child_process').spawn('bash');

       //String entered with terminal.stdin.write is data.
       terminal.stdout.on('data', function (data) {
       		console.log('stdout: ' + data);
       		
		});

        //code is ... something that has to do with terminal.stdin.end. Need this to kill child process.
		terminal.on('exit', function (code) {
			console.log('child process exited with code ' + code);
		});

		setTimeout(function() {
		    console.log('Sending stdin to terminal');
		    if(buffer.toString('utf8',0,1) === 'W' || buffer.toString('utf8',0,1) === 'C'){

			    //Remaining data management done below

			    fs.readFile(files[0].fd, "utf8", function(error, data) {
			    	var lines = data.split('\n')
			    	var dataHolder = []
			    	

			    	//This loop organizes input data

			    	for(var i = 0;i<lines.length;i++){
			    		
			    		if(dataHolder.map(function(el) {return el.key;}).indexOf(lines[i][1]+lines[i][2]+lines[i][3]+lines[i][4]+lines[i][5]+lines[i][6]+lines[i][7]+lines[i][8]+lines[i][11]+lines[i][12]+lines[i][13]+lines[i][14]) == -1 && (lines[i][0] === 'W' ||lines[i][0] === 'C')){
			    			var object ={
			    						 'state':lines[i][1]+lines[i][2],
			    						 'station':lines[i][3]+lines[i][4]+lines[i][5]+lines[i][6]+lines[i][7]+lines[i][8],
			    						 'year':lines[i][11]+lines[i][12],
			    						 'month':lines[i][13]+lines[i][14],
			    						 'key':lines[i][1]+lines[i][2]+lines[i][3]+lines[i][4]+lines[i][5]+lines[i][6]+lines[i][7]+lines[i][8]+lines[i][11]+lines[i][12]+lines[i][13]+lines[i][14]
			    						}
			    			dataHolder.push(object)
		    			}
			    	}
			    	if(buffer.toString('utf8',0,1) === 'W'){
			    		var typeD = "weight"
			    	}
			    	else if(buffer.toString('utf8',0,1) === 'C'){
			    		var typeD = "class"
			    	}

			    	//check if data exists

			    	//Currently has a problem with waiting for data to properly respond

			    	//when creating new table pass false
			    	//when not creating new table pass true

			    	newDataUploadChecker(dataHolder,typeD,dataHolder,lines,fs,files,terminal,true)

			    		

		                
		             

				});
			}
			else{
				terminal.stdin.write('rm ' + files[0].fd +'\n');
			    console.log('Ending terminal session. Invalid File.');
			    terminal.stdin.end();	
			}
		}, 1500);

       //end file management code
       return res.json({
	      	message: files.length + ' file(s) uploaded successfully!',
	        files: files        
	      });
  		}
    });
  },
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to FileController)
   */
  _config: {}

  
};
function byteCount(s) {
    return encodeURI(s).split(/%..|./).length - 1;
}