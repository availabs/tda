$(function () {
    function pageLoad(){
        'use strict';
        // Initialize the jQuery File Upload widget:
        var $fileupload = $('#fileupload');
        $fileupload.fileupload({
            // Uncomment the following to send cross-domain cookies:
            //xhrFields: {withCredentials: true},
            url: '/upload/data/',
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
    
    io.socket.on('connect',function(){
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

            d3.json("/uploadJob/?limit=20&sort=createdAt%20DESC", function(error, json) {
              if (error) return console.warn(error);
              $scope.$apply(function(){
                        $scope.jobs = json
                    });
            });

        })
                
        
    })

    d3.json("/uploadJob/?limit=20&sort=createdAt%20DESC", function(error, json) {
      if (error) return console.warn(error);
      $scope.$apply(function(){
                $scope.jobs = json
            });
    });

}