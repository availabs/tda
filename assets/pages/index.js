$(function(){
    function pageLoad(){        
        //PjaxApp.onResize(drawSparkLines);
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

    wimstates.init('#statesDIV',$scope);

    AADTGraph.initAADTGraph('#povAADTGraph');
    AADTGraph.initAADTGraph('#suAADTGraph');
    AADTGraph.initAADTGraph('#ttAADTGraph');
    var type = [true,false,false]


    $scope.$watch('stations', function() {
        if($scope.stations != undefined){
          if($scope.stations.length > 0){
            var pov={},tt={};
            AADTGraph.drawAADTGraph('#povAADTGraph',angular.copy($scope.stations),'class',[true,false,false]);
            AADTGraph.drawAADTGraph('#suAADTGraph' ,angular.copy($scope.stations),'class', [false,true,false]);
            AADTGraph.drawAADTGraph('#ttAADTGraph' ,angular.copy($scope.stations),'class', [false,false,true]);
          }
          
        }

    });

    function getStateIndex(state_fips){
      return $scope.states.map(function(el) {return el.state_fips;}).indexOf(state_fips);
    }
};

