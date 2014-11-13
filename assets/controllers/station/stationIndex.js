var map = {};

$(function(){
    function pageLoad(){        
        //PjaxApp.onResize(drawSparkLines);
        $('.widget').widgster();
    }
    pageLoad();

});

function StationController ($scope) {
    //console.log('station controller',window.station);
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

    $scope.$watch('stationData',function(){
        
        console.log($scope.stationData);
        if($scope.stationData){
             drawMap($scope.stationData.lat,$scope.stationData.lng)
        }
    
    });

    $scope.resetMap = function(){
        L.Util.requestAnimFrame(map.invalidateSize,map,!1,map._container);
    }
};

function drawMap(lat,lng){
    $('#displayMap').height($(window).height()-200);
    map = L.map('displayMap', {
     center: [lat,lng],
     zoom: 16 
    });
    L.tileLayer("https://{s}.tiles.mapbox.com/v3/matt.hd0b27jd/{z}/{x}/{y}.png").addTo(map);
    var marker = L.marker([lat,lng]).addTo(map);
    $(window).on('resize',function(){
        $('#displayMap').height($(window).height()-200);
    })
}