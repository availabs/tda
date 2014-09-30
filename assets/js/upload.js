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
    PjaxApp.onPageLoad(pageLoad);

});


function parsedDataController($scope){

    io.socket.on('connect',function(){
        $scope.processedFiles = [];
        $scope.givenError = ""
        $scope.loadingData = false
        $scope.showError = false
        io.socket.on('load_start',function(data){
            $scope.$apply(function(){
                $scope.loadingData = true
                $scope.showError = false
            });
        })
        io.socket.on('file_parsed',function(data){
            $scope.processedFiles = []
            $scope.processedFiles.push(data)
            //$scope.$apply();
            $scope.$apply(function(){
                $scope.loadingData = false
            });
        })
        io.socket.on('error_occured',function(data){
            $scope.givenError = data
            $scope.$apply(function(){
                $scope.loadingData = false
                $scope.showError = true
            });
        })
        
    })

}