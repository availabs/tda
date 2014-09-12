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
        io.socket.on('file_parsed',function(data){
            console.log(data)
            // $scope.processedFiles.push(data)
            // // for(var i = 0;i<data.length;i++){
            // //     $scope.processedFiles.push(["StateFips Code: "+data[i].state+" Station: "+data[i].station+" Date:"+data[i].month+"/"+data[i].day+"/"+data[i].year]);
            // // }
            // console.log($scope.processedFiles)
            // $scope.$apply();
        })

    })

}