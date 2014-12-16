$(function(){
    function pageLoad(){        
        $('.widget').widgster();
    }
    pageLoad();


});

function UserAdminController ($scope) {
    $scope.users = window.users;
    $scope.newUser = {};
    $scope.clicked = false
    $scope.agencys = window.agencys;
    $scope.dataSource
    $scope.currentUser = {}


    $scope.createAccount = function(){
        io.socket.post('/user/create',$scope.newUser,function serverSays(err,message){
            if (err)
                console.log(err)

            console.log(message);
        });   
    }
    $scope.updateAccount = function(user){
        console.log("Eventually this will do stuff")
        console.log($scope.newUser,user)
    }
    $scope.setEditable = function(user){

        $scope.clicked = true
        $('#editableName').val(user.name);
        $('#editableUserName').val(user.username);
        $('#editableEmail').val(user.email);
        
        io.socket.get('/user/'+user.id, function serverSays(err2,message2){

            if (message2.statusCode != 200){
                return
            }
            $scope.currentUser = err2
            
        });

        
    }
    $scope.updateDatasource = function(){
        //Extra get is needed since window doesn't seem to store the agency/user listing
        $scope.currentUser.agency.push($scope.dataSource)
        io.socket.put('/user/'+$scope.currentUser.id,{agency:$scope.currentUser.agency},function serverSays(err,message){
            if (message.statusCode != 200){
               return
            }
            $scope.currentUser = err
            
        });
        


        // io.socket.post('/user/'+$scope.currentUser.id,{agency:$scope.dataSource},function serverSays(err,message){
        //     if (err)
        //         console.log(err)
        //     $scope.currentUser = err
        //     console.log($scope.currentUser)
        //     console.log(message);
        // });
    }

};
