var map = {};

$(function(){
    function pageLoad(){        
        //PjaxApp.onResize(drawSparkLines);
        $('.widget').widgster();
    }
    pageLoad();

});

function StationController ($scope) {

    //List of vehicle classes
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
    //For displaying freight data by vehicle count or weight. Only used in weight pages
    $scope.values2 = [
      { id: "Weight", label: 'Weight' },
      { id: "Count", label: 'Count' },
    ];
    //For displaying either freight or class data
    $scope.values3 = [
      { id: "Freight", label:'Freight'},
      { id: "Class", label:'Class'},
    ];
    //For overweight enforcement on displaying data by count or percent
    $scope.values4 = [
      {id: "percent", label:'Percent'},
      {id: "count", label:'Count'},
      ];
    //For the reports tab and whether to display data by days or hours
    $scope.values5 = [
      {id: "Days", label:'Days'},
      {id: "Hours", label:'Hours'},
      ];
    //For the dashboard page, lists class selection types
    $scope.graphs = [
        {id:"All",label:"All"},
        {id:"PT",label:"Cars"},
        {id:"SU",label:"Single Unit Trucks"},
        {id:"TT",label:"Tractor Trailer Trucks"},
    ];
    //List of months for dashboard
    $scope.monthList = [
        {id:0,label:"January"},
        {id:1,label:"February"},
        {id:2,label:"March"},
        {id:3,label:"April"},
        {id:4,label:"May"},
        {id:5,label:"June"},
        {id:6,label:"July"},
        {id:7,label:"August"},
        {id:8,label:"September"},
        {id:9,label:"October"},
        {id:10,label:"November"},
        {id:11,label:"December"},
    ];

    $scope.myClass = 0;                               //ng-model that holds currently selected class. Initially set to "All"
    $scope.myDisp = "Count";                          //ng-model for displaying weight or count data
    $scope.myDataDisp = "Class";                      //ng-model for displaying weight or class data
    $scope.directionValues = [];                      //Directional data for the overweight graph. This can differ from directional data for the seasonality page
    $scope.directionValues2 = [];                     //Directional data for the seasonal graphs
    $scope.myTableDisp = $scope.values4[0].id         //ng-model for whether count or percent data gets diplayed on overweight table
    $scope.myClassOrg = $scope.graphs[0].id;
    $scope.myDir = -1
    $scope.myDir2 = -1
    $scope.loading = true
    $scope.loading2 = true
    $scope.loading3 = true
    $scope.loading4 = true
    $scope.yearRange = []
    $scope.dataRange = []
    $scope.dashYear1 = ""
    $scope.dashYear2 = ""
    $scope.point = 0
    $scope.myYear = ""
    $scope.myReport = "Days"
    $scope.myMonth = ""
    $scope.minYear = ""
    $scope.maxYear = ""
    $scope.drawVars = []
    var dir1 = -1
    var dir2 = -1
    $scope.station = window.station;
    if(window.station.length == 9){
        $scope.station = window.station.slice(0,6);
    }
    $scope.stationType = window.stationType;
    $scope.state = window.station.slice(7)
    d3.select("#radio_"+stationType).attr("class","btn btn-success active")
    $scope.stationData = stationInfo.drawTable($scope.station,'#infoTable',$scope);
   
    wimgraph.grapher('#wimgraph').drawGraph($scope.station, $scope.stationType,$scope.state);
    

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Below is old wimCalender stuff that is now new station index stuff. The below performs various post requests
//to obtain data to be drawn in each calendar, table, and bar graph
var _FILTERS = {
    // data filters for various classes. False indicates filter is inactive.
    // indexes [0, 12] correspond to classes [2, 14]
      class: [false,false,false,false,false,false,false,false,false,false,false,false,false],
    }

//Initializes the seasonal bar and line charts
seasonalLineChart.initseasonalLineChart("#seasonalLineGraph",'.tab-content')
seasonalBarGraph.initseasonalBarGraph("#seasonalBarGraph",'.tab-content')
var URL = '/station/yearsActive';

//This first post request gets the range of years the given station is active for

wimXHR.post(URL, {isClass:$scope.stationType,id:$scope.station,'state_code':$scope.state},function(error, data) {
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
  

  $scope.myClass = $scope.values[0].id;
  $scope.myDisp = $scope.values2[1].id;
  $scope.myDataDisp = $scope.values3[0].id;


  //The below post request gets the data used for the reports table in the reports tab
    wimXHR.post('/station/reportAmounts', {'id':$scope.station,'CoW':$scope.stationType,'year':(parseInt($scope.myYear)-2000),'state_code':$scope.state},function(error, data) {
      $scope.reportData = data
      $scope.dataRange = reportTable.drawTable('#reportTab',$scope.reportData,"Days",0,[])

      $scope.dataRange[2].Year = $scope.myYear
      $scope.$apply(function(){
                $scope.loading3 = false
              });
  //The below post request gets the class data for the class calendar
        wimXHR.post('/station/classAmounts', {'id':$scope.station,'state_code':$scope.state},function(error, data) {
          if(error){
            console.log(error)
            return
          }
          $scope.stationDataAll = data;
          if($scope.stationType === "class"){
              $scope.myDataDisp = $scope.values3[1].id
              $scope.$apply(function(){
                  $scope.loading2 = false
                });
            }

          //parse data here
          $scope.parsedData = parseDataForDashBoard($scope.stationDataAll,$scope.yearRange)

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
                    var dashStart = findRecent($scope.parsedData)
                    $scope.dashYear1 = dashStart.year
                    $scope.myMonth = dashStart.month
                    dashboard.drawdashboard("#dashboardTable",$scope.parsedData,$scope.yearRange.indexOf($scope.dashYear1),"",$scope.myMonth)
                    $scope.loading4 = false
                  });
                }
                
            }
          }

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

          //Weight stations have extra data that also gets displayed in addition to class data
          //hence the below post requests
          
            if($scope.stationType === "wim"){
                  

                  //Below post request is for daily weights of trucks          
                  wimXHR.post('/station/dailyWeights', {'id':$scope.station,'state_code':$scope.state},function(error, data) {
                    if(error){
                      console.log(error)
                      return
                    }
                    $scope.stationData2 = data;
                    if($scope.stationType === "wim"){
                      $scope.myDataDisp = $scope.values3[0].id
                      
                      
                    }
                  

                  //Below post request is for getting an estimated number of empty trucks
                  //The estimated weight value for an empty truck is set in the post request itself
                  wimXHR.post('/station/byTonageInfo/', {'stationID':$scope.station,'state_code':$scope.state},function(error, data) {
                    if(error){
                      console.log(error)
                      return
                    }
                    $scope.stationTonageData = data;

                      //var index = err2.agency.map(function(el) {return el.datasource;}).indexOf(window.database)
                      var thresholdVal = -1
                      if(JSON.parse(window.database).settings != null){
                        if(JSON.parse(window.database).settings.length > 0){
                          for(var i = 0;i<JSON.parse(window.database).settings.length;i++){
                            if( (JSON.parse(window.database).settings[i].state === $scope.state && JSON.parse(window.database).settings[i].type === "Gross Vehicle Violation") ){
                              thresholdVal = parseInt(JSON.parse(window.database).settings[i].limit)
                            }
                          }
                        }
                      }
                      if(thresholdVal < 0){
                        thresholdVal = 80000
                      }
                      console.log(thresholdVal)
                      

                      //The below post request is for finding overweight trucks
                      //The thresh hold value still needs to be set and changed based on the data set being looked at
                      wimXHR.post('/stations/byWeightTableInfo/', {'stationID':$scope.station,'threshold':thresholdVal,'state_code':$scope.state},function(error,data) {
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
                                  
                                });
                              }
                              else{
                                $scope.$apply(function(){
                                  $scope.directionValues.push({id:dir1,label:getDir(dir1)})
                                  $scope.myDir = $scope.directionValues[0].id
                                  
                                })
                              }
                              //weightTable.tableCreate($scope.stationWeightData,$scope.myTableDisp,$scope.myDir)
                              wimCal.init($scope);
                          }
                        }
                      }); //End of /stations/byWeightTableInfo/
                   

                  }); //End of /station/byTonageInfo/
                }); //End of /station/dailyWeights
             } //End of if($scope.stationType === "wim")
            else{
                wimCal.init($scope);
            }
        }); // End of /station/classAmounts
                  
    }); //End of /station/reportAmounts

  //Below are functions that interact with buttons on the index page to reload/update displayed data

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
      $scope.loading3 = true
      wimXHR.post('/station/reportAmounts', {'id':$scope.station,'CoW':$scope.stationType,'year':(parseInt($scope.myYear)-2000),'state_code':$scope.state},function(error, data) {
        $scope.reportData = data
        reportTable.init($scope.station,'#reportTab',$scope.myReport,$scope.stationData)
        if($scope.reportData.rows != undefined){
          reportTable.init($scope.station,'#reportTab',$scope.myReport,$scope.stationData)
          $scope.dataRange = reportTable.drawTable('#reportTab',$scope.reportData,"Days",0,[])
          $scope.dataRange[2].Year = $scope.myYear
          
        }
        $scope.$apply(function(){
                $scope.loading3 = false
              });
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
      wimCal.calCreate($scope.drawVars[5],$scope.drawVars[3],$scope.myClass,$scope.drawVars[1],$scope.drawVars[2],$scope.stationData2,$scope.drawVars[0],$scope.drawVars[4],$scope.myDisp,$scope.myDataDisp)
    
    }
    else{
      wimCal.calCreate($scope.drawVars[5],$scope.drawVars[3],$scope.myClass,$scope.drawVars[1],$scope.drawVars[2],$scope.stationDataAll,$scope.drawVars[0],$scope.drawVars[4],"Count",$scope.myDataDisp)
    }
  }
  $scope.stationChangeClass = function() {
     if($scope.stationType === "wim"){
        window.location ="/station/class/"+$scope.station+"_"+$scope.state
     }
  }
  $scope.stationChangeWim = function() {
     if($scope.stationType === "class"){
        window.location ="/station/wim/"+$scope.station+"_"+$scope.state
     }
  }
  $scope.dashboardChange = function() {
    if($scope.dashYear1 != $scope.dashYear2){
      dashboard.drawdashboard("#dashboardTable",$scope.parsedData,$scope.yearRange.indexOf($scope.dashYear1),$scope.yearRange.indexOf($scope.dashYear2),$scope.myMonth)
    }
  }
}); //End wim calendar posts


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  

    $scope.$watch('stationData',function(){
        
        if($scope.stationData){
             drawMap($scope.stationData.lat,$scope.stationData.lng)
        }
    
    });

    $scope.resetMap = function(){
        L.Util.requestAnimFrame(map.invalidateSize,map,!1,map._container);
    }

