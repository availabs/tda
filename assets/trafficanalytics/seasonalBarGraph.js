var seasonalBarGraph = {
	
	svg:{},

	initseasonalBarGraph:function(elem,container){
		seasonalBarGraph.margin = {top: 30, right: 10, bottom: 10, left: 10}
		seasonalBarGraph.width = parseInt($(elem).width())*10 - seasonalBarGraph.margin.left - seasonalBarGraph.margin.right
		seasonalBarGraph.height = parseInt($(elem).width())*10 - seasonalBarGraph.margin.top - seasonalBarGraph.margin.bottom;
		var svg = d3.select(elem).append("svg")
		    .attr("width", seasonalBarGraph.width + seasonalBarGraph.margin.left + seasonalBarGraph.margin.right)
		    .attr("height", seasonalBarGraph.height + seasonalBarGraph.margin.top + seasonalBarGraph.margin.bottom + 50)
		  .append("g")
		    .attr("transform", "translate(" + seasonalBarGraph.margin.left + "," + seasonalBarGraph.margin.top + ")");
	},

	//graphData: data to be displayed

	//dir: direction of graph

	drawseasonalBarGraph:function(elem,graphData,dir1,dir2,_filter){
		var x = d3.scale.linear()
		    .range([0, seasonalBarGraph.width]);

		var y = d3.scale.linear()
		    .range([(seasonalBarGraph.height), 0]);

		// var xAxis = d3.svg.axis()
		//     .scale(x)
		//     .orient("top");
		// var yAxis = d3.svg.axis()
		// 	.scale(y)
		//     .orient("left");
		var color2 = d3.scale.quantize()
			.domain([0,12])
			.range(["#08306b", "#08519c", "#2171b5", "#4292c6", "#6baed6", "#9ecae1","#ddffff","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"]);

		var avgs = [[],[],[],[],[],[],[],[],[],[],[],[]]
		var countDays = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		for(var xx = 0;xx<avgs.length;xx++){
			avgs[xx].push(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)
		}

		//console.log(dir1,dir2)
		//console.log(dir1)
		graphData.rows.forEach(function(g){
			if(parseInt(g.f[16].v) == dir1){

				if(parseInt(g.f[1].v) == 1){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,1)
					countDays[0]++
					

				}
				else if(parseInt(g.f[1].v) == 2){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,1)
					countDays[1]++
				}
				else if(parseInt(g.f[1].v) == 3){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,1)
					countDays[2]++
				}
				else if(parseInt(g.f[1].v) == 4){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,1)
					countDays[3]++
				}
				else if(parseInt(g.f[1].v) == 5){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,1)
					countDays[4]++
				}
				else if(parseInt(g.f[1].v) == 6){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,1)
					countDays[5]++
				}
				else if(parseInt(g.f[1].v) == 7){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,1)
					countDays[6]++
				}
				else if(parseInt(g.f[1].v) == 8){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,1)
					countDays[7]++
				}
				else if(parseInt(g.f[1].v) == 9){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,1)
					countDays[8]++
				}
				else if(parseInt(g.f[1].v) == 10){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,1)
					countDays[9]++
				}
				else if(parseInt(g.f[1].v) == 11){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,1)
					countDays[10]++
				}
				else if(parseInt(g.f[1].v) == 12){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,1)
					countDays[11]++
				}

			}
			else if(parseInt(g.f[16].v) == dir2){
				if(parseInt(g.f[1].v) == 1){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,-1)
					countDays[12]++

				}
				else if(parseInt(g.f[1].v) == 2){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,-1)
					countDays[13]++
				}
				else if(parseInt(g.f[1].v) == 3){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,-1)
					countDays[14]++
				}
				else if(parseInt(g.f[1].v) == 4){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,-1)
					countDays[15]++
				}
				else if(parseInt(g.f[1].v) == 5){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,-1)
					countDays[16]++
				}
				else if(parseInt(g.f[1].v) == 6){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,-1)
					countDays[17]++
				}
				else if(parseInt(g.f[1].v) == 7){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,-1)
					countDays[18]++
				}
				else if(parseInt(g.f[1].v) == 8){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,-1)
					countDays[19]++
				}
				else if(parseInt(g.f[1].v) == 9){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,-1)
					countDays[20]++
				}
				else if(parseInt(g.f[1].v) == 10){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,-1)
					countDays[21]++
				}
				else if(parseInt(g.f[1].v) == 11){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,-1)
					countDays[22]++
				}
				else if(parseInt(g.f[1].v) == 12){

					avgs[parseInt(g.f[1].v)-1] = calculatorAvg(avgs[parseInt(g.f[1].v)-1],g,-1)
					countDays[23]++
				}
			}
		})

		var barSetCalc = [[],[],[],[],[],[],[],[],[],[],[],[]]
		for(var i = 0;i<12;i++){
			for(var j = 0;j<26;j++){
				if(j<13){
					var numDays = countDays[i]
				}
				else{
					var numDays = countDays[i+12]
				}

				if(numDays != 0){
					if(j == 0 || j == 13){
						barSetCalc[i].push({'x0':0,'x1':(avgs[i][j])/numDays,'month':i})
					}

					else{
						barSetCalc[i].push({'x0':barSetCalc[i][j-1].x1,'x1':(barSetCalc[i][j-1].x1+(avgs[i][j])/numDays),'month':i})	
					}
				}
				else{
					if(j == 0 || j == 13){
						barSetCalc[i].push({'x0':0,'x1':numDays,'month':i})
					}

					else{
						barSetCalc[i].push({'x0':barSetCalc[i][j-1].x1,'x1':barSetCalc[i][j-1].x1,'month':i})	
					}	
				}
			}
			
		}
		
		// var svg = d3.select(elem).append("svg")
		//     .attr("width", seasonalBarGraph.width + seasonalBarGraph.margin.left + seasonalBarGraph.margin.right)
		//     .attr("height", seasonalBarGraph.height + seasonalBarGraph.margin.top + seasonalBarGraph.margin.bottom)
		//   .append("g")
		//     .attr("transform", "translate(" + seasonalBarGraph.margin.left + "," + seasonalBarGraph.margin.top + ")");
	   d3.select(elem).selectAll("div").remove()
       var svg = d3.select(elem+" svg");
		    svg.selectAll("g").remove();

		var x = d3.scale.linear()
		    .range([0, seasonalBarGraph.width])

		var y = d3.scale.ordinal()
		    .rangeRoundBands([0, seasonalBarGraph.height], .2);

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");
		
		d3.max(barSetCalc, function(c) { return d3.max(c, function(v,i){ return Math.abs(v.x1) }); })
		  x.domain([(d3.min(barSetCalc, function(c) { return d3.min(c, function(v,i){ return v.x1 }); })),d3.max(barSetCalc, function(c) { return d3.max(c, function(v,i){ return Math.abs(v.x1) }); })]);
		  y.domain(barSetCalc.map(function(d,i) { return i; }));
		  // var svg = d3.select(elem+" svg");

		var div = d3.select(elem).append("div")
			.attr("id","seasonalBarGraphInfo")   
		    .style("position", "absolute")
		    .style("background-color","#fff")
			.style("z-index", "10")
			.style("visibility", "hidden")
			//.text("a simple tooltip");             

		  var rect = svg.selectAll(".graph")
		      .data(barSetCalc)
		    .enter().append("g")
		      .attr("class", "g")
		      .attr("transform", "translate(" + 0 + "," + seasonalBarGraph.margin.top + ")")
		    rect.selectAll("rect")
		      .data(function(d) { return d; })
		    .enter().append("rect")
		  	//.attr("class","enter")
		  	.attr("class",function(d,i) { return "station_"+i})
		  	//Below is where bar is displayed on x axis
		  	.attr("y", function(d) { return y(d.month); })
		  	//Below is the width of the bar
		  	.attr("height", y.rangeBand())
		  	//Below two values are used to set the height of the bar and make sure it displays upside down properly
			.attr("x", function(d,i) { if(d.x1 < 0){return x(d.x1)};return x(Math.max(0,d.x0)); })
		  	.attr("width", function(d) {return Math.abs(x(d.x0) - x(d.x1)); })
		  	//Below is used to set the color of the bar based on the data being examined.
		  	.attr("style", function(d,i) { if(i>12){return "fill:"+color2(i-13)+";"};return "fill:"+color2(i)+";" })
		  	//console.log(x.domain())
		  	.on("mouseover",function(d,i) {
		  		if(i < 12){
		  			var vehClass = i+1
					var dir = dir1
					
		  		}
		  		else{
		  			var vehClass = i-12
		  			var dir = dir2
		  		}
		  		var info =  "<p>Month "+monthCheck(d.month)+
		  						"<br>Class "+vehClass+
		  						"<br>Average Vehicle Count: "+Math.floor(Math.abs(d.x1-d.x0))+
		  						"<br>Direction: "+getDir(dir)+
								"</p>";
				
		  		$("#seasonalBarGraphInfo").html(info);
		  		//$("#seasonalBarGraphInfo").show();
		  		return div.style("visibility", "visible");
		  	})
		  	.on("mousemove", function(){return div.style("top", (d3.event.layerY)+"px").style("left",(d3.event.layerX+20)+"px");})
			.on("mouseout",function() {
		  		$("#seasonalBarGraphInfo").html('');
		  		//$("#seasonalBarGraphInfo").hide();
		  		return div.style("visibility", "hidden");
		  	});


		  svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + 500 + ")")
		      .call(xAxis)
		  

		  svg.append("g")
		      .attr("class", "y axis")
		    .append("line")
		      .attr("x1", x(0))
		      .attr("x2", x(0))
		      .attr("y2", 500)
		      .attr("fill","none")
		      .attr("stroke","#000")

		  var ticks = svg.selectAll(".tick text")
		  for(var k = 0;k<ticks[0].length;k++){
		  	ticks[0][k].textContent = Math.abs(ticks[0][k].__data__)

		  }

		

		function type(d) {
		  d.value = +d.value;
		  return d;
		}
		function monthCheck(date){
			if(date == 0){
				return "January"
			}
			else if(date == 1){
				return "February"
			}
			else if(date == 2){
				return "March"
			}
			else if(date == 3){
				return "April"
			}
			else if(date == 4){
				return "May"
			}
			else if(date == 5){
				return "June"
			}
			else if(date == 6){
				return "July"
			}
			else if(date == 7){
				return "August"
			}
			else if(date == 8){
				return "September"
			}
			else if(date == 9){
				return "October"
			}
			else if(date == 10){
				return "November"
			}
			else if(date == 11){
				return "December"
			}
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
		};
		function calculatorAvg(avgElem,row,dir){
			if(dir > 0){
				if(!_filter.class[0]) avgElem[0] = avgElem[0] + (dir*row.f[3].v)
				if(!_filter.class[1]) avgElem[1] = avgElem[1] + (dir*row.f[4].v)
				if(!_filter.class[2]) avgElem[2] = avgElem[2] + (dir*row.f[5].v)
				if(!_filter.class[3]) avgElem[3] = avgElem[3] + (dir*row.f[6].v)
				if(!_filter.class[4]) avgElem[4] = avgElem[4] + (dir*row.f[7].v)
				if(!_filter.class[5]) avgElem[5] = avgElem[5] + (dir*row.f[8].v)
				if(!_filter.class[6]) avgElem[6] = avgElem[6] + (dir*row.f[9].v)
				if(!_filter.class[7]) avgElem[7] = avgElem[7] + (dir*row.f[10].v)
				if(!_filter.class[8]) avgElem[8] = avgElem[8] + (dir*row.f[11].v)
				if(!_filter.class[9]) avgElem[9] = avgElem[9] + (dir*row.f[12].v)
				if(!_filter.class[10]) avgElem[10] = avgElem[10] + (dir*row.f[13].v)
				if(!_filter.class[11]) avgElem[11] = avgElem[11] + (dir*row.f[14].v)
				if(!_filter.class[12]) avgElem[12] = avgElem[12] + (dir*row.f[15].v)
			}
			else{
				if(!_filter.class[0]) avgElem[13] = avgElem[13] + (dir*row.f[3].v)
				if(!_filter.class[1]) avgElem[14] = avgElem[14] + (dir*row.f[4].v)
				if(!_filter.class[2]) avgElem[15] = avgElem[15] + (dir*row.f[5].v)
				if(!_filter.class[3]) avgElem[16] = avgElem[16] + (dir*row.f[6].v)
				if(!_filter.class[4]) avgElem[17] = avgElem[17] + (dir*row.f[7].v)
				if(!_filter.class[5]) avgElem[18] = avgElem[18] + (dir*row.f[8].v)
				if(!_filter.class[6]) avgElem[19] = avgElem[19] + (dir*row.f[9].v)
				if(!_filter.class[7]) avgElem[20] = avgElem[20] + (dir*row.f[10].v)
				if(!_filter.class[8]) avgElem[21] = avgElem[21] + (dir*row.f[11].v)
				if(!_filter.class[9]) avgElem[22] = avgElem[22] + (dir*row.f[12].v)
				if(!_filter.class[10]) avgElem[23] = avgElem[23] + (dir*row.f[13].v)
				if(!_filter.class[11]) avgElem[24] = avgElem[24] + (dir*row.f[14].v)
				if(!_filter.class[12]) avgElem[25] = avgElem[25] + (dir*row.f[15].v)	
			}
			return avgElem
		}
	},
}