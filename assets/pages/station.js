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
    $scope.stationType = window.stationType;

    var grapher = wimgraph.grapher('#wimgraph');
    grapher.drawGraph($scope.station, $scope.stationType);

    $scope.values = [
      { id: 0, label: 'All' },
      { id: 4, label: '4' },
      { id: 5, label: '5' },
      { id: 6, label: '6' },
      { id: 7, label: '7' },
      { id: 8, label: '8' },
      { id: 9, label: '9' },
      { id: 10, label: '10' },
      { id: 11, label: '11' },
      { id: 12, label: '12' },
      { id: 13, label: '13' },
    ];
    $scope.values2 = [
      { id: "Weight", label: 'Weight' },
      { id: "Count", label: 'Count' },
    ];
    $scope.values3 = [
      { id: "Freight", label:'Freight'},
      { id: "Class", label:'Class'},
    ];
  $scope.myClass = 0;
  $scope.myDisp = "Count";
  $scope.myDataDisp = "Freight";

       $scope.minYear = ""
       $scope.maxYear = ""
       $scope.drawVars = []

      var URL = '/stations/byStation';

      wimXHR.get(URL, function(error, data) {
          $scope.minYear = data.rows[0].f[0].v
          $scope.maxYear = data.rows[0].f[1].v
          $scope.drawVars = wimCalendar.init($scope.minYear,$scope.maxYear)
          $scope.stationData = [];
          $scope.stationDataAll = [];
          $scope.myClass = $scope.values[0].id;
          $scope.myDisp = $scope.values2[1].id;
          $scope.myDataDisp = $scope.values3[0].id;

                
          wimXHR.get('/stations/byStation/class/'+$scope.station, function(error, data) {
            $scope.stationDataAll = data;
          });
          
          wimXHR.get('/stations/byStation/'+$scope.station, function(error, data) {
              $scope.stationData = data;
              calCreate($scope.drawVars[5],$scope.drawVars[3],$scope.myClass,$scope.drawVars[1],$scope.drawVars[2],data,$scope.drawVars[0],$scope.drawVars[4],"trucks","Freight")
          });
          
          $scope.loadCalendar = function(){
            if($scope.myDataDisp === "Freight"){
                calCreate($scope.drawVars[5],$scope.drawVars[3],$scope.myClass,$scope.drawVars[1],$scope.drawVars[2],$scope.stationData,$scope.drawVars[0],$scope.drawVars[4],$scope.myDisp,$scope.myDataDisp)
            
            }
            else{
                calCreate($scope.drawVars[5],$scope.drawVars[3],$scope.myClass,$scope.drawVars[1],$scope.drawVars[2],$scope.stationDataAll,$scope.drawVars[0],$scope.drawVars[4],"Count",$scope.myDataDisp)
            }
          }
      });

    
}



  function calCreate(rect,svg,classT,day,week,data,z,svg2,dispType,dispType2){
      if(dispType2 === "Freight"){
        wimCalendar.drawCalendar(rect,svg,parseDataF(data,classT),day,week,z,svg2,dispType);
      }
      else{
        wimCalendar.drawCalendar(rect,svg,parseDataA(data,classT),day,week,z,svg2,dispType); 
      }
  };

