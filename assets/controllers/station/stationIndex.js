$(function(){
    function pageLoad(){        
        //PjaxApp.onResize(drawSparkLines);
        $('.widget').widgster();
    }
    pageLoad();

    PjaxApp.onPageLoad(pageLoad);
});

function StationController ($scope) {
    $scope.station = window.station;
    $scope.stationType = window.stationType;
    $scope.stationData = stationInfo.drawTable($scope.station,'#infoTable',$scope);
    wimgraph.grapher('#wimgraph').drawGraph($scope.station, $scope.stationType);
    
    wimCal.init($scope);
};