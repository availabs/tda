(function() {
  var wimCal = {
    version: "0.2.0"
  }
  var _FILTERS = {
    // data filters for various classes. False indicates filter is inactive.
    // indexes [0, 12] correspond to classes [2, 14]
      class: [false,false,false,false,false,false,false,false,false,false,false,false,false],
    }

  function _init(min,max,caltype){
    var html = [];
    var caldiv = d3.select("#caldiv"+caltype);
    var m = {top: 10, right: 10, bottom: 25, left: 80},
      w = parseInt($('.body').width())-m.right,
      z = parseInt(w/54),
      h = parseInt(z*7);
      
      var day = d3.time.format("%w"),
          week = d3.time.format("%U"),
          //percent = d3.format(".1%"),
          format = d3.time.format("%Y-%m-%d");

      if(parseInt(min) < 10){
            min = "0"+min
          }
          if(parseInt(max) < 10){
            max = "0"+max
          }

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
          
          var svg2 = d3.select("#legend"+caltype).selectAll("svg")
              .data(d3.range(0, 1))
            .enter().append("svg")
              .attr("width", 1300)
              .attr("height", 20)
              .attr("class", "RdYlGn")
            .append("g")
              .attr("transform", "translate(60,0)");
          
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

      html.push(z)
      html.push(day)
      html.push(week)
      html.push(svg)
      html.push(svg2)
      html.push(rect)

      return html

  } // end init

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
          .range(colorbrewer.RdYlGn[11]);

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
          .range(["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"]);
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

  wimCal.init = function($scope) {

        $scope.values = [
          { id: 0, label: 'All' },
          { id: 1, label: '1' },
          { id: 2, label: '2' },
          { id: 3, label: '3' },
          { id: 4, label: '4' },
          { id: 5, label: '5' },
          { id: 6, label: '6' },
          { id: 7, label: '7' },
          { id: 8, label: '8' },
          { id: 9, label: '9' },
          { id: 10, label: '10' },
          { id: 11, label: '11' },
          { id: 12, label: '12' },
          { id: 13, label: '13' },
        ];
        $scope.values2 = [
          { id: "Weight", label: 'Weight' },
          { id: "Count", label: 'Count' },
        ];
        $scope.values3 = [
          { id: "Freight", label:'Freight'},
          { id: "Class", label:'Class'},
        ];
        $scope.values4 = [
          {id: "percent", label:'Percent'},
          {id: "count", label:'Count'},
          ];
        $scope.values5 = [
          {id: "Days", label:'Days'},
          {id: "Hours", label:'Hours'},
          ];
      $scope.myClass = 0;
      $scope.myDisp = "Count";
      $scope.myDataDisp = "Class";
      $scope.directionValues = [];
      $scope.directionValues2 = [];
      $scope.myTableDisp = $scope.values4[0].id
      $scope.myDir = -1
      $scope.myDir2 = -1
      $scope.loading = true
      $scope.loading2 = true
      $scope.yearRange = []
      $scope.dataRange = []
      $scope.point = 0
      $scope.myYear = ""
      $scope.myReport = "Days"
      var dir1 = -1
      var dir2 = -1

      

           $scope.minYear = ""
           $scope.maxYear = ""
           $scope.drawVars = []

          var URL = '/station/yearsActive';
          seasonalLineChart.initseasonalLineChart("#seasonalLineGraph",'.tab-content')
          seasonalBarGraph.initseasonalBarGraph("#seasonalBarGraph",'.tab-content')
          wimXHR.post(URL, {isClass:$scope.stationType,id:$scope.station},function(error, data) {
              if(error){
                console.log(error)
                return
              }
              $scope.minYear = data.rows[0].f[0].v;
              $scope.maxYear = data.rows[0].f[1].v;
              $scope.yearRange = d3.range(2000+parseInt($scope.minYear), 2001+parseInt($scope.maxYear))
              $scope.$apply(function(){
                $scope.myYear = $scope.yearRange[0]
              });
              $scope.drawVars = _init($scope.minYear,$scope.maxYear,"");

              $scope.stationData2 = [];
              $scope.stationDataAll = [];
              $scope.reportData = [];
              $scope.stationTonageData = [];
              $scope.myClass = $scope.values[0].id;
              $scope.myDisp = $scope.values2[1].id;
              $scope.myDataDisp = $scope.values3[0].id;

              wimXHR.post('/station/reportAmounts', {'id':$scope.station,'CoW':$scope.stationType,'year':(parseInt($scope.myYear)-2000)},function(error, data) {

                $scope.reportData = data
                $scope.dataRange = reportTable.drawTable('#reportTab',$scope.reportData,"Days",0,[])
                $scope.dataRange[2].Year = $scope.myYear

                wimXHR.post('/station/classAmounts', {'id':$scope.station},function(error, data) {
                  if(error){
                    console.log(error)
                    return
                  }
                  $scope.stationDataAll = data;
                  if($scope.stationType === "class"){
                      $scope.myDataDisp = $scope.values3[1].id
                      calCreate($scope.drawVars[5],$scope.drawVars[3],$scope.myClass,$scope.drawVars[1],$scope.drawVars[2],data,$scope.drawVars[0],$scope.drawVars[4],"Count",$scope.myDataDisp)
                      $scope.$apply(function(){
                          $scope.loading2 = false
                        });
                    }

                  if(data != null){
                    if(data.rows != undefined){
                        dir1 = -1
                        dir2 = -1
                        $scope.stationDataAll.rows.forEach(function(row){
                          if(dir1 == -1){
                              dir1 = parseInt(row.f[16].v)
                            }
                          if(dir1 != parseInt(row.f[16].v) && dir2 == -1){
                              dir2 = parseInt(row.f[16].v)
                            }
                          })
                        if(dir2 != -1){
                         $scope.$apply(function(){
                            $scope.directionValues2.push({id:-1,label:'combined'})
                            $scope.directionValues2.push({id:dir1,label:getDir(dir1)})
                            $scope.directionValues2.push({id:dir2,label:getDir(dir2)})
                            $scope.myDir2 = $scope.directionValues2[0].id
                          });
                        }
                        
                    }
                  }
                  
                  seasonalLineChart.drawseasonalLineChart("#seasonalLineGraph",data,$scope.myDir2,_FILTERS)
                  if(dir2 != -1){
                    seasonalBarGraph.drawseasonalBarGraph("#seasonalBarGraph",$scope.stationDataAll,$scope.directionValues2[1].id,$scope.directionValues2[2].id,_FILTERS)
                  }
                  else{
                    $scope.$apply(function(){
                      $scope.directionValues2.push({id:dir1,label:getDir(dir1)})
                      $scope.myDir2 = $scope.directionValues2[0].id
                    })
                    seasonalBarGraph.drawseasonalBarGraph("#seasonalBarGraph",$scope.stationDataAll,dir1,-1,_FILTERS)
                  }
                  _WIMGrapher("#seasonalLegend");
                  

                  if($scope.stationType === "wim"){
                
                      wimXHR.post('/station/dailyWeights', {id:$scope.station},function(error, data) {
                        if(error){
                          console.log(error)
                          return
                        }
                        $scope.stationData2 = data;
                        if($scope.stationType === "wim"){
                          $scope.myDataDisp = $scope.values3[0].id
                          calCreate($scope.drawVars[5],$scope.drawVars[3],$scope.myClass,$scope.drawVars[1],$scope.drawVars[2],data,$scope.drawVars[0],$scope.drawVars[4],"trucks",$scope.myDataDisp)
                        
                          $scope.$apply(function(){
                            $scope.loading2 = false
                            $scope.myDataDisp = $scope.values3[0].id
                            
                          });
                        }
                      

                      //doesn't work with class stations
                      wimXHR.post('/station/byTonageInfo/', {'stationID':$scope.station},function(error, data) {
                        if(error){
                          console.log(error)
                          return
                        }
                        $scope.stationTonageData = data;
                        $scope.drawVars2 = _init($scope.minYear,$scope.maxYear,"ton");
                        //if($scope.stationType === "wim"){
                          //$scope.myDataDisp = $scope.values3[0].id
                        calCreate($scope.drawVars2[5],$scope.drawVars2[3],9,$scope.drawVars2[1],$scope.drawVars2[2],$scope.stationTonageData,$scope.drawVars2[0],$scope.drawVars2[4],"trucks","Ton")
                        //}
                        // $scope.$apply(function(){
                        //   $scope.loading2 = false
                        //   $scope.myDataDisp = $scope.values3[0].id
                          
                        // });

                        //Remember to add in threshold value
                    
                        wimXHR.post('/stations/byWeightTableInfo/', {'stationID':$scope.station,'threshold':80000},function(error,data) {
                          if(error){
                            console.log(error)
                            return
                          }
                          if(data != null){
                            if(data.rows != undefined){
                              $scope.stationWeightData = data;
                              dir1 = -1
                              dir2 = -1
                                $scope.stationWeightData.rows.forEach(function(row){
                                  if(dir1 == -1){
                                      dir1 = parseInt(row.f[3].v)
                                    }
                                  if(dir1 != parseInt(row.f[3].v) && dir2 == -1){
                                      dir2 = parseInt(row.f[3].v)
                                    }
                                  })
                                if(dir2 != -1){
                                 $scope.$apply(function(){
                                    $scope.directionValues.push({id:-1,label:'combined'})
                                    $scope.directionValues.push({id:dir1,label:getDir(dir1)})
                                    $scope.directionValues.push({id:dir2,label:getDir(dir2)})
                                    $scope.myDir = $scope.directionValues[0].id
                                    $scope.loading = false
                                  });
                                }
                                else{
                                  $scope.$apply(function(){
                                    $scope.directionValues.push({id:dir1,label:getDir(dir1)})
                                    $scope.myDir = $scope.directionValues[0].id
                                    $scope.loading = false
                                  })
                                }
                                //weightTable.tableCreate($scope.stationWeightData,$scope.myTableDisp,$scope.myDir)
                                
                                $scope.reloadTable()
                            }
                          }
                        });
                      });
                    });
                  }
                });
              });
              $scope.reloadTable = function(){
                weightTable.removeTable('#stationTable')
                weightTable.tableCreate($scope.stationWeightData,$scope.myTableDisp,$scope.myDir,'#stationTable')

                
              }
              $scope.reloadSeasonalGraph = function(){
                seasonalLineChart.drawseasonalLineChart("#seasonalLineGraph",$scope.stationDataAll,$scope.myDir2,_FILTERS)
                if($scope.directionValues2.length > 0){
                  seasonalBarGraph.drawseasonalBarGraph("#seasonalBarGraph",$scope.stationDataAll,$scope.directionValues2[1].id,$scope.directionValues2[2].id,_FILTERS)
                  
                }
                else{
                  seasonalBarGraph.drawseasonalBarGraph("#seasonalBarGraph",$scope.stationDataAll,-1,-1,_FILTERS)  

                }
              }
              $scope.reloadReportTable = function(){
                $scope.point = 0
                if(parseInt($scope.dataRange[2].Year) == parseInt($scope.myYear)){
                  reportTable.init($scope.station,'#reportTab',$scope.myReport,$scope.stationData)
                  reportTable.drawTable('#reportTab',"",$scope.myReport,$scope.point,$scope.dataRange)
                }
                else{
                  wimXHR.post('/station/reportAmounts', {'id':$scope.station,'CoW':$scope.stationType,'year':(parseInt($scope.myYear)-2000)},function(error, data) {
                    $scope.reportData = data
                    reportTable.init($scope.station,'#reportTab',$scope.myReport,$scope.stationData)
                    $scope.dataRange = reportTable.drawTable('#reportTab',$scope.reportData,"Days",0,[])
                    $scope.dataRange[2].Year = $scope.myYear
                  });
                }
              }
              $scope.reloadReportTableBack = function(){
                console.log($scope.point)
                if($scope.point >= 100){
                  $scope.point -= 100
                }
                reportTable.init($scope.station,'#reportTab',$scope.myReport,$scope.stationData)
                reportTable.drawTable('#reportTab',"",$scope.myReport,$scope.point,$scope.dataRange)
              }
              $scope.reloadReportTableForward = function(){
                if($scope.myReport === "Days"){
                  if(($scope.point+100) <= $scope.dataRange[0].length){
                    $scope.point +=100 
                  }
                }
                else{
                  if(($scope.point)+100 <= $scope.dataRange[1].length){
                    $scope.point +=100 
                  }
                }
                reportTable.init($scope.station,'#reportTab',$scope.myReport,$scope.stationData)
                reportTable.drawTable('#reportTab',"",$scope.myReport,$scope.point,$scope.dataRange)
              }
              $scope.loadCalendar = function(){
                if($scope.myDataDisp === "Freight"){
                  calCreate($scope.drawVars[5],$scope.drawVars[3],$scope.myClass,$scope.drawVars[1],$scope.drawVars[2],$scope.stationData2,$scope.drawVars[0],$scope.drawVars[4],$scope.myDisp,$scope.myDataDisp)
                
                }
                else{
                  calCreate($scope.drawVars[5],$scope.drawVars[3],$scope.myClass,$scope.drawVars[1],$scope.drawVars[2],$scope.stationDataAll,$scope.drawVars[0],$scope.drawVars[4],"Count",$scope.myDataDisp)
                }
              }
////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
                        return (w * values.length + 10) + 'px';
                      })
                      .style('background-color', '#000');
                  }
                }

////////////////////////////////////////////////////////////////////////////////////////////////////////////


          });
  }// end init

