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

    wimgraph.grapher('#wimgraph').drawGraph($scope.station, $scope.stationType);

    wimCal.init($scope);
}

