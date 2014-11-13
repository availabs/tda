$(function(){
    function pageLoad(){        
        //PjaxApp.onResize(drawSparkLines);
        $('.widget').widgster();
    }
    pageLoad();

});

function StationController ($scope) {
    console.log('station controller',window.station);
    $scope.station = window.station;
    if(window.station.length == 9){
        $scope.station = window.station.slice(0,6);
    }
    $scope.stationType = window.stationType;
    $scope.state = window.station.slice(7)
    d3.select("#radio_"+stationType).attr("class","btn btn-success active")
    $scope.stationData = stationInfo.drawTable($scope.station,'#infoTable',$scope);
    wimgraph.grapher('#wimgraph').drawGraph($scope.station, $scope.stationType,$scope.state);
    
    wimCal.init($scope);


    
};