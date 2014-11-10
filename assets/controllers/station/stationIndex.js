$(function(){
    function pageLoad(){        
        //PjaxApp.onResize(drawSparkLines);
        $('.widget').widgster();
    }
    pageLoad();

    PjaxApp.onPageLoad(pageLoad);
});

function StationController ($scope) {
    if(window.station.length == 9){
        $scope.station = window.station.slice(0,6);
        $scope.stationType = window.stationType;
        $scope.state = window.station.slice(7)
        $scope.stationData = stationInfo.drawTable($scope.station,'#infoTable',$scope);
        wimgraph.grapher('#wimgraph').drawGraph($scope.station, $scope.stationType,$scope.state);
        
        wimCal.init($scope);
    }

    
};