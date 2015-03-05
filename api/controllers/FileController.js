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


/*

NOTE: The file controller is very picky and specific and may still have some bugs and kinks to
it that need to be worked out for it to run more efficiently, but for now the best that can be
done has been done to make sure it works just fine. Notable errors to still be investigated are:

* 1. Potential server crash error if upload doesn't work correctly (Unsure how to repeat and may be fixed)

* 2. File reading error where file is uploaded but not read properly (Has probably been fixed)

* 3. How to catch biq query errors (Error response isn't sent to stderr? Has probably been fixed)

4. Same file name error handling needs to be done

5. Odd NaN error keeps popping up. Has to do with connection? Unsure of what the cause is or how to repeat it,
but doesn't seem to do anything? Example of error is below:

   error: Sent 500 ("Server Error") response
error: Error (E_UNKNOWN) :: Encountered an unexpected error
error: invalid input syntax for integer: "NaN"
    at Connection.parseE (/home/user/code/tda/node_modules/sails-postgresql/node_modules/pg.js/lib/connection.js:526:11)
    at Connection.parseMessage (/home/user/code/tda/node_modules/sails-postgresql/node_modules/pg.js/lib/connection.js:356:17)
    at Socket.<anonymous> (/home/user/code/tda/node_modules/sails-postgresql/node_modules/pg.js/lib/connection.js:105:22)
    at Socket.EventEmitter.emit (events.js:95:17)
    at Socket.<anonymous> (_stream_readable.js:746:14)
    at Socket.EventEmitter.emit (events.js:92:17)
    at emitReadable_ (_stream_readable.js:408:10)
    at emitReadable (_stream_readable.js:404:5)
    at readableAddChunk (_stream_readable.js:165:9)
    at Socket.Readable.push (_stream_readable.js:127:10)


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


/*
	Parameter info for newDataUploadChecker:

	newData: List of data in file. If new table all data is uploaded otherwise only select
	data contained in this array of strings will be uploaded

	typeD: The kind of data to be uploaded, being either weight or class data

	lines: Listing of data that may be uploaded. This is a copy of the file itself.

	fs: used for creating new file for data management

	files: used to manage file names

	terminal: used for access to terminal commands

	NewTable: true if creating a new table. False if not creating a new table

	currentJob: The current job. This data is used for solving the same file name problem

	blastBackData: Used for managing data to be returned to user


*/

/*

Things that still need to be done:

newDataUploadChecker(dataHolder,typeD,lines,fs,files,terminal,currentJob,blastBackData,dataSource,yearFormat)

*/


