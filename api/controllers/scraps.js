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

var newDataUploadChecker = function(newData,typeD,dataHolder,lines,fs,files,terminal) {
		
 		var database = "allWim" //figure out how to get this...
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
			if (err) {
					console.log('Error:',err);
					console.log('Ending terminal session.');
					terminal.stdin.write('rm ' + "/home/evan/code/tda/.tmp/uploads/assets/data/"+files[0].filename +'\n');
					terminal.stdin.write('rm ' + files[0].fd +'\n');
				    terminal.stdin.end();
				}
			else{
			//if data doesn't exist, remove from dataHolder
				if(response.rows != undefined){
	    			response.rows.forEach(function(row){
		    			if(parseInt(row.f[2].v) < 10){
		    				row.f[2].v = "0"+row.f[2].v
		    			}
		    			if(parseInt(row.f[3].v) < 10){
		    				row.f[3].v = "0"+row.f[3].v
		    			}
		    			if(dataHolder.map(function(el) {return el.key;}).indexOf(row.f[0].v+row.f[1].v+row.f[2].v+row.f[3].v) == -1){
		    				dataHolder.splice(dataHolder.map(function(el) {return el.key;}).indexOf(row.f[0].v+row.f[1].v+row.f[2].v+row.f[3].v),1)
		    			}
					});
		    	
	    		//Filter out existing data. May able to be handled differently
	    		//create new file to be inserted.

	    		var rowsToInsert = []
	    		var rowsToInsertString = '';

	    		//var wstream = fs.createWriteStream("/home/evan/code/tda/.tmp/uploads/assets/data/"+files[0].filename);
				for(var j = 0;j<lines.length;j++){
					if(dataHolder.map(function(el) {return el.key;}).indexOf(lines[j][3]+lines[j][4]+lines[j][5]+lines[j][6]+lines[j][7]+lines[j][8]+lines[j][11]+lines[j][12]+lines[j][13]+lines[j][14]) == -1 && (lines[j][0] === 'W' ||lines[j][0] === 'C')){
						//wstream.write(lines[j]);
						var x = 0
						//below is for constructing json row object to be inserted into table
						if(lines[j][x] === 'W'){
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
									var dir = parseInt(lines[j][x])
									x = 10
								}
								else{
									var dir = -1
									x = 10
								}
							}
							else{
								var dir = -1
								x = 10
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var lane = parseInt(lines[j][x])
									x = 11
								}
								else{
									var lane = -1
									x = 11
								}
							}
							else{
								var lane = -1
								x = 11
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var year = parseInt(lines[j][x]+lines[j][x+1])
									x = 13
								}
								else{
									var year = -1
									x = 13
								}
							}
							else{
								var year = -1
								x = 13
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var month = parseInt(lines[j][x]+lines[j][x+1])
									x = 15
								}
								else{
									var month = -1
									x = 15
								}
							}
							else{
								var month = -1
								x = 15
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var day = parseInt(lines[j][x]+lines[j][x+1])
									x = 17
								}
								else{
									var day = -1
									x = 17
								}
							}
							else{
								var day = -1
								x = 17
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var hour = parseInt(lines[j][x]+lines[j][x+1])
									x = 19
								}
								else{
									var hour = -1
									x = 19
								}
							}
							else{
								var hour = -1
								x = 19
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var vehicleClass = parseInt(lines[j][x]+lines[j][x+1])
									x = 21
								}
								else{
									var vehicleClass = -1
									x = 21
								}
							}
							else{
								var vehicleClass = -1
								x = 21
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var open = lines[j][x]+lines[j][x+1]+lines[j][x+2]
									x = 24
								}
								else{
									var open = -1
									x = 24
								}
							}
							else{
								var open = -1
								x = 24
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var totalWeight = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3])
									x = 28
								}
								else{
									var totalWeight = 0
									x = 28
								}
							}
							else{
								var totalWeight = 0
								x = 28
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var numAxles = parseInt(lines[j][x]+lines[j][x+1])
									x = 30
								}
								else{
									var numAxles = 0
									x = 30
								}
							}
							else{
								var numAxles = 0
								x = 30
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleWeightA = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 33
								}
								else{
									var axleWeightA = 0
									x = 33
								}
							}
							else{
								var axleWeightA = 0
								x = 33
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleSpacingA = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 36
								}
								else{
									var axleSpacingA = 0
									x = 36
								}
							}
							else{
								var axleSpacingA = 0
								x = 36
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleWeightB = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 39
								}
								else{
									var axleWeightB = 0
									x = 39
								}
							}
							else{
								var axleWeightB = 0
								x = 39
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleSpacingB = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 42
								}
								else{
									var axleSpacingB = 0
									x = 42
								}
							}
							else{
								var axleSpacingB = 0
								x = 42
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleWeightC = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 45
								}
								else{
									var axleWeightC = 0
									x = 45
								}
							}
							else{
								var axleWeightC = 0
								x = 45
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleSpacingC = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 48
								}
								else{
									var axleSpacingC = 0
									x = 48
								}
							}
							else{
								var axleSpacingC = 0
								x = 48
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleWeightD = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 51
								}
								else{
									var axleWeightD = 0
									x = 51
								}
							}
							else{
								var axleWeightD = 0
								x = 51
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleSpacingD = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 54
								}
								else{
									var axleSpacingD = 0
									x = 54
								}
							}
							else{
								var axleSpacingD = 0
								x = 54
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleWeightE = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 57
								}
								else{
									var axleWeightE = 0
									x = 57
								}
							}
							else{
								var axleWeightE = 0
								x = 57
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleSpacingE = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 60
								}
								else{
									var axleSpacingE = 0
									x = 60
								}
							}
							else{
								var axleSpacingE = 0
								x = 60
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleWeightF = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 63
								}
								else{
									var axleWeightF = 0
									x = 63
								}
							}
							else{
								var axleWeightF = 0
								x = 63
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleSpacingF = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 66
								}
								else{
									var axleSpacingF = 0
									x = 66
								}
							}
							else{
								var axleSpacingF = 0
								x = 66
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleWeightG = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 69
								}
								else{
									var axleWeightG = 0
									x = 69
								}
							}
							else{
								var axleWeightG = 0
								x = 69
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleSpacingG = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 72
								}
								else{
									var axleSpacingG = 0
									x = 72
								}
							}
							else{
								var axleSpacingG = 0
								x = 72
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleWeightH = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 75
								}
								else{
									var axleWeightH = 0
									x = 75
								}
							}
							else{
								var axleWeightH = 0
								x = 75
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleSpacingH = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 78
								}
								else{
									var axleSpacingH = 0
									x = 78
								}
							}
							else{
								var axleSpacingH = 0
								x = 78
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleWeightI = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 81
								}
								else{
									var axleWeightI = 0
									x = 81
								}
							}
							else{
								var axleWeightI = 0
								x = 81
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleSpacingI = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 84
								}
								else{
									var axleSpacingI = 0
									x = 84
								}
							}
							else{
								var axleSpacingI = 0
								x = 84
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleWeightJ = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 87
								}
								else{
									var axleWeightJ = 0
									x = 87
								}
							}
							else{
								var axleWeightJ = 0
								x = 87
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleSpacingJ = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 90
								}
								else{
									var axleSpacingJ = 0
									x = 90
								}
							}
							else{
								var axleSpacingJ = 0
								x = 90
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleWeightK = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 93
								}
								else{
									var axleWeightK = 0
									x = 93
								}
							}
							else{
								var axleWeightK = 0
								x = 93
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleSpacingK = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 96
								}
								else{
									var axleSpacingK = 0
									x = 96
								}
							}
							else{
								var axleSpacingK = 0
								x = 96
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleWeightL = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 99
								}
								else{
									var axleWeightL = 0
									x = 99
								}
							}
							else{
								var axleWeightL = 0
								x = 99
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleSpacingL = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 102
								}
								else{
									var axleSpacingL = 0
									x = 102
								}
							}
							else{
								var axleSpacingL = 0
								x = 102
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var axleWeightM = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2])
									x = 105
								}
								else{
									var axleWeightM = 0
									x = 105
								}
							}
							else{
								var axleWeightM = 0
								x = 105
							}
							rowsToInsert.push({'record_type':rec,'state_fips':state,'station_id':station,'dir':dir,'lane':lane,'year':year,'month':month,'day':day,'hour':hour,'class':vehicleClass,'open':open,'total_weight':totalWeight,'numAxles':numAxles,'axle1':axleWeightA,'axle1sp':axleSpacingA,'axle2':axleWeightB,'axle2sp':axleSpacingB,'axle3':axleWeightC,'axle3sp':axleSpacingC,'axle4':axleWeightD,'axle4sp':axleSpacingD,'axle5':axleWeightE,'axle5sp':axleSpacingE,'axle6':axleWeightF,'axle6sp':axleSpacingF,'axle7':axleWeightG,'axle7sp':axleSpacingG,'axle8':axleWeightH,'axle8sp':axleSpacingH,'axle9':axleWeightI,'axle9sp':axleSpacingI,'axle10':axleWeightJ,'axle10sp':axleSpacingJ,'axle11':axleWeightK,'axle11sp':axleSpacingK,'axle12':axleWeightL,'axle12sp':axleSpacingL/*,'axle13':axleWeightM*/})
							
							
						}

						//If data is class data
						else if(lines[j][x] === 'C'){
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
									var dir = parseInt(lines[j][x])
									x = 10
								}
								else{
									var dir = -2
									x = 10
								}
							}
							else{
								var dir = -2
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var lane = parseInt(lines[j][x])
									x = 11
								}
								else{
									var lane = -2
									x = 11
								}
							}
							else{
								var lane = -2
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var year = parseInt(lines[j][x]+lines[j][x+1])
									x = 13
								}
								else{
									var year = -2
									x = 13
								}
							}
							else{
								var year = -2
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var month = parseInt(lines[j][x]+lines[j][x+1])
									x = 15
								}
								else{
									var month = -2
									x = 15
								}
							}
							else{
								var month = -2
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var day = parseInt(lines[j][x]+lines[j][x+1])
									x = 17
								}
								else{
									var day = -2
									x = 17
								}
							}
							else{
								var day = -2
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var hour = parseInt(lines[j][x]+lines[j][x+1])
									x = 19
								}
								else{
									var hour = -2
									x = 19
								}
							}
							else{
								var hour = -2
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var volume = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4])
									x = 24
								}
								else{
									var volume = -2
									x = 24
								}
							}
							else{
								var volume = -2
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var class1 = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4])
									x = 29
								}
								else{
									var class1 = -2
									x = 29
								}
							}
							else{
								var class1 = -2
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var class2 = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4])
									x = 34
								}
								else{
									var class2 = -2
									x = 34
								}
							}
							else{
								var class2 = -2
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var class3 = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4])
									x = 39
								}
								else{
									var class3 = -2
									x = 39
								}
							}
							else{
								var class3 = -2
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var class4 = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4])
									x = 44
								}
								else{
									var class4 = -2
									x = 44
								}
							}
							else{
								var class4 = -2
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var class5 = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4])
									x = 49
								}
								else{
									var class5 = -2
									x = 49
								}
							}
							else{
								var class5 = -2
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var class6 = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4])
									x = 54
								}
								else{
									var class6 = -2
									x = 54
								}
							}
							else{
								var class6 = -2
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var class7 = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4])
									x = 59
								}
								else{
									var class7 = -2
									x = 59
								}
							}
							else{
								var class7 = -2
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var class8 = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4])
									x = 64
								}
								else{
									var class8 = -2
									x = 64
								}
							}
							else{
								var class8 = -2
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var class9 = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4])
									x = 69
								}
								else{
									var class9 = -2
									x = 69
								}
							}
							else{
								var class9 = -2
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var class10 = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4])
									x = 74
								}
								else{
									var class10 = -2
									x = 74
								}
							}
							else{
								var class10 = -2
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var class11 = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4])
									x = 79
								}
								else{
									var class11 = -2
									x = 79
								}
							}
							else{
								var class11 = -2
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var class12 = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4])
									x = 84
								}
								else{
									var class12 = -2
									x = 84
								}
							}
							else{
								var class12 = -2
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var class13 = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4])
									x = 89
								}
								else{
									var class13 = -2
									x = 89
								}
							}
							else{
								var class13 = -2
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var class14 = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4])
									x = 94
								}
								else{
									var class14 = -2
									x = 94
								}
							}
							else{
								var class14 = -2
							}
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
									var class15 = parseInt(lines[j][x]+lines[j][x+1]+lines[j][x+2]+lines[j][x+3]+lines[j][x+4])
									x = 99
								}
								else{
									var class15 = -2
									x = 99
								}
							}
							else{
								var class15 = -2
							}
							rowsToInsert.push({'record_type':rec , 'state_fips':state,'station_id':station,'dir':dir,'lane':lane,'year':year,'month':month,'day':day,'hour':hour,'total_vol':volume,'class1':class1,'class2':class2,'class3':class3,'class4':class4,'class5':class5,'class6':class6,'class7':class7,'class8':class8,'class9':class9,'class10':class10,'class11':class11,'class12':class12,'class13':class13,'class14':class14,'class15':class15})
							rowsToInsertString += '{"record_type":"'+rec +'",'+' "state_fips":"'+state+'",'+'"station_id":"'+station+'",'+'"dir":'+dir+','+'"lane":'+lane+','+'"year":'+year+','+'"month":'+month+','+'"day":'+day+','+'"hour":'+hour+','+'"total_vol":'+volume+','+'"class1":'+class1+','+'"class2":'+class2+','+'"class3":'+class3+','+'"class4":'+class4+','+'"class5":'+class5+','+'"class6":'+class6+','+'"class7":'+class7+','+'"class8":'+class8+','+'"class9":'+class9+','+'"class10":'+class10+','+'"class11":'+class11+','+'"class12":'+class12+','+'"class13":'+class13+','+'"class14":'+class14+','+'"class15":'+class15+'}\n'
						}
							//End class data management

	    			}
				}
				sails.sockets.blast('file_parsed',rowsToInsert)
				sails.sockets.blast('file_parsed',rowsToInsert.length);
				//wstream.end();

				//From here on, may need to do callback handling, awk handling?, bigquery data insertion
				//console.log(dataHolder)
				//var file_parse= {'messaage':'The file has been parsed.'};
				//Update the User
				var blastBackData = []
				for(var i = 0;i<dataHolder.length;i++){
	                blastBackData.push("StateFips Code: "+data[i].state+" Station: "+data[i].station+" Month: "+data[i].month+" Year: "+data[i].year);
	            }
				sails.sockets.blast('file_parsed',blastBackData);
				

				//Big query insertion 'json': {'id': 123,'name':'test1'}

				//When inserting class data use form: 'json': {'record_type':STRING,'state_fips':STRING,'station_id':STRING,'dir':INTEGER,'lane':INTEGER,'year':INTEGER,'month':INTEGER,'day':INTEGER,'hour':INTEGER,'total_vol':INTEGER,'class1':INTEGER,'class2':INTEGER,'class3':INTEGER,'class4':INTEGER,'class5':INTEGER,'class6':INTEGER,'class7':INTEGER,'class8':INTEGER,'class9':INTEGER,'class10':INTEGER,'class11':INTEGER,'class12':INTEGER,'class13':INTEGER,'class14':INTEGER,'class15':INTEGER}

				//insertId may not be necessary and only used for security purposes

				// bigQuery.tabledata.insertAll({
				//   auth: jwt,
				//   'projectId': 'avail-wim',
				//   'datasetId': 'tmasWIM12',
				//   'tableId': 'TestData',
				//   'resource': {
				//     "kind": "bigquery#tableDataInsertAllRequest",
				//     'rows': rowsToInsert
				//   }
				// }, function(err, result) {
				//   if (err) {
				//   	sails.sockets.blast('file_parsed',err);
				//     return console.error("Le error face ;_; "+err);
				//   }
				//   console.log("Le victory face :^)")
				//   console.log(result);
				//   sails.sockets.blast('file_parsed',result);
				// });

	
				//request variables made below

				if(lines[0][0] === "C"){
					var requestC =
					'{'+
					'"configuration": {'+
					'"load": {'+
					'"sourceFormat":"NEWLINE_DELIMITED_JSON",'+
					'"schema": {'+
					'"fields": ['+
					'{"name":"record_type","type":"STRING"},'+
					'{"name":"state_fips","type":"STRING"},'+
					'{"name":"station_id","type":"STRING"},'+
					'{"name":"dir","type":"INTEGER"},'+
					'{"name":"lane","type":"INTEGER"},'+
					'{"name":"year","type":"INTEGER"},'+
					'{"name":"month","type":"INTEGER"},'+
					'{"name":"day","type":"INTEGER"},'+
					'{"name":"hour","type":"INTEGER"},'+
					'{"name":"total_vol","type":"INTEGER"},'+
					'{"name":"class1","type":"INTEGER"},'+
					'{"name":"class2","type":"INTEGER"},'+
					'{"name":"class3","type":"INTEGER"},'+
					'{"name":"class4","type":"INTEGER"},'+
					'{"name":"class5","type":"INTEGER"},'+
					'{"name":"class6","type":"INTEGER"},'+
					'{"name":"class7","type":"INTEGER"},'+
					'{"name":"class8","type":"INTEGER"},'+
					'{"name":"class9","type":"INTEGER"},'+
					'{"name":"class10","type":"INTEGER"},'+
					'{"name":"class11","type":"INTEGER"},'+
					'{"name":"class12","type":"INTEGER"},'+
					'{"name":"class13","type":"INTEGER"},'+
					'{"name":"class14","type":"INTEGER"},'+
					'{"name":"class15","type":"INTEGER"}'+
					']'+
					'},'+
					'"destinationTable": {'+
					'"projectId": "avail-wim",'+
					'"datasetId": "tmasWIM12",'+
					'"tableId": "TestData"'+
					'}'+
					'}'+
					'}'+
					'}';

				//console.log(requestC)				

				//
				//console.log(jwt.gapi.token,'xxx\n',JSON.stringify(jwt));

				var options = {
				  host: 'www.googleapis.com',
				  path: '/upload/bigquery/v2/projects/avail-wim/jobs',
				  method: 'POST',
				  body: requestC,
				  headers: {
				  	'Content-Type': 'application/json; charset=UTF-8',
				  	'Content-Length':byteCount(requestC),
				  	'X-Upload-Content-Type': '*/*',
					'X-Upload-Content-Length': 2000000
				  },
				  //auth:'Bearer '+jwt.gapi.token
				};
				console.log(requestC,byteCount(requestC))

				parseHTTPreturn = function(response) {
				  var str = ''
				  console.log("c")
				  response.on('data', function (chunk) {
				  	console.log("b",chunk)
				    str += chunk;
				  });

				  response.on('end', function () {
				    console.log("a",str);
				  });
				}
				console.log("d",options)
				http.request(options, parseHTTPreturn).end();
				console.log("e")
				// bigQuery.jobs.insert({
				// 	'auth': jwt,
				// 	'timeoutMs': '30000',
			 //  //   	'projectId': 'avail-wim',
				// 	// 'datasetId': 'tmasWIM12',
				// 	// 'tableId': 'TestData',
				// 	// 'configuration':'load',
				// 	// 'resource': {
				// 	//   "kind": "bigquery#job",
				// 	//   'rows': rowsToInsert
				// 	// 	}
				// 	'kind' : 'bigquery#job',
				// 	'projectId' : 'avail-wim',
				// 	'body': requestC

				// 	}, function(err, result) {
						
				//   if (err) {
				//   	sails.sockets.blast('file_parsed',err);
				//   	sails.sockets.blast('file_parsed',requestC);
				//     return console.error("Le error face ;_; "+err);
				//   }
				//   console.log("Le victory face :^)")
				//   console.log(result);
				//   sails.sockets.blast('file_parsed',result);
				// });

				}

				//removes junk data
				console.log('Ending terminal session.');
				// terminal.stdin.write('rm ' + "/home/evan/code/tda/.tmp/uploads/assets/data/"+files[0].filename +'\n');
				terminal.stdin.write('rm ' + files[0].fd +'\n');
			    terminal.stdin.end();
				}
				else{
					console.log("Job couldn't complete, but somehow this isn't an error...")
					console.log('Ending terminal session.');
					// terminal.stdin.write('rm ' + "/home/evan/code/tda/.tmp/uploads/assets/data/"+files[0].filename +'\n');
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
       		console.log('stdout b: ' + data);
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

			    	newDataUploadChecker(dataHolder,typeD,dataHolder,lines,fs,files,terminal)

			    		

		                
		             

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





/////////////////////////














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

var newDataUploadChecker = function(newData,typeD,dataHolder,lines,fs,files,terminal) {
		
 		var database = "allWim" //figure out how to get this...
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
			if (err) {
					console.log('Error:',err);
					console.log('Ending terminal session.');
					terminal.stdin.write('rm ' + "/home/evan/code/tda/.tmp/uploads/assets/data/"+files[0].filename +'\n');
					terminal.stdin.write('rm ' + files[0].fd +'\n');
				    terminal.stdin.end();
				}
			else{
			//if data doesn't exist, remove from dataHolder
				if(response.rows != undefined){
	    			response.rows.forEach(function(row){
		    			if(parseInt(row.f[2].v) < 10){
		    				row.f[2].v = "0"+row.f[2].v
		    			}
		    			if(parseInt(row.f[3].v) < 10){
		    				row.f[3].v = "0"+row.f[3].v
		    			}
		    			if(dataHolder.map(function(el) {return el.key;}).indexOf(row.f[0].v+row.f[1].v+row.f[2].v+row.f[3].v) == -1){
		    				dataHolder.splice(dataHolder.map(function(el) {return el.key;}).indexOf(row.f[0].v+row.f[1].v+row.f[2].v+row.f[3].v),1)
		    			}
					});
		    	
	    		//Filter out existing data. May able to be handled differently
	    		//create new file to be inserted.

	    		var rowsToInsert = []
	    		var rowsToInsertString = '';

	    		var wstream = fs.createWriteStream("/home/evan/code/tda/.tmp/uploads/assets/data/"+files[0].filename);
				for(var j = 0;j<lines.length;j++){
					if(dataHolder.map(function(el) {return el.key;}).indexOf(lines[j][3]+lines[j][4]+lines[j][5]+lines[j][6]+lines[j][7]+lines[j][8]+lines[j][11]+lines[j][12]+lines[j][13]+lines[j][14]) == -1 && (lines[j][0] === 'W' ||lines[j][0] === 'C')){
						var x = 0
						//below is for constructing json row object to be inserted into table
						if(lines[j][x] === 'W'){
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
							rowsToInsert.push({'record_type':rec,'state_fips':state,'station_id':station,'dir':dir,'lane':lane,'year':year,'month':month,'day':day,'hour':hour,'class':vehicleClass,'open':open,'total_weight':totalWeight,'numAxles':numAxles,'axle1':axleWeightA,'axle1sp':axleSpacingA,'axle2':axleWeightB,'axle2sp':axleSpacingB,'axle3':axleWeightC,'axle3sp':axleSpacingC,'axle4':axleWeightD,'axle4sp':axleSpacingD,'axle5':axleWeightE,'axle5sp':axleSpacingE,'axle6':axleWeightF,'axle6sp':axleSpacingF,'axle7':axleWeightG,'axle7sp':axleSpacingG,'axle8':axleWeightH,'axle8sp':axleSpacingH,'axle9':axleWeightI,'axle9sp':axleSpacingI,'axle10':axleWeightJ,'axle10sp':axleSpacingJ,'axle11':axleWeightK,'axle11sp':axleSpacingK,'axle12':axleWeightL,'axle12sp':axleSpacingL/*,'axle13':axleWeightM*/})
							
							
						}

						//If data is class data
						else if(lines[j][x] === 'C'){
							if(x < lines[j].length){
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
								if(lines[j][x] != '\n'){
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
							rowsToInsert.push({'record_type':rec , 'state_fips':state,'station_id':station,'dir':dir,'lane':lane,'year':year,'month':month,'day':day,'hour':hour,'total_vol':volume,'class1':class1,'class2':class2,'class3':class3,'class4':class4,'class5':class5,'class6':class6,'class7':class7,'class8':class8,'class9':class9,'class10':class10,'class11':class11,'class12':class12,'class13':class13,'class14':class14,'class15':class15})
							rowsToInsertString += "{'record_type':'"+rec +"',"+" 'state_fips':'"+state+"',"+"'station_id':'"+station+"',"+"'dir':"+dir+","+"'lane':"+lane+","+"'year':"+year+","+"'month':"+month+","+"'day':"+day+","+"'hour':"+hour+","+"'total_vol':"+volume+","+"'class1':"+class1+","+"'class2':"+class2+","+"'class3':"+class3+","+"'class4':"+class4+","+"'class5':"+class5+","+"'class6':"+class6+","+"'class7':"+class7+","+"'class8':"+class8+","+"'class9':"+class9+","+"'class10':"+class10+","+"'class11':"+class11+","+"'class12':"+class12+","+"'class13':"+class13+","+"'class14':"+class14+","+"'class15':"+class15+"}\n"
							wstream.write(rec +","+state+","+station+","+dir+","+lane+","+year+","+month+","+day+","+hour+","+volume+","+class1+","+class2+","+class3+","+class4+","+class5+","+class6+","+class7+","+class8+","+class9+","+class10+","+class11+","+class12+","+class13+","+class14+","+class15+"\n");
						}
							//End class data management

	    			}
				}
				sails.sockets.blast('file_parsed',rowsToInsert)
				sails.sockets.blast('file_parsed',rowsToInsert.length);
				//wstream.write(rowsToInsertString)
				wstream.end();

				//From here on, may need to do callback handling, awk handling?, bigquery data insertion
				//console.log(dataHolder)
				//var file_parse= {'messaage':'The file has been parsed.'};
				//Update the User
				var blastBackData = []
				for(var i = 0;i<dataHolder.length;i++){
	                blastBackData.push("StateFips Code: "+data[i].state+" Station: "+data[i].station+" Month: "+data[i].month+" Year: "+data[i].year);
	            }
				sails.sockets.blast('file_parsed',blastBackData);
				

				//Big query insertion 'json': {'id': 123,'name':'test1'}

				//When inserting class data use form: 'json': {'record_type':STRING,'state_fips':STRING,'station_id':STRING,'dir':INTEGER,'lane':INTEGER,'year':INTEGER,'month':INTEGER,'day':INTEGER,'hour':INTEGER,'total_vol':INTEGER,'class1':INTEGER,'class2':INTEGER,'class3':INTEGER,'class4':INTEGER,'class5':INTEGER,'class6':INTEGER,'class7':INTEGER,'class8':INTEGER,'class9':INTEGER,'class10':INTEGER,'class11':INTEGER,'class12':INTEGER,'class13':INTEGER,'class14':INTEGER,'class15':INTEGER}

				//insertId may not be necessary and only used for security purposes

				// bigQuery.tabledata.insertAll({
				//   auth: jwt,
				//   'projectId': 'avail-wim',
				//   'datasetId': 'tmasWIM12',
				//   'tableId': 'TestData',
				//   'resource': {
				//     "kind": "bigquery#tableDataInsertAllRequest",
				//     'rows': rowsToInsert
				//   }
				// }, function(err, result) {
				//   if (err) {
				//   	sails.sockets.blast('file_parsed',err);
				//     return console.error("Le error face ;_; "+err);
				//   }
				//   console.log("Le victory face :^)")
				//   console.log(result);
				//   sails.sockets.blast('file_parsed',result);
				// });

	
				//request variables made below

				// if(lines[0][0] === 'C'){
				// 	var requestC = '--foo_bar_baz\n' +
				// 	'Content-Type: application/json; charset=UTF-8\n' + '\n' +
				// 	'{\n'+
				// 	'	"configuration": {\n'+
				// 	'	    "load": {\n'+
				// 	'	        "sourceFormat":"NEWLINE_DELIMITED_JSON",\n'+
				// 	'	        "schema": {\n'+
				// 	'	            "fields": [\n'+
				// 	'						{\n'+
				// 	'						"name":"record_type",\n'+
				// 	'						"type":"STRING"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"state_fips",\n'+
				// 	'						"type":"STRING"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"station_id",\n'+
				// 	'						"type":"STRING"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"dir",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"lane",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"year",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"month",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"day",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"hour",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"total_vol",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"class1",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"class2",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"class3",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"class4",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"class5",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"class6",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"class7",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"class8",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"class9",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"class10",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"class11",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"class12",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"class13",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"class14",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						},\n'+
				// 	'						{\n'+
				// 	'						"name":"class15",\n'+
				// 	'						"type":"INTEGER"\n'+
				// 	'						}\n'+
				// 	'					]\n'+
				// 	'	        },\n'+
				// 	'	        "destinationTable": {\n'+
				// 	'	            "projectId": "avail-wim",\n'+
				// 	'	            "datasetId": "tmasWIM12",\n'+
				// 	'	            "tableId": "TestDataClass1"\n'+
				// 	'	        }\n'+
				// 	'	    }\n'+
				// 	'	}\n'+
				// 	'}\n'+
				// 	'--foo_bar_baz\n' +
				// 	'Content-Type: application/json\n' +
				// 	'\n'
				// 	+rowsToInsertString
				// 	+'--foo_bar_baz--\n'

				// //console.log(requestC)				

				// //
				// console.log(requestC);
				// //console.log(encodeURI(rowsToInsertString))
				// var options = {
				//   host: "www.googleapis.com",
				//   path: "/upload/bigquery/v2/projects/avail-wim/jobs",
				//   method: "post",
				//   body: requestC,
				//   headers: {
				//   	'Content-Type': 'multipart/related; boundary="foo_bar_baz"',
				//   	'Content-Length': byteCount(requestC)
				//   }
				// };
				// parseHTTPreturn = function(response) {
				//   var str = ''
				//   response.on('data', function (chunk) {
				//     str += chunk;
				//   });

				//   response.on('end', function () {
				//     console.log('response:',str);
				//   });
				// }
				// http.request(options, parseHTTPreturn).end();
				// // bigQuery.jobs.insert({
				// // 	'auth': jwt,
				// // 	'timeoutMs': '30000',
			 // //  //   	'projectId': 'avail-wim',
				// // 	// 'datasetId': 'tmasWIM12',
				// // 	// 'tableId': 'TestData',
				// // 	// 'configuration':'load',
				// // 	// 'resource': {
				// // 	//   "kind": "bigquery#job",
				// // 	//   'rows': rowsToInsert
				// // 	// 	}
				// // 	'kind' : 'bigquery#job',
				// // 	'projectId' : 'avail-wim',
				// // 	'body': requestC

				// // 	}, function(err, result) {
						
				// //   if (err) {
				// //   	sails.sockets.blast('file_parsed',err);
				// //   	sails.sockets.blast('file_parsed',requestC);
				// //     return console.error("Le error face ;_; "+err);
				// //   }
				// //   console.log("Le victory face :^)")
				// //   console.log(result);
				// //   sails.sockets.blast('file_parsed',result);
				// // });

				// }

				//removes junk data
				console.log('Ending terminal session.');
				// terminal.stdin.write('rm ' + "/home/evan/code/tda/.tmp/uploads/assets/data/"+files[0].filename +'\n');
				terminal.stdin.write('rm ' + files[0].fd +'\n');
			    terminal.stdin.end();
				}
				else{
					console.log("Job couldn't complete, but somehow this isn't an error...")
					console.log('Ending terminal session.');
					// terminal.stdin.write('rm ' + "/home/evan/code/tda/.tmp/uploads/assets/data/"+files[0].filename +'\n');
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
       		console.log('stdout b: ' + data);
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

			    	newDataUploadChecker(dataHolder,typeD,dataHolder,lines,fs,files,terminal)

			    		

		                
		             

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