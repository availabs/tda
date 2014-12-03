$(function(){
    function pageLoad(){        
        //PjaxApp.onResize(drawSparkLines);
        $('.widget').widgster();
    }
    pageLoad();

});

function StatusCalendarController ($scope) {
    $scope.currentUser = window.currentUser;
    $scope.arrayCheck = []
    $scope.myDataDisp = "Class";
    $scope.loading = true
    io.socket.get('/user/'+$scope.currentUser.id, function serverSays(err2,message2){

        if (message2.statusCode != 200){
            return
        }
        $scope.values33 = [
          { id: "Freight", label:'Freight'},
          { id: "Class", label:'Class'},
        ];
        $scope.$apply(function(){
                $scope.agencys = err2.agency
                $scope.curAgency = $scope.agencys[0];
                $scope.curAgencyLabel = $scope.agencys[0];
                $scope.myDataDisp33 = $scope.values33[0].id;
            });

        //Gets listings of number of stations with data available per day based on the currently selected datasource
        wimXHR.post('/station/getStationCounts/', {dataSource:$scope.agencys[0].datasource},function(error, data) {
            if(error){
              console.log(error)
              return
            }
            for(i = 0;i<$scope.agencys.length;i++){
                if(i != 0){
                    $scope.arrayCheck.push({status:false,data:null,statusC:false,dataC:null})
                }
                else{
                    $scope.arrayCheck.push({status:true,data:data.rows,statusC:false,dataC:null})
                }   
            }    
            $scope.curAgency = $scope.arrayCheck[0]
            wimCal.init($scope);
            $scope.$apply(function(){
                $scope.loading = false
            });

        });
    });

    //Interactive button functionality for status page. "Caches" data so that multiple and unecessary post
    //requests aren't made.

    $scope.loadCalendar2 = function(){
        $scope.loading = true
        if($scope.arrayCheck[document.getElementById("selector").value].status && ($scope.myDataDisp33 === "Freight")){
                $scope.curAgency = $scope.arrayCheck[document.getElementById("selector").value]
                $scope.curAgencyLabel = $scope.agencys[document.getElementById("selector").value]
                wimCal.init($scope);
                $scope.loading = false
            }
            else if($scope.arrayCheck[document.getElementById("selector").value].statusC && ($scope.myDataDisp33 === "Class")){
                $scope.curAgency = $scope.arrayCheck[document.getElementById("selector").value]
                $scope.curAgencyLabel = $scope.agencys[document.getElementById("selector").value]
                wimCal.init($scope);
                $scope.loading = false
            }
            else{
                if($scope.myDataDisp33 === "Class"){
                    var dataSourceInput = $scope.agencys[document.getElementById("selector").value].datasource + "Class"
                    }
                else{
                    var dataSourceInput = $scope.agencys[document.getElementById("selector").value].datasource
                }
                wimXHR.post('/station/getStationCounts/', {dataSource:dataSourceInput},function(error, data) {
                    if(error){
                      console.log(error)
                      return
                    }
                    if($scope.myDataDisp33 === "Class"){
                        $scope.arrayCheck[document.getElementById("selector").value].statusC = true
                        $scope.arrayCheck[document.getElementById("selector").value].dataC = data.rows
                    }
                    else{
                        $scope.arrayCheck[document.getElementById("selector").value].status = true
                        $scope.arrayCheck[document.getElementById("selector").value].data = data.rows
                    }
                    $scope.curAgency = $scope.arrayCheck[document.getElementById("selector").value]
                    $scope.curAgencyLabel = $scope.agencys[document.getElementById("selector").value]
                    wimCal.init($scope);
                    $scope.$apply(function(){
                        $scope.loading = false
                    });
                });
            
            }
        }

    
};