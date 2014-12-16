var dashboard = {
	
	svg:{},

	/*

		The dashboard will display information on seasonal changes in traffic data.

		elem: html tag by id where line graph is displayed

		graphData: data to be displayed

		start: The initial year of comparison

		end: The last year of comparison

		classType: The classes of truck data displayed

	*/

	drawdashboard:function(elem,parsedData,start,end,month){
		$(elem).html('')

		console.log(parsedData)
		// $(elem).append('<table id="dashboardTableData" class="table" border="1"><tbody><tr><td style="vertical-align:bottom;text-align:center;background:#B8B8B8">Month</td><td style="vertical-align:bottom;text-align:center;background:#B8B8B8">ADT</td><td style="vertical-align:bottom;text-align:center;background:#B8B8B8">Year: '+parsedData[start].both.year+' <br>Avg: '+parsedData[start].both.yearAVG+'</td><td style="vertical-align:bottom;text-align:center;background:#B8B8B8">Year: '+parsedData[end].year+' <br>Avg: '+parsedData[end].yearAVG+'</td><td style="text-align:center;background:#B8B8B8"> Range<br>'+parsedData[start].both.year+'-'+parsedData[end].year+'<br>Avg: '+(parsedData[end].yearAVG/parsedData[start].both.yearAVG).toFixed(2)+'</td><td style="text-align:center;background:#B8B8B8"> Change by Year </td></tr></tbody></table>')
		var appendString = ""
		// for(var i = 0;i<12;i++){
		// 	appendString = appendString + '<tr><td style="background:#B8B8B8">'+findMonth(i)+
		// 								  '</td><td>'+parsedData[start].both.monthAVG[i]+
		// 								  '</td><td>'+parsedData[start].both.monthRAT[i]+
		// 								  '</td><td>'+parsedData[end].monthAVG[i]+
		// 								  '</td><td>'+parseRange(parsedData[end].monthAVG[i],parsedData[start].both.monthAVG[i])+
		// 								  '</td><td style="background:'+findChange(parsedData[end].monthAVG[i],parsedData[start].both.monthAVG[i])+'">'+percentChange(parsedData[end].monthAVG[i],parsedData[start].both.monthAVG[i])+
		// 								  '</td></tr>'
		// }

		var perChangeMon = {All:0,SU:0,TT:0}
		var perChangeYear = {All:0,SU:0,TT:0}

		if(start != 0){
			if(parsedData[start].both.All.monthAVG[month] != 0 && parsedData[start-1].both.All.monthAVG[month] != 0){
				perChangeYear.All = percentChange((parsedData[start].both.All.monthAVG[month]),(parsedData[start-1].both.All.monthAVG[month]))

			}
			if(parsedData[start].both.SU.monthAVG[month] != 0 && parsedData[start-1].both.SU.monthAVG[month] != 0){
				perChangeYear.SU = percentChange((parsedData[start].both.SU.monthAVG[month]),(parsedData[start-1].both.SU.monthAVG[month]))

			}
			if(parsedData[start].both.TT.monthAVG[month] != 0 && parsedData[start-1].both.TT.monthAVG[month] != 0){
				perChangeYear.TT = percentChange((parsedData[start].both.TT.monthAVG[month]),(parsedData[start-1].both.TT.monthAVG[month]))

			}
			if(month != 0){
				if(parsedData[start].both.TT.monthAVG[month] != 0 && parsedData[start].both.TT.monthAVG[month-1] != 0){
					perChangeMon.TT = percentChange((parsedData[start].both.TT.monthAVG[month]*parsedData[start].both.TT.monthRAT[month]),(parsedData[start].both.TT.monthAVG[month-1]*parsedData[start].both.TT.monthRAT[month-1]))
				}
				if(parsedData[start].both.SU.monthAVG[month] != 0 && parsedData[start].both.SU.monthAVG[month-1] != 0){
					perChangeMon.SU = percentChange((parsedData[start].both.SU.monthAVG[month]*parsedData[start].both.SU.monthRAT[month]),(parsedData[start].both.SU.monthAVG[month-1]*parsedData[start].both.SU.monthRAT[month-1]))			
				}
				if(parsedData[start].both.All.monthAVG[month] != 0 && parsedData[start].both.All.monthAVG[month-1] != 0){
					perChangeMon.All = percentChange((parsedData[start].both.All.monthAVG[month]*parsedData[start].both.All.monthRAT[month]),(parsedData[start].both.All.monthAVG[month-1]*parsedData[start].both.All.monthRAT[month-1]))
				}
			}
			else{
				if(parsedData[start].both.TT.monthAVG[month] != 0 && parsedData[start].both.TT.monthAVG[month-1] != 0){
					perChangeMon.TT = percentChange((parsedData[start].both.TT.monthAVG[month]*parsedData[start].both.TT.monthRAT[month]),(parsedData[start].both.TT.monthAVG[11]*parsedData[start].both.TT.monthRAT[11]))
				}
				if(parsedData[start].both.SU.monthAVG[month] != 0 && parsedData[start].both.SU.monthAVG[month-1] != 0){
					perChangeMon.SU = percentChange((parsedData[start].both.SU.monthAVG[month]*parsedData[start].both.SU.monthRAT[month]),(parsedData[start].both.SU.monthAVG[11]*parsedData[start].both.SU.monthRAT[11]))			
				}
				if(parsedData[start].both.All.monthAVG[month] != 0 && parsedData[start].both.All.monthAVG[month-1] != 0){
					perChangeMon.All = percentChange((parsedData[start].both.All.monthAVG[month]*parsedData[start].both.All.monthRAT[month]),(parsedData[start].both.All.monthAVG[11]*parsedData[start].both.All.monthRAT[11]))
				}	
			}


		}
		else{
			if(month != 0){
				if(parsedData[start].both.TT.monthAVG[month] != 0 && parsedData[start].both.TT.monthAVG[month-1] != 0){
					perChangeMon.TT = percentChange((parsedData[start].both.TT.monthAVG[month]*parsedData[start].both.TT.monthRAT[month]),(parsedData[start].both.TT.monthAVG[month-1]*parsedData[start].both.TT.monthRAT[month-1]))
				}
				if(parsedData[start].both.SU.monthAVG[month] != 0 && parsedData[start].both.SU.monthAVG[month-1] != 0){
					perChangeMon.SU = percentChange((parsedData[start].both.SU.monthAVG[month]*parsedData[start].both.SU.monthRAT[month]),(parsedData[start].both.SU.monthAVG[month-1]*parsedData[start].both.SU.monthRAT[month-1]))			
				}
				if(parsedData[start].both.All.monthAVG[month] != 0 && parsedData[start].both.All.monthAVG[month-1] != 0){
					perChangeMon.All = percentChange((parsedData[start].both.All.monthAVG[month]*parsedData[start].both.All.monthRAT[month]),(parsedData[start].both.All.monthAVG[month-1]*parsedData[start].both.All.monthRAT[month-1]))
				}
			}
			
		}


		
		appendString =  appendString +'<tr>'+
									'<td rowspan = "2"><div id="dashDiv1"></div></td>'+
									'<td height="75" width="75">'+imageArrow(perChangeMon.All)+' '+perChangeMon.All+'%<br>Monthly</td>'+
									'<td rowspan = "2" ><div id="dashDiv2" ></div></td>'+
									'<td height="75" width="75">'+imageArrow(perChangeMon.SU)+' '+perChangeMon.SU+'%<br>Monthly</td>'+
									'<td rowspan = "2"><div id="dashDiv3"></div></td>'+
									'<td height="75" width="75">'+imageArrow(perChangeMon.TT)+' '+perChangeMon.TT+'%<br>Monthly</td>'+
									'</tr>'+
									'<tr>'+
									'<td height="75" width="75">'+imageArrow(perChangeYear.All)+' '+perChangeYear.All+'%<br>Yearly</td>'+
									'<td height="75" width="75">'+imageArrow(perChangeYear.SU)+' '+perChangeYear.SU+'%<br>Yearly</td>'+
									'<td height="75" width="75">'+imageArrow(perChangeYear.TT)+' '+perChangeYear.TT+'%<br>Yearly</td>'+
									'</tr>'+
									'<tr>'+
									'<td colspan = "2"><div>'+parsedData[start].both.All.monthAVG[month]+'</div></td>'+
								    '<td colspan = "2"><div>'+parsedData[start].both.SU.monthAVG[month]+'</div></td>'+
									'<td colspan = "2"><div>'+parsedData[start].both.TT.monthAVG[month]+'</div></td>'+
									'</tr>'
		
						
		$(elem).append(appendString)

		// if(start != 0){
		// 	end = start-1
		// }
		// else{
		// 	end = start
			
		// }
		console.log("Circles below")
		radialProgress(document.getElementById('dashDiv1'))
	        .label("All traffic")
	        .diameter(150)
	        .value(percentChange(parsedData[start].both.All.monthAVG[month],parsedData[start].both.All.yearAVG) + 100)
	        .render();
		radialProgress(document.getElementById('dashDiv2'))
	        .label("SU traffic")
	        .diameter(150)
	        .value(percentChange(parsedData[start].both.SU.monthAVG[month],parsedData[start].both.SU.yearAVG) + 100)
	        .render();	
		radialProgress(document.getElementById('dashDiv3'))
	        .label("TT traffic")
	        .diameter(150)
	        .value(percentChange(parsedData[start].both.TT.monthAVG[month],parsedData[start].both.TT.yearAVG) + 100)
	        .render();	
		// radialProgress(document.getElementById('dashDiv3'))
	 //        .label(findMonth("TT traffic"))
	 //        .diameter(150)
	 //        .value(percentChange(parsedData[start].both.yearAVG,parsedData[start].both.monthAVG[a-12]))
	 //        .render();	
		

		console.log(parsedData)	    








		function findMonth(value){
			if( value == 0) return "January";
			if( value == 1) return "February";
			if( value == 2) return "March";
			if( value == 3) return "April";
			if( value == 4) return "May";
			if( value == 5) return "June";
			if( value == 6) return "July";
			if( value == 7) return "August";
			if( value == 8) return "September";
			if( value == 9) return "October";
			if( value == 10) return "November";
			if( value == 11) return "December";
		}
		function findChange(a,b){

			if(b != 0){
				var c = (((a-b)/b)*100).toFixed(2)
				if(c == 0){
					return "#0066FF"
				}
				else if(c > 0){
					return "#00FF66"	
				}
				else{
					return "#FF3300"
				}

			}
			else{
				return "#FFFFFF"
			}
		}
		function parseRange(a,b){
			if(a != 0 && b != 0){
				return (a/b).toFixed(2)
			}
			else{
				return "No data to compare"
			}
		}
		function percentChange(a,b){
			console.log(a,b)
			if(b != 0){
				if(a != 0){
					var c = (((a-b)/b)*100).toFixed(2)
					return parseFloat(c)
				}
				else{
					return 0
				}
			}
			else{
				return 0
			}
		}
		function imageArrow(a){
			if(a > 0){
				return '<span class="glyphicon glyphicon-arrow-up"></span>'
			}
			else if(a < 0){
				return '<span class="glyphicon glyphicon-arrow-down"></span>'
			}
			else{
				console.log(a)
				return '<span class="glyphicon glyphicon-minus"></span>'
			}
		}












		//The below code was for if it was more desirable to display a line graph.

		// //Graph building is done below

		// var x = d3.scale.linear()
		//     .range([50, dashboard.width+50]);

		// var y = d3.scale.linear()
		//     .range([dashboard.height, 0]);

		// var y2 = d3.scale.linear()
		//     .range([dashboard.height, 0]);


		// var color = d3.scale.category10();
		// color.domain(d3.keys(graphData).filter(function(key) { return key; }));

		// var color2 = d3.scale.quantize()
		// 	.domain([0,7])
		// 	.range(colorbrewer.Set1[7]);

		// var xAxis = d3.svg.axis()
		//     .scale(x)
		//     .orient("bottom");

		// var yAxis = d3.svg.axis()
		//     .scale(y)
		//     .orient("left");

		// //The line function must accept an array as input or it won't work ;_;
		// //It creates the line

		// var line = d3.svg.line()
		//     .interpolate("linear")
		//     .x(function(d,i) { if(i != 13){return x(i+1);} })
		//     .y(function(d,i) { if(i != 13){return y(d)}; });

		// var line2 = d3.svg.line()
		//     .interpolate("linear")
		//     .x(function(d,i) { if(i != 13){return x(i+1);} })
		//     .y(function(d,i) { if(i != 13){return y2(d)}; });

		// var voronoi = d3.geom.voronoi()
		//     .x(function(d,i) { console.log(d,i);return x(i) })
		//     .y(function(d) { return y(d) })

		// x.domain([1,12]);

	 //    //adjust the y domain based on dir
	 //    y.domain([
		//     0,
  //   		d3.max(parsedData, function(c) { return d3.max(c.monthRAT, function(v,i) { return v  }); })
	 //    ]).nice();
	
		// y2.domain([
		//     0,
  //   		d3.max(parsedData, function(c) { return d3.max(c.monthAVG, function(v,i) { return v  }); })
	 //    ]).nice();
	

	 //    d3.select(elem).selectAll("div").remove()
	 //    var div = d3.select(elem).append("div")
		//   .attr("id","dashboardInfo")   
	 //      .style("position", "absolute")
	 //      .style("background-color","#fff")
		//   .style("z-index", "10")
		//   .style("visibility", "hidden")

	  
	 //    var svg = d3.select(elem+" svg");
	 //      svg.selectAll("g").remove();
	 //      svg.append("g")
	 //        .attr("class", "x axis")
	 //        .attr("transform", "translate(0," + dashboard.height + ")")
	 //        .call(xAxis)
	 //      .append("text")
	 //        .attr("class", "label")
	 //        .attr("x", dashboard.width)
	 //        .attr("y", -6)
	 //        .style("text-anchor", "end")

	 //     svg.append("g")
	 //        .attr("class", "y axis")
	 //        .attr("transform", "translate(" + (dashboard.margin.left) + "," + dashboard.margin.top + ")")
	 //        .style("font-size","10px")
	 //        .call(yAxis)
	 //      .append("text")
	 //        .attr("class", "label")
	 //        .attr("transform", "rotate(-90)")
	 //        .attr("y", 6)
	 //        .attr("dy", ".71em")
	 //        .style("text-anchor", "end")

	 //    var zz = 0;
		

	 //    var rect = svg.append("g")
		//     .attr("class", "monthRATs")
		//     .selectAll("path")
		//        .data(parsedData)
		//     .enter().append("path")
		// 	   .attr("class", function(d,i){return "RATLine_"+parseInt(i+1)})
		// 	   .attr("d", function(d) { return line(d.monthRAT) }) //Must be passed an array
		// 	   .style("stroke", function(d,i) {return color2(i) })
		// 	   .style("fill","none")

		// // var rect2 = svg.append("g")
		// //     .attr("class", "monthAVGs")
		// //     .selectAll("path")
		// //        .data(parsedData)
		// //     .enter().append("path")
		// // 	   .attr("class", function(d,i){return "AVGLine_"+parseInt(i+1)})
		// // 	   .attr("d", function(d) { return line2(d.monthAVG) }) //Must be passed an array
		// // 	   .style("stroke", function(d,i) {return color2(i) })
		// // 	   .style("fill","none")

		// var rect3 = svg.append("g")
		//     .attr("class", "monthRATs")
		//     .selectAll("path")
		//        .data(parsedData)
		//     .enter().append("path")
		// 	   .attr("class", function(d,i){return "RATLineAVG_"+parseInt(i+1)})
		// 	   .attr("d", function(d) { return line([d.yearRAT,d.yearRAT,d.yearRAT,d.yearRAT,d.yearRAT,d.yearRAT,d.yearRAT,d.yearRAT,d.yearRAT,d.yearRAT,d.yearRAT,d.yearRAT]) }) //Must be passed an array
		// 	   .style("stroke", function(d,i) {return color2(i) })
		// 	   .style("fill","none")

		// // var rect4 = svg.append("g")
		// //     .attr("class", "monthAVGs")
		// //     .selectAll("path")
		// //        .data(parsedData)
		// //     .enter().append("path")
		// // 	   .attr("class", function(d,i){return "AVGLineAVG_"+parseInt(i+1)})
		// // 	   .attr("d", function(d) { return line2([d.yearAVG,d.yearAVG,d.yearAVG,d.yearAVG,d.yearAVG,d.yearAVG,d.yearAVG,d.yearAVG,d.yearAVG,d.yearAVG,d.yearAVG,d.yearAVG]) }) //Must be passed an array
		// // 	   .style("stroke", function(d,i) {return color2(i) })
		// // 	   .style("fill","none")


		
	 // //    //Used for dots
		// // var focus = svg.append("g")
		// //     .attr("transform", "translate(-100,-100)")
		// //     .attr("class", "focus");

		// // focus.append("circle")
		// //     .attr("r", 3.5);

		// 	//console.log(voronoi(parsedData))


		// 	 //  var voronoiGroup = svg.append("g")
		// 	 //      .attr("class", "voronoi");

		// 	 //  voronoiGroup.selectAll("path")
		// 	 //      .data(voronoi(temp))
		// 	 //    .enter().append("path")
		// 	 //      .attr("d", function(d) { if(d != undefined && d.length != 0){return "M" + d.join("L") + "Z"}; })
		// 	 //      .datum(function(d) { if(d != undefined && d.length != 0){return d.point;} })
		// 	 //      .on("mouseover", mouseover)
		// 	 //      .on("mousemove", function(){return div.style("top", (d3.event.layerY)+"px").style("left",(d3.event.layerX+20)+"px");})
		// 	 //      .on("mouseout", mouseout)
		// 	 //      .style("fill","none")
		// 	 //      .style("pointer-events","all")

		// 	 //  //Below is hover info

		// 	 //  //NOTE This data is already formatted in a way so that drawing all dots on hover may actually doable. Probably.

		// 	 //  function mouseover(d) {
		// 	 //  	$('#linegraph path').attr('opacity',0.1);
		//   // 		$('.classLine_'+d.classID).attr('opacity',0.9);
		//   // 		var dotData = d.graphData
		// 		// rect.select("rect")
		// 		//   .data(dotData)
		// 		// .enter().append("circle")
		// 		// 	  .attr("class","dot")
		// 		// 	  .attr("r", 3.5)
		// 		// 	  .attr("cx", function(d,i) { return x(i+1); })
		// 		// 	  .attr("cy", function(d) { return y(d); })
		// 		//       .style("fill", function(d,i) {return color(i); }); //Color has no specific functionality for now

		//  	// 	 var info =  "<p>Class "+d.classID+
	 //  	// 					"<br>Average Vehicle Count: "+Math.floor(d.value)+
		// 		// 			"</p>";
					
		// 	 //  		$("#dashboardInfo").html(info);
		// 	 //  		return div.style("visibility", "visible");
		// 	 //    //focus.attr("transform", "translate(" + x(d.xax+1) + "," + y(d.value) + ")"); //What's really used in voronoi dot formation
		// 	 //  }

		// 	 //  function mouseout(d) {
		// 	 //   	svg.selectAll("circle").remove()
	 //   //  		$('#linegraph path').attr('opacity',1);
	 //   //  		$("#dashboardInfo").html('');
		// 	 //  	return div.style("visibility", "hidden");
		// 	 //    //focus.attr("transform", "translate(-100,-100)");
		// 	 //  }

	},
}