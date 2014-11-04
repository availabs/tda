var reportTable = {
	init:function(stationID,elem,data,location){
		$(elem).html('')
		$(elem).append('<table id="reportTable" class="table"><thead><tr><th><strong> Yearly Highest '+data+'</strong></th></tr></thead><tbody><tr><th colspan=2><strong>Location: '+location['station_location']+'</strong></th><th colspan=2><strong>Functional Class: '+location['func_class_code']+'</strong></th></tr></tbody></table>')
	},
	drawTable:function(elem,data,order,indexPoint,searchAgain){

		var parsedData = []
		var DailyVol = []
		var total = 0
		var minDate = ""
		var maxDate = ""
		var dir1 = ""
		var dir2 = ""
		var temp = null

		if(searchAgain.length == 0){
			data.rows.forEach(function(row){
					total += parseInt(row.f[6].v)
					if(parseInt(row.f[0].v) < 10){
						row.f[0].v = "0"+row.f[0].v
					}
					if(temp != null){
						//console.log()
						if(temp.f[0].v+'/'+temp.f[1].v+'/'+temp.f[2].v+'/'+temp.f[3].v === row.f[0].v+'/'+row.f[1].v+'/'+row.f[2].v+'/'+row.f[3].v){
							parsedData[parsedData.length-1].HourVol += parseInt(row.f[6].v)
							if(parsedData[parsedData.length-1].PeakHourVol <= parseInt(row.f[6].v)){
								parsedData[parsedData.length-1].PeakHourVol = parseInt(row.f[6].v)
								parsedData[parsedData.length-1].Direction = getDir(parseInt(row.f[5].v))
							}
							parsedData[parsedData.length-1].PerPeakHour = ((parsedData[parsedData.length-1].PeakHourVol/parsedData[parsedData.length-1].HourVol)*100).toFixed(2)
							temp = row
						}
						else{
							parsedData.push({'Date':row.f[1].v+'/'+row.f[2].v+'/'+row.f[0].v,'hour':row.f[3].v,'DoW':getDOW(parseInt(row.f[4].v)),'Direction':getDir(parseInt(row.f[5].v)),'HourVol':parseInt(row.f[6].v),'PeakHourVol':parseInt(row.f[6].v),'PerPeakHour':"100"})	
							temp = row
						}
					}
					else{
						temp = row
						parsedData.push({'Date':row.f[1].v+'/'+row.f[2].v+'/'+row.f[0].v,'hour':row.f[3].v,'DoW':getDOW(parseInt(row.f[4].v)),'Direction':getDir(parseInt(row.f[5].v)),'HourVol':parseInt(row.f[6].v),'PeakHourVol':parseInt(row.f[6].v),'PerPeakHour':"100"})	
					}
					if(indexSearch(row.f[1].v+'/'+row.f[2].v+'/'+row.f[0].v,"Date") == -1){
						DailyVol.push({'Date':row.f[1].v+'/'+row.f[2].v+'/'+row.f[0].v,'Total':parseInt(row.f[6].v)})
					}
					else{
						DailyVol[indexSearch(row.f[1].v+'/'+row.f[2].v+'/'+row.f[0].v,"Date")].Total += parseInt(row.f[6].v)
					}
					if(minDate === ""){
						minDate = {"month":parseInt(row.f[1].v),"day":parseInt(row.f[2].v),"date":row.f[1].v+'/'+row.f[2].v+'/'+row.f[0].v}
					}
					else{
						if(minDate.month >= parseInt(row.f[1].v) && minDate.day >= parseInt(row.f[2].v)){
							minDate = {"month":parseInt(row.f[1].v),"day":parseInt(row.f[2].v),"date":row.f[1].v+'/'+row.f[2].v+'/'+row.f[0].v}
						}
					}
					if(maxDate === ""){
						maxDate = {"month":parseInt(row.f[1].v),"day":parseInt(row.f[2].v),"date":row.f[1].v+'/'+row.f[2].v+'/'+row.f[0].v}
					}
					else{
						if(maxDate.month <= parseInt(row.f[1].v) && maxDate.day <= parseInt(row.f[2].v)){
							maxDate = {"month":parseInt(row.f[1].v),"day":parseInt(row.f[2].v),"date":row.f[1].v+'/'+row.f[2].v+'/'+row.f[0].v}
						}
					}
					if(dir1 === ""){
						dir1 = getDir(parseInt(row.f[5].v))
					}
					else if(parseInt(row.f[5].v) !== dir1){
						dir2 = "/"+getDir(parseInt(row.f[5].v))
					}
			});
		}
		else{
			DailyVol = searchAgain[0]
			parsedData = searchAgain[1]
		}
		if(searchAgain.length > 0){
			var AADT = searchAgain[2].AADT
			minDate = searchAgain[2].minDate
			maxDate = searchAgain[2].maxDate
			dir1 = searchAgain[2].dir1
			dir2 = searchAgain[2].dir2
		}
		else if(DailyVol.length > 0){
			var AADT = parseInt((total/DailyVol.length).toFixed(0))
		}
		else{
			var AADT = 0
		}
		$('#reportTable tbody').append('<tr><th colspan=2><strong>Date Range: '+minDate.date+' - '+maxDate.date+'</strong></th><th colspan=2><strong>Station Direction: '+dir1+dir2+'</strong></th></tr>')
		$(elem).append('<table id="reportTableData" class="table" border="1"><tbody><tr><td rowspan="2" colspan="2" style="vertical-align:bottom;text-align:center;background:#B8B8B8">Date</td><td rowspan="2" style="vertical-align:bottom;text-align:center;background:#B8B8B8">Day of Week</td><td rowspan="2" style="vertical-align:bottom;text-align:right;background:#B8B8B8">AADT</td><td colspan ="2" style="text-align:center;background:#B8B8B8">Daily Data</td><td colspan="4" style="text-align:center;background:#B8B8B8">Peak Hour</td><td colspan="5" style="text-align:center;background:#B8B8B8">Peak Directional Data</td></tr><tr><td style="text-align:right;background:#B8B8B8">Daily Vol</td><td style="text-align:right;background:#B8B8B8">% AADT</td><td style="text-align:right;background:#B8B8B8">Hour</td><td style="text-align:right;background:#B8B8B8">Hr Vol</td><td style="text-align:right;background:#B8B8B8">% Daily Vol</td><td style="text-align:right;background:#B8B8B8">% AADT</td><td style="text-align:center;background:#B8B8B8">Dir</td><td style="text-align:right;background:#B8B8B8">Hr Vol</td><td style="text-align:right;background:#B8B8B8">% Peak Hr</td><td style="text-align:right;background:#B8B8B8">%Daily Vol</td><td style="text-align:right;background:#B8B8B8">% AADT</td></tr></tbody></table>')
		var appendString = ""
		
		if(order === "Days"){
			DailyVol.sort(compareVolDay)
			parsedData.sort(compareVolHour)
			if(indexPoint + 100 > DailyVol.length){
				endPoint = DailyVol.length
			}
			else{
				endPoint = indexPoint + 100
			}
			for(var x = 0+indexPoint;x<endPoint;x++){
				appendString = appendString + '<tr><td style="background:#B8B8B8">'+(x+1)+
											  '</td><td>'+DailyVol[x].Date+
											  '</td><td>'+parsedData[indexSearch(DailyVol[x].Date,"Day")].DoW+
											  '</td><td>'+AADT+
											  '</td><td>'+DailyVol[x].Total+
											  '</td><td>'+((DailyVol[x].Total/AADT)*100).toFixed(2)+
											  '%</td><td>'+parsedData[indexSearch(DailyVol[x].Date,"Day")].hour+
											  '</td><td>'+parsedData[indexSearch(DailyVol[x].Date,"Day")].HourVol+
											  '</td><td>'+((parsedData[indexSearch(DailyVol[x].Date,"Day")].HourVol/DailyVol[x].Total)*100).toFixed(2)+
											  '%</td><td>'+((parsedData[indexSearch(DailyVol[x].Date,"Day")].HourVol/AADT)*100).toFixed(2)+
											  '%</td><td>'+parsedData[indexSearch(DailyVol[x].Date,"Day")].Direction+
											  '</td><td>'+parsedData[indexSearch(DailyVol[x].Date,"Day")].PeakHourVol+
											  '</td><td>'+parsedData[indexSearch(DailyVol[x].Date,"Day")].PerPeakHour+
											  '%</td><td>'+((parsedData[indexSearch(DailyVol[x].Date,"Day")].PeakHourVol/DailyVol[x].Total)*100).toFixed(2)+
											  '%</td><td>'+((parsedData[indexSearch(DailyVol[x].Date,"Day")].PeakHourVol/AADT)*100).toFixed(2)+
											  '</td></tr>'
			}
		}
		else{
			parsedData.sort(compareVolHour)
			if(indexPoint + 100 > parsedData.length){
				endPoint = parsedData.length
			}
			else{
				endPoint = indexPoint + 100
			}
			for(var x = 0+indexPoint;x<endPoint;x++){
				appendString = appendString + '<tr><td style="background:#B8B8B8">'+(x+1)+
											  '</td><td>'+parsedData[x].Date+
											  '</td><td>'+parsedData[x].DoW+
											  '</td><td>'+AADT+
											  '</td><td>'+DailyVol[indexSearch(parsedData[x].Date,"Date")].Total+
											  '</td><td>'+((DailyVol[indexSearch(parsedData[x].Date,"Date")].Total/AADT)*100).toFixed(2)+
											  '%</td><td>'+parsedData[x].hour+
											  '</td><td>'+parsedData[x].HourVol+
											  '</td><td>'+((parsedData[x].HourVol/DailyVol[indexSearch(parsedData[x].Date,"Date")].Total)*100).toFixed(2)+
											  '%</td><td>'+((parsedData[x].HourVol/AADT)*100).toFixed(2)+
											  '%</td><td>'+parsedData[x].Direction+
											  '</td><td>'+parsedData[x].PeakHourVol+
											  '</td><td>'+parsedData[x].PerPeakHour+
											  '%</td><td>'+((parsedData[x].PeakHourVol/DailyVol[indexSearch(parsedData[x].Date,"Date")].Total)*100).toFixed(2)+
											  '%</td><td>'+((parsedData[x].PeakHourVol/AADT)*100).toFixed(2)+
											  '</td></tr>'
			}
		}
		
		$("#reportTableData tbody").append(appendString)
		if(searchAgain.length == 0){
			var returnArray = []
			returnArray.push(DailyVol)
			returnArray.push(parsedData)
			returnArray.push({"AADT":AADT,"Year":"","minDate":minDate,"maxDate":maxDate,"dir1":dir1,"dir2":dir2})
			return returnArray
		}
		else{
			return
		}

		function getDir(dir){
		  if(dir == 0){
		    return "EW/SENW"
		  }
		  else if(dir == 1){
		    return "North"
		  }
		  else if(dir == 2){
		    return "Northeast"
		  }
		  else if(dir == 3){
		    return "East"
		  }
		  else if(dir == 4){
		    return "Southeast"
		  }
		  else if(dir == 5){
		    return "South"
		  }
		  else if(dir == 6){
		    return "Southwest"
		  }
		  else if(dir == 7){
		    return "West"
		  }
		  else if(dir == 8){
		    return "Northwest"
		  }
		  else{
		    return "NS/NESW"
		  }
		}

		function getDOW(day){
			if(day == 1){
				return 'Sunday'
			}
			else if(day == 2){
				return 'Monday'
			}
			else if(day == 3){
				return 'Tuesday'
			}
			else if(day == 4){
				return 'Wednesday'
			}
			else if(day == 5){
				return 'Thursday'
			}
			else if(day == 6){
				return 'Friday'
			}
			else if(day == 7){
				return 'Saturday'
			}
		}

		function indexSearch(index,kind){
			if(kind === "Date"){
				return DailyVol.map(function(el) {return el.Date;}).indexOf(index)	
			}
			else if(kind === "Day"){
				return parsedData.map(function(el) {return el.Date;}).indexOf(index)
			}
		}
		function compareVolDay(a, b) {
			return b.Total - a.Total
		}
		function compareVolHour(a, b) {
			return b.HourVol - a.HourVol 
		}
	}
	
}