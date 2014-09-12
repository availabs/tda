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

	    		var wstream = fs.createWriteStream("/home/evan/code/tda/.tmp/uploads/assets/data/"+files[0].filename);
				for(var j = 0;j<lines.length;j++){
					if(dataHolder.map(function(el) {return el.key;}).indexOf(lines[j][3]+lines[j][4]+lines[j][5]+lines[j][6]+lines[j][7]+lines[j][8]+lines[j][11]+lines[j][12]+lines[j][13]+lines[j][14]) == -1 && (lines[j][0] === 'W' ||lines[j][0] === 'C')){
						wstream.write(lines[j]);
						var x = 0
						//below is for constructing json row object to be inserted into table

							//If data is class data
						if(lines[j][x] === 'C'){
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
							if(j < 500){
							rowsToInsert.push({'json': {'record_type':rec,'state_fips':state,'station_id':station,'dir':dir,'lane':lane,'year':year,'month':month,'day':day,'hour':hour,'total_vol':volume,'class1':class1,'class2':class2,'class3':class3,'class4':class4,'class5':class5,'class6':class6,'class7':class7,'class8':class8,'class9':class9,'class10':class10,'class11':class11,'class12':class12,'class13':class13,'class14':class14,'class15':class15}})
							}
							
						}
							//End class data management

	    			}
				}
				sails.sockets.blast('file_parsed',rowsToInsert.length);
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

				bigQuery.tabledata.insertAll({
				  auth: jwt,
				  'projectId': 'avail-wim',
				  'datasetId': 'tmasWIM12',
				  'tableId': 'TestDataClass',
				  'resource': {
				    "kind": "bigquery#tableDataInsertAllRequest",
				    'rows': rowsToInsert
				  }
				}, function(err, result) {
				  if (err) {
				  	sails.sockets.blast('file_parsed',err);
				    return console.error("Le error face ;_; "+err);
				  }
				  console.log("Le victory face :^)")
				  console.log(result);
				  sails.sockets.blast('file_parsed',result);
				});



				//removes junk data
				console.log('Ending terminal session.');
				terminal.stdin.write('rm ' + "/home/evan/code/tda/.tmp/uploads/assets/data/"+files[0].filename +'\n');
				terminal.stdin.write('rm ' + files[0].fd +'\n');
			    terminal.stdin.end();
				}
				else{
					console.log("Job couldn't complete, but somehow this isn't an error...")
					console.log('Ending terminal session.');
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