//Gets the directional value as described in the traffic monitoring guide

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


};

//Draws the map on the station page

function drawMap(lat,lng){
    $('#displayMap').height($(window).height()-200);
    map = L.map('displayMap', {
     center: [lat,lng],
     zoom: 16 
    });
    L.tileLayer("https://{s}.tiles.mapbox.com/v3/matt.hd0b27jd/{z}/{x}/{y}.png").addTo(map);
    var marker = L.marker([lat,lng]).addTo(map);
    $(window).on('resize',function(){
        $('#displayMap').height($(window).height()-200);
    })
}

function parseDataForDashBoard(graphData,yearRange){
    var parsedData = []
    var dir = 0
    for(var count = 0;count<yearRange.length;count++){
      var item = { both:{year:""+(parseInt(yearRange[count])-2000),yearCT:0,monthCT:[0,0,0,0,0,0,0,0,0,0,0,0],All:{yearTOT:0,yearAVG:0,yearRAT:0,monthAVG:[0,0,0,0,0,0,0,0,0,0,0,0],monthTOT:[0,0,0,0,0,0,0,0,0,0,0,0],monthRAT:[0,0,0,0,0,0,0,0,0,0,0,0]},SU:{yearTOT:0,yearAVG:0,yearRAT:0,monthAVG:[0,0,0,0,0,0,0,0,0,0,0,0],monthTOT:[0,0,0,0,0,0,0,0,0,0,0,0],monthRAT:[0,0,0,0,0,0,0,0,0,0,0,0]},TT:{yearTOT:0,yearAVG:0,yearRAT:0,monthAVG:[0,0,0,0,0,0,0,0,0,0,0,0],monthTOT:[0,0,0,0,0,0,0,0,0,0,0,0],monthRAT:[0,0,0,0,0,0,0,0,0,0,0,0]}},dir1:{year:""+(parseInt(yearRange[count])-2000),yearCT:0,monthCT:[0,0,0,0,0,0,0,0,0,0,0,0],All:{yearTOT:0,yearAVG:0,yearRAT:0,monthAVG:[0,0,0,0,0,0,0,0,0,0,0,0],monthTOT:[0,0,0,0,0,0,0,0,0,0,0,0],monthRAT:[0,0,0,0,0,0,0,0,0,0,0,0]},SU:{yearTOT:0,yearAVG:0,yearRAT:0,monthAVG:[0,0,0,0,0,0,0,0,0,0,0,0],monthTOT:[0,0,0,0,0,0,0,0,0,0,0,0],monthRAT:[0,0,0,0,0,0,0,0,0,0,0,0]},TT:{yearTOT:0,yearAVG:0,yearRAT:0,monthAVG:[0,0,0,0,0,0,0,0,0,0,0,0],monthTOT:[0,0,0,0,0,0,0,0,0,0,0,0],monthRAT:[0,0,0,0,0,0,0,0,0,0,0,0]}},dir2:{year:""+(parseInt(yearRange[count])-2000),yearCT:0,monthCT:[0,0,0,0,0,0,0,0,0,0,0,0],All:{yearTOT:0,yearAVG:0,yearRAT:0,monthAVG:[0,0,0,0,0,0,0,0,0,0,0,0],monthTOT:[0,0,0,0,0,0,0,0,0,0,0,0],monthRAT:[0,0,0,0,0,0,0,0,0,0,0,0]},SU:{yearTOT:0,yearAVG:0,yearRAT:0,monthAVG:[0,0,0,0,0,0,0,0,0,0,0,0],monthTOT:[0,0,0,0,0,0,0,0,0,0,0,0],monthRAT:[0,0,0,0,0,0,0,0,0,0,0,0]},TT:{yearTOT:0,yearAVG:0,yearRAT:0,monthAVG:[0,0,0,0,0,0,0,0,0,0,0,0],monthTOT:[0,0,0,0,0,0,0,0,0,0,0,0],monthRAT:[0,0,0,0,0,0,0,0,0,0,0,0]}} }
      parsedData.push(item)
    }
        
    graphData.rows.forEach(function(row){
        if(dir == 0){
          dir = row.f[16].v
        }
        if(row.f[16].v == dir){
          var index = parsedData.map(function(el) {return el.dir1.year;}).indexOf(row.f[0].v )
          parsedData[index].dir1.All.monthTOT[row.f[1].v - 1] = parsedData[index].dir1.All.monthTOT[row.f[1].v - 1] + parseInt(row.f[3].v) + parseInt(row.f[4].v) + parseInt(row.f[5].v) + parseInt(row.f[6].v) + parseInt(row.f[7].v) + parseInt(row.f[8].v) + parseInt(row.f[9].v) + parseInt(row.f[10].v) + parseInt(row.f[11].v) + parseInt(row.f[12].v) + parseInt(row.f[13].v) + parseInt(row.f[14].v) + parseInt(row.f[15].v)
          parsedData[index].dir1.All.yearTOT = parsedData[index].dir1.All.yearTOT + parseInt(row.f[3].v) + parseInt(row.f[4].v) + parseInt(row.f[5].v) + parseInt(row.f[6].v) + parseInt(row.f[7].v) + parseInt(row.f[8].v) + parseInt(row.f[9].v) + parseInt(row.f[10].v) + parseInt(row.f[11].v) + parseInt(row.f[12].v) + parseInt(row.f[13].v) + parseInt(row.f[14].v) + parseInt(row.f[15].v)
        
        
          parsedData[index].dir1.SU.monthTOT[row.f[1].v - 1] = parsedData[index].dir1.SU.monthTOT[row.f[1].v - 1]+ parseInt(row.f[6].v) + parseInt(row.f[7].v) + parseInt(row.f[8].v) + parseInt(row.f[9].v)
          parsedData[index].dir1.SU.yearTOT = parsedData[index].dir1.SU.yearTOT + parseInt(row.f[6].v) + parseInt(row.f[7].v) + parseInt(row.f[8].v) + parseInt(row.f[9].v)
        
        
          parsedData[index].dir1.TT.monthTOT[row.f[1].v - 1] = parsedData[index].dir1.TT.monthTOT[row.f[1].v - 1] + parseInt(row.f[10].v) + parseInt(row.f[11].v) + parseInt(row.f[12].v) + parseInt(row.f[13].v) + parseInt(row.f[14].v) + parseInt(row.f[15].v)
          parsedData[index].dir1.TT.yearTOT = parsedData[index].dir1.TT.yearTOT + parseInt(row.f[10].v) + parseInt(row.f[11].v) + parseInt(row.f[12].v) + parseInt(row.f[13].v) + parseInt(row.f[14].v) + parseInt(row.f[15].v)
          
          parsedData[index].dir1.monthCT[row.f[1].v - 1]++
          parsedData[index].dir1.yearCT++
        }
        else{
          var index = parsedData.map(function(el) {return el.dir2.year;}).indexOf(row.f[0].v )
        
          parsedData[index].dir2.All.monthTOT[row.f[1].v - 1] = parsedData[index].dir2.All.monthTOT[row.f[1].v - 1] + parseInt(row.f[3].v) + parseInt(row.f[4].v) + parseInt(row.f[5].v) + parseInt(row.f[6].v) + parseInt(row.f[7].v) + parseInt(row.f[8].v) + parseInt(row.f[9].v) + parseInt(row.f[10].v) + parseInt(row.f[11].v) + parseInt(row.f[12].v) + parseInt(row.f[13].v) + parseInt(row.f[14].v) + parseInt(row.f[15].v)
          parsedData[index].dir2.All.yearTOT = parsedData[index].dir2.All.yearTOT + parseInt(row.f[3].v) + parseInt(row.f[4].v) + parseInt(row.f[5].v) + parseInt(row.f[6].v) + parseInt(row.f[7].v) + parseInt(row.f[8].v) + parseInt(row.f[9].v) + parseInt(row.f[10].v) + parseInt(row.f[11].v) + parseInt(row.f[12].v) + parseInt(row.f[13].v) + parseInt(row.f[14].v) + parseInt(row.f[15].v)

          parsedData[index].dir2.SU.monthTOT[row.f[1].v - 1] = parsedData[index].dir2.SU.monthTOT[row.f[1].v - 1]+ parseInt(row.f[6].v) + parseInt(row.f[7].v) + parseInt(row.f[8].v) + parseInt(row.f[9].v)
          parsedData[index].dir2.SU.yearTOT = parsedData[index].dir2.SU.yearTOT + parseInt(row.f[6].v) + parseInt(row.f[7].v) + parseInt(row.f[8].v) + parseInt(row.f[9].v)

          parsedData[index].dir2.TT.monthTOT[row.f[1].v - 1] = parsedData[index].dir2.TT.monthTOT[row.f[1].v - 1] + parseInt(row.f[10].v) + parseInt(row.f[11].v) + parseInt(row.f[12].v) + parseInt(row.f[13].v) + parseInt(row.f[14].v) + parseInt(row.f[15].v)
          parsedData[index].dir2.TT.yearTOT = parsedData[index].dir2.TT.yearTOT + parseInt(row.f[10].v) + parseInt(row.f[11].v) + parseInt(row.f[12].v) + parseInt(row.f[13].v) + parseInt(row.f[14].v) + parseInt(row.f[15].v)
          
          parsedData[index].dir2.monthCT[row.f[1].v - 1]++
          parsedData[index].dir2.yearCT++
        }     

      })
      //console.log(parsedData)
      for(var x = 0;x<parsedData.length;x++){
            if(parseInt(parsedData[x].dir1.year) < 2000 ){
              parsedData[x].dir1.year = 2000 + parseInt(parsedData[x].dir1.year)
              parsedData[x].dir2.year = 2000 + parseInt(parsedData[x].dir2.year)
              parsedData[x].both.year = 2000 + parseInt(parsedData[x].both.year)
            }
            parsedData[x].dir1.All.yearAVG = parseFloat( (parsedData[x].dir1.All.yearTOT/parsedData[x].dir1.yearCT).toFixed(2) )
            parsedData[x].dir1.SU.yearAVG = parseFloat( (parsedData[x].dir1.SU.yearTOT/parsedData[x].dir1.yearCT).toFixed(2) )
            parsedData[x].dir1.TT.yearAVG = parseFloat( (parsedData[x].dir1.TT.yearTOT/parsedData[x].dir1.yearCT).toFixed(2) )
            

            parsedData[x].dir2.All.yearAVG = parseFloat( (parsedData[x].dir2.All.yearTOT/parsedData[x].dir2.yearCT).toFixed(2) )
            parsedData[x].dir2.SU.yearAVG = parseFloat( (parsedData[x].dir2.SU.yearTOT/parsedData[x].dir2.yearCT).toFixed(2) )
            parsedData[x].dir2.TT.yearAVG = parseFloat( (parsedData[x].dir2.TT.yearTOT/parsedData[x].dir2.yearCT).toFixed(2) )
            

            parsedData[x].both.All.yearAVG = parseFloat( ( (parsedData[x].dir1.All.yearTOT + parsedData[x].dir2.All.yearTOT)/parsedData[x].dir1.yearCT).toFixed(2) )
            parsedData[x].both.SU.yearAVG = parseFloat( ( (parsedData[x].dir1.SU.yearTOT + parsedData[x].dir2.SU.yearTOT) /parsedData[x].dir1.yearCT).toFixed(2) )
            parsedData[x].both.TT.yearAVG = parseFloat( ( (parsedData[x].dir1.TT.yearTOT + parsedData[x].dir2.TT.yearTOT) /parsedData[x].dir1.yearCT).toFixed(2) )
            var zAll = 0
            var zSU = 0
            var zTT = 0
            for(var y = 0;y<12;y++){
              if(parsedData[x].dir1.monthCT[y] != 0){
                parsedData[x].dir1.All.monthAVG[y] = parseFloat( (parsedData[x].dir1.All.monthTOT[y]/parsedData[x].dir1.monthCT[y]).toFixed(2) )

                parsedData[x].dir2.All.monthAVG[y] = parseFloat( (parsedData[x].dir2.All.monthTOT[y]/parsedData[x].dir2.monthCT[y]).toFixed(2) )

                parsedData[x].both.All.monthAVG[y] = parseFloat( ( (parsedData[x].dir1.All.monthTOT[y] + parsedData[x].dir2.All.monthTOT[y])/parsedData[x].dir1.monthCT[y]).toFixed(2) )
              }
              if(parsedData[x].dir1.monthCT[y] != 0){
                parsedData[x].dir1.SU.monthAVG[y] = parseFloat( (parsedData[x].dir1.SU.monthTOT[y]/parsedData[x].dir1.monthCT[y]).toFixed(2) )

                parsedData[x].dir2.SU.monthAVG[y] = parseFloat( (parsedData[x].dir2.SU.monthTOT[y]/parsedData[x].dir2.monthCT[y]).toFixed(2) )

                parsedData[x].both.SU.monthAVG[y] = parseFloat( ( (parsedData[x].dir1.SU.monthTOT[y] + parsedData[x].dir2.SU.monthTOT[y])/parsedData[x].dir1.monthCT[y]).toFixed(2) )
              }
              if(parsedData[x].dir1.monthCT[y] != 0){
                parsedData[x].dir1.TT.monthAVG[y] = parseFloat( (parsedData[x].dir1.TT.monthTOT[y]/parsedData[x].dir1.monthCT[y]).toFixed(2) )

                parsedData[x].dir2.TT.monthAVG[y] = parseFloat( (parsedData[x].dir2.TT.monthTOT[y]/parsedData[x].dir2.monthCT[y]).toFixed(2) )

                parsedData[x].both.TT.monthAVG[y] = parseFloat( ( (parsedData[x].dir1.TT.monthTOT[y] + parsedData[x].dir2.TT.monthTOT[y])/parsedData[x].dir1.monthCT[y]).toFixed(2) )
              }
              if(parsedData[x].dir1.All.monthAVG[y] > 0){
                parsedData[x].dir1.All.monthRAT[y] = parseFloat( (parsedData[x].dir1.All.yearAVG/parsedData[x].dir1.All.monthAVG[y]).toFixed(2) )
                parsedData[x].dir1.All.yearRAT = parseInt(parsedData[x].dir1.All.yearRAT) + parseInt(parsedData[x].dir1.All.monthRAT[y])

                parsedData[x].dir2.All.monthRAT[y] = parseFloat( (parsedData[x].dir2.All.yearAVG/parsedData[x].dir2.All.monthAVG[y]).toFixed(2) )
                parsedData[x].dir2.All.yearRAT = parseInt(parsedData[x].dir2.All.yearRAT) + parseInt(parsedData[x].dir2.All.monthRAT[y])
                

                parsedData[x].both.All.monthRAT[y] = parseFloat( (parsedData[x].both.All.yearAVG/parsedData[x].both.All.monthAVG[y]).toFixed(2) )
                parsedData[x].both.All.yearRAT = parseInt(parsedData[x].both.All.yearRAT) + parseInt(parsedData[x].both.All.monthRAT[y])
                
                zAll++
              }
              if(parsedData[x].dir1.SU.monthAVG[y] > 0){
                parsedData[x].dir1.SU.monthRAT[y] = parseFloat( (parsedData[x].dir1.SU.yearAVG/parsedData[x].dir1.SU.monthAVG[y]).toFixed(2) )
                parsedData[x].dir1.SU.yearRAT = parseInt(parsedData[x].dir1.SU.yearRAT) + parseInt(parsedData[x].dir1.SU.monthRAT[y])
                
                parsedData[x].dir2.SU.monthRAT[y] = parseFloat( (parsedData[x].dir2.SU.yearAVG/parsedData[x].dir2.SU.monthAVG[y]).toFixed(2) )
                parsedData[x].dir2.SU.yearRAT = parseInt(parsedData[x].dir2.SU.yearRAT) + parseInt(parsedData[x].dir2.SU.monthRAT[y])
                
                parsedData[x].both.SU.monthRAT[y] = parseFloat( (parsedData[x].both.SU.yearAVG/parsedData[x].both.SU.monthAVG[y]).toFixed(2) )
                parsedData[x].both.SU.yearRAT = parseInt(parsedData[x].both.SU.yearRAT) + parseInt(parsedData[x].both.SU.monthRAT[y])
                
                zSU++
              }
              if(parsedData[x].dir1.TT.monthAVG[y] > 0){
                parsedData[x].dir1.TT.monthRAT[y] = parseFloat( (parsedData[x].dir1.TT.yearAVG/parsedData[x].dir1.TT.monthAVG[y]).toFixed(2) )
                parsedData[x].dir1.TT.yearRAT = parseInt(parsedData[x].dir1.TT.yearRAT) + parseInt(parsedData[x].dir1.TT.monthRAT[y])
                
                parsedData[x].dir2.TT.monthRAT[y] = parseFloat( (parsedData[x].dir2.TT.yearAVG/parsedData[x].dir2.TT.monthAVG[y]).toFixed(2) )
                parsedData[x].dir2.TT.yearRAT = parseInt(parsedData[x].dir2.TT.yearRAT) + parseInt(parsedData[x].dir2.TT.monthRAT[y])
                
                parsedData[x].both.TT.monthRAT[y] = parseFloat( (parsedData[x].both.TT.yearAVG/parsedData[x].both.TT.monthAVG[y]).toFixed(2) )
                parsedData[x].both.TT.yearRAT = parseInt(parsedData[x].both.TT.yearRAT) + parseInt(parsedData[x].both.TT.monthRAT[y])
                

                zTT++
              }
            }


            parsedData[x].dir1.All.yearRAT = parseFloat( (parsedData[x].dir1.All.yearRAT/zAll).toFixed(2) )
            parsedData[x].dir1.SU.yearRAT = parseFloat( (parsedData[x].dir1.SU.yearRAT/zSU).toFixed(2) )
            parsedData[x].dir1.TT.yearRAT = parseFloat( (parsedData[x].dir1.TT.yearRAT/zTT).toFixed(2) )

            parsedData[x].dir2.All.yearRAT = parseFloat( (parsedData[x].dir2.All.yearRAT/zAll).toFixed(2) )
            parsedData[x].dir2.SU.yearRAT = parseFloat( (parsedData[x].dir2.SU.yearRAT/zSU).toFixed(2) )
            parsedData[x].dir2.TT.yearRAT = parseFloat( (parsedData[x].dir2.TT.yearRAT/zTT).toFixed(2) )

            parsedData[x].both.All.yearRAT = parseFloat( (parsedData[x].both.All.yearRAT/zAll).toFixed(2) )
            parsedData[x].both.SU.yearRAT = parseFloat( (parsedData[x].both.SU.yearRAT/zSU).toFixed(2) )
            parsedData[x].both.TT.yearRAT = parseFloat( (parsedData[x].both.TT.yearRAT/zTT).toFixed(2) )
      }
      return parsedData
}


function findRecent(array){

  for(x = array.length-1;x >= 0;x-- ){
    for(y = 11;y>=0;y--){
      if(array[x].dir1.monthCT[y] >= 15 ){
        return {year:array[x].dir1.year,month:y}
      }
    }
  }
  return {year:0,month:0}
}