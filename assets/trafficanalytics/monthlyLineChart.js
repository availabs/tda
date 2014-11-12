var monthlyLineChart = {
	
	svg:{},

	initMonthlylLineChart:function(elem){
		monthlyLineChart.margin = {top: 5, right: 5, bottom: 10, left:50},
		monthlyLineChart.width = parseInt($('#sectionMAP').width())/2.5 - monthlyLineChart.margin.left - monthlyLineChart.margin.right,
		monthlyLineChart.height = parseInt($('#sectionMAP').width())/2.5 - monthlyLineChart.margin.top - monthlyLineChart.margin.bottom + 100;

		var svg = d3.select(elem).append("svg")
		    .attr("width", monthlyLineChart.width + monthlyLineChart.margin.left + monthlyLineChart.margin.right)
		    .attr("height", monthlyLineChart.height + monthlyLineChart.margin.top + monthlyLineChart.margin.bottom + 30)
		    .attr("id","linegraph")
		  .append("g")
		    .attr("transform", "translate(" + (monthlyLineChart.margin.left) + "," + monthlyLineChart.margin.top + ")");
	},

	//graphData: data to be displayed

	//dataType: type of traffic being displayed

	drawMonthlyLineChart:function(elem,dataType,id,yearS){
		var _URL = '/stations/timeLine/'
		var graphData = [];
		if(yearS !== 'All'){
			yearS = parseInt(yearS) - 2000
		}
		wimXHR.post(_URL,{time:"month",year:yearS,statefips:id},function(error, data) {
			if (error) {
				console.log(error);
        		return;
        	}
        	if(data.rows != undefined){
        		data.rows.forEach(function(row){
					var rowStation = row.f[0].v;
					for(var x = 0;x<rowStation.length;x++){
						if(rowStation[x] === " "){
							rowStation = rowStation.substr(0, x) + '0' + rowStation.substr(x + 1)
						}
					}
					if(getStationIndex(rowStation) == -1) {
						graphData.push({'stationId':rowStation, 'funcCode':row.f[6].v,monthsAll:[0,0,0,0,0,0,0,0,0,0,0,0], monthsAPT:[0,0,0,0,0,0,0,0,0,0,0,0], monthsASU:[0,0,0,0,0,0,0,0,0,0,0,0], monthsATT:[0,0,0,0,0,0,0,0,0,0,0,0]})
						
					}
					graphData[getStationIndex(rowStation)].monthsAll[parseInt(row.f[1].v)-1] = parseInt(row.f[2].v)
					graphData[getStationIndex(rowStation)].monthsAPT[parseInt(row.f[1].v)-1] = parseInt(row.f[3].v)
					graphData[getStationIndex(rowStation)].monthsASU[parseInt(row.f[1].v)-1] = parseInt(row.f[4].v)
					graphData[getStationIndex(rowStation)].monthsATT[parseInt(row.f[1].v)-1] = parseInt(row.f[5].v)
				});
		  	}

				
		var svg = d3.select(elem+" svg");
	    svg.selectAll("g").remove();
		var x = d3.scale.linear()
		    .range([50, monthlyLineChart.width+50]); //For positioning data

		var y = d3.scale.linear()
		    .range([monthlyLineChart.height, 10]); //For positioning data

		var color = d3.scale.category10();
		color.domain(d3.keys(graphData).filter(function(key) { return key; }));

		var color2 = d3.scale.quantize()
			.domain([1,7])
			.range(colorbrewer.Set1[7]);
		
		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");

		//The line function must accept an array as input or it won't work ;_;
		//It creates the line


		var line = d3.svg.line()
		    .interpolate("linear")
		    .x(function(d,i) { return x(i+1); })
		    .y(function(d) { return y(d); });

		var voronoi = d3.geom.voronoi()
		    .x(function(d) { return x(d.xax+1) })
		    .y(function(d) { return y(d.value) })  

		    
		//graphData.sort(compareStations); 

	  x.domain([1,12]);
	  //adjust the y domain based on dataType
	  if(dataType === "All"){
	  
		  y.domain([
			    d3.min(graphData, function(c) { return d3.min(c.monthsAll, function(v) { return v; }); }),
	    		d3.max(graphData, function(c) { return d3.max(c.monthsAll, function(v) { return v; }); })
		  ]);
	  }
	  else if(dataType === "AAPT"){
		  y.domain([
			    d3.min(graphData, function(c) { return d3.min(c.monthsAPT, function(v) { return v; }); }),
	    		d3.max(graphData, function(c) { return d3.max(c.monthsAPT, function(v) { return v; }); })
		  ]);
	  }
	  else if(dataType === "AASU"){
		  y.domain([
			    d3.min(graphData, function(c) { return d3.min(c.monthsASU, function(v) { return v; }); }),
	    		d3.max(graphData, function(c) { return d3.max(c.monthsASU, function(v) { return v; }); })
		  ]);
	  }
	  else if(dataType === "AATT"){
		  y.domain([
			    d3.min(graphData, function(c) { return d3.min(c.monthsATT, function(v) { return v; }); }),
	    		d3.max(graphData, function(c) { return d3.max(c.monthsATT, function(v) { return v; }); })
		  ]);
	  }

		//For x axis, possibly try and find better way to display what text is shown
	 
	    svg.append("g")
	      .attr("class", "x axis")
	      .style("font-size","10px")
	      .attr("transform", "translate(0," + monthlyLineChart.height + ")") //For positioning x axis
	      .call(xAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("x", monthlyLineChart.width)
	      .attr("y", -6)
	      .style("text-anchor", "end")

	    svg.append("g")
	      .attr("class", "y axis")
	      .attr("transform", "translate(50,0)") //For positioning y axis
	      .style("font-size","10px")
	      .call(yAxis)
	    .append("text")
	      .attr("class", "label")
	      .style("font-size","10px")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")

	  var zz = 0;

	  var rect = svg.append("g")
		   .attr("class", "stations")
		   .selectAll("path")
		      .data(graphData)
		    .enter().append("path")
			  .attr("class", function(d){return "stationLine_"+d.stationId})
		      .attr("d", function(d) { if(dataType === "All"){return line(d.monthsAll);} else if(dataType === "AAPT"){return line(d.monthsAPT);} else if(dataType === "AASU"){return line(d.monthsASU);} else if(dataType === "AATT"){return line(d.monthsATT);} })
		      .style("stroke", function(d) { return color2(parseInt(d.funcCode[0])); })
		      .style("fill","none");
	   //console.log(graphData)
	      //Used for dots
		  var focus = svg.append("g")
		      .attr("transform", "translate(-100,-100)")
		      .attr("class", "focus");

		  focus.append("circle")
		      .attr("r", 3.5);

		//Below builds voronoi but needs hover for most important part?
		var temp = []
		for(var h = 0;h<graphData.length;h++){
			if(dataType === "All"){
				for(var hh = 0;hh < graphData[h].monthsAll.length;hh++){
					temp.push({'value':graphData[h].monthsAll[hh],'xax':hh,'graphData':graphData[h]})
				}
			}
			else if(dataType === "AAPT"){
				for(var hh = 0;hh < graphData[h].monthsAPT.length;hh++){
					temp.push({'value':graphData[h].monthsAPT[hh],'xax':hh,'graphData':graphData[h]})
				}
			}
			else if(dataType === "AASU"){
				for(var hh = 0;hh < graphData[h].monthsASU.length;hh++){
					temp.push({'value':graphData[h].monthsASU[hh],'xax':hh,'graphData':graphData[h]})
				}
			}
			else if(dataType === "AATT"){
				for(var hh = 0;hh < graphData[h].monthsATT.length;hh++){
					temp.push({'value':graphData[h].monthsATT[hh],'xax':hh,'graphData':graphData[h]})
				}
			}
		}
		  var voronoiGroup = svg.append("g")
		      .attr("class", "voronoi");

		  voronoiGroup.selectAll("path")
		      .data(voronoi(temp))
		    .enter().append("path")
		      .attr("d", function(d) { if(d != undefined && d.length != 0){return "M" + d.join("L") + "Z"}; })
		      .datum(function(d) { if(d != undefined && d.length != 0){return d.point;} })
		      .on("mouseover", mouseover)
		      .on("mouseout", mouseout)
		      .style("fill","none")
		      .style("pointer-events","all")

		  //Below is hover info

		  //NOTE This data is already formatted in a way so that drawing all dots on hover may actually doable. Probably.

		  function mouseover(d) {
		  	//d3.select(".stationLine_"+d.graphData.stationId).classed("station--hover", true); //Really only used to highlight a line
		    //d.graphData.line.parentNode.appendChild(d.graphData.line); //???
    		$('#map_station_'+d.graphData.stationId).attr('stroke-width','2px');
	  		$('#map_station_'+d.graphData.stationId).attr('stroke','yellow');
    		$('#linegraph path').attr('opacity',0.1);
	  		$('.stationLine_'+d.graphData.stationId).attr('opacity',0.9);
	  		$('.station_'+d.graphData.stationId).attr('opacity',0.1);
	  		d3.select('#map_station_'+d.graphData.stationId)
			  			.style('opacity', 1.0)
			  			.style('background', 'yellow')//#a50026')
			  			.style('z-index', 6);
			var dotData;
			if(dataType === "All"){dotData = d.graphData.monthsAll}
			else if(dataType === "AAPT"){dotData = d.graphData.monthsAPT}
			else if(dataType === "AASU"){dotData = d.graphData.monthsASU}
			else if(dataType === "AATT"){dotData = d.graphData.monthsATT}
			rect.select("rect")
			  .data(dotData)
			.enter().append("circle")
				  .attr("class","dot")
				  .attr("r", 3.5)
				  .attr("cx", function(d,i) { return x(i+1); })
				  .attr("cy", function(d) { return y(d); })
			      .style("fill", function(d,i) {return color(i); }); //Color has no specific functionality for now
	  // 		var info =  "<p class="+d.stationId+">Station: " +d.stationId+
			// 				"<br>Class: "+d.funcCode+
			// 				"</p>";
			// $("#stationInfo").html(info);
		    focus.attr("transform", "translate(" + x(d.xax+1) + "," + y(d.value) + ")"); //What's really used in voronoi dot formation
		  }

		  function mouseout(d) {
		    //d3.select(".stationLine_"+d.graphData.stationId).classed("station--hover", false);
		    d3.select('#map_station_'+d.graphData.stationId)
			  			.style('opacity', 0.66)
			  			.style('z-index', 5)
			  			.style('background', function(d) {
							return (d.properties.type == 'wim' ? '#081d58' : '#d94801');
						});
			svg.selectAll("circle").remove()
    		$('#map_station_'+d.graphData.stationId).attr('stroke-width','none');
	  		$('#map_station_'+d.graphData.stationId).attr('stroke','none');
	  		$('.station_'+d.graphData.stationId).attr('opacity',1);
	  		$('#linegraph path').attr('opacity',1);
		    focus.attr("transform", "translate(-100,-100)");
		  }










	 //  var rect = svg.selectAll(".graph")
	 //      .data(graphData)
	 //    .enter().append("g")
	 //      .attr("class", "g")

	 //   //    var focus = monthlyLineChart.svg.append("g")
		//   //     .attr("transform", "translate(-100,-100)")
		//   //     .attr("class", "focus");

		//   // //creates focus dot on line

		//   // focus.append("circle")
		//   //     .attr("r", 3.5);

	 //    //draws best fit line
	 //    rect.append("path")
		//       .attr("class", function(d){return "stationLine_"+d.stationId})
		//       .attr("d", function(d) { if(dataType === "All"){return line(d.monthsAll);} else if(dataType === "AAPT"){return line(d.monthsAPT);} else if(dataType === "AASU"){return line(d.monthsASU);} else if(dataType === "AATT"){return line(d.monthsATT);} }) //Must be passed an array
		//       .style("stroke", function(d) { return color2(parseInt(d.funcCode[0])); })
		//       .style("fill","none")
		// 	  .on("mouseover",function(d) {
		// 	  		$('#linegraph path').attr('opacity',0.1);
		// 	  		$('.stationLine_'+d.stationId).attr('opacity',0.9)
		// 	  		$('#map_station_'+d.stationId).attr('stroke-width','2px');
		// 	  		$('#map_station_'+d.stationId).attr('stroke','yellow');
		// 	  		var info =  "<p class="+d.stationId+">Station: " +d.stationId+
		// 							"<br>Class: "+dataType+
		// 							"<br>Class Code: "+d.funcCode+
		// 							"</p>";
		// 			//focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
		// 	  		$("#stationInfo").html(info);
		// 	  	})
		// 	  	.on("mouseout",function(d) {
		// 	  		$('#map_station_'+d.stationId).attr('stroke-width','none');
		// 	  		$('#map_station_'+d.stationId).attr('stroke','none');
		// 	  		//focus.attr("transform", "translate(-100,-100)");
		// 	  		$('#linegraph path').attr('opacity',1);
		// 	  		//$('.station_'+d.stationId).attr('opacity',1);
		// 	  		$("#stationInfo").html('');
		// 	  	});


		// //draws dots

		// rect.selectAll("rect")
	 //      .data(function(d) { if(dataType === "All"){return d.monthsAll;} else if(dataType === "AAPT"){return d.monthsAPT;} else if(dataType === "AASU"){return d.monthsASU;} else if(dataType === "AATT"){return d.monthsATT;} })
		// .enter().append("circle")
		// 	  .attr("class","dot")
		// 	  .attr("r", 3.5)
		// 	  .attr("cx", function(d,i) { return x(i+1); })
		// 	  .attr("cy", function(d) { return y(d); })
		//       .style("fill", function() {zz++;return color(Math.floor((zz-1)/12)); });

		 
		}); //end get
		 function getStationIndex(stationID){
		  		return graphData.map(function(el){return el.stationId;}).indexOf(stationID)
		  	}

		
	},

	//Below is the function for drawing hourly data

	drawHourlyLineChart:function(elem,dataType,id,yearS){
		
		URL = '/stations/timeLine/'
		var graphData = []
		if(yearS !== 'All'){
			yearS = parseInt(yearS) - 2000
		}
		wimXHR.post(URL,{time:"hour",year:yearS,statefips:id},function(error, data) {
					if (error) {
	            		console.log(error);
	            		return;
	            	}
	            	if(data.rows != undefined){

	            		data.rows.forEach(function(row){
							var rowStation = row.f[0].v;
							for(var x = 0;x<rowStation.length;x++){
								if(rowStation[x] === " "){
									rowStation = rowStation.substr(0, x) + '0' + rowStation.substr(x + 1)
								}
							}
							if(getStationIndex(rowStation) == -1) {
								graphData.push({'stationId':rowStation, 'funcCode':row.f[6].v,hoursAll:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], hoursAPT:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], hoursASU:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], hoursATT:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]})
								
							}
							graphData[getStationIndex(rowStation)].hoursAll[parseInt(row.f[1].v)] = parseInt(row.f[2].v)
							graphData[getStationIndex(rowStation)].hoursAPT[parseInt(row.f[1].v)] = parseInt(row.f[3].v)
							graphData[getStationIndex(rowStation)].hoursASU[parseInt(row.f[1].v)] = parseInt(row.f[4].v)
							graphData[getStationIndex(rowStation)].hoursATT[parseInt(row.f[1].v)] = parseInt(row.f[5].v)
							

						
						});
				  	}

		var svg = d3.select(elem+" svg");
	    svg.selectAll("g").remove();

		var x = d3.scale.linear()
		    .range([50, monthlyLineChart.width+50]); //For positioning data

		var y = d3.scale.linear()
		    .range([monthlyLineChart.height, 10]); //For positioning data

		var color = d3.scale.category10();
		color.domain(d3.keys(graphData).filter(function(key) { return key; }));

		var color2 = d3.scale.quantize()
			.domain([1,7])
			.range(colorbrewer.Set1[7]);
		
		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");

		//The line function must accept an array as input or it won't work ;_;
		//It creates the line


		var line = d3.svg.line()
		    .interpolate("linear")
		    .x(function(d,i) { return x(i+1); })
		    .y(function(d) { return y(d); });

		var voronoi = d3.geom.voronoi()
		    .x(function(d) { return x(d.xax+1) })
		    .y(function(d) { return y(d.value) })    
		//graphData.sort(compareStations); 

	  x.domain([1,24]);

	  //adjust the y domain based on dataType
	  if(dataType === "All"){
	  
		  y.domain([
			    d3.min(graphData, function(c) { return d3.min(c.hoursAll, function(v) { return v; }); }),
	    		d3.max(graphData, function(c) { return d3.max(c.hoursAll, function(v) { return v; }); })
		  ]);
	  }
	  else if(dataType === "AAPT"){
		  y.domain([
			    d3.min(graphData, function(c) { return d3.min(c.hoursAPT, function(v) { return v; }); }),
	    		d3.max(graphData, function(c) { return d3.max(c.hoursAPT, function(v) { return v; }); })
		  ]);
	  }
	  else if(dataType === "AASU"){
		  y.domain([
			    d3.min(graphData, function(c) { return d3.min(c.hoursASU, function(v) { return v; }); }),
	    		d3.max(graphData, function(c) { return d3.max(c.hoursASU, function(v) { return v; }); })
		  ]);
	  }
	  else if(dataType === "AATT"){
		  y.domain([
			    d3.min(graphData, function(c) { return d3.min(c.hoursATT, function(v) { return v; }); }),
	    		d3.max(graphData, function(c) { return d3.max(c.hoursATT, function(v) { return v; }); })
		  ]);
	  }

	//For x axis, possibly try and find better way to display what text is shown
	 
	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + monthlyLineChart.height + ")") //For positioning x axis
	      .call(xAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("x", monthlyLineChart.width)
	      .attr("y", -6)
	      .style("text-anchor", "end")

	  svg.append("g")
	      .attr("class", "y axis")
	      .attr("transform", "translate(50,0)") //For positioning y axis
	      .style("font-size","10px")
	      .call(yAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")

	  var zz = 0;
	  
	  var rect = svg.append("g")
		   .attr("class", "stations")
		   .selectAll("path")
		      .data(graphData)
		    .enter().append("path")
			  .attr("class", function(d){return "stationLine_"+d.stationId})
		      .attr("d", function(d) { if(dataType === "All"){return line(d.hoursAll);} else if(dataType === "AAPT"){return line(d.hoursAPT);} else if(dataType === "AASU"){return line(d.hoursASU);} else if(dataType === "AATT"){return line(d.hoursATT);} }) //Must be passed an array
		      .style("stroke", function(d) { return color2(parseInt(d.funcCode[0])); })
		      .style("fill","none");
	  // console.log(graphData)
	      //Used for dots
		  var focus = svg.append("g")
		      .attr("transform", "translate(-100,-100)")
		      .attr("class", "focus");

		  focus.append("circle")
		      .attr("r", 3.5);

		//Below builds voronoi but needs hover for most important part?
		var temp = []
		for(var h = 0;h<graphData.length;h++){
			if(dataType === "All"){
				for(var hh = 0;hh < graphData[h].hoursAll.length;hh++){
					temp.push({'value':graphData[h].hoursAll[hh],'xax':hh,'graphData':graphData[h]})
				}
			}
			else if(dataType === "AAPT"){
				for(var hh = 0;hh < graphData[h].hoursAPT.length;hh++){
					temp.push({'value':graphData[h].hoursAPT[hh],'xax':hh,'graphData':graphData[h]})
				}
			}
			else if(dataType === "AASU"){
				for(var hh = 0;hh < graphData[h].hoursASU.length;hh++){
					temp.push({'value':graphData[h].hoursASU[hh],'xax':hh,'graphData':graphData[h]})
				}
			}
			else if(dataType === "AATT"){
				for(var hh = 0;hh < graphData[h].hoursATT.length;hh++){
					temp.push({'value':graphData[h].hoursATT[hh],'xax':hh,'graphData':graphData[h]})
				}
			}
		}
		  var voronoiGroup = svg.append("g")
		      .attr("class", "voronoi");

		  voronoiGroup.selectAll("path")
		      .data(voronoi(temp))
		    .enter().append("path")
		      .attr("d", function(d) { if(d != undefined && d.length != 0){return "M" + d.join("L") + "Z"}; })
		      .datum(function(d) { if(d != undefined && d.length != 0){return d.point;} })
		      .on("mouseover", mouseover)
		      .on("mouseout", mouseout)
		      .style("fill","none")
		      .style("pointer-events","all")

		  //Below is hover info

		  //NOTE This data is already formatted in a way so that drawing all dots on hover may actually doable. Probably.

		  function mouseover(d) {
		  	//d3.select(".stationLine_"+d.graphData.stationId).classed("station--hover", true); //Really only used to highlight a line
		    //d.graphData.line.parentNode.appendChild(d.graphData.line); //???
    		$('#map_station_'+d.graphData.stationId).attr('stroke-width','2px');
	  		$('#map_station_'+d.graphData.stationId).attr('stroke','yellow');
    		$('#linegraph path').attr('opacity',0.1);
	  		$('.stationLine_'+d.graphData.stationId).attr('opacity',0.9);
	  		$('.station_'+d.graphData.stationId).attr('opacity',0.1);
	  		d3.select('#map_station_'+d.graphData.stationId)
			  			.style('opacity', 1.0)
			  			.style('background', 'yellow')//#a50026')
			  			.style('z-index', 6);
			var dotData;
			if(dataType === "All"){dotData = d.graphData.hoursAll}
			else if(dataType === "AAPT"){dotData = d.graphData.hoursAPT}
			else if(dataType === "AASU"){dotData = d.graphData.hoursASU}
			else if(dataType === "AATT"){dotData = d.graphData.hoursATT}
			rect.select("rect")
			  .data(dotData)
			.enter().append("circle")
				  .attr("class","dot")
				  .attr("r", 3.5)
				  .attr("cx", function(d,i) { return x(i+1); })
				  .attr("cy", function(d) { return y(d); })
			      .style("fill", function(d,i) {return color(i); }); //Color has no specific functionality for now
	  // 		var info =  "<p class="+d.stationId+">Station: " +d.stationId+
			// 				"<br>Class: "+d.funcCode+
			// 				"</p>";
			// $("#stationInfo").html(info);
		    //focus.attr("transform", "translate(" + x(d.xax+1) + "," + y(d.value) + ")"); //What's really used in voronoi dot formation
		  }

		  function mouseout(d) {
		    //d3.select(".stationLine_"+d.graphData.stationId).classed("station--hover", false);
		    d3.select('#map_station_'+d.graphData.stationId)
			  			.style('opacity', 0.66)
			  			.style('z-index', 5)
			  			.style('background', function(d) {
							return (d.properties.type == 'wim' ? '#081d58' : '#d94801');
						});
			svg.selectAll("circle").remove()
    		$('#map_station_'+d.graphData.stationId).attr('stroke-width','none');
	  		$('#map_station_'+d.graphData.stationId).attr('stroke','none');
	  		$('.station_'+d.graphData.stationId).attr('opacity',1);
	  		$('#linegraph path').attr('opacity',1);
		    //focus.attr("transform", "translate(-100,-100)");
		  }














	  // var rect = svg.selectAll(".graph")
	  //     .data(graphData)
	  //   .enter().append("g")
	  //     .attr("class", "g")

	   

	    //draws best fit line

	 //    rect.append("path")
		//       .attr("class", function(d){return "stationLine_"+d.stationId})
		//       .attr("d", function(d) { if(dataType === "All"){return line(d.hoursAll);} else if(dataType === "AAPT"){return line(d.hoursAPT);} else if(dataType === "AASU"){return line(d.hoursASU);} else if(dataType === "AATT"){return line(d.hoursATT);} }) //Must be passed an array
		//       .style("stroke", function(d) { return color2(parseInt(d.funcCode[0])); })
		//       .style("fill","none")
		// 	  .on("mouseover",function(d) {
		// 	  		$('#linegraph path').attr('opacity',0.1);
		// 	  		$('.stationLine_'+d.stationId).attr('opacity',0.9);
		// 	  		$('#map_station_'+d.stationId).attr('stroke-width','2px');
		// 	  		$('#map_station_'+d.stationId).attr('stroke','yellow');
		// 	  		var info =  "<p class="+d.stationId+">Station: " +d.stationId+
		// 							"<br>Class: "+dataType+
		// 							"<br>Class Code: "+d.funcCode+
		// 							"</p>";
		// 			//focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
		// 	  		$("#stationInfo").html(info);
		// 	  	})
		// 	  	.on("mouseout",function(d) {
		// 	  		$('#map_station_'+d.stationId).attr('stroke-width','none');
		// 	  		$('#map_station_'+d.stationId).attr('stroke','none');
		// 	  		//focus.attr("transform", "translate(-100,-100)");
		// 	  		$('#linegraph path').attr('opacity',1);
		// 	  		$("#stationInfo").html('');

		// 	  	});


		// //draws dots

		// rect.selectAll("rect")
	 //      .data(function(d) { if(dataType === "All"){return d.hoursAll;} else if(dataType === "AAPT"){return d.hoursAPT;} else if(dataType === "AASU"){return d.hoursASU;} else if(dataType === "AATT"){return d.hoursATT;} })
		// .enter().append("circle")
		// 	  .attr("class","dot")
		// 	  .attr("r", 3.5)
		// 	  .attr("cx", function(d,i) { return x(i+1); })
		// 	  .attr("cy", function(d) { return y(d); })
		//       .style("fill", function() {zz++;return color(Math.floor((zz-1)/24)); });

		 

		 }); //end get
		function getStationIndex(stationID){
			return graphData.map(function(el){return el.stationId;}).indexOf(stationID)
		}

		
	},

}