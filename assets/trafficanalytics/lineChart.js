var lineChart = {
	
	svg:{},

	initlineChart:function(elem){
		lineChart.margin = {top: 5, right: 5, bottom: 10, left:50},
		lineChart.width = parseInt($(elem).width()) - lineChart.margin.left - lineChart.margin.right,
		lineChart.height = parseInt($(elem).width()*0.75) - lineChart.margin.top - lineChart.margin.bottom;

		lineChart.svg = d3.select(elem).append("svg")
		    .attr("width", lineChart.width + lineChart.margin.left + lineChart.margin.right)
		    .attr("height", lineChart.height + lineChart.margin.top + lineChart.margin.bottom)
		    .attr("id","linegraph")
		  .append("g")
		    .attr("transform", "translate(" + lineChart.margin.left + "," + lineChart.margin.top + ")");


		

		
	},

	//graphData: data to be displayed

	//dataType: whether to display count or percent

	drawlineChart:function(elem,graphData,dataType){
		var x = d3.scale.linear()
		    .range([50, lineChart.width+50]);

		var y = d3.scale.linear()
		    .range([lineChart.height, 0]);

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
		    //.clipExtent([[-lineChart.margin.left, -lineChart.margin.top], [lineChart.width + lineChart.margin.right, lineChart.height + lineChart.margin.bottom]]);

      x.domain([1,12]);

	  //adjust the y domain based on dataType
	  if(dataType === "count"){
		  y.domain([
			    d3.min(graphData, function(c) { return d3.min(c.avgOverWeight, function(v) { return v; }); }),
	    		d3.max(graphData, function(c) { return d3.max(c.avgOverWeight, function(v) { return v; }); })
		  ]).nice();
		}
	  else if(dataType === "percent"){
		  y.domain([
		    d3.min(graphData, function(c) { return d3.min(c.perOverWeight, function(v) { return v; }); }),
	    	d3.max(graphData, function(c) { return d3.max(c.perOverWeight, function(v) { return v; }); })
		  ]).nice();	
	  }
	  var svg = d3.select(elem+" svg");
	    svg.selectAll("g").remove();
	    svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + lineChart.height + ")")
	      .call(xAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("x", lineChart.width)
	      .attr("y", -6)
	      .style("text-anchor", "end")

	  svg.append("g")
	      .attr("class", "y axis")
	      .attr("transform", "translate(" + (lineChart.margin.left) + "," + lineChart.margin.top + ")")
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
			  .attr("d", function(d) { d.line = this; if(dataType === "count"){return line(d.avgOverWeight);} else{return line(d.perOverWeight);} }) //Must be passed an array
			  .style("stroke", function(d) { return color2(parseInt(d.funcCode[0])); })
			  .style("fill","none")		      

	      //Used for dots
		  var focus = svg.append("g")
		      .attr("transform", "translate(-100,-100)")
		      .attr("class", "focus");

		  focus.append("circle")
		      .attr("r", 3.5);

		//Below builds voronoi but needs hover for most important part?
		var temp = []
		for(var h = 0;h<graphData.length;h++){
			if(dataType === "count"){
				for(var hh = 0;hh < graphData[h].avgOverWeight.length;hh++){
					temp.push({'value':graphData[h].avgOverWeight[hh],'xax':hh,'graphData':graphData[h]})
				}
			}
			else{
				for(var hh = 0;hh < graphData[h].perOverWeight.length;hh++){
					temp.push({'value':graphData[h].perOverWeight[hh],'xax':hh,'graphData':graphData[h]})
				}
			}
		}
		  //console.log(temp)
		  //console.log(voronoi(temp))
		  //console.log(voronoi(graphData))

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
			if(dataType === "count"){dotData = d.graphData.avgOverWeight}
			else if(dataType === "percent"){dotData = d.graphData.perOverWeight}
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

	    //draws best fit line

	    // rect.append("path")
		   //    .attr("class", function(d){return "stationLine_"+d.stationId})
		   //    .attr("d", function(d) { if(dataType === "count"){return line(d.avgOverWeight);} else{return line(d.perOverWeight);} }) //Must be passed an array
		   //    .style("stroke", function(d) { return color2(parseInt(d.funcCode[0])); })
		   //    .style("fill","none")
			  // .on("mouseover",function(d) {
			  // 		$('#linegraph path').attr('opacity',0.1);
			  // 		$('.stationLine_'+d.stationId).attr('opacity',0.9);
			  // 		$('#map_station_'+d.stationId).attr('stroke-width','2px');
			  // 		$('#map_station_'+d.stationId).attr('stroke','yellow');
			  // 		var info =  "<p class="+d.stationId+">Station: " +d.stationId+
					// 				"<br>Class: "+d.funcCode+
					// 				"</p>";
					// //focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
			  // 		$("#stationInfo").html(info);
			  // 	})
			  // 	.on("mouseout",function(d) {
			  // 		$('#map_station_'+d.stationId).attr('stroke-width','none');
			  // 		$('#map_station_'+d.stationId).attr('stroke','none');
			  // 		//focus.attr("transform", "translate(-100,-100)");
			  // 		$('#linegraph path').attr('opacity',1);
			  // 		$("#stationInfo").html('');
			  // 	});

		
		
	},
}