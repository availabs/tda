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

function IndexController ($scope) {
   
    $scope.stations = {};
    $scope.barGraph = null;
    $scope.currentYear = [];
    $scope.compareYear = [];
    $scope.graphs = [
        {id:"All",label:"All",data:[true,false,false,false]},
        {id:"AAPT",label:"AAPT",data:[false,true,false,false]},
        {id:"AASU",label:"AASU",data:[false,false,true,false]},
        {id:"AATT",label:"AATT",data:[false,false,false,true]},
    ];
    $scope.times = [
        {id:"month",label:"Monthly"},
        {id:"hour",label:"Hourly"},
    ];
    $scope.state = "";
    $scope.dispTime = $scope.times[0].id;
    $scope.dispGraph = $scope.graphs[0].id;
    $scope.curYear = "All";
    wimstates.init('#statesDIV',$scope);
    AADTGraph.initAADTGraph('#changeAADTGraph');
    AADTGraph.initAADTGraph('#aadtGraph');
    monthlyLineChart.initMonthlylLineChart("#hrMonLineGraph");
    var type = [true,false,false]


    $scope.$watch('stations', function() {
        if($scope.stations != undefined){
          if($scope.stations.length > 0){
            $scope.years = getYearRange($scope.stations);
            //console.log($scope.years);
            $scope.active_years = {first:d3.min($scope.years),max:d3.max($scope.years)}
            $scope.years2 = ["All"]
            for(var x = 0;x<$scope.years.length;x++){
                $scope.years2.push($scope.years[x])
            }
            $scope.active_years2 = {id:$scope.years2[0]}
            //var pov={},tt={};
            AADTGraph.drawAADTGraph('#changeAADTGraph',angular.copy($scope.stations),'class',[false,true,false,false],[$scope.active_years.first,$scope.active_years.max]);
            AADTGraph.drawAADTGraph('#aadtGraph',angular.copy($scope.stations),'class',[true,false,false,false],[]);
            monthlyLineChart.drawMonthlyLineChart('#hrMonLineGraph',"All",$scope.state);
            
          }
          
        }
    });
    $scope.$watchCollection('active_years', function() {
        if($scope.stations.length > 0){
            $scope.active_years.first = parseInt($scope.active_years.first);
            $scope.active_years.max = parseInt($scope.active_years.max);
            //console.log('first_year',$scope.active_years)
            if(parseInt($scope.active_years.first) != parseInt($scope.active_years.max)){
                AADTGraph.drawAADTGraph('#changeAADTGraph',angular.copy($scope.stations),'class',[false,true,false,false],[$scope.active_years.first,$scope.active_years.max]);      
            }
        }
    });
    $scope.$watchCollection('active_years2', function() {
        if($scope.stations.length > 0){
            $scope.curYear = $scope.active_years2.id
            if($scope.active_years2.id === "All"){
                AADTGraph.drawAADTGraph('#aadtGraph',angular.copy($scope.stations),'class',$scope.graphs[$scope.graphs.map(function(el){return el.id;}).indexOf($scope.dispGraph)].data,[]);
            }
            else{
                AADTGraph.drawAADTGraph('#aadtGraph',angular.copy($scope.stations),'class',$scope.graphs[$scope.graphs.map(function(el){return el.id;}).indexOf($scope.dispGraph)].data,[parseInt($scope.active_years2.id)]);
            }
            
        }
    });

    $scope.$watchCollection('dispGraph', function() {
        // console.log($scope.dispTime)
        // console.log($scope.dispGraph)
        //console.log($scope.curYear)
        if($scope.stations.length > 0){
            if($scope.curYear === "All"){
                AADTGraph.drawAADTGraph('#aadtGraph',angular.copy($scope.stations),'class',$scope.graphs[$scope.graphs.map(function(el){return el.id;}).indexOf($scope.dispGraph)].data,[]);
                if($scope.dispTime === "month"){
                    monthlyLineChart.drawMonthlyLineChart('#hrMonLineGraph',$scope.dispGraph,$scope.state);
                }
                else{
                    monthlyLineChart.drawHourlyLineChart('#hrMonLineGraph',$scope.dispGraph,$scope.state);   
                }
            }
            else{
                AADTGraph.drawAADTGraph('#aadtGraph',angular.copy($scope.stations),'class',$scope.graphs[$scope.graphs.map(function(el){return el.id;}).indexOf($scope.dispGraph)].data,[parseInt($scope.active_years2.id)]);
                if($scope.dispTime === "month"){
                        monthlyLineChart.drawMonthlyLineChart('#hrMonLineGraph',$scope.dispGraph,$scope.state);
                    }
                    else{
                        monthlyLineChart.drawHourlyLineChart('#hrMonLineGraph',$scope.dispGraph,$scope.state);   
                    }
            }
        }
    });
    $scope.$watchCollection('dispTime', function() {
        // console.log($scope.dispGraph)
        // console.log($scope.dispTime)
        //console.log($scope.curYear)
        if($scope.stations.length > 0){
            if($scope.curYear === "All"){
                AADTGraph.drawAADTGraph('#aadtGraph',angular.copy($scope.stations),'class',$scope.graphs[$scope.graphs.map(function(el){return el.id;}).indexOf($scope.dispGraph)].data,[]);
                if($scope.dispTime === "month"){
                    monthlyLineChart.drawMonthlyLineChart('#hrMonLineGraph',$scope.dispGraph,$scope.state);
                }
                else{
                    monthlyLineChart.drawHourlyLineChart('#hrMonLineGraph',$scope.dispGraph,$scope.state);   
                }
            }
            else{
                AADTGraph.drawAADTGraph('#aadtGraph',angular.copy($scope.stations),'class',$scope.graphs[$scope.graphs.map(function(el){return el.id;}).indexOf($scope.dispGraph)].data,[parseInt($scope.active_years2.id)]);
                if($scope.dispTime === "month"){
                        monthlyLineChart.drawMonthlyLineChart('#hrMonLineGraph',$scope.dispGraph,$scope.state);
                    }
                    else{
                        monthlyLineChart.drawHourlyLineChart('#hrMonLineGraph',$scope.dispGraph,$scope.state);   
                    }
            }
        }
    });
    


    function getYearRange(stations){
        var output = [];
        //console.log(stations);
        stations.forEach(function(station){
            station.years.forEach(function(year){
                if(parseInt(year.year) < 10){ year.year  = '0'+year.year; }
                year.year = parseInt('20'+year.year)
                if(output.indexOf(year.year) == -1){
                    output.push(year.year)
                }
                
            })
        })
        //console.log('year list',output)
                
        return output;
        //console.log()
        
    }

    function getStateIndex(state_fips){
      return $scope.states.map(function(el) {return el.state_fips;}).indexOf(state_fips);
    }
};

