var seasonalLineChart = {
	
	svg:{},

	initseasonalLineChart:function(elem,container){
		seasonalLineChart.margin = {top: 5, right: 5, bottom: 10, left:50},
		seasonalLineChart.width = 960 - seasonalLineChart.margin.left - seasonalLineChart.margin.right,
		seasonalLineChart.height = 500 - seasonalLineChart.margin.top - seasonalLineChart.margin.bottom;
		var svg = d3.select(elem).append("svg")
		    .attr("width", seasonalLineChart.width + seasonalLineChart.margin.left + seasonalLineChart.margin.right + 30)
		    .attr("height", seasonalLineChart.height + seasonalLineChart.margin.top + seasonalLineChart.margin.bottom + 30)
		    .attr("id","linegraph")
		  .append("g")
		    .attr("transform", "translate(" + (seasonalLineChart.margin.left) + "," + seasonalLineChart.margin.top + ")");
	},

	//graphData: data to be displayed

	//dir: direction of graph

	drawseasonalLineChart:function(elem,graphData,dir,_filter){
		var x = d3.scale.linear()
		    .range([50, seasonalLineChart.width+50]);

		var y = d3.scale.linear()
		    .range([seasonalLineChart.height, 0]);

		var color = d3.scale.category10();
		color.domain(d3.keys(graphData).filter(function(key) { return key; }));

		var color2 = d3.scale.quantize()
			.domain([0,12])
			.range(["#08306b", "#08519c", "#2171b5", "#4292c6", "#6baed6", "#9ecae1","#ddffff","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"]);
		
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
		    .x(function(d,i) { if(i != 13){return x(i+1);} })
		    .y(function(d,i) { if(i != 13){return y(d)}; });


		var voronoi = d3.geom.voronoi()
		    .x(function(d) { return x(d.xax+1) })
		    .y(function(d) { return y(d.value) })
		    //.clipExtent([[-seasonalLineChart.margin.left, -seasonalLineChart.margin.top], [seasonalLineChart.width + seasonalLineChart.margin.right, seasonalLineChart.height + seasonalLineChart.margin.bottom]]);

		//console.log(graphData)

		var avgs = [[],[],[],[],[],[],[],[],[],[],[],[],[]]
		var countDays = [0,0,0,0,0,0,0,0,0,0,0,0]
		for(var xx = 0;xx<avgs.length;xx++){
			avgs[xx].push(0,0,0,0,0,0,0,0,0,0,0,0)
		}

		
		graphData.rows.forEach(function(g){
			if(parseInt(g.f[16].v) == dir || dir == -1){
				if(parseInt(g.f[1].v) == 1 ){
					if(!(_filter['class'][0])){
						avgs[0][parseInt(g.f[1].v)-1] = avgs[0][parseInt(g.f[1].v)-1] + parseInt(g.f[3].v)
					}
					if(!(_filter['class'][1])){
						avgs[1][parseInt(g.f[1].v)-1] = avgs[1][parseInt(g.f[1].v)-1] + parseInt(g.f[4].v)
					}
					if(!(_filter['class'][2])){
						avgs[2][parseInt(g.f[1].v)-1] = avgs[2][parseInt(g.f[1].v)-1] + parseInt(g.f[5].v)
					}
					if(!(_filter['class'][3])){
						avgs[3][parseInt(g.f[1].v)-1] = avgs[3][parseInt(g.f[1].v)-1] + parseInt(g.f[6].v)
					}
					if(!(_filter['class'][4])){
						avgs[4][parseInt(g.f[1].v)-1] = avgs[4][parseInt(g.f[1].v)-1] + parseInt(g.f[7].v)
					}
					if(!(_filter['class'][5])){
						avgs[5][parseInt(g.f[1].v)-1] = avgs[5][parseInt(g.f[1].v)-1] + parseInt(g.f[8].v)
					}
					if(!(_filter['class'][6])){
						avgs[6][parseInt(g.f[1].v)-1] = avgs[6][parseInt(g.f[1].v)-1] + parseInt(g.f[9].v)
					}
					if(!(_filter['class'][7])){
						avgs[7][parseInt(g.f[1].v)-1] = avgs[7][parseInt(g.f[1].v)-1] + parseInt(g.f[10].v)
					}
					if(!(_filter['class'][8])){
						avgs[8][parseInt(g.f[1].v)-1] = avgs[8][parseInt(g.f[1].v)-1] + parseInt(g.f[11].v)
					}
					if(!(_filter['class'][9])){
						avgs[9][parseInt(g.f[1].v)-1] = avgs[9][parseInt(g.f[1].v)-1] + parseInt(g.f[12].v)
					}
					if(!(_filter['class'][10])){
						avgs[10][parseInt(g.f[1].v)-1] = avgs[10][parseInt(g.f[1].v)-1] + parseInt(g.f[13].v)
					}
					if(!(_filter['class'][11])){
						avgs[11][parseInt(g.f[1].v)-1] = avgs[11][parseInt(g.f[1].v)-1] + parseInt(g.f[14].v)
					}
					if(!(_filter['class'][12])){
						avgs[12][parseInt(g.f[1].v)-1] = avgs[12][parseInt(g.f[1].v)-1] + parseInt(g.f[15].v)
					}
					countDays[parseInt(g.f[1].v)-1]++
				}
				else if(parseInt(g.f[1].v) == 2){
					if(!(_filter['class'][0])){
						avgs[0][parseInt(g.f[1].v)-1] = avgs[0][parseInt(g.f[1].v)-1] + parseInt(g.f[3].v)
					}
					if(!(_filter['class'][1])){
						avgs[1][parseInt(g.f[1].v)-1] = avgs[1][parseInt(g.f[1].v)-1] + parseInt(g.f[4].v)
					}
					if(!(_filter['class'][2])){
						avgs[2][parseInt(g.f[1].v)-1] = avgs[2][parseInt(g.f[1].v)-1] + parseInt(g.f[5].v)
					}
					if(!(_filter['class'][3])){
						avgs[3][parseInt(g.f[1].v)-1] = avgs[3][parseInt(g.f[1].v)-1] + parseInt(g.f[6].v)
					}
					if(!(_filter['class'][4])){
						avgs[4][parseInt(g.f[1].v)-1] = avgs[4][parseInt(g.f[1].v)-1] + parseInt(g.f[7].v)
					}
					if(!(_filter['class'][5])){
						avgs[5][parseInt(g.f[1].v)-1] = avgs[5][parseInt(g.f[1].v)-1] + parseInt(g.f[8].v)
					}
					if(!(_filter['class'][6])){
						avgs[6][parseInt(g.f[1].v)-1] = avgs[6][parseInt(g.f[1].v)-1] + parseInt(g.f[9].v)
					}
					if(!(_filter['class'][7])){
						avgs[7][parseInt(g.f[1].v)-1] = avgs[7][parseInt(g.f[1].v)-1] + parseInt(g.f[10].v)
					}
					if(!(_filter['class'][8])){
						avgs[8][parseInt(g.f[1].v)-1] = avgs[8][parseInt(g.f[1].v)-1] + parseInt(g.f[11].v)
					}
					if(!(_filter['class'][9])){
						avgs[9][parseInt(g.f[1].v)-1] = avgs[9][parseInt(g.f[1].v)-1] + parseInt(g.f[12].v)
					}
					if(!(_filter['class'][10])){
						avgs[10][parseInt(g.f[1].v)-1] = avgs[10][parseInt(g.f[1].v)-1] + parseInt(g.f[13].v)
					}
					if(!(_filter['class'][11])){
						avgs[11][parseInt(g.f[1].v)-1] = avgs[11][parseInt(g.f[1].v)-1] + parseInt(g.f[14].v)
					}
					if(!(_filter['class'][12])){
						avgs[12][parseInt(g.f[1].v)-1] = avgs[12][parseInt(g.f[1].v)-1] + parseInt(g.f[15].v)
					}
					countDays[parseInt(g.f[1].v)-1]++
				}
				else if(parseInt(g.f[1].v) == 3){
					if(!(_filter['class'][0])){
						avgs[0][parseInt(g.f[1].v)-1] = avgs[0][parseInt(g.f[1].v)-1] + parseInt(g.f[3].v)
					}
					if(!(_filter['class'][1])){
						avgs[1][parseInt(g.f[1].v)-1] = avgs[1][parseInt(g.f[1].v)-1] + parseInt(g.f[4].v)
					}
					if(!(_filter['class'][2])){
						avgs[2][parseInt(g.f[1].v)-1] = avgs[2][parseInt(g.f[1].v)-1] + parseInt(g.f[5].v)
					}
					if(!(_filter['class'][3])){
						avgs[3][parseInt(g.f[1].v)-1] = avgs[3][parseInt(g.f[1].v)-1] + parseInt(g.f[6].v)
					}
					if(!(_filter['class'][4])){
						avgs[4][parseInt(g.f[1].v)-1] = avgs[4][parseInt(g.f[1].v)-1] + parseInt(g.f[7].v)
					}
					if(!(_filter['class'][5])){
						avgs[5][parseInt(g.f[1].v)-1] = avgs[5][parseInt(g.f[1].v)-1] + parseInt(g.f[8].v)
					}
					if(!(_filter['class'][6])){
						avgs[6][parseInt(g.f[1].v)-1] = avgs[6][parseInt(g.f[1].v)-1] + parseInt(g.f[9].v)
					}
					if(!(_filter['class'][7])){
						avgs[7][parseInt(g.f[1].v)-1] = avgs[7][parseInt(g.f[1].v)-1] + parseInt(g.f[10].v)
					}
					if(!(_filter['class'][8])){
						avgs[8][parseInt(g.f[1].v)-1] = avgs[8][parseInt(g.f[1].v)-1] + parseInt(g.f[11].v)
					}
					if(!(_filter['class'][9])){
						avgs[9][parseInt(g.f[1].v)-1] = avgs[9][parseInt(g.f[1].v)-1] + parseInt(g.f[12].v)
					}
					if(!(_filter['class'][10])){
						avgs[10][parseInt(g.f[1].v)-1] = avgs[10][parseInt(g.f[1].v)-1] + parseInt(g.f[13].v)
					}
					if(!(_filter['class'][11])){
						avgs[11][parseInt(g.f[1].v)-1] = avgs[11][parseInt(g.f[1].v)-1] + parseInt(g.f[14].v)
					}
					if(!(_filter['class'][12])){
						avgs[12][parseInt(g.f[1].v)-1] = avgs[12][parseInt(g.f[1].v)-1] + parseInt(g.f[15].v)
					}
					countDays[parseInt(g.f[1].v)-1]++
				}
				else if(parseInt(g.f[1].v) == 4){
					if(!(_filter['class'][0])){
						avgs[0][parseInt(g.f[1].v)-1] = avgs[0][parseInt(g.f[1].v)-1] + parseInt(g.f[3].v)
					}
					if(!(_filter['class'][1])){
						avgs[1][parseInt(g.f[1].v)-1] = avgs[1][parseInt(g.f[1].v)-1] + parseInt(g.f[4].v)
					}
					if(!(_filter['class'][2])){
						avgs[2][parseInt(g.f[1].v)-1] = avgs[2][parseInt(g.f[1].v)-1] + parseInt(g.f[5].v)
					}
					if(!(_filter['class'][3])){
						avgs[3][parseInt(g.f[1].v)-1] = avgs[3][parseInt(g.f[1].v)-1] + parseInt(g.f[6].v)
					}
					if(!(_filter['class'][4])){
						avgs[4][parseInt(g.f[1].v)-1] = avgs[4][parseInt(g.f[1].v)-1] + parseInt(g.f[7].v)
					}
					if(!(_filter['class'][5])){
						avgs[5][parseInt(g.f[1].v)-1] = avgs[5][parseInt(g.f[1].v)-1] + parseInt(g.f[8].v)
					}
					if(!(_filter['class'][6])){
						avgs[6][parseInt(g.f[1].v)-1] = avgs[6][parseInt(g.f[1].v)-1] + parseInt(g.f[9].v)
					}
					if(!(_filter['class'][7])){
						avgs[7][parseInt(g.f[1].v)-1] = avgs[7][parseInt(g.f[1].v)-1] + parseInt(g.f[10].v)
					}
					if(!(_filter['class'][8])){
						avgs[8][parseInt(g.f[1].v)-1] = avgs[8][parseInt(g.f[1].v)-1] + parseInt(g.f[11].v)
					}
					if(!(_filter['class'][9])){
						avgs[9][parseInt(g.f[1].v)-1] = avgs[9][parseInt(g.f[1].v)-1] + parseInt(g.f[12].v)
					}
					if(!(_filter['class'][10])){
						avgs[10][parseInt(g.f[1].v)-1] = avgs[10][parseInt(g.f[1].v)-1] + parseInt(g.f[13].v)
					}
					if(!(_filter['class'][11])){
						avgs[11][parseInt(g.f[1].v)-1] = avgs[11][parseInt(g.f[1].v)-1] + parseInt(g.f[14].v)
					}
					if(!(_filter['class'][12])){
						avgs[12][parseInt(g.f[1].v)-1] = avgs[12][parseInt(g.f[1].v)-1] + parseInt(g.f[15].v)
					}
					countDays[parseInt(g.f[1].v)-1]++
				}
				else if(parseInt(g.f[1].v) == 5){
					if(!(_filter['class'][0])){
						avgs[0][parseInt(g.f[1].v)-1] = avgs[0][parseInt(g.f[1].v)-1] + parseInt(g.f[3].v)
					}
					if(!(_filter['class'][1])){
						avgs[1][parseInt(g.f[1].v)-1] = avgs[1][parseInt(g.f[1].v)-1] + parseInt(g.f[4].v)
					}
					if(!(_filter['class'][2])){
						avgs[2][parseInt(g.f[1].v)-1] = avgs[2][parseInt(g.f[1].v)-1] + parseInt(g.f[5].v)
					}
					if(!(_filter['class'][3])){
						avgs[3][parseInt(g.f[1].v)-1] = avgs[3][parseInt(g.f[1].v)-1] + parseInt(g.f[6].v)
					}
					if(!(_filter['class'][4])){
						avgs[4][parseInt(g.f[1].v)-1] = avgs[4][parseInt(g.f[1].v)-1] + parseInt(g.f[7].v)
					}
					if(!(_filter['class'][5])){
						avgs[5][parseInt(g.f[1].v)-1] = avgs[5][parseInt(g.f[1].v)-1] + parseInt(g.f[8].v)
					}
					if(!(_filter['class'][6])){
						avgs[6][parseInt(g.f[1].v)-1] = avgs[6][parseInt(g.f[1].v)-1] + parseInt(g.f[9].v)
					}
					if(!(_filter['class'][7])){
						avgs[7][parseInt(g.f[1].v)-1] = avgs[7][parseInt(g.f[1].v)-1] + parseInt(g.f[10].v)
					}
					if(!(_filter['class'][8])){
						avgs[8][parseInt(g.f[1].v)-1] = avgs[8][parseInt(g.f[1].v)-1] + parseInt(g.f[11].v)
					}
					if(!(_filter['class'][9])){
						avgs[9][parseInt(g.f[1].v)-1] = avgs[9][parseInt(g.f[1].v)-1] + parseInt(g.f[12].v)
					}
					if(!(_filter['class'][10])){
						avgs[10][parseInt(g.f[1].v)-1] = avgs[10][parseInt(g.f[1].v)-1] + parseInt(g.f[13].v)
					}
					if(!(_filter['class'][11])){
						avgs[11][parseInt(g.f[1].v)-1] = avgs[11][parseInt(g.f[1].v)-1] + parseInt(g.f[14].v)
					}
					if(!(_filter['class'][12])){
						avgs[12][parseInt(g.f[1].v)-1] = avgs[12][parseInt(g.f[1].v)-1] + parseInt(g.f[15].v)
					}
					countDays[parseInt(g.f[1].v)-1]++
				}
				else if(parseInt(g.f[1].v) == 6){
					if(!(_filter['class'][0])){
						avgs[0][parseInt(g.f[1].v)-1] = avgs[0][parseInt(g.f[1].v)-1] + parseInt(g.f[3].v)
					}
					if(!(_filter['class'][1])){
						avgs[1][parseInt(g.f[1].v)-1] = avgs[1][parseInt(g.f[1].v)-1] + parseInt(g.f[4].v)
					}
					if(!(_filter['class'][2])){
						avgs[2][parseInt(g.f[1].v)-1] = avgs[2][parseInt(g.f[1].v)-1] + parseInt(g.f[5].v)
					}
					if(!(_filter['class'][3])){
						avgs[3][parseInt(g.f[1].v)-1] = avgs[3][parseInt(g.f[1].v)-1] + parseInt(g.f[6].v)
					}
					if(!(_filter['class'][4])){
						avgs[4][parseInt(g.f[1].v)-1] = avgs[4][parseInt(g.f[1].v)-1] + parseInt(g.f[7].v)
					}
					if(!(_filter['class'][5])){
						avgs[5][parseInt(g.f[1].v)-1] = avgs[5][parseInt(g.f[1].v)-1] + parseInt(g.f[8].v)
					}
					if(!(_filter['class'][6])){
						avgs[6][parseInt(g.f[1].v)-1] = avgs[6][parseInt(g.f[1].v)-1] + parseInt(g.f[9].v)
					}
					if(!(_filter['class'][7])){
						avgs[7][parseInt(g.f[1].v)-1] = avgs[7][parseInt(g.f[1].v)-1] + parseInt(g.f[10].v)
					}
					if(!(_filter['class'][8])){
						avgs[8][parseInt(g.f[1].v)-1] = avgs[8][parseInt(g.f[1].v)-1] + parseInt(g.f[11].v)
					}
					if(!(_filter['class'][9])){
						avgs[9][parseInt(g.f[1].v)-1] = avgs[9][parseInt(g.f[1].v)-1] + parseInt(g.f[12].v)
					}
					if(!(_filter['class'][10])){
						avgs[10][parseInt(g.f[1].v)-1] = avgs[10][parseInt(g.f[1].v)-1] + parseInt(g.f[13].v)
					}
					if(!(_filter['class'][11])){
						avgs[11][parseInt(g.f[1].v)-1] = avgs[11][parseInt(g.f[1].v)-1] + parseInt(g.f[14].v)
					}
					if(!(_filter['class'][12])){
						avgs[12][parseInt(g.f[1].v)-1] = avgs[12][parseInt(g.f[1].v)-1] + parseInt(g.f[15].v)
					}
					countDays[parseInt(g.f[1].v)-1]++
				}
				else if(parseInt(g.f[1].v) == 7){
					if(!(_filter['class'][0])){
						avgs[0][parseInt(g.f[1].v)-1] = avgs[0][parseInt(g.f[1].v)-1] + parseInt(g.f[3].v)
					}
					if(!(_filter['class'][1])){
						avgs[1][parseInt(g.f[1].v)-1] = avgs[1][parseInt(g.f[1].v)-1] + parseInt(g.f[4].v)
					}
					if(!(_filter['class'][2])){
						avgs[2][parseInt(g.f[1].v)-1] = avgs[2][parseInt(g.f[1].v)-1] + parseInt(g.f[5].v)
					}
					if(!(_filter['class'][3])){
						avgs[3][parseInt(g.f[1].v)-1] = avgs[3][parseInt(g.f[1].v)-1] + parseInt(g.f[6].v)
					}
					if(!(_filter['class'][4])){
						avgs[4][parseInt(g.f[1].v)-1] = avgs[4][parseInt(g.f[1].v)-1] + parseInt(g.f[7].v)
					}
					if(!(_filter['class'][5])){
						avgs[5][parseInt(g.f[1].v)-1] = avgs[5][parseInt(g.f[1].v)-1] + parseInt(g.f[8].v)
					}
					if(!(_filter['class'][6])){
						avgs[6][parseInt(g.f[1].v)-1] = avgs[6][parseInt(g.f[1].v)-1] + parseInt(g.f[9].v)
					}
					if(!(_filter['class'][7])){
						avgs[7][parseInt(g.f[1].v)-1] = avgs[7][parseInt(g.f[1].v)-1] + parseInt(g.f[10].v)
					}
					if(!(_filter['class'][8])){
						avgs[8][parseInt(g.f[1].v)-1] = avgs[8][parseInt(g.f[1].v)-1] + parseInt(g.f[11].v)
					}
					if(!(_filter['class'][9])){
						avgs[9][parseInt(g.f[1].v)-1] = avgs[9][parseInt(g.f[1].v)-1] + parseInt(g.f[12].v)
					}
					if(!(_filter['class'][10])){
						avgs[10][parseInt(g.f[1].v)-1] = avgs[10][parseInt(g.f[1].v)-1] + parseInt(g.f[13].v)
					}
					if(!(_filter['class'][11])){
						avgs[11][parseInt(g.f[1].v)-1] = avgs[11][parseInt(g.f[1].v)-1] + parseInt(g.f[14].v)
					}
					if(!(_filter['class'][12])){
						avgs[12][parseInt(g.f[1].v)-1] = avgs[12][parseInt(g.f[1].v)-1] + parseInt(g.f[15].v)
					}
					countDays[parseInt(g.f[1].v)-1]++
				}
				else if(parseInt(g.f[1].v) == 8){
					if(!(_filter['class'][0])){
						avgs[0][parseInt(g.f[1].v)-1] = avgs[0][parseInt(g.f[1].v)-1] + parseInt(g.f[3].v)
					}
					if(!(_filter['class'][1])){
						avgs[1][parseInt(g.f[1].v)-1] = avgs[1][parseInt(g.f[1].v)-1] + parseInt(g.f[4].v)
					}
					if(!(_filter['class'][2])){
						avgs[2][parseInt(g.f[1].v)-1] = avgs[2][parseInt(g.f[1].v)-1] + parseInt(g.f[5].v)
					}
					if(!(_filter['class'][3])){
						avgs[3][parseInt(g.f[1].v)-1] = avgs[3][parseInt(g.f[1].v)-1] + parseInt(g.f[6].v)
					}
					if(!(_filter['class'][4])){
						avgs[4][parseInt(g.f[1].v)-1] = avgs[4][parseInt(g.f[1].v)-1] + parseInt(g.f[7].v)
					}
					if(!(_filter['class'][5])){
						avgs[5][parseInt(g.f[1].v)-1] = avgs[5][parseInt(g.f[1].v)-1] + parseInt(g.f[8].v)
					}
					if(!(_filter['class'][6])){
						avgs[6][parseInt(g.f[1].v)-1] = avgs[6][parseInt(g.f[1].v)-1] + parseInt(g.f[9].v)
					}
					if(!(_filter['class'][7])){
						avgs[7][parseInt(g.f[1].v)-1] = avgs[7][parseInt(g.f[1].v)-1] + parseInt(g.f[10].v)
					}
					if(!(_filter['class'][8])){
						avgs[8][parseInt(g.f[1].v)-1] = avgs[8][parseInt(g.f[1].v)-1] + parseInt(g.f[11].v)
					}
					if(!(_filter['class'][9])){
						avgs[9][parseInt(g.f[1].v)-1] = avgs[9][parseInt(g.f[1].v)-1] + parseInt(g.f[12].v)
					}
					if(!(_filter['class'][10])){
						avgs[10][parseInt(g.f[1].v)-1] = avgs[10][parseInt(g.f[1].v)-1] + parseInt(g.f[13].v)
					}
					if(!(_filter['class'][11])){
						avgs[11][parseInt(g.f[1].v)-1] = avgs[11][parseInt(g.f[1].v)-1] + parseInt(g.f[14].v)
					}
					if(!(_filter['class'][12])){
						avgs[12][parseInt(g.f[1].v)-1] = avgs[12][parseInt(g.f[1].v)-1] + parseInt(g.f[15].v)
					}
					countDays[parseInt(g.f[1].v)-1]++
				}
				else if(parseInt(g.f[1].v) == 9){
					if(!(_filter['class'][0])){
						avgs[0][parseInt(g.f[1].v)-1] = avgs[0][parseInt(g.f[1].v)-1] + parseInt(g.f[3].v)
					}
					if(!(_filter['class'][1])){
						avgs[1][parseInt(g.f[1].v)-1] = avgs[1][parseInt(g.f[1].v)-1] + parseInt(g.f[4].v)
					}
					if(!(_filter['class'][2])){
						avgs[2][parseInt(g.f[1].v)-1] = avgs[2][parseInt(g.f[1].v)-1] + parseInt(g.f[5].v)
					}
					if(!(_filter['class'][3])){
						avgs[3][parseInt(g.f[1].v)-1] = avgs[3][parseInt(g.f[1].v)-1] + parseInt(g.f[6].v)
					}
					if(!(_filter['class'][4])){
						avgs[4][parseInt(g.f[1].v)-1] = avgs[4][parseInt(g.f[1].v)-1] + parseInt(g.f[7].v)
					}
					if(!(_filter['class'][5])){
						avgs[5][parseInt(g.f[1].v)-1] = avgs[5][parseInt(g.f[1].v)-1] + parseInt(g.f[8].v)
					}
					if(!(_filter['class'][6])){
						avgs[6][parseInt(g.f[1].v)-1] = avgs[6][parseInt(g.f[1].v)-1] + parseInt(g.f[9].v)
					}
					if(!(_filter['class'][7])){
						avgs[7][parseInt(g.f[1].v)-1] = avgs[7][parseInt(g.f[1].v)-1] + parseInt(g.f[10].v)
					}
					if(!(_filter['class'][8])){
						avgs[8][parseInt(g.f[1].v)-1] = avgs[8][parseInt(g.f[1].v)-1] + parseInt(g.f[11].v)
					}
					if(!(_filter['class'][9])){
						avgs[9][parseInt(g.f[1].v)-1] = avgs[9][parseInt(g.f[1].v)-1] + parseInt(g.f[12].v)
					}
					if(!(_filter['class'][10])){
						avgs[10][parseInt(g.f[1].v)-1] = avgs[10][parseInt(g.f[1].v)-1] + parseInt(g.f[13].v)
					}
					if(!(_filter['class'][11])){
						avgs[11][parseInt(g.f[1].v)-1] = avgs[11][parseInt(g.f[1].v)-1] + parseInt(g.f[14].v)
					}
					if(!(_filter['class'][12])){
						avgs[12][parseInt(g.f[1].v)-1] = avgs[12][parseInt(g.f[1].v)-1] + parseInt(g.f[15].v)
					}
					countDays[parseInt(g.f[1].v)-1]++
				}
				else if(parseInt(g.f[1].v) == 10){
					if(!(_filter['class'][0])){
						avgs[0][parseInt(g.f[1].v)-1] = avgs[0][parseInt(g.f[1].v)-1] + parseInt(g.f[3].v)
					}
					if(!(_filter['class'][1])){
						avgs[1][parseInt(g.f[1].v)-1] = avgs[1][parseInt(g.f[1].v)-1] + parseInt(g.f[4].v)
					}
					if(!(_filter['class'][2])){
						avgs[2][parseInt(g.f[1].v)-1] = avgs[2][parseInt(g.f[1].v)-1] + parseInt(g.f[5].v)
					}
					if(!(_filter['class'][3])){
						avgs[3][parseInt(g.f[1].v)-1] = avgs[3][parseInt(g.f[1].v)-1] + parseInt(g.f[6].v)
					}
					if(!(_filter['class'][4])){
						avgs[4][parseInt(g.f[1].v)-1] = avgs[4][parseInt(g.f[1].v)-1] + parseInt(g.f[7].v)
					}
					if(!(_filter['class'][5])){
						avgs[5][parseInt(g.f[1].v)-1] = avgs[5][parseInt(g.f[1].v)-1] + parseInt(g.f[8].v)
					}
					if(!(_filter['class'][6])){
						avgs[6][parseInt(g.f[1].v)-1] = avgs[6][parseInt(g.f[1].v)-1] + parseInt(g.f[9].v)
					}
					if(!(_filter['class'][7])){
						avgs[7][parseInt(g.f[1].v)-1] = avgs[7][parseInt(g.f[1].v)-1] + parseInt(g.f[10].v)
					}
					if(!(_filter['class'][8])){
						avgs[8][parseInt(g.f[1].v)-1] = avgs[8][parseInt(g.f[1].v)-1] + parseInt(g.f[11].v)
					}
					if(!(_filter['class'][9])){
						avgs[9][parseInt(g.f[1].v)-1] = avgs[9][parseInt(g.f[1].v)-1] + parseInt(g.f[12].v)
					}
					if(!(_filter['class'][10])){
						avgs[10][parseInt(g.f[1].v)-1] = avgs[10][parseInt(g.f[1].v)-1] + parseInt(g.f[13].v)
					}
					if(!(_filter['class'][11])){
						avgs[11][parseInt(g.f[1].v)-1] = avgs[11][parseInt(g.f[1].v)-1] + parseInt(g.f[14].v)
					}
					if(!(_filter['class'][12])){
						avgs[12][parseInt(g.f[1].v)-1] = avgs[12][parseInt(g.f[1].v)-1] + parseInt(g.f[15].v)
					}
					countDays[parseInt(g.f[1].v)-1]++
				}
				else if(parseInt(g.f[1].v) == 11){
					if(!(_filter['class'][0])){
						avgs[0][parseInt(g.f[1].v)-1] = avgs[0][parseInt(g.f[1].v)-1] + parseInt(g.f[3].v)
					}
					if(!(_filter['class'][1])){
						avgs[1][parseInt(g.f[1].v)-1] = avgs[1][parseInt(g.f[1].v)-1] + parseInt(g.f[4].v)
					}
					if(!(_filter['class'][2])){
						avgs[2][parseInt(g.f[1].v)-1] = avgs[2][parseInt(g.f[1].v)-1] + parseInt(g.f[5].v)
					}
					if(!(_filter['class'][3])){
						avgs[3][parseInt(g.f[1].v)-1] = avgs[3][parseInt(g.f[1].v)-1] + parseInt(g.f[6].v)
					}
					if(!(_filter['class'][4])){
						avgs[4][parseInt(g.f[1].v)-1] = avgs[4][parseInt(g.f[1].v)-1] + parseInt(g.f[7].v)
					}
					if(!(_filter['class'][5])){
						avgs[5][parseInt(g.f[1].v)-1] = avgs[5][parseInt(g.f[1].v)-1] + parseInt(g.f[8].v)
					}
					if(!(_filter['class'][6])){
						avgs[6][parseInt(g.f[1].v)-1] = avgs[6][parseInt(g.f[1].v)-1] + parseInt(g.f[9].v)
					}
					if(!(_filter['class'][7])){
						avgs[7][parseInt(g.f[1].v)-1] = avgs[7][parseInt(g.f[1].v)-1] + parseInt(g.f[10].v)
					}
					if(!(_filter['class'][8])){
						avgs[8][parseInt(g.f[1].v)-1] = avgs[8][parseInt(g.f[1].v)-1] + parseInt(g.f[11].v)
					}
					if(!(_filter['class'][9])){
						avgs[9][parseInt(g.f[1].v)-1] = avgs[9][parseInt(g.f[1].v)-1] + parseInt(g.f[12].v)
					}
					if(!(_filter['class'][10])){
						avgs[10][parseInt(g.f[1].v)-1] = avgs[10][parseInt(g.f[1].v)-1] + parseInt(g.f[13].v)
					}
					if(!(_filter['class'][11])){
						avgs[11][parseInt(g.f[1].v)-1] = avgs[11][parseInt(g.f[1].v)-1] + parseInt(g.f[14].v)
					}
					if(!(_filter['class'][12])){
						avgs[12][parseInt(g.f[1].v)-1] = avgs[12][parseInt(g.f[1].v)-1] + parseInt(g.f[15].v)
					}
					countDays[parseInt(g.f[1].v)-1]++
				}
				else if(parseInt(g.f[1].v) == 12){
					if(!(_filter['class'][0])){
						avgs[0][parseInt(g.f[1].v)-1] = avgs[0][parseInt(g.f[1].v)-1] + parseInt(g.f[3].v)
					}
					if(!(_filter['class'][1])){
						avgs[1][parseInt(g.f[1].v)-1] = avgs[1][parseInt(g.f[1].v)-1] + parseInt(g.f[4].v)
					}
					if(!(_filter['class'][2])){
						avgs[2][parseInt(g.f[1].v)-1] = avgs[2][parseInt(g.f[1].v)-1] + parseInt(g.f[5].v)
					}
					if(!(_filter['class'][3])){
						avgs[3][parseInt(g.f[1].v)-1] = avgs[3][parseInt(g.f[1].v)-1] + parseInt(g.f[6].v)
					}
					if(!(_filter['class'][4])){
						avgs[4][parseInt(g.f[1].v)-1] = avgs[4][parseInt(g.f[1].v)-1] + parseInt(g.f[7].v)
					}
					if(!(_filter['class'][5])){
						avgs[5][parseInt(g.f[1].v)-1] = avgs[5][parseInt(g.f[1].v)-1] + parseInt(g.f[8].v)
					}
					if(!(_filter['class'][6])){
						avgs[6][parseInt(g.f[1].v)-1] = avgs[6][parseInt(g.f[1].v)-1] + parseInt(g.f[9].v)
					}
					if(!(_filter['class'][7])){
						avgs[7][parseInt(g.f[1].v)-1] = avgs[7][parseInt(g.f[1].v)-1] + parseInt(g.f[10].v)
					}
					if(!(_filter['class'][8])){
						avgs[8][parseInt(g.f[1].v)-1] = avgs[8][parseInt(g.f[1].v)-1] + parseInt(g.f[11].v)
					}
					if(!(_filter['class'][9])){
						avgs[9][parseInt(g.f[1].v)-1] = avgs[9][parseInt(g.f[1].v)-1] + parseInt(g.f[12].v)
					}
					if(!(_filter['class'][10])){
						avgs[10][parseInt(g.f[1].v)-1] = avgs[10][parseInt(g.f[1].v)-1] + parseInt(g.f[13].v)
					}
					if(!(_filter['class'][11])){
						avgs[11][parseInt(g.f[1].v)-1] = avgs[11][parseInt(g.f[1].v)-1] + parseInt(g.f[14].v)
					}
					if(!(_filter['class'][12])){
						avgs[12][parseInt(g.f[1].v)-1] = avgs[12][parseInt(g.f[1].v)-1] + parseInt(g.f[15].v)
					}
					countDays[parseInt(g.f[1].v)-1]++
				}
			} //end dir
		}) //end avg build

		
		for(var i = 0;i<avgs.length;i++){
			for(var j = 0;j<avgs[i].length;j++){
				if(countDays[j] != 0){
					avgs[i][j] = avgs[i][j]/countDays[j]
				}
				else{
					avgs[i][j] = 0
				}
			}
		}

		//console.log(avgs)

	      x.domain([1,12]);

		  //adjust the y domain based on dir
		  y.domain([
			    0,
	    		d3.max(avgs, function(c) { return d3.max(c, function(v,i) { if(v != undefined || v != null || i != 13){return v;}; if(v == undefined || v == null){ return 0};  }); })
		  ]).nice();
		

		  var div = d3.select(elem).append("div")
			.attr("id","seasonalLineChartInfo")   
		    .style("position", "absolute")
		    .style("background-color","#fff")
			.style("z-index", "10")
			.style("visibility", "hidden")


		  var svg = d3.select(elem+" svg");
		    svg.selectAll("g").remove();
		    svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + seasonalLineChart.height + ")")
		      .call(xAxis)
		    .append("text")
		      .attr("class", "label")
		      .attr("x", seasonalLineChart.width)
		      .attr("y", -6)
		      .style("text-anchor", "end")

		  svg.append("g")
		      .attr("class", "y axis")
		      .attr("transform", "translate(" + (seasonalLineChart.margin.left) + "," + seasonalLineChart.margin.top + ")")
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
			      .data(avgs)
			    .enter().append("path")
				  .attr("class", function(d,i){return "classLine_"+parseInt(i+1)})
				  .attr("d", function(d) { return line(d) }) //Must be passed an array
				  .style("stroke", function(d,i) {return color2(i) })
				  .style("fill","none")		      

		      //Used for dots
			  var focus = svg.append("g")
			      .attr("transform", "translate(-100,-100)")
			      .attr("class", "focus");

			  focus.append("circle")
			      .attr("r", 3.5);

			//Below builds voronoi but needs hover for most important part?
			
			var temp = []
			for(var h = 0;h<avgs.length;h++){
				for(var hh = 0;hh < avgs[h].length;hh++){
					temp.push({'value':avgs[h][hh],'xax':hh,'graphData':avgs[h],'classID':h+1})
				}
								
			}

			  // console.log(temp)
			  // console.log(voronoi(temp))


			  var voronoiGroup = svg.append("g")
			      .attr("class", "voronoi");

			  voronoiGroup.selectAll("path")
			      .data(voronoi(temp))
			    .enter().append("path")
			      .attr("d", function(d) { if(d != undefined && d.length != 0){return "M" + d.join("L") + "Z"}; })
			      .datum(function(d) { if(d != undefined && d.length != 0){return d.point;} })
			      .on("mouseover", mouseover)
			      .on("mousemove", function(){return div.style("top", (d3.event.layerY)+"px").style("left",(d3.event.layerX+20)+"px");})
			      .on("mouseout", mouseout)
			      .style("fill","none")
			      .style("pointer-events","all")

			  //Below is hover info

			  //NOTE This data is already formatted in a way so that drawing all dots on hover may actually doable. Probably.

			  function mouseover(d) {
			  	$('#linegraph path').attr('opacity',0.1);
		  		$('.classLine_'+d.classID).attr('opacity',0.9);
		  		var dotData = d.graphData
				rect.select("rect")
				  .data(dotData)
				.enter().append("circle")
					  .attr("class","dot")
					  .attr("r", 3.5)
					  .attr("cx", function(d,i) { return x(i+1); })
					  .attr("cy", function(d) { return y(d); })
				      .style("fill", function(d,i) {return color(i); }); //Color has no specific functionality for now

		 		 var info =  "<p>Class "+d.classID+
	  						"<br>Average Vehicle Count: "+Math.floor(d.value)+
							"</p>";
					
			  		$("#seasonalLineChartInfo").html(info);
			  		return div.style("visibility", "visible");
			    //focus.attr("transform", "translate(" + x(d.xax+1) + "," + y(d.value) + ")"); //What's really used in voronoi dot formation
			  }

			  function mouseout(d) {
			   	svg.selectAll("circle").remove()
	    		$('#linegraph path').attr('opacity',1);
	    		$("#seasonalLineChartInfo").html('');
			  	return div.style("visibility", "hidden");
			    //focus.attr("transform", "translate(-100,-100)");
			  }

		    //draws best fit line

		    // rect.append("path")
			   //    .attr("class", function(d){return "classLine_"+d.stationId})
			   //    .attr("d", function(d) { if(dir === "count"){return line(d.avgOverWeight);} else{return line(d.perOverWeight);} }) //Must be passed an array
			   //    .style("stroke", function(d) { return color2(parseInt(d.funcCode[0])); })
			   //    .style("fill","none")
				  // .on("mouseover",function(d) {
				  // 		$('#linegraph path').attr('opacity',0.1);
				  // 		$('.classLine_'+d.stationId).attr('opacity',0.9);
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