var tonageGraph ={
	svg:{},
	

	initTonageGraph:function(elem){

		tonageGraph.margin = {top: 5, right: 5, bottom: 10, left:50},
		tonageGraph.width = parseInt($(elem).width()) - tonageGraph.margin.left - tonageGraph.margin.right,
		tonageGraph.height = parseInt($(elem).width()*0.3) - tonageGraph.margin.top - tonageGraph.margin.bottom;

		tonageGraph.svg = d3.select(elem).append("svg")
		    .attr("width", tonageGraph.width + tonageGraph.margin.left + tonageGraph.margin.right)
		    .attr("height", tonageGraph.height + tonageGraph.margin.top + tonageGraph.margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + tonageGraph.margin.left + "," + tonageGraph.margin.top + ")");

	},
	/*

	The draw graph function has the following parameter conditions:
	graphData: Data to by organized in graph
	classT: set this flag to the string class when you want to display class data
	
	PST: These four boolean flags are used in conjunction with the kind of data
	you wish to display. The first element is used if you want to display the total data.
	the second element is used for passenger data. The third element is used for single
	value data. The last element is used for Tractor trailer data
	
	year: Year accepts an array of at most size two. If this parameter
	is left empty(undefined) than the code will run as normal. If the first
	element is given a two character string that represents a year(such as 09
	or 11) then the code will only display data for that specific year. If the
	second element of the array exists and it is a valid year, and the given data
	has station data for both year[0] and year[1] then the displayed graph will
	be based off of the total change between the two.

	

	*/



	drawtonageGraph:function(elem,graphData){
		var output = [];
		if(graphData != null){
			if(graphData.rows != undefined){
				graphData.rows.forEach(function(row){

				        var totalTrucks = parseInt(row.f[3].v) + parseInt(row.f[4].v) + parseInt(row.f[5].v) + parseInt(row.f[6].v) + parseInt(row.f[7].v) + parseInt(row.f[8].v) + parseInt(row.f[9].v) + parseInt(row.f[10].v) + parseInt(row.f[0].v) + parseInt(row.f[1].v) + parseInt(row.f[2].v)
				        if(output.map(function(el) {return el.stationId;}).indexOf(row.f[11].v) == -1) {
				        	var item = {}
				        	item.numTrucks = totalTrucks;
					        item.stationId = row.f[11].v;
					        item.count = 1
					        item.avg = 0
				            output.push(item);
				        }
				        else{
				        	output[output.map(function(el) {return el.stationId;}).indexOf(row.f[11].v)].numTrucks += totalTrucks
				        	output[output.map(function(el) {return el.stationId;}).indexOf(row.f[11].v)].count++
				        }
				  });
				}
			}
		
		for(var i = 0;i<output.length;i++){
			output[i].avg = output[i].numTrucks/output[i].count
		}
	/*Below Block of code is used for making a graph that displays data based on year*/
		var x = d3.scale.ordinal()
		    .rangeRoundBands([50, (tonageGraph.width+50)], 0.1);

		var y = d3.scale.linear()
		    .rangeRound([tonageGraph.height,0]);

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left")
		var temp = 0
		var flagA = false
		var flagB = false
		var zz = 0;

		/*

		The following block of code is used to organize the input data based on the flags
		given in the PST array and whether data for a specific year or a data comparison
		for two specific years should be done.

		*/

		// if(year.length == 2){
		// 	for(var z = 0;z<graphData.length;z++){
		// 		if(PST != undefined){
		// 			flagA = false
		// 			flagB = false
		// 			if( graphData[z].years.length < 2){
		// 					graphData.splice(z,1)
		// 					z--
		// 			}
		// 			else{
		// 				for(var count = 0;count<graphData[z].years.length;count++){
		// 					if(graphData[z].years[count].year === year[0]){
		// 						flagA = true			
		// 					}

		// 					if(graphData[z].years[count].year === year[1]){
		// 						flagB = true
		// 					}
							
		// 				}
		// 				if(!(flagA) && !(flagB)){
		// 					graphData.splice(z,1)
		// 				}
		// 			}
		// 		}
		// 	}
		// }

		// for(var z = 0;z<graphData.length;z++){
		// 	if(PST != undefined){
		// 		if(PST[0]){
		// 			flagA = false
		// 			flagB = false
		// 			if( year.length == 0 || year == undefined){
		// 				graphData[z].AAPT = totalAADT(graphData[z].years,"APT")
		// 			}
		// 			else{
		// 				for(var count = 0;count<graphData[z].years.length;count++){
		// 					if(graphData[z].years[count].year === year[0]){
		// 						temp = graphData[z].years[count].APT
		// 						flagA = true			
		// 					}

		// 					if(year.length > 1){
								
		// 						if(graphData[z].years[count].year === year[1]){
		// 							graphData[z].AAPT = graphData[z].years[count].APT
		// 							flagB = true
		// 						}
		// 					}
		// 				}
		// 				if(flagA && flagB){
		// 					if(temp != 0){
		// 						graphData[z].AAPT = temp - graphData[z].AAPT
		// 						graphData[z].AAPT = graphData[z].AAPT/temp
		// 						graphData[z].AAPT = graphData[z].AAPT * 100
		// 					}
		// 					else{
		// 						graphData[z].AAPT = 0
		// 					}	
		// 				}
						
		// 				else if((flagA && year.length == 1) || year.length == 0){
		// 					graphData[z].AAPT = temp
		// 				}
		// 			}
		// 		}
		// 		if(PST[1]){
		// 			flagA = false
		// 			flagB = false
		// 			if( year == undefined || year.length == 0){
		// 				graphData[z].AASU = totalAADT(graphData[z].years,"ASU")
		// 			}
		// 			else{
		// 				for(var count = 0;count<graphData[z].years.length;count++){
		// 					if(graphData[z].years[count].year === year[0]){
		// 						temp = graphData[z].years[count].ASU
		// 						flagA = true			
		// 					}

		// 					if(year.length > 1){
		// 						if(graphData[z].years[count].year === year[1]){
		// 							graphData[z].AASU = graphData[z].years[count].ASU
		// 							flagB = true
		// 						}
		// 					}
		// 				}
		// 				if(flagA && flagB){
		// 					if(temp != 0){
		// 						graphData[z].AASU = temp - graphData[z].AASU
		// 						graphData[z].AASU = graphData[z].AASU/temp
		// 						graphData[z].AASU = graphData[z].AASU * 100
		// 					}
		// 					else{
		// 						graphData[z].AASU = 0
		// 					}
							
		// 				}
		// 				else if((flagA && year.length == 1) || year.length == 0){
		// 					graphData[z].AASU = temp
		// 				}
		// 			}
		// 		}
		// 		if(PST[2]){
		// 			flagA = false
		// 			flagB = false
		// 			if( year == undefined || year.length == 0){
		// 				graphData[z].AATT = totalAADT(graphData[z].years,"ATT")
		// 			}
		// 			else{
		// 				for(var count = 0;count<graphData[z].years.length;count++){
		// 					if(graphData[z].years[count].year === year[0]){
		// 						temp = graphData[z].years[count].ATT
		// 						flagA = true			
		// 					}

		// 					if(year.length > 1){
		// 						if(graphData[z].years[count].year === year[1]){
		// 							graphData[z].AATT = graphData[z].years[count].ATT
		// 							flagB = true
		// 						}
		// 					}
		// 				}
		// 				if(flagA && flagB){
		// 					if(temp != 0){
		// 						graphData[z].AATT = temp - graphData[z].AATT
		// 						graphData[z].AATT = graphData[z].AATT/temp
		// 						graphData[z].AATT = graphData[z].AATT * 100
		// 					}
		// 					else{
		// 						graphData[z].AATT = 0
		// 					}
							
		// 				}
		// 				else if((flagA && year.length == 1) || year.length == 0){
		// 					graphData[z].AATT = temp
		// 				}
		// 			}
		// 		}
		// 	}
		// 	var AAPTS = true
		// 	var AASUS = true
		// 	var AATTS = true

		// 	if(graphData[z].AAPT < 0){
		// 		AAPTS = false
		// 	}
		// 	if(graphData[z].AASU < 0){
		// 		AASUS = false
		// 	}
		// 	if(graphData[z].AATT < 0){
		// 		AATTS = false
		// 	}

		// 	graphData[z].heights[0].y1 = graphData[z].AAPT


		// 	if(AAPTS == AASUS){
		// 		graphData[z].heights[1].y0 = graphData[z].heights[0].y1
		// 	}
		// 	else{
		// 		graphData[z].heights[1].y0 = 0.0	
		// 	}
		// 	if(graphData[z].heights[1].y0 == 0.0){
		// 		graphData[z].heights[1].y1 = graphData[z].AASU
		// 	}
		// 	else{
		// 		graphData[z].heights[1].y1 = graphData[z].heights[0].y1 + graphData[z].AASU	
		// 	}



		// 	if(AATTS == AASUS){
		// 		graphData[z].heights[2].y0 = graphData[z].heights[1].y1
		// 	}
		// 	else if(AATTS == AAPTS){
		// 		graphData[z].heights[2].y0 = graphData[z].heights[0].y1
		// 	}
		// 	else{
		// 		graphData[z].heights[2].y0 = 0.0
		// 	}
		// 	if(graphData[z].heights[2].y0 == 0.0){
		// 		graphData[z].heights[2].y1 = graphData[z].AATT
		// 	}
		// 	else if(AATTS == AASUS){
		// 		graphData[z].heights[2].y1 = graphData[z].heights[1].y1 + graphData[z].AATT
		// 	}
		// 	else if(AATTS == AAPTS){
		// 		graphData[z].heights[2].y1 = graphData[z].heights[0].y1 + graphData[z].AATT	
		// 	}
			
		// } //End For loop



		output.sort(compareStations); 
		x.domain(output.map(function(d,i) { return output[i].stationId; }));
		y.domain([0, d3.max(output, function(d,i) { return output[i].avg; })]);
		
		

		var color = d3.scale.quantize()
	        .domain([d3.min(output, function(d,i) { return output[i].avg; }), d3.max(output, function(d,i) { return output[i].avg; })])
	        .range(colorbrewer.RdYlGn[11]);
	    var svg = d3.select(elem+" svg");
	    svg.selectAll("g").remove();
	    svg.append("g")
	      .attr("class", "y axis")
	      .style("font-size","10px")
	      .attr("transform", "translate(" + (tonageGraph.margin.left) + "," + tonageGraph.margin.top + ")")
		  .call(yAxis)
		.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("AADTonage");

		var rect =svg.selectAll("rect");
			rect.remove();
			rect =svg.selectAll("rect")
		  		.data(output);
		rect.enter().append("rect")
		  	.attr("class",function(d,i) { return "station_"+d.stationId})
		  	.attr("x", function(d,i) { return x(d.stationId); })
		  	.attr("width", x.rangeBand())
		  	.attr("y", function(d,i) { return y(d.avg); })
		  	.attr("style", function(d,i) { return  "fill:"+color(d.avg)+";"; })
		  	.attr("height", function(d,i) { if(tonageGraph.height - y(d.avg) == 0){return 1}; return tonageGraph.height - y(d.avg); });

		rect.on("click",function(d,i) { window.location ="/station/wim/"+ d.stationId; })
		  	.on("mouseover",function(d,i) {
		  		d3.select('#map_station_'+d.stationId)
			  			.style('opacity', 1.0)
			  			.style('background', 'yellow')//#a50026')
			  			.style('z-index', 6);
		  		$(".station_"+d.stationId).attr('opacity',0.5);
		  		$('#linegraph path').attr('opacity',0.1);
			  	$('.stationLine_'+d.stationId).attr('opacity',0.9);
		  		$('#map_station_'+d.stationId).attr('stroke-width','2px');
		  		$('#map_station_'+d.stationId).attr('stroke','yellow');
			  		var info =  "<p class="+d.stationId+">Station: " +d.stationId+
								//"<br>Number of "+displayType+"s of data: "+graphData[i].years.length+
								"<br>Avg Tonage: "+d.avg+
								//"<br>Percent overweight: "+d.avg+
								"</p>";
		  		$("#stationInfo").html(info);
		  		//$("#stationInfo").show();
		  	})
		  	.on("mouseout",function(d,i) {
		  		d3.select('#map_station_'+d.stationId)
			  			.style('opacity', 0.66)
			  			.style('z-index', 5)
			  			.style('background', function(d) {
							return (d.properties.type == 'wim' ? '#081d58' : '#d94801');
						});
		  		$('#map_station_'+d.stationId).attr('stroke-width','none');
		  		$('#map_station_'+d.stationId).attr('stroke','none');
		  		$(".station_"+d.stationId).attr('opacity',1);
		  		$('#linegraph path').attr('opacity',1);
		  		$("#stationInfo").html('');
		  		//$("#stationInfo").hide();
		  	});
		


		// x.domain(graphData.map(function(d,i) { return graphData[i].stationId; }));
		// if(year.length < 2){
		// 	y.domain([d3.min(graphData, function(d,i) { return graphData[i].heights[2].y1; }), d3.max(graphData, function(d,i) { return graphData[i].heights[2].y1; })]);
		// }
		// else{
		// 	y.domain([d3.min(graphData, function(d,i) { return d3.min(graphData[i].heights,function(d,i){return d.y1}) }),d3.max(graphData, function(d,i) { return d3.max(graphData[i].heights,function(d,i){return d.y1}) })]);
		// 	//console.log(y.domain())
		// }
		// //y.domain(d3.extent(function(d,i) { return graphData[i].heights[2].y1; })).nice();

		// var svg = d3.select(elem+" svg");
	 //    svg.selectAll("g").remove();

		// svg.append("g")
		//   .attr("transform", "translate(" + tonageGraph.margin.left + "," + tonageGraph.margin.top + ")")
		//   .attr("class", "y axis")
		//   .style("font-size","10px")
		//   .call(yAxis)
		// .append("text")
		//   .attr("transform", "rotate(-90)")
		//   .attr("y", 6)
		//   .attr("dy", ".71em")
		//   .style("font-size","10px")
		//   .style("text-anchor", "end")
		//   .text("AAADT");

		// //Below clears out previous graph data

		// var rect2 =svg.selectAll("rect")
		// 		 rect2.remove();
		
		// //Below is where color functions are created for coloring the bars

		// var colorP = d3.scale.quantize()
	 //        .domain([d3.min(graphData, function(d,i) {  return graphData[i].AAPT; }), d3.max(graphData, function(d,i) { return graphData[i].AAPT; })])
	 //        .range(colorbrewer.RdYlGn[11]);
	 //    var colorS = d3.scale.quantize()
	 //        .domain([d3.min(graphData, function(d,i) {  return graphData[i].AASU; }), d3.max(graphData, function(d,i) { return graphData[i].AASU; })])
	 //        .range(colorbrewer.RdYlGn[11]);
	 //    var colorT = d3.scale.quantize()
	 //        .domain([d3.min(graphData, function(d,i) { return graphData[i].AATT; }), d3.max(graphData, function(d,i) { return graphData[i].AATT; })])
	 //        .range(colorbrewer.RdYlGn[11]);

		// var rect = svg.selectAll(".graph")
	 //      .data(graphData)
	 //    .enter().append("g")
	 //      .attr("class", "g")
	 //      .attr("transform", "translate(" + tonageGraph.margin.left + "," + tonageGraph.margin.top + ")")
		  
		// rect.selectAll("rect")
	 //      .data(function(d) { return d.heights; })
	 //    .enter().append("rect")
		// 	  	//.attr("class","enter")
		// 	  	.attr("class",function(d,i,zz) { return "station_"+graphData[zz].stationId})
		// 	  	//Below is where bar is displayed on x axis
		// 	  	.attr("x", function(d,i) { if(i==0){++zz;}; return x(graphData[zz-1].stationId); })
		// 	  	//Below is the width of the bar
		// 	  	.attr("width", x.rangeBand())
		// 	  	//Below two values are used to set the height of the bar and make sure it displays upside down properly
		// 		.attr("y", function(d,i) { if(d.y1 < 0){return y(d.y0)};return y(Math.max(0,d.y1)); })
		// 	  	.attr("height", function(d,i) {zz = 0; return Math.abs(y(d.y0) - y(d.y1)); })
		// 	  	//Below is used to set the color of the bar based on the data being examined.
		// 	  	.attr("style", function(d,i,zz) { 
		// 	  		if(i==0){return  "fill:"+colorP(graphData[zz].AAPT)+";";}
		// 	  		else if(i==1){return  "fill:"+colorS(graphData[zz].AASU)+";";}
		// 	  		else {return  "fill:"+colorT(graphData[zz].AATT)+";";} 
		// 	  	})
		// 	  	.on("click",function(d,i,zz) { window.location ="#/station/class/"+ graphData[zz].stationId; })
		// 	  	.on("mouseover",function(d,i,zz) {
		// 	  		d3.select('#map_station_'+graphData[zz].stationId)
		// 	  			.style('opacity', 1.0)
		// 	  			.style('background', 'yellow')//#a50026')
		// 	  			.style('z-index', 6);
		// 	  		$('.station_'+graphData[zz].stationId).attr('opacity',0.5);
		// 	  		$('#linegraph path').attr('opacity',0.1);
		// 	  		$('.stationLine_'+graphData[zz].stationId).attr('opacity',0.9);
		// 	  		$('#map_station_'+graphData[zz].stationId).attr('stroke-width','2px');
		// 	  		$('#map_station_'+graphData[zz].stationId).attr('stroke','yellow');
		// 	  		if(classT !== "class"){
		// 		  		var info =  "<p class="+graphData[i].stationId+">Station: " +graphData[i].stationId+
		// 							"<br> Number of years of data: "+graphData[i].years.length+
		// 							"<br>ACompleteness: "+totalAADT(graphData[i].years,"percent")+
		// 							"<br>AAADT: "+totalAADT(graphData[i].years)+
		// 							"</p>";
		// 			}
		// 			else{
		// 				var info = "<p class="+graphData[zz].stationId+">Station: " +graphData[zz].stationId;
		// 				if(year == undefined || year.length == 0){
		// 					info = info+"<br> Number of years of data: "+graphData[zz].years.length
		// 				}
		// 				else if(year.length == 1){
		// 					info = info+"<br> Year of data: 20"+year[0]
		// 				}
		// 				else{
		// 					info = info+"<br> Years compared: "+year[0] + " VS " + year[1]
		// 				}
		// 				if(year.length == 2){
		// 					info = info +"<br>ADT: "+totalAADT(graphData[zz].years,"class");
		// 					if(i == 0){
		// 						info = info+"<br>% Change APT: "+graphData[zz].AAPT+"</p>"
		// 					}
		// 					else if(i == 1){
		// 						info = info+"<br>% ASU: "+graphData[zz].AASU+"</p>"
		// 					}
		// 					else{
		// 						info = info+"<br>% ATT: "+graphData[zz].AATT+"</p>"
		// 					}
		// 				}
		// 				else{
		// 					info = info +"<br> ADT: "+totalAADT(graphData[zz].years,"class");
		// 					if(i == 0){
		// 						info = info+"<br> APT: "+graphData[zz].AAPT+"</p>"
		// 					}
		// 					else if(i == 1){
		// 						info = info+"<br> ASU: "+graphData[zz].AASU+"</p>"
		// 					}
		// 					else{
		// 						info = info+"<br> ATT: "+graphData[zz].AATT+"</p>"
		// 					}	
		// 				}

		// 			}

		// 	  		$("#stationInfo").html(info);
		// 	  		//$("#stationInfo").show();
		// 	  	})
		// 	  	.on("mouseout",function(d,i,zz) {
		// 	  		d3.select('#map_station_'+graphData[zz].stationId)
		// 	  			.style('opacity', 0.66)
		// 	  			.style('z-index', 5)
		// 	  			.style('background', function(d) {
		// 					return (d.properties.type == 'wim' ? '#081d58' : '#d94801');
		// 				});
		// 	  		$('#map_station_'+graphData[zz].stationId).attr('stroke-width','none');
		// 	  		$('#map_station_'+graphData[zz].stationId).attr('stroke','none');
		// 	  		$('#linegraph path').attr('opacity',1);
		// 	  		$('.station_'+graphData[zz].stationId).attr('opacity',1);
		// 	  		$("#stationInfo").html('');
		// 	  		//$("#stationInfo").hide();
		// 	  	});
		
		// //Collects various forms of average trafic data.

		// function totalAADT(arr,check){
		// 	var total = 0;

		// 	for(var i = 0;i<arr.length;i++){
		// 		if(check === "APT"){total = total+arr[i].APT}
		// 		else if(check === "ASU"){total = total+arr[i].ASU}
		// 		else if(check === "ATT"){total = total+arr[i].ATT}
		// 		else if(check === "class"){total = total+arr[i].ADT}	
		// 		else if(classT === "class"){total = total + arr[i].ADT;}
		// 		else if(typeof check === 'undefined'){ total = total + arr[i].AADT; }
		// 		else{ total = total + arr[i].percent; }
		// 	}

		// 	total = total / arr.length;
		// 	return total;
		// }

		// //Is used by the sorting function to sort given values
		
		function compareStations(a, b) {
	   		return Math.abs(Math.abs(a.avg)) - Math.abs(Math.abs(b.avg))
		}	
	}
	 
}