$(function(){
    function pageLoad(){        
        
        $('.widget').widgster();
    
    }

    pageLoad();

    
});

function IndexController ($scope) {
   
    $scope.stations = {};
    $scope.barGraph = null;
    $scope.currentYear = [];
    $scope.compareYear = [];
    $scope.maxYears = [];
    $scope.graphs = [
        {id:"All",label:"All",data:[true,true,true]},
        {id:"AAPT",label:"Cars",data:[true,false,false]},
        {id:"AASU",label:"Single Unit Trucks",data:[false,true,false]},
        {id:"AATT",label:"Tractor Trailer Trucks",data:[false,false,true]},
    ];
    $scope.times = [
        {id:"month",label:"Monthly"},
        {id:"hour",label:"Hourly"},
    ];
    $scope.state = "";
    $scope.dispTime = $scope.times[0].id;
    $scope.dispGraph = $scope.graphs[0].id;
    $scope.curYear = "All";
    $scope.getStations = false
    $scope.getRecent = false
    //$scope.myMaxYear = ""
    $scope.stateName = ""
    $scope.recentClass = ""
    $scope.recentWeight = ""
    $scope.flagA = false
    $scope.flagB = false
    $scope.flagC = false

    wimstates2.init('#statesDIV',$scope);

    AADTGraph.initAADTGraph('#changeAADTGraph');
    AADTGraph.initAADTGraph('#aadtGraph');
    monthlyLineChart.initMonthlylLineChart("#hrMonLineGraph");
    tonageGraph.initTonageGraph('#tonageGraph')
    
    

    $scope.$watch('stations', function() {

        if($scope.stations != undefined){

          if($scope.stations.length > 0){

            d3.select('#hrMonLineGraph'+" svg").selectAll("g").attr('opacity',0.1);
            d3.select('#hrMonLineGraph'+" svg").append("g")
                .append("text")
                  .attr('opacity',1)
                  .attr("transform", "translate(" + ((AADTGraph.width + AADTGraph.margin.left + AADTGraph.margin.right)/1.25) + "," + ((AADTGraph.height + AADTGraph.margin.top + AADTGraph.margin.bottom)/2) + ")")
                  .attr("y", 6)
                  .attr("dy", ".71em")
                  .style("font-size","36px")
                  .style("text-anchor", "end")
                  .text("Loading");
            d3.select('#hrMonLineGraph'+" svg").append("g").append("svg:image")
                .attr("transform", "translate(" + ((AADTGraph.width + AADTGraph.margin.left + AADTGraph.margin.right)/1.25) + "," + (((AADTGraph.height + AADTGraph.margin.top + AADTGraph.margin.bottom)/2)-20) + ")")
                .attr("xlink:href", "/img/loading.gif")
                .attr("width", 67)
                .attr("height", 40);
            //$scope.getMonHour = true
            $scope.years = getYearRange($scope.stations);
            //console.log($scope.years);
            $scope.active_years = {first:d3.min($scope.years),max:d3.max($scope.years)}
            $scope.years2 = ["All"]
            for(var x = 0;x<$scope.years.length;x++){
                $scope.years2.push($scope.years[x])
                $scope.maxYears.push({id:$scope.years[x],label:$scope.years[x]})
            }
            $scope.myMaxYear = $scope.maxYears[$scope.maxYears.length-1].id
            $scope.active_years2 = {id:$scope.years2[0]}
            
            //Tonnage graph below

            d3.select('#tonageGraph'+" svg").selectAll("g").attr('opacity',0.1);
                    d3.select('#tonageGraph'+" svg").selectAll("rect").attr('opacity',0.1);
                    d3.select('#tonageGraph'+" svg").append("g")
                    .append("text")
                      .attr('opacity',1)
                      .attr("transform", "translate(" + ((tonageGraph.width + tonageGraph.margin.left + tonageGraph.margin.right)/1.25) + "," + ((tonageGraph.height + tonageGraph.margin.top + tonageGraph.margin.bottom)/2) + ")")
                      .attr("y", 6)
                      .attr("dy", ".71em")
                      .style("font-size","36px")
                      .style("text-anchor", "end")
                      .text("Loading");
                    d3.select('#tonageGraph'+" svg").append("g").append("svg:image")
                    .attr("transform", "translate(" + ((tonageGraph.width + tonageGraph.margin.left + tonageGraph.margin.right)/1.25) + "," + (((tonageGraph.height + tonageGraph.margin.top + tonageGraph.margin.bottom)/2)-20) + ")")
                    .attr("xlink:href", "/img/loading.gif")
                    .attr("width", 67)
                    .attr("height", 40);
                    wimXHR.post('/station/byTonageStations/', {stateFips:$scope.state},function(error, data) {  
                        // $scope.$apply(function(){
                        //     $scope.truckClass = getClassRange(angular.copy($scope.graphData))
                        //     $scope.active_TruckClass = {value:$scope.truckClass[0]}
                        // });
                        tonageGraph.drawtonageGraph('#tonageGraph',data,$scope.state)
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


                    });

            //End tonageGraph


            AADTGraph.drawAADTGraph('#changeAADTGraph',angular.copy($scope.stations),'class',[true,true,true],[$scope.active_years.first,$scope.active_years.max],$scope.state);
            AADTGraph.drawAADTGraph('#aadtGraph',angular.copy($scope.stations),'class',[true,true,true],[],$scope.state);
            monthlyLineChart.drawMonthlyLineChart('#hrMonLineGraph',"All",$scope.state,"All");

          }
          
        }
    });

    //fix data being displayed to not be static
    $scope.$watchCollection('active_years', function() {
        if($scope.stations.length > 0){
            if($scope.flagA){
                $scope.active_years.first = parseInt($scope.active_years.first);
                //console.log('first_year',$scope.active_years)
                if(parseInt($scope.active_years.first) != parseInt($scope.myMaxYear)){
                    AADTGraph.drawAADTGraph('#changeAADTGraph',angular.copy($scope.stations),'class',$scope.graphs[$scope.graphs.map(function(el){return el.id;}).indexOf($scope.dispGraph)].data,[$scope.active_years.first,parseInt($scope.myMaxYear)],$scope.state);      
                }
            }
            else{
                $scope.flagA = true
            }
        }
    });
    $scope.$watchCollection('myMaxYear', function() {
        if($scope.stations.length > 0){
            if($scope.flagC){
                if(parseInt($scope.active_years.first) != parseInt($scope.myMaxYear)){
                    AADTGraph.drawAADTGraph('#changeAADTGraph',angular.copy($scope.stations),'class',$scope.graphs[$scope.graphs.map(function(el){return el.id;}).indexOf($scope.dispGraph)].data,[$scope.active_years.first,parseInt($scope.myMaxYear)],$scope.state);      
                }
            }
            else{
                $scope.flagC = true
                
            }
        }
    });

    //Year data is changed
    $scope.$watchCollection('active_years2', function() {
    if($scope.stations.length > 0){
            if($scope.flagB){
                d3.select('#hrMonLineGraph'+" svg").selectAll("g").attr('opacity',0.1);
                d3.select('#hrMonLineGraph'+" svg").append("g")
                .append("text")
                  .attr('opacity',1)
                  .attr("transform", "translate(" + ((AADTGraph.width + AADTGraph.margin.left + AADTGraph.margin.right)/1.25) + "," + ((AADTGraph.height + AADTGraph.margin.top + AADTGraph.margin.bottom)/2) + ")")
                  .attr("y", 6)
                  .attr("dy", ".71em")
                  .style("font-size","36px")
                  .style("text-anchor", "end")
                  .text("Loading");
                d3.select('#hrMonLineGraph'+" svg").append("g").append("svg:image")
                .attr("transform", "translate(" + ((AADTGraph.width + AADTGraph.margin.left + AADTGraph.margin.right)/1.25) + "," + (((AADTGraph.height + AADTGraph.margin.top + AADTGraph.margin.bottom)/2)-20) + ")")
                .attr("xlink:href", "/img/loading.gif")
                .attr("width", 67)
                .attr("height", 40);
                $scope.curYear = $scope.active_years2.id
                if($scope.active_years2.id === "All"){
                    AADTGraph.drawAADTGraph('#aadtGraph',angular.copy($scope.stations),'class',$scope.graphs[$scope.graphs.map(function(el){return el.id;}).indexOf($scope.dispGraph)].data,[],$scope.state);
                    if($scope.dispTime === "month"){
                        monthlyLineChart.drawMonthlyLineChart('#hrMonLineGraph',$scope.dispGraph,$scope.state,$scope.active_years2.id);

                    }
                    else{
                        monthlyLineChart.drawHourlyLineChart('#hrMonLineGraph',$scope.dispGraph,$scope.state,$scope.active_years2.id);   
                    }
                }
                else{
                    AADTGraph.drawAADTGraph('#aadtGraph',angular.copy($scope.stations),'class',$scope.graphs[$scope.graphs.map(function(el){return el.id;}).indexOf($scope.dispGraph)].data,[parseInt($scope.active_years2.id)],$scope.state);
                    if($scope.dispTime === "month"){
                        monthlyLineChart.drawMonthlyLineChart('#hrMonLineGraph',$scope.dispGraph,$scope.state,$scope.active_years2.id);
                    }
                    else{
                        monthlyLineChart.drawHourlyLineChart('#hrMonLineGraph',$scope.dispGraph,$scope.state,$scope.active_years2.id);   
                    }
                }
            }
            else{
                $scope.flagB = true
            }
        }
    });

    //Type of vehicle data is changed
    $scope.$watchCollection('dispGraph', function() {
    if($scope.stations.length > 0){
            d3.select('#hrMonLineGraph'+" svg").selectAll("g").attr('opacity',0.1);
            d3.select('#hrMonLineGraph'+" svg").append("g")
            .append("text")
              .attr('opacity',1)
              .attr("transform", "translate(" + ((AADTGraph.width + AADTGraph.margin.left + AADTGraph.margin.right)/1.25) + "," + ((AADTGraph.height + AADTGraph.margin.top + AADTGraph.margin.bottom)/2) + ")")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("font-size","36px")
              .style("text-anchor", "end")
              .text("Loading");
            d3.select('#hrMonLineGraph'+" svg").append("g").append("svg:image")
                .attr("transform", "translate(" + ((AADTGraph.width + AADTGraph.margin.left + AADTGraph.margin.right)/1.25) + "," + (((AADTGraph.height + AADTGraph.margin.top + AADTGraph.margin.bottom)/2)-20) + ")")
                .attr("xlink:href", "/img/loading.gif")
                .attr("width", 67)
                .attr("height", 40);
            if($scope.curYear === "All"){
                AADTGraph.drawAADTGraph('#aadtGraph',angular.copy($scope.stations),'class',$scope.graphs[$scope.graphs.map(function(el){return el.id;}).indexOf($scope.dispGraph)].data,[],$scope.state);
                $scope.active_years.first = parseInt($scope.active_years.first);
                $scope.active_years.max = parseInt($scope.active_years.max);
                if(parseInt($scope.active_years.first) != parseInt($scope.active_years.max)){
                    AADTGraph.drawAADTGraph('#changeAADTGraph',angular.copy($scope.stations),'class',$scope.graphs[$scope.graphs.map(function(el){return el.id;}).indexOf($scope.dispGraph)].data,[$scope.active_years.first,$scope.active_years.max],$scope.state);      
                }
                if($scope.dispTime === "month"){
                    monthlyLineChart.drawMonthlyLineChart('#hrMonLineGraph',$scope.dispGraph,$scope.state,$scope.active_years2.id);
                }
                else{
                    monthlyLineChart.drawHourlyLineChart('#hrMonLineGraph',$scope.dispGraph,$scope.state,$scope.active_years2.id);   
                }
            }
            else{
                AADTGraph.drawAADTGraph('#aadtGraph',angular.copy($scope.stations),'class',$scope.graphs[$scope.graphs.map(function(el){return el.id;}).indexOf($scope.dispGraph)].data,[parseInt($scope.active_years2.id)],$scope.state);
                if($scope.dispTime === "month"){
                       monthlyLineChart.drawMonthlyLineChart('#hrMonLineGraph',$scope.dispGraph,$scope.state,$scope.active_years2.id);
                }
                else{
                       monthlyLineChart.drawHourlyLineChart('#hrMonLineGraph',$scope.dispGraph,$scope.state,$scope.active_years2.id);   
                }
            }
        }
    });

    //Below switches between hourly and monthly data. Only the line graph should change
    $scope.$watchCollection('dispTime', function() {
    if($scope.stations.length > 0){
            d3.select('#hrMonLineGraph'+" svg").selectAll("g").attr('opacity',0.1);
            d3.select('#hrMonLineGraph'+" svg").append("g")
            .append("text")
              .attr('opacity',1)
              .attr("transform", "translate(" + ((AADTGraph.width + AADTGraph.margin.left + AADTGraph.margin.right)/1.25) + "," + ((AADTGraph.height + AADTGraph.margin.top + AADTGraph.margin.bottom)/2) + ")")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("font-size","36px")
              .style("text-anchor", "end")
              .text("Loading");
             d3.select('#hrMonLineGraph'+" svg").append("g").append("svg:image")
                .attr("transform", "translate(" + ((AADTGraph.width + AADTGraph.margin.left + AADTGraph.margin.right)/1.25) + "," + (((AADTGraph.height + AADTGraph.margin.top + AADTGraph.margin.bottom)/2)-20) + ")")
                .attr("xlink:href", "/img/loading.gif")
                .attr("width", 67)
                .attr("height", 40);
            if($scope.curYear === "All"){
                if($scope.dispTime === "month"){
                    monthlyLineChart.drawMonthlyLineChart('#hrMonLineGraph',$scope.dispGraph,$scope.state,$scope.active_years2.id);
                }
                else{
                    monthlyLineChart.drawHourlyLineChart('#hrMonLineGraph',$scope.dispGraph,$scope.state,$scope.active_years2.id);   
                }
            }
            else{
                if($scope.dispTime === "month"){

                        monthlyLineChart.drawMonthlyLineChart('#hrMonLineGraph',$scope.dispGraph,$scope.state,$scope.active_years2.id);
                      
                    }
                    else{
                        monthlyLineChart.drawHourlyLineChart('#hrMonLineGraph',$scope.dispGraph,$scope.state,$scope.active_years2.id);   
                    }
            }
        }
    });
  //   $('#nav-wrapper').height($("#my-affix").height());
  //   $('#my-affix').affix({
  //   offset: {
  //     top: 0
  //   , bottom: function () {
  //       return (this.bottom = $('.content container').outerHeight(true))
  //     }
  //   }
  // })


    function getYearRange(stations){
        var output = [];
        //console.log(stations);
        stations.forEach(function(station){
            station.years.forEach(function(year){
                if(parseInt(year.year) < 10){ year.year  = '0'+year.year; }
                year.year = parseInt('20'+year.year)
                if(output.indexOf(year.year) == -1){
                    output.push(year.year)
                }
                
            })
        })
  
                
        return output;
        //console.log()
        
    }

    // function getStateIndex(state_fips){
    //   return $scope.states.map(function(el) {return el.state_fips;}).indexOf(state_fips);
    // }
};

