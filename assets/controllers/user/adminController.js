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
    $scope.dataSource = ""
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
        $scope.currentUser = user
        console.log(user,$scope.currentUser,$scope.dataSource)
        if(user.agency != null){
            // $scope.$apply(function(){
            //      $scope.dataSource = $scope.agencys[$scope.agencys.map(function(el) {return el.id;}).indexOf($scope.currentUser.agency)]
            //      console.log($scope.dataSource)
            // });
        }
        else{
            $('#editableDatasource').val("")   
        }
    }
    $scope.updateDatasource = function(){
        console.log($scope.dataSource)
        console.log($scope.currentUser)
        io.socket.put('/user/'+$scope.currentUser.id,{agency:$scope.dataSource},function serverSays(err,message){
            if (err)
                console.log(err)
            $scope.currentUser = err
            console.log($scope.currentUser)
            console.log(message);
        });
    }

};
