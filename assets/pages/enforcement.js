$(function(){
    function pageLoad(){        
        //PjaxApp.onResize(drawSparkLines);f
        $('.widget').widgster();

        // $("body").on("mousemove", function(e) {
        //   var x = e.pageX - 20;
        //   var y = e.pageY;
        //   var windowH = $(window).height();
        //   if (y > (windowH - 100)) {
        //   var y = e.pageY - 100;
        //   } else {
        //   var y = e.pageY - 20;
        //   }
        //   //console.log(x,y)
        //   $("#stationInfo").css({
        //     "left": x,
        //     "top": y
        //   });
        // });
    }

    pageLoad();

    PjaxApp.onPageLoad(pageLoad);
});

function EnforcementController ($scope) {
   
    $scope.stations = {};
    $scope.graphData = [];
    $scope.truckClass = [];
    $scope.overWeightBar = [];
    $scope.overWeightLine = [];
    $scope.active_TruckClass = {};
    $scope.timePeriod = [

      { id:"year", label:'Year'},
      { id:"month", label:'Month'},
      { id:"day", label:'Day'},

    ];
    $scope.time_order =[

    { id:"count",label:'Count'},
    { id:"percent",label:'Percent'},

    ];
    $scope.myTimePeriod = $scope.timePeriod[0].id
    $scope.myOrder = $scope.time_order[0].id
    wimstates.init('#statesDIV',$scope);
    AADTGraph.initAADTGraph('#weightByHour');
    lineChart.initlineChart('#overweightLineGraph');
    truckWeightGraph.initTruckWeightGraph('#overweightBarGraph')
    //var type = [true,false,false]


    $scope.$watch('stations', function() {
        if($scope.stations != undefined){
            if($scope.stations.length > 0){
                if($scope.graphData.length == 0){
                    URL = '/stations/'+$scope.state+'/weight/'
                    wimXHR.get(URL, function(error, data) {
                                if (error) {
                                    console.log(error);
                                    return;
                                }
                                if(data.rows != undefined){

                                    data.rows.forEach(function(row){
                                        var rowStation = row.f[0].v;
                                        if(getStationIndex(rowStation) == -1) {
                                            $scope.graphData.push({'stationId':rowStation, years:[]})
                                            
                                        }
                                        if(parseInt(row.f[1].v) < 10){
                                            row.f[1].v = "0"+row.f[1].v
                                        }
                                        $scope.graphData[getStationIndex(rowStation)].years.push({'year':row.f[1].v,'hours':row.f[2].v,'Weight':row.f[3].v,'Class':row.f[4].v});
                                    
                                    });

                                }
                        $scope.truckClass = getClassRange(angular.copy($scope.graphData))
                        $scope.active_TruckClass = {value:$scope.truckClass[0]}
                        AADTGraph.drawAADTGraphWeight('#weightByHour',angular.copy($scope.graphData),"weight","All")
                    });

                    //line graph
                    
                    URL = '/stations/'+$scope.state+'/overweight/'
                    wimXHR.post(URL,{timeType:"on",threshold:80000} ,function(error, data) {
                        if (error) {
                            console.log(error);
                            return;
                        }
                        if(data.rows != undefined){
                            data.rows.forEach(function(row){
                                var rowStation = row.f[0].v;
                                if(getStationIndex(rowStation,"line") == -1) {
                                    $scope.overWeightLine.push({'stationId':rowStation, 'funcCode': row.f[4].v,perOverWeight:[0,0,0,0,0,0,0,0,0,0,0,0],avgOverWeight:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]})
                                    
                                }
                                if(parseInt(row.f[3].v) < 10){
                                    row.f[3].v = "0"+row.f[3].v
                                }

                                $scope.overWeightLine[getStationIndex(rowStation,"line")].avgOverWeight[parseInt(row.f[3].v)-1] = $scope.overWeightLine[getStationIndex(rowStation,"line")].avgOverWeight[parseInt(row.f[3].v)-1] + parseInt(row.f[1].v)
                                $scope.overWeightLine[getStationIndex(rowStation,"line")].perOverWeight[parseInt(row.f[3].v)-1] = $scope.overWeightLine[getStationIndex(rowStation,"line")].perOverWeight[parseInt(row.f[3].v)-1] + parseInt(row.f[2].v)
                                $scope.overWeightLine[getStationIndex(rowStation,"line")].avgOverWeight[parseInt(row.f[3].v)+11] = $scope.overWeightLine[getStationIndex(rowStation,"line")].avgOverWeight[parseInt(row.f[3].v)+11] + 1
                                
                            });
                            for(var i = 0;i<$scope.overWeightLine.length;i++){
                                for(var j = 0;j<12;j++){
                                    if($scope.overWeightLine[i].avgOverWeight[12] != 0){
                                        $scope.overWeightLine[i].avgOverWeight[j] = $scope.overWeightLine[i].avgOverWeight[j] / $scope.overWeightLine[i].avgOverWeight[12]
                                        $scope.overWeightLine[i].perOverWeight[j] = $scope.overWeightLine[i].perOverWeight[j] / $scope.overWeightLine[i].avgOverWeight[12]
                                        $scope.overWeightLine[i].perOverWeight[j] = $scope.overWeightLine[i].avgOverWeight[j] / $scope.overWeightLine[i].perOverWeight[j]
                                        $scope.overWeightLine[i].perOverWeight[j] = $scope.overWeightLine[i].perOverWeight[j] * 100
                                    }
                                    $scope.overWeightLine[i].avgOverWeight.splice(12,1)
                                }
                            }
                            lineChart.drawlineChart('#overweightLineGraph',angular.copy($scope.overWeightLine),$scope.myOrder);
                        }
                    });

                    //Bar graph

                    wimXHR.post(URL,{timeType:$scope.myTimePeriod,threshold:80000} ,function(error, data) {
                        if (error) {
                            console.log(error);
                            return;
                        }
                        if(data.rows != undefined){
                            data.rows.forEach(function(row){
                                var rowStation = row.f[0].v;
                                if(getStationIndex(rowStation,"bar") == -1) {
                                    $scope.overWeightBar.push({'stationId':rowStation, years:[]})                         
                                    
                                }
                                if(parseInt(row.f[3].v) < 10){
                                    row.f[3].v = "0"+row.f[3].v
                                }

                                $scope.overWeightBar[getStationIndex(rowStation,"bar")].years.push({'overweightTrucks':row.f[1].v,'numTrucks':row.f[2].v,'year':row.f[3].v})
                            });
                            truckWeightGraph.drawTruckWeightGraph('#overweightBarGraph',angular.copy($scope.overWeightBar),$scope.myOrder,$scope.myTimePeriod);
                        }
                    });

                }
            }
        }
    });

    $scope.$watchCollection('active_TruckClass', function() {
        if($scope.graphData.length > 0){
            AADTGraph.drawAADTGraphWeight('#weightByHour',angular.copy($scope.graphData),"weight",$scope.active_TruckClass.value)      
        }
        //console.log($scope.active_TruckClass)
    });
    $scope.$watchCollection('myOrder', function() {
        if($scope.overWeightBar.length > 0 && $scope.overWeightLine.length > 0){
            truckWeightGraph.drawTruckWeightGraph('#overweightBarGraph',angular.copy($scope.overWeightBar),$scope.myOrder,$scope.myTimePeriod);
            lineChart.drawlineChart('#overweightLineGraph',angular.copy($scope.overWeightLine),$scope.myOrder);
        }
        //console.log($scope.active_TruckClass)
    });
    $scope.$watchCollection('myTimePeriod', function() {
        if($scope.overWeightBar.length > 0){
            URL = '/stations/'+$scope.state+'/overweight/'
            wimXHR.post(URL,{timeType:$scope.myTimePeriod,threshold:80000} ,function(error, data) {
                if (error) {
                    console.log(error);
                    return;
                }
                if(data.rows != undefined){
                    data.rows.forEach(function(row){
                        var rowStation = row.f[0].v;
                        if(getStationIndex(rowStation,"bar") == -1) {
                            $scope.overWeightBar.push({'stationId':rowStation, years:[]})                         
                            
                        }
                        if(parseInt(row.f[3].v) < 10){
                            row.f[3].v = "0"+row.f[3].v
                        }

                        $scope.overWeightBar[getStationIndex(rowStation,"bar")].years.push({'overweightTrucks':row.f[1].v,'numTrucks':row.f[2].v,'year':row.f[3].v})
                    });
                    truckWeightGraph.drawTruckWeightGraph('#overweightBarGraph',angular.copy($scope.overWeightBar),$scope.myOrder,$scope.myTimePeriod);
                }
            });
        }
        //console.log($scope.active_TruckClass)
    });
   


    function getClassRange(stations){
        var output = [];
        //console.log(stations);
        output.push("All")
        stations.forEach(function(station){
            station.years.forEach(function(year){
                if(output.indexOf(year.Class) == -1){
                    output.push(year.Class)
                }
                
            })
        })
        output.sort(function compareStations(a, b) {
            return parseInt(a) - parseInt(b)
        })
                
        return output;
        //console.log()
        
    }

    function getStateIndex(state_fips){
      return $scope.states.map(function(el) {return el.state_fips;}).indexOf(state_fips);
    }
    
    function getStationIndex(stationID,check){
        if(check === undefined){
            return $scope.graphData.map(function(el){return el.stationId;}).indexOf(stationID)
        }
        else if(check === "bar"){
            return $scope.overWeightBar.map(function(el){return el.stationId;}).indexOf(stationID)
        }
        else if(check === "line"){
            return $scope.overWeightLine.map(function(el){return el.stationId;}).indexOf(stationID)
        }
    }
};

