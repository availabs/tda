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
    $scope.stationData = window.stationData;
    console.log('stationData',$scope.stationData);

    wimgraph.grapher('#wimgraph').drawGraph($scope.station, $scope.stationType);
    stationInfo.drawTable($scope.station,'#infoTable');
    //wimCal.init($scope);
}