(function() {
  var wimCal = {
    version: "0.2.0"
  }
  var _FILTERS = {
    // data filters for various classes. False indicates filter is inactive.
    // indexes [0, 12] correspond to classes [2, 14]
      class: [false,false,false,false,false,false,false,false,false,false,false,false,false],
    }

  //This is used to set colors for the calendar and legend
  var colorRange = colorbrewer.RdYlGn[11]//.reverse();


  /*

  The below function is used to create a calendar display. It takes three arguments:

  min: The lowest year in range

  max: The highest year in range

  caltype: The type of calendar. With the exception of the value "status", caltype only determines which
  div on the display page the graph will be placed. When the value "status" is passed, the code assumes
  the calendar is being created on the calendar status page so it has extra code added in for reloading
  so that duplicate calendars aren't displayed and such.

  This function returns a listing of information for drawing the calendar.

  */

  function _init(min,max,caltype){

    var html = []; //This array will contain all the drawing variables

    if(caltype === "status"){
      caltype = ""
      var caldiv = d3.select("#caldiv"+caltype);
      var svgTemp = caldiv.selectAll("svg");
      svgTemp.remove();
    }
    var caldiv = d3.select("#caldiv"+caltype);
    //The below two if statements are for when newer traffic monitoring formats are being used.
    if(parseInt(min) >= 2000){
      min = parseInt(min) - 2000
      max = parseInt(max) - 2000
    }
    else if(parseInt(max) >= 2000){
      min = parseInt(min) - 2000
      max = parseInt(max) - 2000
    }
    //For setting the size of the calendar
    var m = {top: 10, right: 10, bottom: 25, left: 80},
      w = parseInt($('.body').width())-m.right,
      z = parseInt(w/60),
      h = parseInt(z*7);
      

      //For setting up where data will be input in the calendar
      var day = d3.time.format("%w"),
          week = d3.time.format("%U"),
          //percent = d3.format(".1%"),
          format = d3.time.format("%Y-%m-%d");

      //The svg that holds the calender. It currently assumes that the year 2000 is the lowest year

      var svg = d3.select("#caldiv"+caltype).selectAll("svg")
              .data(d3.range(2000+parseInt(min), 2001+parseInt(max)))
            .enter().append("svg")
              .attr("width", 1800)
              .attr("height", 300)
              .attr("class", "RdYlGn")
            .append("g")
              .attr("transform", "translate(" + (m.bottom + (w - z * 53) / 2) + "," + (m.top + (h - z * 7) / 2) + ")");
          
          svg.append("text")
              .attr("transform", "translate(-6," + z * 3.5 + ")rotate(-90)")
              .attr("text-anchor", "middle")
              .text(String);
      
      //Below is where the individual rectangles for each day are created

      var rect = svg.selectAll("rect.day")
              .data(function(d) { 
                return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
            .enter().append("rect")
              .attr("class", "day")
              .attr("width", z)
              .attr("height", z)
              .attr("x", function(d) { return week(d) * z; })
              .attr("y", function(d) { return day(d) * z; })
              //.map(format);

          rect.append("title")
              .text(function(d) { return d; });


      //The svg that holds the calendar legend

      var svg2 = d3.select("#legend"+caltype).selectAll("svg")
          .data(d3.range(0, 1))
        .enter().append("svg")
          .attr("width", 1300)
          .attr("height", 20)
          .attr("class", "RdYlGn")
        .append("g")
          .attr("transform", "translate(0,0)");
          
      //Add draw variables to the array and return.    
      html.push(z)
      html.push(day)
      html.push(week)
      html.push(svg)
      html.push(svg2)
      html.push(rect)

      return html

  } // end init

//Below code colors in the calendar

wimCal.colorDays = function(svg,input_data,monthPath,rect,color,dispType){
  var format = d3.time.format("%Y-%m-%d");

  svg.selectAll("path.month")
        .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
      .enter().append("path")
        .attr("class", "month")
        .attr("d", monthPath);
  var data = d3.nest() 
        .key(function(d) {  return d.date; }) //Creates key value
        .rollup(function(d) { 
          if(dispType === "Weight"){
            return +d[0].averageWeight; 
          }
          else{
            return +d[0].numTrucks; 
          }
        }) //create pair value
        .map(input_data); //Turns code into an array of objects
        svg.selectAll('rect.day').attr('style','fill:#fff');

        //Below code colors in the calendar
        rect.filter(function(d) { return format(d) in data; })
            .attr("style", function(d) { 
              return  "fill:"+color(data[format(d)])+";"; })
          .select("title") //Creates hover icon
            .text(function(d) { return d + ": " + data[format(d)]; }); //creates hover icon
   
    return data;

  }//end colorDays

  /*

  Below code draws the calendar. Mostly takes values from the drawvars array.

  Parameters:

  rect: The rectangle values created in init (found in drawVars)

  svg: The calendar svg (found in drawVars)

  input_data: The data to be visualized

  day: Day format from _init (found in drawVars)

  week: Week format from _init (found in drawVars)

  z: Used for size of individual rectangles (found in drawVars)

  svg2: The legend svg (found in drawVars)

  dispType: The kind of data being displayed

  caltype: Which calendar div that is getting drawn on.

  */

  wimCal.drawCalendar = function(rect,svg,input_data,day,week,z,svg2,dispType,caltype){
     
      var values = [];
      input_data.forEach(function(input){
        if(dispType === "Weight"){
          values.push(+input.averageWeight);
        }
        else{
          values.push(+input.numTrucks);  
        }
      })

      var color = d3.scale.quantize()
          .domain([d3.min(values), d3.max(values)])
          .range(colorRange);

        var data = wimCal.colorDays(svg,input_data,monthPath,rect,color,dispType)
        
        

        //Legend is drawn below


          //truckData should contain strings detailing which truck goes where
          // if(typeof wimCal.legend != 'undefined'){
          //   wimCal.legend.remove();
          // }

          var truckData = [Math.floor(color.invertExtent("#a50026")[0]) + " - " + Math.floor(color.invertExtent("#a50026")[1]),
                           Math.floor(color.invertExtent("#d73027")[0]) + " - " + Math.floor(color.invertExtent("#d73027")[1]),
                           Math.floor(color.invertExtent("#f46d43")[0]) + " - " + Math.floor(color.invertExtent("#f46d43")[1]),
                           Math.floor(color.invertExtent("#fdae61")[0]) + " - " + Math.floor(color.invertExtent("#fdae61")[1]),
                           Math.floor(color.invertExtent("#fee08b")[0]) + " - " + Math.floor(color.invertExtent("#fee08b")[1]),
                           Math.floor(color.invertExtent("#ffffbf")[0]) + " - " + Math.floor(color.invertExtent("#ffffbf")[1]),
                           Math.floor(color.invertExtent("#d9ef8b")[0]) + " - " + Math.floor(color.invertExtent("#d9ef8b")[1]),
                           Math.floor(color.invertExtent("#a6d96a")[0]) + " - " + Math.floor(color.invertExtent("#a6d96a")[1]),
                           Math.floor(color.invertExtent("#66bd63")[0]) + " - " + Math.floor(color.invertExtent("#66bd63")[1]),
                           Math.floor(color.invertExtent("#1a9850")[0]) + " - " + Math.floor(color.invertExtent("#1a9850")[1]),
                           Math.floor(color.invertExtent("#006837")[0]) + " - " + Math.floor(color.invertExtent("#006837")[1])]

          var color2 = d3.scale.ordinal()
          .range(colorRange);
          wimCal.legend = svg2.selectAll("#legend"+caltype)
          .data(truckData.slice())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(" + i * 95 + ",0)"; }); //Displays ordering of legend
        
     
        //Coordinates of legend
          wimCal.legend.append("rect")
              .attr("x", 0)
              .attr("y", 0)
              .attr("width", 95)
              .attr("height", 18)
              .style("fill", color2)    //Sets text of legend
          
          wimCal.legend.append("text")
              .attr("x", 10)
              .attr("y", 10)     
              .attr("dy", ".35em")
              .attr("text-anchor", "front")
              .attr("font-size","10px")
              .attr("color","#fff")
              .text(function(d) { return d; });

    function monthPath(t0) {
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = +day(t0), w0 = +week(t0),
            d1 = +day(t1), w1 = +week(t1);
        return "M" + (w0 + 1) * z + "," + d0 * z
            + "H" + w0 * z + "V" + 7 * z
            + "H" + w1 * z + "V" + (d1 + 1) * z
            + "H" + (w1 + 1) * z + "V" + 0
            + "H" + (w0 + 1) * z + "Z";
      }

      
  } // end drawCalendar

  //When all post requests on either the station or status page are done, the below code is called to draw all
  //the calendars

  wimCal.init = function($scope) {


    //The below if statement is only executed for the status page
        
     if($scope.curAgency != undefined){
      var x = 0
      if($scope.myDataDisp33 === "Class"){
        if($scope.curAgency.dataC[x].f[1].v == null){
          while($scope.curAgency.dataC[x].f[1].v == null){
            x++
          }
        }
        $scope.drawVars = _init($scope.curAgency.dataC[x].f[1].v,$scope.curAgency.dataC[$scope.curAgency.dataC.length-1].f[1].v,"status")
        wimCal.calCreate($scope.drawVars[5],$scope.drawVars[3],$scope.myClass,$scope.drawVars[1],$scope.drawVars[2],$scope.curAgency.dataC,$scope.drawVars[0],$scope.drawVars[4],"trucks","status")
      }
      else{
        if($scope.curAgency.data[x].f[1].v == null){
          while($scope.curAgency.data[x].f[1].v == null){
            x++
          }
        }
        $scope.drawVars = _init($scope.curAgency.data[x].f[1].v,$scope.curAgency.data[$scope.curAgency.data.length-1].f[1].v,"status")
        wimCal.calCreate($scope.drawVars[5],$scope.drawVars[3],$scope.myClass,$scope.drawVars[1],$scope.drawVars[2],$scope.curAgency.data,$scope.drawVars[0],$scope.drawVars[4],"trucks","status")
        
      }
      return
     }

     //End status page drawing

     //Below is for drawing on the station page
           
    $scope.drawVars = _init($scope.minYear,$scope.maxYear,"");
    seasonalLineChart.drawseasonalLineChart("#seasonalLineGraph",$scope.stationDataAll,$scope.myDir2,_FILTERS)
    wimCal.calCreate($scope.drawVars[5],$scope.drawVars[3],$scope.myClass,$scope.drawVars[1],$scope.drawVars[2],$scope.stationDataAll,$scope.drawVars[0],$scope.drawVars[4],"Count",$scope.myDataDisp)
    _WIMGrapher("#seasonalLegend");
    if($scope.stationType === "wim"){
          wimCal.calCreate($scope.drawVars[5],$scope.drawVars[3],$scope.myClass,$scope.drawVars[1],$scope.drawVars[2],$scope.stationData2,$scope.drawVars[0],$scope.drawVars[4],"trucks",$scope.myDataDisp)
          $scope.$apply(function(){
            $scope.loading2 = false
            $scope.loading = false
            $scope.myDataDisp = $scope.values3[0].id
          });
          $scope.drawVars2 = _init($scope.minYear,$scope.maxYear,"ton");
          wimCal.calCreate($scope.drawVars2[5],$scope.drawVars2[3],9,$scope.drawVars2[1],$scope.drawVars2[2],$scope.stationTonageData,$scope.drawVars2[0],$scope.drawVars2[4],"trucks","Ton")
          $scope.reloadTable()
    } //End of if($scope.stationType === "wim")
                
    //End station page drawing
              

  

////////////////////////////////////////////////////////////////////////////////////////////////////////////

//This code is ported from the wimgraph code. It creates the interactive legend used in conjunction with
//the seasonal line and bar graphs

                function _WIMGrapher(id) {
                  
                  // create class and weight scales

                  // this scales maps classes to array index
                  var classScale = d3.scale.ordinal()
                    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
                    .range([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
                  // used to color class and weight legends
                  var _LEGEND_COLORS = {
                    class: ["#08306b", "#08519c", "#2171b5", "#4292c6", "#6baed6", "#9ecae1","#ddffff","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"],
                  }
                  

                  // create legends
                  var legendDIV = d3.select(id).append('div')
                    .attr('id', 'legendDIV');
                  // class legend
                  var classLegend = legendDIV.append('div')
                    .attr('class', 'legend');
                  var classValues = [0,1,2,3,4,5,6,7,8,9,10,11,12]

                  _createLegendLabels(classLegend, classValues, 'class')

                  // this function creates the labels for the legend parameter
                  // values is an array of data the data contains
                  //    labels for data not included in values are not created
                  // attr is the weight or class label
                  function _createLegendLabels(legend, values, attr) {
                    values.sort(function(a, b) { return a-b; });

                    var labels = legend.selectAll('a').data(values);

                    labels.exit().remove();

                    labels.enter().append('a')
                      .attr('class', attr+'-label')
                      .on('click', function(d) {
                        clicked = true;
                        var self = d3.select(this)

                        self.classed('inactive', !self.classed('inactive'));
                        _FILTERS[attr][d] = self.classed('inactive');

                        if (self.classed('inactive')) {
                          self.style('background', null)
                        } else {
                          self.style('background', function(d) {
                            return _LEGEND_COLORS[attr][d];
                          })
                        }

                        //When a value on the interactive legend is changed.
                        seasonalLineChart.drawseasonalLineChart("#seasonalLineGraph",$scope.stationDataAll,$scope.myDir2,_FILTERS)
                        seasonalBarGraph.drawseasonalBarGraph("#seasonalBarGraph",$scope.stationDataAll,$scope.directionValues2[1].id,$scope.directionValues2[2].id,_FILTERS)

                      })
                      .on('mouseover', function(d) {
                        d3.selectAll('.'+attr + d)
                          .style('opacity', 1.0)
                          .attr('fill', '#d73027')
                      })
                      .on('mouseout', function(d) {
                        d3.selectAll('.'+attr + d)
                          .style('opacity', 0.75)
                          .attr('fill', function() { return _LEGEND_COLORS[attr][d]; })
                      });

                    labels.classed('inactive', function(d) {
                        return _FILTERS[attr][d]
                      })
                      .style('background', function(d) {
                        if (d3.select(this).classed('inactive')) {
                          return null;
                        }
                        return _LEGEND_COLORS[attr][d];
                      })
                      .text(function(d, i) {
                        var text;
                        if (attr === 'weight') {
                           if (d < weightScale.range().length-1) {
                            text = (d*20).toString() +'-'+((d+1)*20) +'k lbs.';
                           } else {
                            text = (d*20).toString()+'k+ lbs.';
                           }
                        } else {
                          text = 'Cls '+classScale.domain()[d];
                        }
                        return text;
                      })

                    legend.style('width', function() {
                        var w = parseInt(d3.select('.'+attr+'-label').style('width'));
                        return ((61.3) * values.length) + 'px';
                      })
                      .style('background-color', '#000');
                  }
                }

////////////////////////////////////////////////////////////////////////////////////////////////////////////
}// end init

//The below code is used to manage and organize data so that the right kind of calendar is drawn.


wimCal.calCreate = function(rect,svg,classT,day,week,data,z,svg2,dispType,dispType2){
      if(dispType2 === "Freight"){
        wimCal.drawCalendar(rect,svg,parseDataF(data,classT),day,week,z,svg2,dispType,"");
      }
      else if(dispType2 === "Ton"){
        wimCal.drawCalendar(rect,svg,parseDataT(data,classT),day,week,z,svg2,dispType,"ton");
      }
      else if(dispType2 === "status"){
        wimCal.drawCalendar(rect,svg,parseDataT(data,"status"),day,week,z,svg2,dispType,"");  
      }
      else{
        wimCal.drawCalendar(rect,svg,parseDataA(data,classT),day,week,z,svg2,dispType,""); 
      }
  };

function parseDataA(input,classInfo){
  var output = [];
  if(input != null){
    if(input.rows != undefined){
      input.rows.forEach(function(row){

            var item = {}
            var string = ""
            var yearStr = row.f[0].v
            var totalTrucks = 0;
            if(parseInt(yearStr) >= 2000){
              yearStr = yearStr.slice(2,4)
            }
            else if(row.f[0].v < 10){
              yearStr = "0"+row.f[0].v
            }
            if(classInfo == 0){
              totalTrucks = parseInt(row.f[3].v) + parseInt(row.f[4].v) + parseInt(row.f[5].v) + parseInt(row.f[6].v) + parseInt(row.f[7].v) + parseInt(row.f[8].v) + parseInt(row.f[9].v) + parseInt(row.f[10].v) + parseInt(row.f[11].v) + parseInt(row.f[12].v) + parseInt(row.f[13].v) + parseInt(row.f[14].v) + parseInt(row.f[15].v)
            }
            else{
              totalTrucks = parseInt(row.f[classInfo+2].v);
            }
            if(row.f[1].v < 10){
                  if(row.f[2].v < 10){
                    string= "20"+yearStr+"-0"+row.f[1].v+"-0"+row.f[2].v
                  }else{
                    string = "20"+yearStr+"-0"+row.f[1].v+"-"+row.f[2].v
                  }
            }else{
                  if(row.f[2].v < 10){
                    string = "20"+yearStr+"-"+row.f[1].v+"-0"+row.f[2].v
                  }else{
                    string = "20"+yearStr+"-"+row.f[1].v+"-"+row.f[2].v
                  }
            }

                  item.date = string;
                  item.numTrucks = totalTrucks;
                  output.push(item);
      });
    }
  }
  return output
};

function parseDataF(input,classInfo){
  var output = [];
  if(input != null){
    if(input.rows != undefined){
      input.rows.forEach(function(row){
        if(classInfo == 0 || classInfo == row.f[4].v){
            var item = {}
            var x = 0
            var string = ""
            var yearStr = row.f[5].v
            if(parseInt(yearStr) >= 2000){
              yearStr = yearStr.slice(2,4)
            }
            else if(row.f[5].v < 10){
              yearStr = "0"+row.f[5].v
            }
            if(row.f[2].v < 10){
                  if(row.f[3].v < 10){
                    string= "20"+yearStr+"-0"+row.f[2].v+"-0"+row.f[3].v
                  }else{
                    string = "20"+yearStr+"-0"+row.f[2].v+"-"+row.f[3].v
                  }
            }else{
                  if(row.f[3].v < 10){
                    string = "20"+yearStr+"-"+row.f[2].v+"-0"+row.f[3].v
                  }else{
                    string = "20"+yearStr+"-"+row.f[2].v+"-"+row.f[3].v
                  }
            }

                for(var i = 0;i<output.length;i++){
                  if(output[i].date == string){
                    output[i].numTrucks = parseInt(row.f[1].v) + parseInt(output[i].numTrucks)
                    output[i].totalWeight = parseInt(row.f[6].v) + parseInt(output[i].totalWeight)
                    x = 1
                    break
                  }
                }
                if(x == 0){
                  item.date = string;
                  item.numTrucks = parseInt(row.f[1].v);
                  item.totalWeight = parseInt(row.f[6].v)
                  item.averageWeight = parseInt(row.f[6].v) / parseInt(row.f[1].v)
                  output.push(item);
                }
                x = 0 
             }

            
      });
    }
  }
  return output
};



function parseDataT(input,classInfo){
  var output = [];
  if(input != null){
    if(classInfo === "status"){
      input.forEach(function(row){

              var item = {}
              var string = ""
              var totalTrucks = parseInt(row.f[0].v)

              if(parseInt(row.f[1].v) >= 2000){
                row.f[1].v = row.f[1].v.slice(2,4)
                
              }
              if(parseInt(row.f[1].v) < 10){
                string = "200"+parseInt(row.f[1].v)
              }
              else{
                string = "20"+parseInt(row.f[1].v)
              }
              if(parseInt(row.f[2].v) < 10){
                string = string+"-0"+row.f[2].v
              }
              else{
                string = string+"-"+row.f[2].v 
              }
              if(parseInt(row.f[3].v) < 10){
                string = string+"-0"+row.f[3].v
              }
              else{
                string = string+"-"+row.f[3].v 
              }

                    item.date = string;
                    item.numTrucks = totalTrucks;
                    output.push(item);
        });  
    }
    else{
      if(input.rows != undefined){
    
        input.rows.forEach(function(row){

              var item = {}
              var string = ""
              var totalTrucks = parseInt(row.f[0].v) + parseInt(row.f[4].v) + parseInt(row.f[5].v) + parseInt(row.f[6].v) + parseInt(row.f[7].v) + parseInt(row.f[8].v) + parseInt(row.f[9].v) + parseInt(row.f[10].v) + parseInt(row.f[11].v) + parseInt(row.f[12].v) + parseInt(row.f[13].v);
              if(parseInt(row.f[1].v) >= 2000){
                row.f[1].v = row.f[1].v.slice(2,4)
              }
              if(parseInt(row.f[1].v) < 10){
                string = "200"+parseInt(row.f[1].v)
              }
              else{
                string = "20"+parseInt(row.f[1].v)
              }
              if(parseInt(row.f[2].v) < 10){
                string = string+"-0"+row.f[2].v
              }
              else{
                string = string+"-"+row.f[2].v 
              }
              if(parseInt(row.f[3].v) < 10){
                string = string+"-0"+row.f[3].v
              }
              else{
                string = string+"-"+row.f[3].v 
              }

                    item.date = string;
                    item.numTrucks = totalTrucks;
                    output.push(item);
        });
      }
   }
  }
  return output
};


  this.wimCal = wimCal;
})()