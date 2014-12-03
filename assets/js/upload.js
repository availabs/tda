$(function () {
    function pageLoad(){
        'use strict';
        // Initialize the jQuery File Upload widget:
        $fileupload = $('#fileupload');
        $fileupload.fileupload({
            // Uncomment the following to send cross-domain cookies:
            //xhrFields: {withCredentials: true},
            url: '/upload/data/notReady',
            dropZone: $('#dropzone')
        });

        // Enable iframe cross-domain access via redirect option:
        $fileupload.fileupload(
            'option',
            'redirect',
            window.location.href.replace(
                /\/[^\/]*$/,
                '/cors/result.html?%s'
            )
        );

    }

    pageLoad();
});




function parsedDataController($scope){

    $scope.currentUser = window.currentUser;
    $scope.currentSource = ""
    source = ""
    io.socket.on('connect',function(){

        $scope.dataSource = ""
        io.socket.get('/user/'+$scope.currentUser.id, function serverSays(err2,message2){

            if (message2.statusCode != 200){
                return
            }
            $scope.$apply(function(){
                $scope.agencys = err2.agency
                $scope.dataSource = $scope.agencys[0]
                
            });
            for(x = 0;x<err2.agency.length;x++){
                source = source+"source="+err2.agency[x].datasource
                if(x+1 != err2.agency.length){
                    source = source+"&"
                }   
            }
            d3.json("/uploadJob/?limit=20&"+source+"&sort=createdAt%20DESC", function(error, json) {
              if (error) return console.warn(error);
              $scope.$apply(function(){
                        $scope.jobs = json
                    });
            });
            
        });
        
    
        $scope.processedFiles = [];
        $scope.loadingData = false
        $scope.doneLoading = 0
        io.socket.on('load_start',function(data){
            
            $scope.processedFiles = []
            $scope.$apply(function(){
                $scope.doneLoading = $scope.doneLoading + 1
                $scope.loadingData = true
            });
        })
        io.socket.on('file_parsed',function(data){
            $scope.processedFiles.push(data)
            $scope.doneLoading = $scope.doneLoading -1
            $scope.$apply(function(){
                if($scope.doneLoading == 0){
                    $scope.loadingData = false
                }
            });
            d3.json("/uploadJob/?limit=20&"+source+"&sort=createdAt%20DESC", function(error, json) {
              if (error) return console.warn(error);
              $scope.$apply(function(){
                        $scope.jobs = json
                    });
            });

        })
                
        
    })

    
    
    $scope.changeDateSource = function() {
        $scope.currentSource = $scope.dataSource.datasource
        $fileupload = $('#fileupload');
            $fileupload.fileupload({
                // Uncomment the following to send cross-domain cookies:
                //xhrFields: {withCredentials: true},
                url: '/upload/data/'+$scope.currentSource,
                dropZone: $('#dropzone')
            });

            // Enable iframe cross-domain access via redirect option:
            $fileupload.fileupload(
                'option',
                'redirect',
                window.location.href.replace(
                    /\/[^\/]*$/,
                    '/cors/result.html?%s'
                )
            );
    }

}