function calCreate(rect,svg,classT,day,week,data,z,svg2,dispType,dispType2){
      if(dispType2 === "Freight"){
        wimCal.drawCalendar(rect,svg,parseDataF(data,classT),day,week,z,svg2,dispType,"");
      }
      else if(dispType2 === "Ton"){
        wimCal.drawCalendar(rect,svg,parseDataT(data,classT),day,week,z,svg2,dispType,"ton");
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
            if(classInfo == 0){
              totalTrucks = parseInt(row.f[3].v) + parseInt(row.f[4].v) + parseInt(row.f[5].v) + parseInt(row.f[6].v) + parseInt(row.f[7].v) + parseInt(row.f[8].v) + parseInt(row.f[9].v) + parseInt(row.f[10].v) + parseInt(row.f[11].v) + parseInt(row.f[12].v) + parseInt(row.f[13].v) + parseInt(row.f[14].v) + parseInt(row.f[15].v)
            }
            else{
              totalTrucks = parseInt(row.f[classInfo+2].v);
            }
            if(row.f[0].v < 10){
              yearStr = "0"+row.f[0].v
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
            if(row.f[5].v < 10){
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
    if(input.rows != undefined){
  
      input.rows.forEach(function(row){

            var item = {}
            var string = ""
            var totalTrucks = parseInt(row.f[0].v) + parseInt(row.f[4].v) + parseInt(row.f[5].v) + parseInt(row.f[6].v) + parseInt(row.f[7].v) + parseInt(row.f[8].v) + parseInt(row.f[9].v) + parseInt(row.f[10].v) + parseInt(row.f[11].v) + parseInt(row.f[12].v) + parseInt(row.f[13].v);
            
            if(row.f[1].v < 10){
              string = "200"+row.f[1].v
            }
            else{
              string = "20"+row.f[1].v
            }
            if(row.f[2].v < 10){
              string = string+"-0"+row.f[2].v
            }
            else{
              string = string+"-"+row.f[2].v 
            }
            if(row.f[3].v < 10){
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
  return output
};


  this.wimCal = wimCal;
})()