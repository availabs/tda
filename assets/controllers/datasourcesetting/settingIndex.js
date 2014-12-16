$(function(){
    function pageLoad(){        
        //PjaxApp.onResize(drawSparkLines);
        $('.widget').widgster();
    }
    pageLoad();

});

function DataSourceSettingController ($scope) {
    $scope.currentUser = window.currentUser;
    $scope.newSetting = {state:null,type:null,limit:null,id:null};
    $scope.updateSetting = {state:null,type:null,limit:null,id:null};
    $scope.settings = []
    $scope.edit = false
    io.socket.get('/user/'+$scope.currentUser.id, function serverSays(err2,message2){

        if (message2.statusCode != 200){
            console.log("Help")
            return
        }
        $scope.$apply(function(){
            $scope.agencys = err2.agency
            $scope.settings = JSON.parse( JSON.stringify( err2.agency[0].settings ) )
            $scope.curAgency = $scope.agencys[0];
            $scope.curAgencyLabel = $scope.agencys[0];
            
         });
    });

    $scope.editSettings = function(setting){
        $scope.edit = true
        $scope.updateSetting = JSON.parse( JSON.stringify( setting ) );
        $('#editState').val($scope.updateSetting.state);
        $('#editType').val($scope.updateSetting.type);
        $('#editLimit').val($scope.updateSetting.limit);
        $('#editStateOld').html(setting.state);
        $('#editTypeOld').html(setting.type);
        $('#editLimitOld').html(setting.limit);  
    }
    $scope.updateSettingFin = function(){
        $scope.curAgency.settings[$scope.updateSetting.id-1] = {state:$scope.updateSetting.state,type:$scope.updateSetting.type,limit:$scope.updateSetting.limit,id:$scope.updateSetting.id}
        io.socket.post('/agency/update',{agency:$scope.curAgency.id,newData:$scope.curAgency.settings},function serverSays(err,message){
            if (message.statusCode != 200){
               return
            }
            $scope.$apply(function(){
                $scope.settings = JSON.parse( JSON.stringify($scope.curAgency.settings))
                $scope.edit = false
                $scope.updateSetting = {}
             });
            
        });
    }

    $scope.deleteSettings = function(setting){
        var range = $scope.curAgency.settings.map(function(el) {return el.id;}).indexOf(setting.id)
        if(range > -1){
            $scope.curAgency.settings.splice(range,1)
        }
        else{
            return
        }
        io.socket.post('/agency/update',{agency:$scope.curAgency.id,newData:$scope.curAgency.settings},function serverSays(err,message){
            if (message.statusCode != 200){
               return
            }
            $scope.$apply(function(){
                $scope.settings = JSON.parse( JSON.stringify($scope.curAgency.settings))
             });
            
        });
    }

    $scope.cancelUpdate = function(){
        $scope.edit = false   
        $scope.updateSetting = {}
    }

    $scope.createSetting = function(){
        if($scope.curAgency.settings == null || $scope.curAgency.settings == undefined){
            $scope.curAgency.settings = []
            $scope.newSetting.id = 1
        }
        else if($scope.curAgency.settings.length == 0){
            $scope.newSetting.id = 1   
        }
        else{
            $scope.newSetting.id = $scope.curAgency.settings[$scope.curAgency.settings.length-1].id + 1
        }
        $scope.curAgency.settings.push(JSON.parse( JSON.stringify($scope.newSetting ) ) )
        io.socket.post('/agency/update',{agency:$scope.curAgency.id,newData:$scope.curAgency.settings},function serverSays(err,message){
            if (message.statusCode != 200){
               return
            }
            $scope.$apply(function(){
                $scope.settings = JSON.parse( JSON.stringify($scope.curAgency.settings))
            });
            
        });
        
    }

    //Below is code for when agency is changed
    $( "#selector" ).change(function() {
        
        $scope.curAgency = $scope.agencys[parseInt(document.getElementById("selector").value)]
        $scope.curAgencyLabel = $scope.agencys[parseInt(document.getElementById("selector").value)]
        $scope.settings = JSON.parse( JSON.stringify( $scope.curAgency.settings ) )
        $('#newState').val("");
        $('#newType').val("");
        $('#newLimit').val("");
        
    })
}