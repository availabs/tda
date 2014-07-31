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
    
   
    wimstates.init('#statesDIV',$scope);
    // AADTGraph.initAADTGraph('#changeAADTGraph');
    // AADTGraph.initAADTGraph('#aadtGraph');
    // monthlyLineChart.initMonthlylLineChart("#hrMonLineGraph");
    var type = [true,false,false]


    $scope.$watch('stations', function() {
        if($scope.stations != undefined){
          if($scope.stations.length > 0){
            
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

