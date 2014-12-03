function HeaderController ($scope) {
$scope.database = JSON.parse(window.database).datasource
wimXHR.setDatabase(JSON.parse(database).datasource);
$scope.setDatabase = function(database){
	 $.post('/user/db',{database:database},function serverSays(err,message){
            if (err) {console.log(err);}
        	window.location = "/";
    });
}

}
