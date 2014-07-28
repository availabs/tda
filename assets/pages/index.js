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
    wimstates.init('#statesDIV',$scope);

    AADTGraph.initAADTGraph('#changeAADTGraph');
    AADTGraph.initAADTGraph('#povAADTGraph');
    AADTGraph.initAADTGraph('#suAADTGraph');
    AADTGraph.initAADTGraph('#ttAADTGraph');
    var type = [true,false,false]


    $scope.$watch('stations', function() {
        if($scope.stations != undefined){
          if($scope.stations.length > 0){
            $scope.years = getYearRange($scope.stations);
            console.log($scope.years);
            $scope.active_years = {first:d3.min($scope.years),max:d3.max($scope.years)}
            var pov={},tt={};
            AADTGraph.drawAADTGraph('#changeAADTGraph',angular.copy($scope.stations),'class',[false,true,false,false],[$scope.active_years.first,$scope.active_years.max]);
            AADTGraph.drawAADTGraph('#povAADTGraph',angular.copy($scope.stations),'class',[false,true,false,false],[]);
            AADTGraph.drawAADTGraph('#suAADTGraph' ,angular.copy($scope.stations),'class', [false,false,true,false],[]);
            AADTGraph.drawAADTGraph('#ttAADTGraph' ,angular.copy($scope.stations),'class', [false,false,false,true],[]);
          }
          
        }
    });
    $scope.$watchCollection('active_years', function() {
        if($scope.stations.length > 0){
            $scope.active_years.first = parseInt($scope.active_years.first);
            $scope.active_years.max = parseInt($scope.active_years.max);
            console.log('first_year',$scope.active_years)

            AADTGraph.drawAADTGraph('#changeAADTGraph',angular.copy($scope.stations),'class',[false,true,false,false],[$scope.active_years.first,$scope.active_years.max]);      
        }
    });
    


    function getYearRange(stations){
        var output = [];
        console.log(stations);
        stations.forEach(function(station){
            station.years.forEach(function(year){
                if(parseInt(year.year) < 10){ year.year  = '0'+year.year; }
                year.year = parseInt('20'+year.year)
                if(output.indexOf(year.year) == -1){
                    output.push(year.year)
                }
                
            })
        })
        console.log('year list',output)
                
        return output;
        //console.log()
        
    }

    function getStateIndex(state_fips){
      return $scope.states.map(function(el) {return el.state_fips;}).indexOf(state_fips);
    }
};

