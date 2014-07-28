function HeaderController ($scope) {

$scope.database = window.database;
wimXHR.setDatabase(database);
$scope.setDatabase = function(database){
	 io.socket.post('/user/db',{database:database},function serverSays(err,message){
            if (err) {console.log(err);}
        	window.location = "/";
    });
}

}