var newDataUploadChecker = function(newData,typeD,lines,fs,files,terminal,currentJob,blastBackData,dataSource,yearFormat) {
		
 		var database = dataSource
 		var data = newData

 		//A database of class data should always end in the string "Class" for claritys sake

 		if(typeD === "class"){
 			database = database+"Class"
 		}

 		//Build SQL query to check for old data

 		var sql = 'SELECT state_fips,station_id,year,month FROM [tmasWIM12.'+database+'] where '
 		for(var i = 0;i<data.length;i++){
 			sql = sql + "(state_fips = '"+data[i].state+"' and station_id = '"+data[i].station+"' and year = "+data[i].year+" and month = "+data[i].month+" ) "
 			if((i+1) != data.length){
 				sql = sql + "or "
 			}
 		}
 		sql = sql+"group by state_fips,station_id,year,month"
 		//Make request and run query
 		var request = bigQuery.jobs.query({
	    	kind: "bigquery#queryRequest",
	    	projectId: 'avail-wim',
	    	timeoutMs: '30000',
	    	resource: {query:sql,projectId:'avail-wim'},
	    	auth: jwt
	    },

		function(err, response) {

			/*
			If there was an error with the request:

			Uploading data to a new table will always cause an error, hence the below logic
			will cause the run of the current file to end if you are not making a new table


			*/
			if(err != null){
				if(err.errors != undefined){
					if(err.errors[0].reason === "notFound"){
						var NewTable = true
					}
					else{
						var NewTable = false
					}
				}
				
			}
			else{
				var NewTable = false
			}
			if (err && !(NewTable)) {
					UploadJob.update({id:currentJob.id},{isFinished:true,status:"Finished-ERROR"}).exec(function(err,job){
			    		if(err){
			    			console.log(err)
			    		}
			    	})
					console.log('Error:',err);
					//console.log('Ending terminal session.');
					blastBackData.push("An error beyond our control happened courtesy of Google.\nEither upload the file again or try again later.")
					sails.sockets.blast('file_parsed',blastBackData)
					terminal.stdin.write('rm ' + files[0].fd +'\n');
					terminal.stdin.write('rm ' + files[0].fd+"_"+currentJob.id +'\n');
				    terminal.stdin.end();
				}
			else{ //data management else
		    		

				/*

				The below block of code is used to manage what data to be added to the table is actually new.
				It has extra error checking due to the above error notification and new table management

				*/
				if(response != null || NewTable){
					if(response != null){
						if(response.rows != undefined){
							response.rows.forEach(function(row){
								if(yearFormat === "2001"){
					    			if(parseInt(row.f[2].v) < 10){
					    				row.f[2].v = "0"+row.f[2].v
					    			}
					    			
					    		}
					    		if(parseInt(row.f[3].v) < 10){
					    			row.f[3].v = "0"+row.f[3].v
					    		}
					    		if(newData.map(function(el) {return el.key;}).indexOf(row.f[0].v+row.f[1].v+row.f[2].v+row.f[3].v) != -1){
				    				newData.splice(newData.map(function(el) {return el.key;}).indexOf(row.f[0].v+row.f[1].v+row.f[2].v+row.f[3].v),1)
				    			}
				    			//Because of how the Texas data was formatted, this extra check is needed to be done for yearly data.
				    			//Otherwise repeat data would go unrecognized.
				    			if(yearFormat === "2001"){
					    			if(parseInt(row.f[2].v) < 10){
					    				
					    				row.f[2].v = " "+row.f[2].v[1]
					    			}
					    		}
				    			if(newData.map(function(el) {return el.key;}).indexOf(row.f[0].v+row.f[1].v+row.f[2].v+row.f[3].v) != -1){
				    				
				    				newData.splice(newData.map(function(el) {return el.key;}).indexOf(row.f[0].v+row.f[1].v+row.f[2].v+row.f[3].v),1)
				    			}
							});
		    			}
		    		}

			    	/*

			    	Update the user to let them know job is running fine at this point.
					Update is done here since the following part of the code is slow

					*/
					UploadJob.update({id:currentJob.id},{isFinished:false,status:"Running"}).exec(function(err,job){
						if(err){
			    			console.log(err)
			    		}
			    	})

			    	/*
		    		
					The below part of code is one of the two slowest parts of the run.
					It removes repeat data and writes the data to be input to a new file
					for later processing and management.

		    		*/
		    		if(newData.length != 0){
			    		for(var j = 0;j<lines.length;j++){
			    			if(NewTable || (response.rows == undefined) ){
			    				// terminal.stdin.write('cp ' + files[0].fd+" "+files[0].fd+"_"+currentJob.id+'\n');
			    				// j = lines.length
			    				terminal.stdin.write('printf "'+lines[j]+'\n" >> '+files[0].fd+'_'+currentJob.id+'\n');
			    			}
			    			if(yearFormat === '2001'){
				    			if(newData.map(function(el) {return el.key;}).indexOf(lines[j][1]+lines[j][2]+lines[j][3]+lines[j][4]+lines[j][5]+lines[j][6]+lines[j][7]+lines[j][8]+lines[j][11]+lines[j][12]+lines[j][13]+lines[j][14]) != -1 && (lines[j][0] === 'W' || lines[j][0] === 'C')){
					    			//wstream.write(lines[j] +"\n")
									terminal.stdin.write('printf "'+lines[j]+'\n" >> '+files[0].fd+'_'+currentJob.id+'\n');
				    			}
				    		}
				    		if(yearFormat === '2013'){
				    			if(newData.map(function(el) {return el.key;}).indexOf(lines[j][1]+lines[j][2]+lines[j][3]+lines[j][4]+lines[j][5]+lines[j][6]+lines[j][7]+lines[j][8]+lines[j][11]+lines[j][12]+lines[j][13]+lines[j][14]+lines[j][15]+lines[j][16]) != -1 && (lines[j][0] === 'W' || lines[j][0] === 'C')){
					    			//wstream.write(lines[j] +"\n")
									terminal.stdin.write('printf "'+lines[j]+'\n" >> '+files[0].fd+'_'+currentJob.id+'\n');
				    			}
				    		}

				    	}
			    	}
			    	/*
			    	Try and catch blocks to make sure files exist and prevent a server crashing error
			    	*/
		    		//wstream.on('finish', function() {
			    		try{
							fs.chmodSync(files[0].fd+"_"+currentJob.id,0777)
						}
						catch(err){
							console.log(err)
							UploadJob.update({id:currentJob.id},{isFinished:true,status:"Finished-ERROR"}).exec(function(err,job){
					    		if(err){
					    			console.log(err)
					    		}
					    	})
							//console.log("There was an error. Couldn't modify new file.")
							terminal.stdin.write('rm ' + files[0].fd+"_"+currentJob.id +'\n');
							terminal.stdin.write('rm ' + files[0].fd +'\n');
							blastBackData.push("A small error occured. Please try reuploading "+files[0].filename)
							sails.sockets.blast('file_parsed',blastBackData)
							terminal.stdin.end();
							return
						}
						try{
							fs.chmodSync(files[0].fd,0777)
						}
						catch(err){
							UploadJob.update({id:currentJob.id},{isFinished:true,status:"Finished-ERROR"}).exec(function(err,job){
					    		if(err){
					    			console.log(err)
					    		}
					    	})
							terminal.stdin.write('rm ' + files[0].fd+"_"+currentJob.id +'\n');
							terminal.stdin.write('rm ' + files[0].fd +'n');
							blastBackData.push("A small error occured. Please try reuploading "+files[0].filename)
							sails.sockets.blast('file_parsed',blastBackData)
							terminal.stdin.end();
							return
						}
						/*
						Below parses new data to be properly formed for table insertion.

						The first if statement ends the code if there is no new data to be added in.
						*/
						
						if(newData.length == 0){
							UploadJob.update({id:currentJob.id},{isFinished:true,status:"Finished-No New Data"}).exec(function(err,job){
					    		if(err){
					    			console.log(err)
					    		}
					    	})
					    	blastBackData.push("The file "+files[0].filename+" contains no new data.")
							sails.sockets.blast('file_parsed',blastBackData)
							terminal.stdin.write('rm ' + files[0].fd+"_"+currentJob.id +'\n');
							terminal.stdin.write('rm ' + files[0].fd +'\n');
							terminal.stdin.end();
							return
						}
						else if(yearFormat === "2001"){
							if(lines[0][0] === 'W'){
								var schema = "'record_type:string,state_fips:string,station_id:string,dir:integer,lane:integer,year:integer,month:integer,day:integer,hour:integer,class:integer,open:string,total_weight:integer,numAxles:integer,axle1:integer,axle1sp:integer,axle2:integer,axle2sp:integer,axle3:integer,axle3sp:integer,axle4:integer,axle4sp:integer,axle5:integer,axle5sp:integer,axle6:integer,axle6sp:integer,axle7:integer,axle7sp:integer,axle8:integer,axle8sp:integer,axle9:integer,axle9sp:integer,axle10:integer,axle10sp:integer,axle11:integer,axle11sp:integer,axle12:integer,axle12sp:integer,axle13:integer'"
								terminal.stdin.write("sed 's/\\r$//' '"+files[0].fd+"_"+currentJob.id+"' > '"+files[0].fd+"'\n")
								terminal.stdin.write("awk -v FIELDWIDTHS='1 2 6 1 1 2 2 2 2 2 3 4 2 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3' -v OFS=',' '{ $1=$1 \"\"; print }' '"+files[0].fd+"' > '"+files[0].fd+"_"+currentJob.id+"'\n")
								
							
							}
							else if(lines[0][0] === 'C'){
								var schema = "'record_type:string,state_fips:string,station_id:string,dir:integer,lane:integer,year:integer,month:integer,day:integer,hour:integer,total_vol:integer,class1:integer,class2:integer,class3:integer,class4:integer,class5:integer,class6:integer,class7:integer,class8:integer,class9:integer,class10:integer,class11:integer,class12:integer,class13:integer,class14:integer,class15:integer'"
								terminal.stdin.write("sed 's/\\r$//' '"+files[0].fd+"_"+currentJob.id+"' > '"+files[0].fd+"'\n")
								terminal.stdin.write("awk -v FIELDWIDTHS='1 2 6 1 1 2 2 2 2 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5' -v OFS=',' '{ $1=$1 \"\"; print }' '"+files[0].fd+"' > '"+files[0].fd+"_"+currentJob.id+"'\n")
							}
						}
						else if(yearFormat === "2013"){
							if(lines[0][0] === 'W'){
								var schema = "'record_type:string,state_fips:string,station_id:string,dir:integer,lane:integer,year:integer,month:integer,day:integer,hour:integer,class:integer,open:string,total_weight:integer,numAxles:integer,axle1:integer,axle1sp:integer,axle2:integer,axle2sp:integer,axle3:integer,axle3sp:integer,axle4:integer,axle4sp:integer,axle5:integer,axle5sp:integer,axle6:integer,axle6sp:integer,axle7:integer,axle7sp:integer,axle8:integer,axle8sp:integer,axle9:integer,axle9sp:integer,axle10:integer,axle10sp:integer,axle11:integer,axle11sp:integer,axle12:integer,axle12sp:integer,axle13:integer'"
								terminal.stdin.write("sed 's/\\r$//' '"+files[0].fd+"_"+currentJob.id+"' > '"+files[0].fd+"'\n")
								terminal.stdin.write("awk -v FIELDWIDTHS='1 2 6 1 1 4 2 2 2 2 3 6 2 5 4 5 4 5 4 5 4 5 4 5 4 5 4 5 4 5 4 5 4 5 4 5 4 5' -v OFS=',' '{ $1=$1 \"\"; print }' '"+files[0].fd+"' > '"+files[0].fd+"_"+currentJob.id+"'\n")
								
							}
							else if(lines[0][0] === 'C'){
								var schema = "'record_type:string,state_fips:string,station_id:string,dir:integer,lane:integer,year:integer,month:integer,day:integer,hour:integer,Class_Time_Interval:integer,total_vol:integer,restrictions:integer,class1:integer,class2:integer,class3:integer,class4:integer,class5:integer,class6:integer,class7:integer,class8:integer,class9:integer,class10:integer,class11:integer,class12:integer,class13:integer'"
								terminal.stdin.write("sed 's/\\r$//' '"+files[0].fd+"_"+currentJob.id+"' > '"+files[0].fd+"'\n")
								terminal.stdin.write("awk -v FIELDWIDTHS='1 2 6 1 1 4 2 2 2 1 5 1 5 5 5 5 5 5 5 5 5 5 5 5 5 ' -v OFS=',' '{ $1=$1 \"\"; print }' '"+files[0].fd+"' > '"+files[0].fd+"_"+currentJob.id+"'\n")
							}
						}
						else{
							UploadJob.update({id:currentJob.id},{isFinished:true,status:"Finished-ERROR"}).exec(function(err,job){
					    		if(err){
					    			console.log(err)
					    		}
					    	})
					    	blastBackData.push("The file "+files[0].filename+" is invalid. Select a new file.")
							sails.sockets.blast('file_parsed',blastBackData)
							terminal.stdin.write('rm ' + files[0].fd+"_"+currentJob.id +'\n');
							terminal.stdin.write('rm ' + files[0].fd +'\n');
							terminal.stdin.end();
							return
						}


							
							//Below line is what inserts data to bigquery
							terminal.stdin.write("echo Performing query \n")
							//blastBackData = []
							for(var i = 0;i<newData.length;i++){
				                blastBackData.push("StateFips Code: "+newData[i].state+" Station: "+newData[i].station+" Month: "+newData[i].month+" Year: "+newData[i].year);
				            }
				            terminal.stdin.write("bq --project_id=avail-wim load --max_bad_records=10 tmasWIM12."+database+" "+files[0].fd+"_"+currentJob.id+" "+schema+" \n");
				            //Below removes junkfiles and lets the user know what data got uploaded
							terminal.stdin.write('rm ' + files[0].fd+"_"+currentJob.id +'\n');
							terminal.stdin.write('rm ' + files[0].fd +'\n');
							terminal.stdin.end();
					
					//}); //End wstream on finish

				}
				else{
					UploadJob.update({id:currentJob.id},{isFinished:true,status:"Finished-ERROR"}).exec(function(err,job){
			    		if(err){
			    			console.log(err)
			    		}
			    	})
					console.log('Ending terminal session.');
					terminal.stdin.write('rm ' + files[0].fd+"_"+currentJob.id +'\n');
					terminal.stdin.write('rm ' + files[0].fd +'\n');
					blastBackData.push("There was either an error with the file uploaded or google servies. Please try reuploading the file "+files[0].filename)
					sails.sockets.blast('file_parsed',blastBackData)
					terminal.stdin.end();
				}

      		} //End data management else
	    });
 	}

