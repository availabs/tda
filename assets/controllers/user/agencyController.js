$(function(){
    function pageLoad(){        
        $('.widget').widgster();
    }
    pageLoad();


});

function UserAgencyController ($scope) {
    $scope.agencys = window.agencys;
    $scope.newAgency = {};
    $scope.clicked = false
    console.log($scope.agencys);

    $scope.createAccount = function(){
        console.log($scope.newAgency)
        io.socket.post('/agency/create',$scope.newAgency,function serverSays(err,message){
            if(err){
                console.log(err)
            }
            console.log(message);
            $scope.$apply(function(){
                $scope.agencys = window.agencys;            
            });
        });   
    }
    $scope.updateAccount = function(agency){
        console.log("Eventually this will do stuff")
    }
    $scope.DeleteAgency = function(agency){
        io.socket.delete('/agency/destroy',agency,function serverSays(err,message){
            if(err){
                console.log(err)
            }
            //Doesn't update list?
            $scope.$apply(function(){
                $scope.agencys = window.agencys;            
            });
        });
    }
    $scope.setEditable = function(user){
        $scope.clicked = true
        // $('#editableName').val(user.name);
        // $('#editableUserName').val(user.username);
        // $('#editableEmail').val(user.email);
    }

};
