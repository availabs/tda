$(function(){
    function pageLoad(){        
        //PjaxApp.onResize(drawSparkLines);f
        $('.widget').widgster();

        // $("body").on("mousemove", function(e) {
        //   var x = e.pageX - 20;
        //   var y = e.pageY;
        //   var windowH = $(window).height();
        //   if (y > (windowH - 100)) {
        //   var y = e.pageY - 100;
        //   } else {
        //   var y = e.pageY - 20;
        //   }
        //   //console.log(x,y)
        //   $("#stationInfo").css({
        //     "left": x,
        //     "top": y
        //   });
        // });
    }

    pageLoad();

    PjaxApp.onPageLoad(pageLoad);
});

function EnforcementController ($scope) {
   
    $scope.stations = {};
    $scope.graphData = [];
    $scope.truckClass = [];
    $scope.overWeightBar = [];
    $scope.overWeightLine = [];
    $scope.active_TruckClass = {};
    $scope.timePeriod = [

      { id:"year", label:'Year'},
      { id:"month", label:'Month'},
      { id:"day", label:'Day'},

    ];
    $scope.time_order =[

    { id:"count",label:'Count'},
    { id:"percent",label:'Percent'},

    ];
    $scope.myTimePeriod = $scope.timePeriod[0].id
    $scope.myOrder = $scope.time_order[0].id
    $scope.getStations = false

    wimstates2.init('#statesDIV',$scope);

    $scope.recentClass = ""
    $scope.recentWeight = ""
    $scope.getRecent = false

    AADTGraph.initAADTGraph('#weightByHour');
    lineChart.initlineChart('#overweightLineGraph');
    truckWeightGraph.initTruckWeightGraph('#overweightBarGraph')
    //var type = [true,false,false]


    $scope.$watch('stations', function() {
        if($scope.stations != undefined){
            if($scope.stations.length > 0){
                
                    d3.select('#weightByHour'+" svg").selectAll("g").attr('opacity',0.1);
                    d3.select('#weightByHour'+" svg").selectAll("rect").attr('opacity',0.1);
                    d3.select('#weightByHour'+" svg").append("g")
                    .append("text")
                      .attr('opacity',1)
                      .attr("transform", "translate(" + ((AADTGraph.width + AADTGraph.margin.left + AADTGraph.margin.right)/1.25) + "," + ((AADTGraph.height + AADTGraph.margin.top + AADTGraph.margin.bottom)/2) + ")")
                      .attr("y", 6)
                      .attr("dy", ".71em")
                      .style("font-size","36px")
                      .style("text-anchor", "end")
                      .text("Loading");
                    d3.select('#weightByHour'+" svg").append("g").append("svg:image")
                    .attr("transform", "translate(" + ((AADTGraph.width + AADTGraph.margin.left + AADTGraph.margin.right)/1.25) + "," + (((AADTGraph.height + AADTGraph.margin.top + AADTGraph.margin.bottom)/2)-20) + ")")
                    .attr("xlink:href", "/img/loading.gif")
                    .attr("width", 67)
                    .attr("height", 40);
                    
                    var URL = '/stations/weight/'
                    wimXHR.post(URL, {stateFips:$scope.state},function(error, data) {

                                if (error) {
                                    console.log(error);
                                    return;
                                }
                                if(data.rows != undefined){

                                    data.rows.forEach(function(row){
                                        var rowStation = row.f[0].v;
                                        for(var x = 0;x<rowStation.length;x++){
                                            if(rowStation[x] === " "){
                                                rowStation = rowStation.substr(0, x) + '0' + rowStation.substr(x + 1)
                                            }
                                        }
                                        if(getStationIndex(rowStation) == -1) {
                                            $scope.graphData.push({'stationId':rowStation, years:[]})
                                            
                                        }
                                        if(parseInt(row.f[1].v) < 10){
                                            row.f[1].v = "0"+row.f[1].v
                                        }
                                        $scope.graphData[getStationIndex(rowStation)].years.push({'year':row.f[1].v,'hours':row.f[2].v,'Weight':(parseInt(row.f[3].v)*220.462),'Class':row.f[4].v});
                                    
                                    });

                                }
                                else{
                                    $scope.graphData = []
                                }
                        $scope.$apply(function(){
                            $scope.truckClass = getClassRange(angular.copy($scope.graphData))
                            $scope.active_TruckClass = {value:$scope.truckClass[0]}
                        });
                        wimXHR.post('/station/byMostRecentDate/',{'type':""},function(error,data){

                            wimXHR.post('/station/byMostRecentDate/',{'type':"Class"},function(error,data){

                                if(parseInt(data.rows[0].f[0].v) < 10 ){
                                    $scope.recentClass = "200"+data.rows[0].f[0].v+"/"+data.rows[0].f[1].v+"/"+data.rows[0].f[2].v
                                }
                                else{
                                    $scope.recentClass = "20"+data.rows[0].f[0].v+"/"+data.rows[0].f[1].v+"/"+data.rows[0].f[2].v
                                }
                                $scope.$apply(function(){
                                    $scope.getRecent = true
                                });
                            });

                            if(parseInt(data.rows[0].f[0].v) < 10 ){
                                $scope.recentWeight = "200"+data.rows[0].f[0].v+"/"+data.rows[0].f[1].v+"/"+data.rows[0].f[2].v
                            }
                            else{
                                $scope.recentWeight = "20"+data.rows[0].f[0].v+"/"+data.rows[0].f[1].v+"/"+data.rows[0].f[2].v
                            }
                                

                        });
                        AADTGraph.drawAADTGraphWeight('#weightByHour',angular.copy($scope.graphData),"weight","All",$scope.state)
                    });

                    //line graph

                    d3.select('#overweightLineGraph'+" svg").selectAll("g").attr('opacity',0.1);
                    d3.select('#overweightLineGraph'+" svg").append("g")
                    .append("text")
                      .attr('opacity',1)
                      .attr("transform", "translate(" + ((AADTGraph.width + AADTGraph.margin.left + AADTGraph.margin.right)/1.25) + "," + ((AADTGraph.height + AADTGraph.margin.top + AADTGraph.margin.bottom)/2) + ")")
                      .attr("y", 6)
                      .attr("dy", ".71em")
                      .style("font-size","36px")
                      .style("text-anchor", "end")
                      .text("Loading");
                    d3.select('#overweightLineGraph'+" svg").append("g").append("svg:image")
                    .attr("transform", "translate(" + ((AADTGraph.width + AADTGraph.margin.left + AADTGraph.margin.right)/1.25) + "," + (((AADTGraph.height + AADTGraph.margin.top + AADTGraph.margin.bottom)/2)-20) + ")")
                    .attr("xlink:href", "/img/loading.gif")
                    .attr("width", 67)
                    .attr("height", 40);
                    var URL = '/stations/overweight/'
                    wimXHR.post(URL,{timeType:"on",threshold:80000,stateFips:$scope.state} ,function(error, data) {
                        $scope.overWeightLine = []
                        
                        if (error) {
                            console.log(error);
                            return;
                        }
                        if(data.rows != undefined){
                            data.rows.forEach(function(row){
                                var rowStation = row.f[0].v;
                                for(var x = 0;x<rowStation.length;x++){
                                            if(rowStation[x] === " "){
                                                rowStation = rowStation.substr(0, x) + '0' + rowStation.substr(x + 1)
                                            }
                                        }
                                if(getStationIndex(rowStation,"line") == -1) {
                                    $scope.overWeightLine.push({'stationId':rowStation, 'funcCode': row.f[4].v,perOverWeight:[0,0,0,0,0,0,0,0,0,0,0,0],avgOverWeight:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]})
                                    
                                }
                                if(parseInt(row.f[3].v) < 10){
                                    row.f[3].v = "0"+row.f[3].v
                                }

                                $scope.overWeightLine[getStationIndex(rowStation,"line")].avgOverWeight[parseInt(row.f[3].v)-1] = $scope.overWeightLine[getStationIndex(rowStation,"line")].avgOverWeight[parseInt(row.f[3].v)-1] + parseInt(row.f[1].v)
                                $scope.overWeightLine[getStationIndex(rowStation,"line")].perOverWeight[parseInt(row.f[3].v)-1] = $scope.overWeightLine[getStationIndex(rowStation,"line")].perOverWeight[parseInt(row.f[3].v)-1] + parseInt(row.f[2].v)
                                $scope.overWeightLine[getStationIndex(rowStation,"line")].avgOverWeight[parseInt(row.f[3].v)+11] = $scope.overWeightLine[getStationIndex(rowStation,"line")].avgOverWeight[parseInt(row.f[3].v)+11] + 1
                                
                            });
                            for(var i = 0;i<$scope.overWeightLine.length;i++){
                                for(var j = 0;j<12;j++){
                                    if($scope.overWeightLine[i].avgOverWeight[12] != 0){
                                        $scope.overWeightLine[i].avgOverWeight[j] = $scope.overWeightLine[i].avgOverWeight[j] / $scope.overWeightLine[i].avgOverWeight[12]
                                        $scope.overWeightLine[i].perOverWeight[j] = $scope.overWeightLine[i].perOverWeight[j] / $scope.overWeightLine[i].avgOverWeight[12]
                                        $scope.overWeightLine[i].perOverWeight[j] = $scope.overWeightLine[i].avgOverWeight[j] / $scope.overWeightLine[i].perOverWeight[j]
                                        $scope.overWeightLine[i].perOverWeight[j] = $scope.overWeightLine[i].perOverWeight[j] * 100
                                    }
                                    $scope.overWeightLine[i].avgOverWeight.splice(12,1)
                                }
                            }
                            lineChart.drawlineChart('#overweightLineGraph',angular.copy($scope.overWeightLine),$scope.myOrder);
                        }
                        else{
                            $scope.overWeightLine = []
                            lineChart.drawlineChart('#overweightLineGraph',angular.copy($scope.overWeightLine),$scope.myOrder);
                        }
                    });

                    //Bar graph
                    d3.select('#overweightBarGraph'+" svg").selectAll("g").attr('opacity',0.1);
                    d3.select('#overweightBarGraph'+" svg").selectAll("rect").attr('opacity',0.1);
                    d3.select('#overweightBarGraph'+" svg").append("g")
                    .append("text")
                      .attr('opacity',1)
                      .attr("transform", "translate(" + ((AADTGraph.width + AADTGraph.margin.left + AADTGraph.margin.right)/1.25) + "," + ((AADTGraph.height + AADTGraph.margin.top + AADTGraph.margin.bottom)/2) + ")")
                      .attr("y", 6)
                      .attr("dy", ".71em")
                      .style("font-size","36px")
                      .style("text-anchor", "end")
                      .text("Loading");
                    d3.select('#overweightBarGraph'+" svg").append("g").append("svg:image")
                    .attr("transform", "translate(" + ((AADTGraph.width + AADTGraph.margin.left + AADTGraph.margin.right)/1.25) + "," + (((AADTGraph.height + AADTGraph.margin.top + AADTGraph.margin.bottom)/2)-20) + ")")
                    .attr("xlink:href", "/img/loading.gif")
                    .attr("width", 67)
                    .attr("height", 40);
                    wimXHR.post(URL,{timeType:$scope.myTimePeriod,threshold:80000,stateFips:$scope.state} ,function(error, data) {
                        if (error) {
                            console.log(error);
                            return;
                        }
                        if(data.rows != undefined){
                            data.rows.forEach(function(row){
                                var rowStation = row.f[0].v;
                                for(var x = 0;x<rowStation.length;x++){
                                            if(rowStation[x] === " "){
                                                rowStation = rowStation.substr(0, x) + '0' + rowStation.substr(x + 1)
                                            }
                                        }
                                if(getStationIndex(rowStation,"bar") == -1) {
                                    $scope.overWeightBar.push({'stationId':rowStation, years:[]})                         
                                    
                                }
                                if(parseInt(row.f[3].v) < 10){
                                    row.f[3].v = "0"+row.f[3].v
                                }

                                $scope.overWeightBar[getStationIndex(rowStation,"bar")].years.push({'overweightTrucks':row.f[1].v,'numTrucks':row.f[2].v,'year':row.f[3].v})
                            });
                            truckWeightGraph.drawTruckWeightGraph('#overweightBarGraph',angular.copy($scope.overWeightBar),$scope.myOrder,$scope.myTimePeriod,$scope.state);
                        }
                        else{
                            $scope.overWeightBar = []
                            truckWeightGraph.drawTruckWeightGraph('#overweightBarGraph',angular.copy($scope.overWeightBar),$scope.myOrder,$scope.myTimePeriod,$scope.state);
                        }
                    });

                
            }
        }
    });

    $scope.$watchCollection('active_TruckClass', function() {
            AADTGraph.drawAADTGraphWeight('#weightByHour',angular.copy($scope.graphData),"weight",$scope.active_TruckClass.value,$scope.state)      
        
        //console.log($scope.active_TruckClass)
    });
    $scope.$watchCollection('myOrder', function() {
            truckWeightGraph.drawTruckWeightGraph('#overweightBarGraph',angular.copy($scope.overWeightBar),$scope.myOrder,$scope.myTimePeriod,$scope.state);
            lineChart.drawlineChart('#overweightLineGraph',angular.copy($scope.overWeightLine),$scope.myOrder);
        
        //console.log($scope.active_TruckClass)
    });
    $scope.$watchCollection('myTimePeriod', function() {
            d3.select('#overweightBarGraph'+" svg").selectAll("g").attr('opacity',0.1);
            d3.select('#overweightBarGraph'+" svg").selectAll("rect").attr('opacity',0.1);
            d3.select('#overweightBarGraph'+" svg").append("g")
            .append("text")
              .attr('opacity',1)
              .attr("transform", "translate(" + ((AADTGraph.width + AADTGraph.margin.left + AADTGraph.margin.right)/1.25) + "," + ((AADTGraph.height + AADTGraph.margin.top + AADTGraph.margin.bottom)/2) + ")")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("font-size","36px")
              .style("text-anchor", "end")
              .text("Loading");
            d3.select('#overweightBarGraph'+" svg").append("g").append("svg:image")
                .attr("transform", "translate(" + ((AADTGraph.width + AADTGraph.margin.left + AADTGraph.margin.right)/1.25) + "," + (((AADTGraph.height + AADTGraph.margin.top + AADTGraph.margin.bottom)/2)-20) + ")")
                .attr("xlink:href", "/img/loading.gif")
                .attr("width", 67)
                .attr("height", 40);
            var URL = '/stations/overweight/'
            if($scope.state != undefined){
                wimXHR.post(URL,{timeType:$scope.myTimePeriod,threshold:80000,stateFips:$scope.state} ,function(error, data) {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    if(data.rows != undefined){
                        data.rows.forEach(function(row){
                            var rowStation = row.f[0].v;
                            for(var x = 0;x<rowStation.length;x++){
                                                if(rowStation[x] === " "){
                                                    rowStation = rowStation.substr(0, x) + '0' + rowStation.substr(x + 1)
                                                }
                                            }
                            if(getStationIndex(rowStation,"bar") == -1) {
                                $scope.overWeightBar.push({'stationId':rowStation, years:[]})                         
                                
                            }
                            if(parseInt(row.f[3].v) < 10){
                                row.f[3].v = "0"+row.f[3].v
                            }

                            $scope.overWeightBar[getStationIndex(rowStation,"bar")].years.push({'overweightTrucks':row.f[1].v,'numTrucks':row.f[2].v,'year':row.f[3].v})
                        });
                        truckWeightGraph.drawTruckWeightGraph('#overweightBarGraph',angular.copy($scope.overWeightBar),$scope.myOrder,$scope.myTimePeriod,$scope.state);
                    }
                    else{
                        $scope.overWeightBar = []
                        truckWeightGraph.drawTruckWeightGraph('#overweightBarGraph',angular.copy($scope.overWeightBar),$scope.myOrder,$scope.myTimePeriod,$scope.state);    
                    }
                });
            }
        
        //console.log($scope.active_TruckClass)
    });
   


    function getClassRange(stations){
        var output = [];
        //console.log(stations);
        output.push("All")
        stations.forEach(function(station){
            station.years.forEach(function(year){
                if(output.indexOf(year.Class) == -1){
                    output.push(year.Class)
                }
                
            })
        })
        output.sort(function compareStations(a, b) {
            return parseInt(a) - parseInt(b)
        })
                
        return output;
        //console.log()
        
    }
    $('#nav-wrapper').height($("#my-affix").height());
    $('#my-affix').affix({
    offset: {
    top: 0
    , bottom: function () {
        return (this.bottom = $('.content container').outerHeight(true))
      }
    }
  })

    function getStateIndex(state_fips){
      return $scope.states.map(function(el) {return el.state_fips;}).indexOf(state_fips);
    }
    
    function getStationIndex(stationID,check){
        if(check === undefined){
            return $scope.graphData.map(function(el){return el.stationId;}).indexOf(stationID)
        }
        else if(check === "bar"){
            return $scope.overWeightBar.map(function(el){return el.stationId;}).indexOf(stationID)
        }
        else if(check === "line"){
            return $scope.overWeightLine.map(function(el){return el.stationId;}).indexOf(stationID)
        }
    }
};

