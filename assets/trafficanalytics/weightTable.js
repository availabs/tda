var weightTable = {
	
	tableCreate:function(cleanData,organizationType,dir,elem){
		if(cleanData.rows != undefined){
			var data = [[],[],[],[],[],[],[]]
			var total = 0
			var max = 0
			for(var i = 0;i<data.length;i++){
				for(var j = 0;j<12;j++){
					data[i].push([0,0,0]) //numtrucks,numdays,percent,average count
				}
			}
			//console.log(dir)
			cleanData.rows.forEach(function(row){
				var hour = row.f[1].v
				if(dir == -1 || row.f[3].v == dir){
					if(hour < 2){
						data[(row.f[0].v)-1][0][0] = parseInt(row.f[2].v) + data[(row.f[0].v)-1][0][0] 
						data[(row.f[0].v)-1][0][1]++
					}
					else if(hour > 1 && hour < 4){
						data[(row.f[0].v)-1][1][0] = parseInt(row.f[2].v) + data[(row.f[0].v)-1][0][0] 
						data[(row.f[0].v)-1][1][1]++
					}
					else if(hour > 3 && hour < 6){
						data[(row.f[0].v)-1][2][0] = parseInt(row.f[2].v) + data[(row.f[0].v)-1][0][0] 
						data[(row.f[0].v)-1][2][1]++
					}
					else if(hour > 5 && hour < 8){
						data[(row.f[0].v)-1][3][0] = parseInt(row.f[2].v) + data[(row.f[0].v)-1][0][0] 
						data[(row.f[0].v)-1][3][1]++
					}
					else if(hour > 7 && hour < 10){
						data[(row.f[0].v)-1][4][0] = parseInt(row.f[2].v) + data[(row.f[0].v)-1][0][0] 
						data[(row.f[0].v)-1][4][1]++
					}
					else if(hour > 9 && hour < 12){
						data[(row.f[0].v)-1][5][0] = parseInt(row.f[2].v) + data[(row.f[0].v)-1][0][0] 
						data[(row.f[0].v)-1][5][1]++
					}
					else if(hour > 11 && hour < 14){
						data[(row.f[0].v)-1][6][0] = parseInt(row.f[2].v) + data[(row.f[0].v)-1][0][0] 
						data[(row.f[0].v)-1][6][1]++
					}
					else if(hour > 13 && hour < 16){
						data[(row.f[0].v)-1][7][0] = parseInt(row.f[2].v) + data[(row.f[0].v)-1][0][0] 
						data[(row.f[0].v)-1][7][1]++	
					}
					else if(hour > 15 && hour < 18){
						data[(row.f[0].v)-1][8][0] = parseInt(row.f[2].v) + data[(row.f[0].v)-1][0][0] 
						data[(row.f[0].v)-1][8][1]++
					}
					else if(hour > 17 && hour < 20){
						data[(row.f[0].v)-1][9][0] = parseInt(row.f[2].v) + data[(row.f[0].v)-1][0][0] 
						data[(row.f[0].v)-1][9][1]++
					}
					else if(hour > 19 && hour < 22){
						data[(row.f[0].v)-1][10][0] = parseInt(row.f[2].v) + data[(row.f[0].v)-1][0][0] 
						data[(row.f[0].v)-1][10][1]++
					}
					else{
						data[(row.f[0].v)-1][11][0] = parseInt(row.f[2].v) + data[(row.f[0].v)-1][0][0] 
						data[(row.f[0].v)-1][11][1]++
					}
					total = total + parseInt(row.f[2].v)
				}
			});
			//console.log(total)
			for(var i = 0;i<data.length;i++){
				for(var j = 0;j<12;j++){
					if(organizationType === "count"){
						data[i][j][2] = parseFloat(data[i][j][0]/data[i][j][1]).toFixed(2)
						if(data[i][j][2] > max){
							max = data[i][j][2]
						}
					}
					else{
						data[i][j][2] = parseFloat(((data[i][j][0]/total)*100).toFixed(2))
						if(data[i][j][2] > max){
							max = data[i][j][2]
						}
					}
				}
			}
			var htmlCode = "<table class=\"table table-hover table-bordered\">";
			htmlCode = htmlCode+"<tr><th>Day</th><th>0:00-2:00</th><th>2:00-4:00</th><th>4:00-6:00</th>"+
			"<th>6:00-8:00</th><th>8:00-10:00</th><th>10:00-12:00</th><th>12:00-14:00</th>"+
			"<th>14:00-16:00</th><th>16:00-18:00</th><th>18:00-20:00</th><th>20:00-22:00</th><th>22:00-24:00</th></tr>"
			if(organizationType === "percent"){
					var color = d3.scale.quantize()
						.domain([0,max])
						.range(colorbrewer.RdYlGn[11].reverse());	
				}
			else{
				var color = d3.scale.quantize()
					.domain([0,max])
					.range(colorbrewer.RdYlGn[11]);
			}
			for(var x = 0;x<data.length;x++){
					if(x == 0){
						htmlCode = htmlCode + "<tr><th>Sunday</th>"
						if(organizationType === "percent"){
							for(var y = 0;y<12;y++){
								htmlCode = htmlCode + "<th bgcolor="+color(data[x][y][2])+">"+data[x][y][2]+"%</th>"
							}
						}
						else{
							for(var y = 0;y<12;y++){
								htmlCode = htmlCode + "<th bgcolor="+color(data[x][y][2])+">"+data[x][y][2]+"</th>"
							}
						}
						htmlCode = htmlCode + "</tr>"
					}
					
					else if(x == 1){
						htmlCode = htmlCode + "<tr><th>Monday</th>"
						if(organizationType === "percent"){
							for(var y = 0;y<12;y++){
								htmlCode = htmlCode + "<th bgcolor="+color(data[x][y][2])+">"+data[x][y][2]+"%</th>"
							}
						}
						else{
							for(var y = 0;y<12;y++){
								htmlCode = htmlCode + "<th bgcolor="+color(data[x][y][2])+">"+data[x][y][2]+"</th>"
							}
						}
						htmlCode = htmlCode + "</tr>"
					}
					else if(x == 2){
						htmlCode = htmlCode + "<tr><th>Tuesday</th>"
						if(organizationType === "percent"){
							for(var y = 0;y<12;y++){
								htmlCode = htmlCode + "<th bgcolor="+color(data[x][y][2])+">"+data[x][y][2]+"%</th>"
							}
						}
						else{
							for(var y = 0;y<12;y++){
								htmlCode = htmlCode + "<th bgcolor="+color(data[x][y][2])+">"+data[x][y][2]+"</th>"
							}
						}
						htmlCode = htmlCode + "</tr>"
					}
					else if(x == 3){
						htmlCode = htmlCode + "<tr><th>Wednesday</th>"
						if(organizationType === "percent"){
							for(var y = 0;y<12;y++){
								htmlCode = htmlCode + "<th bgcolor="+color(data[x][y][2])+">"+data[x][y][2]+"%</th>"
							}
						}
						else{
							for(var y = 0;y<12;y++){
								htmlCode = htmlCode + "<th bgcolor="+color(data[x][y][2])+">"+data[x][y][2]+"</th>"
							}
						}
						htmlCode = htmlCode + "</tr>"
					}
					else if(x == 4){
						htmlCode = htmlCode + "<tr><th>Thursday</th>"
						if(organizationType === "percent"){
							for(var y = 0;y<12;y++){
								htmlCode = htmlCode + "<th bgcolor="+color(data[x][y][2])+">"+data[x][y][2]+"%</th>"
							}
						}
						else{
							for(var y = 0;y<12;y++){
								htmlCode = htmlCode + "<th bgcolor="+color(data[x][y][2])+">"+data[x][y][2]+"</th>"
							}
						}
						htmlCode = htmlCode + "</tr>"
					}
					else if(x == 5){
						htmlCode = htmlCode + "<tr><th>Friday</th>"
						if(organizationType === "percent"){
							for(var y = 0;y<12;y++){
								htmlCode = htmlCode + "<th bgcolor="+color(data[x][y][2])+">"+data[x][y][2]+"%</th>"
							}
						}
						else{
							for(var y = 0;y<12;y++){
								htmlCode = htmlCode + "<th bgcolor="+color(data[x][y][2])+">"+data[x][y][2]+"</th>"
							}
						}
						htmlCode = htmlCode + "</tr>"
					}
					else{
						htmlCode = htmlCode + "<tr><th>Saturday</th>"
						if(organizationType === "percent"){
							for(var y = 0;y<12;y++){
								htmlCode = htmlCode + "<th bgcolor="+color(data[x][y][2])+">"+data[x][y][2]+"%</th>"
							}
						}
						else{
							for(var y = 0;y<12;y++){
								htmlCode = htmlCode + "<th bgcolor="+color(data[x][y][2])+">"+data[x][y][2]+"</th>"
							}
						}
						htmlCode = htmlCode + "</tr>"
					}

			}
			htmlCode = htmlCode + "</table>"
			// console.log(data)
			$(elem).html(htmlCode);
		}	
	},	

	removeTable:function(elem){
		$(elem).html('')
	},

}