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
    $scope.active_TruckClass = {};
   
    wimstates.init('#statesDIV',$scope);
    // AADTGraph.initAADTGraph('#changeAADTGraph');
    AADTGraph.initAADTGraph('#weightByHour');
    // monthlyLineChart.initMonthlylLineChart("#hrMonLineGraph");
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
    
    function getStationIndex(stationID){
            return $scope.graphData.map(function(el){return el.stationId;}).indexOf(stationID)
    }
};

