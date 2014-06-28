$(function(){
    function pageLoad(){        
        //PjaxApp.onResize(drawSparkLines);
        $('.widget').widgster();
    }
    pageLoad();

    PjaxApp.onPageLoad(pageLoad);
});

function StationController ($scope) {
    
    // create graph object and draw a graph
    $scope.station = window.station;
    $scope.stationType = window.stationType

    // create graph object and draw a graph
    var grapher = wimgraph.grapher('#wimgraph');
    grapher.drawGraph($scope.station, $scope.stationType);

    //Populate Station Info Table
    stationInfo.drawTable($scope.station,"#infoTable");

};