module.exports = {
 

  //Below should upload the file(s)
  //This code manages one file at a time, however all files are managed concurrently.
  //All problems that could arise from the code running concurrently should be
  //Taken care of
  upload: function  (req, res) {
  	req.file('files').upload(
    	{dirname:'assets/data/',
    	 maxBytes:500000000},
      function (err, files) {
      if (err){
      	console.log("Error: ",err)
      	return //res.serverError(err); //This probably crashes server? Testing seemed to vary...
      }

    else {
    	if(typeof req.param('dataBase') == 'undefined'){
 			res.send('{status:"error",message:"Database required"}',500);
 			return;
 		}
 		var dataSource = req.param('dataBase')
 		sails.sockets.blast('load_start',"");
    	var currentJob = {};
    	var blastBackData = []
    	if(dataSource === "notReady"){
 			res.send('{status:"error",message:"Database required"}',500);
 			blastBackData.push("Please select a data source.")
			sails.sockets.blast('file_parsed',blastBackData)
			return;	
 		}

    	//Below code sends messages to user that jobs are being run. Need to add code to remove jobs that
    	//Have been ran a long time ago


    	UploadJob.create({filename:files[0].filename,isFinished:false,status:"Started",progress:"Began",source:dataSource}).exec(function(err,job){
    		currentJob = job;
    		
    		
   		/*

		The below block of code occasionally seems to emit a bug where the given file is not properly read
		in. Either change how the given file has it's first character obtained for further processing
		or find what causes bug and look at stopping it.

		I think it has been fixed and was being caused by when fs.close was being ran. Further testing may be
		needed but for now it seems to work and the same error hasn't been seen since the week of the 22nd of
		September 2014

		The purpose of the below block of code is to open the given file for reading.

    	*/


    	var buffer=new Buffer(1)
 		var fs=require('fs')
 		fs.open(files[0].fd,'r',function(err,fd){
 			if(err){
 				//console.log("Error Openning file")
 				UploadJob.update({id:currentJob.id},{isFinished:true,status:"Finished-ERROR"}).exec(function(err,job){
		    		if(err){
		    			console.log(err)
		    		}
		    	})
 				console.log(err)
 				fs.close(fd)
 				blastBackData.push("An error occured with the given file.\nMake sure the file has no problems or try reuploading it.")
 				sails.sockets.blast('file_parsed',blastBackData)
 				return res.json({
				      	message: files.length + ' file(s) failed to upload.',
				        files: files        
				      });
 			}
	 		fs.read(fd, buffer, 0, 1, 0, function(e,l,b){
	 		 if(e){
	 		 	//console.log("Error Reading file")
	 		 	UploadJob.update({id:currentJob.id},{isFinished:true,status:"Finished-ERROR"}).exec(function(err,job){
		    		if(err){
		    			console.log(err)
		    		}
		    	})
	 		 	console.log(e)
	 		 	blastBackData.push("An error occured with the given file.\nMake sure the file has no problems or try reuploading it.")
	 		 	sails.sockets.blast('file_parsed',blastBackData)
	 		 	fs.close(fd)
	 		 }
	 		 else{
			     // res.write(b.toString('utf8',0,l))
			     // console.log("The value: "+b.toString('utf8',0,l))
			     fs.close(fd)
			 }
		    })
		    
	 	})

		/*At this point in the code, the file has been sucessfully read. The code will then check
		to see if the file is a valid weight or class file and continue running.*/

		UploadJob.update({id:currentJob.id},{isFinished:false,status:"Running"}).exec(function(err,job){
    		if(err){
    			console.log(err)
    		}
    	})

    	var terminal = require('child_process').spawn('bash');

        /*

        Manages data written to stdout.
        If bq command ends successfully the code will properly update to indicate as such
        and update the run log

        */
        terminal.stdout.on('data', function (data) {
        	if(typeof data === 'object'){
       			if(data.toString().indexOf("Failure details") > -1){
       				UploadJob.update({id:currentJob.id},{isFinished:true,status:"Finished-ERROR"}).exec(function(err,job){
			    		if(err){
			    			console.log(err)
			    		}
			    	})
					console.log('Ending terminal session.');
					blastBackData = []
					blastBackData.push("The file "+files[0].filename+" is either improperly formated or contains illegal characters. Fix these errors and reupload the file.")
					sails.sockets.blast('file_parsed',blastBackData)
					terminal.stdin.end();
       			}
       			else{
       				console.log(data.toString())
		       		var status = data.toString().split(" Current status: ")
		       		if(status[0].indexOf("Provided Schema does not match Table") > -1){
		       			UploadJob.update({id:currentJob.id},{isFinished:true,status:"Finished-ERROR"}).exec(function(err,job){
				    		if(err){
				    			console.log(err)
				    		}
				    	})
						console.log('Ending terminal session.');
						blastBackData = []
						blastBackData.push("The file "+files[0].filename+" is improperly formated. Fix these errors and reupload the file.")
						sails.sockets.blast('file_parsed',blastBackData)
						terminal.stdin.end();
       			
		       		}
		       		if(status[status.length-1].slice(0,4) === 'DONE'){
		       			sails.sockets.blast('file_parsed',blastBackData);
		       			UploadJob.update({id:currentJob.id},{isFinished:true,status:"Finished-Success"}).exec(function(err,job){
					    		if(err){
					    			console.log(err)
					    		}
					    })
		       		}
		       	}
	       	}
	    });

	    //If something is printed to stderr, this code runs.
	    //Only the bq command should ever cause this to run.
        terminal.stderr.on('data', function (data) {
          console.log('stderr: ' + data);
		  UploadJob.update({id:currentJob.id},{isFinished:true,status:"Finished-ERROR"}).exec(function(err,job){
		    		if(err){
		    			console.log(err)
		    		}
		   })
		});

        //When child processed is killed, this code is ran
        terminal.on('exit', function (code) {
			console.log('child process exited with code ' + code);
		});

		setTimeout(function() {
		    
		    //Check if file is valid
		    if(buffer.toString('utf8',0,1) === 'W' || buffer.toString('utf8',0,1) === 'C'){

			    //Remaining data management done below

			    fs.readFile(files[0].fd, "utf8", function(error, data) {

			    	var lines = data.split('\n')
			    	var dataHolder = []
			    	if(lines[0][0] === 'C'){
			    		if(((lines[0].length - 29)%5) == 0){

				    		var yearFormat = "2013"
				    	}
				    	else{
				    		var yearFormat = "2001"
				    	}
				    }
				    else{
				    	// var lengthTot = (lines[0].length) - 15
				    	// console.log(lines[0].length)
				    	// while(lengthTot >= 34){
				    	// 	lengthTot = lengthTot - 9
				    	// }
				    	// console.log(lengthTot)
				    	// console.log(lines[0][25])
	 			    	// console.log(lines[0][25] >= '0')
				    	// console.log(lines[0][25] <= 'z')
				    	if( (lines[0][22] !== ' ')){
				    		var yearFormat = "2013"
				 
				    	}
				    	else{
				    		var yearFormat = "2001"
				    	}

				    }
				    
			    	//This loop organizes input data for the sql query and later management
			    	var skip = false
			    	if(yearFormat === "2001"){
				    	for(var i = 0;i<lines.length;i++){
				    		//Below checks are to make sure line does not invalidate
				    		//FDA upload format by checking for critical values
				    		if(lines[i][0] === 'C'){
				    			if((lines[i][2] === ' ') || (lines[i][8] === ' ') || (lines[i][9] === ' ') || (lines[i][10] === ' ') || (lines[i][12] === ' ') || (lines[i][14] === ' ') || (lines[i][16] === ' ') || (lines[i][18] === ' ') || (lines[i][33] === ' ') || (lines[i][43] === ' ') || (lines[i][48] === ' ') || (lines[i][53] === ' ') || (lines[i][58] === ' ') || (lines[i][63] === ' ') || (lines[i][68] === ' ') || (lines[i][73] === ' ') || (lines[i][78] === ' ') || (lines[i][83] === ' ') || (lines[i][88] === ' ')){
				    				skip = true
				    				lines.splice(i,1)
				    				i = i - 1
				    			}

				    		}
				    		else if(lines[i][0] === 'W'){
				    			if((lines[i][2] === ' ') || (lines[i][8] === ' ') || (lines[i][9] === ' ') || (lines[i][10] === ' ') || (lines[i][12] === ' ') || (lines[i][14] === ' ') || (lines[i][16] === ' ') || (lines[i][18] === ' ') || (lines[i][20] === ' ')){
				    				skip = true
				    				lines.splice(i,1)
				    				i = i - 1
				    			}

				    		}
				    		if(!skip){
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
				    		skip = false
				    	}
				    }
				    else if(yearFormat === "2013"){
				    	skip = false
				    	for(var i = 0;i<lines.length;i++){
				    		
				    		if(lines[i][0] === 'C'){
				    			if((lines[i][2] === ' ') || (lines[i][8] === ' ') || (lines[i][9] === ' ') || (lines[i][10] === ' ') || (lines[i][11] === '0') || (lines[i][11] === ' ') || (lines[i][14] === ' ') || (lines[i][16] === ' ') || (lines[i][18] === ' ') || (lines[i][20] === ' ') || (lines[i][26] === ' ') || (lines[i][27] === ' ') || (lines[i][32] === ' ') || (lines[i][37] === ' ')){
				    				skip = true
				    				lines.splice(i,1)
				    				i = i - 1
				    			}
				    		}
				    		else if(lines[i][0] === 'W'){
				    			if((lines[i][2] === ' ') || (lines[i][8] === ' ') || (lines[i][9] === ' ') || (lines[i][10] === ' ') || (lines[i][11] === '0') || (lines[i][11] === ' ') || (lines[i][14] === ' ') || (lines[i][16] === ' ') || (lines[i][18] === ' ') || (lines[i][20] === ' ') || (lines[i][31] === ' ') || (lines[i][33] === ' ') || (lines[i][38] === ' ') || (lines[i][42] === ' ') || (lines[i][47] === ' ')){
				    				skip = true
				    				lines.splice(i,1)
				    				i = i - 1
				    			}

				    		}


				    		if(!skip){
					    		if(dataHolder.map(function(el) {return el.key;}).indexOf(lines[i][1]+lines[i][2]+lines[i][3]+lines[i][4]+lines[i][5]+lines[i][6]+lines[i][7]+lines[i][8]+lines[i][11]+lines[i][12]+lines[i][13]+lines[i][14]+lines[i][15]+lines[i][16]) == -1 && (lines[i][0] === 'W' ||lines[i][0] === 'C')){
					    			var object ={
					    						 'state':lines[i][1]+lines[i][2],
					    						 'station':lines[i][3]+lines[i][4]+lines[i][5]+lines[i][6]+lines[i][7]+lines[i][8],
					    						 'year':lines[i][11]+lines[i][12]+lines[i][13]+lines[i][14],
					    						 'month':lines[i][15]+lines[i][16],
					    						 'key':lines[i][1]+lines[i][2]+lines[i][3]+lines[i][4]+lines[i][5]+lines[i][6]+lines[i][7]+lines[i][8]+lines[i][11]+lines[i][12]+lines[i][13]+lines[i][14]+lines[i][15]+lines[i][16]
					    						}
					    			dataHolder.push(object)
				    			}
				    		}
				    	}	
				    }
				    if(buffer.toString('utf8',0,1) === 'W'){
			    		var typeD = "weight"
			    	}
			    	else if(buffer.toString('utf8',0,1) === 'C'){
			    		var typeD = "class"
			    	}

			    	//Below creates a new file for working with awk and sed

					var wstream = fs.createWriteStream(files[0].fd+"_"+currentJob.id,{ flags: 'w',encoding: null,mode: 0666 });
			    	wstream.end();


			    	//when creating new table pass true
			    	//when not creating new table pass false

			    	console.log(yearFormat)
			    	newDataUploadChecker(dataHolder,typeD,lines,fs,files,terminal,currentJob,blastBackData,dataSource,yearFormat)
			    	

				});
			}
			else{
				UploadJob.update({id:currentJob.id},{isFinished:true,status:"Finished-ERROR"}).exec(function(err,job){
		    		if(err){
		    			console.log(err)
		    		}
		    	})
				terminal.stdin.write('rm ' + files[0].fd +'\n');
				terminal.stdin.write('rm ' + files[0].fd+"_"+currentJob.id +'\n');
			    //console.log('Ending terminal session. Invalid File.');
			    blastBackData.push("The file "+files[0].filename+" you have input is invalid. Please select a different file.")
			    sails.sockets.blast('file_parsed',blastBackData);
			    terminal.stdin.end();	
			}
		}, 1500);

       //end file management code
       return res.json({
	      	message: files.length + ' file(s) uploaded successfully!',
	        files: files        
	      });
   		})
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
