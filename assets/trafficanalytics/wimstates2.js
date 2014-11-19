(function() {
	var wimstates = {};

	var mapDIV = null,
		popup = null,
		__JSON__ = {},  // contains geoJSON data indexed by state fips
		$scope = null,
		clicked = null,
		stateResetControl = null,
		stations = null,
		dataCollection = {  // collection of geoJSON for states containing WIM data
			type: 'FeatureCollection',
			features: []
		};

	var AVLmap = null,
		width = 1000,
		height = 500;

	var HPMSmap = null;

	var projection = null,
		path = null;

	var colorScale = d3.scale.linear()
		.range(['#deebf7', '#08306b']);

	wimstates.init = function(DOMelemID, $s) {
		var states ={},
			URL = '/stations/allWIMStations',
			dataSources = 2,
			sourcesLoaded = 0;

	    wimXHR.get(URL, function(error, data) {
	    	data.rows.forEach(function(row){
	            var rowState = row.f[0].v;
	            var rowStation = row.f[1].v;


	            if (!(rowState in states)) {
	                states[rowState] = {
	                    'state_fips': rowState, 
	                    stations: {length: 0},
	                    name: esc.fips2state[rowState]
	                };
	            }
	            var obj = {
	                stationID: rowStation,
	                stationCount: row.f[2].v,
	                stationType: 'wim'
	            }
	            if (!(rowStation in states[rowState].stations)) {
	                states[rowState].stations[rowStation] = obj;
	                states[rowState].stations.length++;
	            } else {
	                states[rowState].stations[rowStation].stationType = 'wim';

	            }
	        });
	        if (++sourcesLoaded == dataSources) {
	            finalInit(DOMelemID, states, $s);
	        }
	    })

	    URL = '/stations/allClassStations';

	    wimXHR.get(URL, function(error, data) {
	        if(data){
		        data.rows.forEach(function(row){
		            var rowState = row.f[0].v;
		            var rowStation = row.f[1].v;

		            if (!(rowState in states)) {
		                states[rowState] = {
		                    'state_fips': rowState, 
		                    stations: {length: 0},
		                    name: esc.fips2state[rowState]
		                };
		            }
		            var obj = {
		                stationID: rowStation,
		                stationCount: row.f[2].v,
		                stationType: 'class'
		            }
		            if (!(rowStation in states[rowState].stations)) {
		                states[rowState].stations[rowStation] = obj;
		                states[rowState].stations.length++;
		            }
		        });
		    }
	        if (++sourcesLoaded == dataSources) {
	            finalInit(DOMelemID, states, $s);
	        }
	    });
	}

	// states is an array of state objects
	function finalInit(id, states, $scp) {
		mapDIV = d3.select(id);

		width = mapDIV.node().clientWidth;
		height = width*(2/3);

    	var statesSVG = mapDIV.append('svg')
    		.style('position', 'absolute')
    		.style('width', width+'px')
    		.style('height', height+'px')

		mapDIV.style('height', height+"px")
			.style('position', 'relative');

		popup = mapDIV.append('div')
			.attr('class', 'station-popup');

		$scope = $scp;

		// states object
		var statesObj = {};

		var domain = []; // colorScale domain

		// load scope states data into states object
		for (var i in states) {
			statesObj[states[i].state_fips] = {stations: states[i].stations, name: states[i].name}
			domain.push(states[i].stations.length);
		}
		colorScale.domain(d3.extent(domain));

		d3.json('./data/us-states-10m.json', function(error, data) {

			var statesJSON = topojson.feature(data, data.objects.states);

			var props;
			statesJSON.features.forEach(function(d) {
				// pad single digit FIPS with a 0 for compatibility
				if (d.id.toString().match(/^\d$/)) {
					d.id = '0' + d.id;
				}
				d.properties.fips = d.id.toString();
				if (d.id in statesObj) {
					d.properties.stations = statesObj[d.id].stations;
					d.properties.name = statesObj[d.id].name;
					dataCollection.features.push(d);
				}
			})

			AVLmap  = avlmap.Map({id: id, startLoc: [-95.5, 37], minZoom: 3, maxZoom: 17})
				.addLayer(avlmap.RasterLayer({url: "http://api.tiles.mapbox.com/v3/am3081.map-lkbhqenw/{z}/{x}/{y}.png"}))
				.addControl({type:'info', position: 'bottom-right'})

			projection = AVLmap.projection();
			path = d3.geo.path().projection(projection);

			AVLmap.zoomToBounds(path.bounds(dataCollection));
			AVLmap.zoomMap();

			stateResetControl = AVLmap.addControl({type:'custom', position: 'bottom-left'});
			stateResetControl.data([{name: "Reset Map", func: doclick}])();

			// create new HPMS object with base HPMS URL and TileStache URL
			HPMSmap = hpms_map_maker("http://api.availabs.org/hpms/", "http://lor.availabs.org:1331/");
			HPMSmap.init(AVLmap);

			drawMap(statesSVG);

		})
	}

	function drawMap(states) {
	    var markerData = [];

    	var paths = states.selectAll('path')
    		.data(dataCollection.features)
    		.enter().append('path')
    		.attr('id', function(d) {
    			return 'state-'+d.id;
    		})
    		.attr('class', 'state')
    		.attr('fill', function(d) {
				return colorScale(d.properties.stations.length);
    		})
    		.attr('d', path)
    		.each(function(d) {
	    		__JSON__[d.id] = d;

	    		markerData.push({coords: projection.invert(path.centroid(d)),
	    			name: d.id, data: d,
	    			image: '/images/tda_marker.png'});
    		});

    	AVLmap.MapMarker().data(markerData)();
    	AVLmap.on('mapzoom', update);

    	d3.selectAll('.avl-map-marker')
    		.on('click', doclick);

    	function update() {
    		paths.attr('d', path);
    		if (stations) {
    			updateStations();
    		}
    	}

		function updateStations() {
			stations
				.style('left', function(d) {
					return (projection(d.geometry.coordinates)[0]-10)+"px";
				})
				.style('top', function(d) {
					return (projection(d.geometry.coordinates)[1]-10)+"px";
				})
		};
    }

    function doclick(marker) {
	  	if (d3.event.defaultPrevented) return;

	  	if (!marker || clicked == marker.name) {
			HPMSmap.updateActiveStates(fips2route(clicked), false);

	  		resetMap();

			stateResetControl.data([{name: "Reset Map", func: doclick}])();

	  		clicked = null;

			return;
	  	}
	  	
	  	if (clicked) {
			HPMSmap.updateActiveStates(clicked, false);
	  	}

	  	clicked = marker.name;

		stateResetControl.data([{name: "Reset Map", func: doclick}, {name: "Reset State", func: resetState}])();

		$scope.$apply(function(){
			$scope.getStations = true
			$scope.stateName = esc.fips2state[marker.name]
		});

		AVLmap.zoomToBounds(path.bounds(__JSON__[marker.name]));
		AVLmap.zoomMap();

		HPMSmap.updateActiveStates(fips2route(marker.name), true);

		formatData(__JSON__[marker.name],function(stationPoints){
			drawStationPoints(stationPoints);
		})

		getStationData(marker.name);
    }

    function resetState() {
		AVLmap.zoomToBounds(path.bounds(__JSON__[clicked]));
		AVLmap.zoomMap();
    }

	function resetMap() {
		d3.selectAll(".station-point").remove();

		$scope.$apply(function(){
  			$scope.stations = [];
		  	$scope.getStations = false;
		});

		AVLmap.zoomToBounds(path.bounds(dataCollection));
		AVLmap.zoomMap();
	}

	function fips2route(fips) {
		switch(+fips) {
			case 36:
				return "newyork2012";
			case 42:
				return "pennsylvania2012";
			case 6:
				return "california2012";
			case 34:
				return "newjersey2012";
			case 39:
				return "ohio2012";
			case 48:
				return "texas2012";
			case 15:
				return "hawaii2012";
			case 32:
				return "nevada2012";
			case 16:
				return "idaho2012";
			case 30:
				return "montana2012";
			case 56:
				return "wyoming2012";
			case 8:
				return "colorado2012";
			case 35:
				return "newmexico2012";
			case 38:
				return "northdakota2012";
			case 46:
				return "southdakota2012";
			case 31:
				return "nebraska2012";
			case 27:
				return "minnesota2012";
			case 19:
				return "iowa2012";
			case 29:
				return "missouri2012";
			case 12:
				return "florida2012";
			case 5:
				return "arkansas2012";
			case 28:
				return "mississippi2012";
			case 13:
				return "georgia2012";
			case 55:
				return "wisconsin2012";
			case 26:
				return "michigan2012";
			case 18:
				return "indiana2012";
			case 51:
				return "virginia2012";
			case 54:
				return "westvirginia2012";
			case 9:
				return "connecticut2012";
			case 25:
				return "massachusetts2012";
			case 33:
				return "newhampshire2012";
			case 23:
				return "maine2012";
			case 37:
				return "northcarolina2012";
			case 24:
				return "maryland2012";
			case 11:
				return "district2012";
			case 10:
				return "delaware2012";
			case 44:
				return "rhodeisland2012";
			default:
				return "none";
		}
	}

	function formatData(stateData,cb) {
		var collection = {
				type: 'FeatureCollection',
				features: []
			};
		var currentStateStations = []
		d3.json('/data/allStations.json',function(data){
    		AllStations = data;
		
			AllStations.forEach(function(d){
				if(parseInt(d.state_fips) == stateData.id){
					currentStateStations.push(d)
				}
			})
			var schema = [ 'station_id',
						  'func_class_code',
						  'method_of_vehicle_class',
						  'method_of_truck_weighing',
						  'type_of_sensor',
						  'latitude',
						  'longitude' ]
			var featureCollection = {
				type: "FeatureCollection",
				features: []
			}
	    	currentStateStations.forEach(function(d) {
	    		var feature = {
	    			type:'Feature',
	    			geometry: {
	    				type:'Point',
	    				coordinates: [0, 0]
	    			},
	    			properties: {}
	    	};
	    		schema.forEach(function(name, i) {

	    			if (name != 'latitude' && name != 'longitude') {
		    			feature.properties[name] = d[name];
		    		} else if (name == 'longitude') {
		    			var lng = (+d[name]).toString();
		    			if (/^1/.test(lng)) {
		    				lng = lng.replace(/^(1\d\d)/, '-$1.');
		    			} else {
		    				lng = lng.replace(/^(\d\d)/, '-$1.');
		    			}

		    			feature.geometry.coordinates[0] = lng*1;
		    		} else if (name == 'latitude') {
		    			var lat = (+d[name]).toString().replace(/^ ?(\d\d)/, '$1.');
		    			feature.geometry.coordinates[1] = lat*1;
		    		}
	    		})
	    		featureCollection.features.push(feature);
	    	})
	    	//get valid geometries
			var stations = {};
			// need this to filter out bad geometry
			featureCollection.features.forEach(function(d) {
				if (d.geometry.coordinates[0] != 0 && d.geometry.coordinates[1] != 0) {
					stations[d.properties.station_id] = d.geometry;
				}
			});
			for (var i in stateData.properties.stations) {
				var d = stateData.properties.stations[i];

				var obj = {
					type: 'Feature',
					properties: {},
					geometry: {}
				};
				obj.properties.stationID = d.stationID;
				obj.properties.count = d.stationCount;
				obj.properties.type = d.stationType;

				if (d.stationID in stations) {
					obj.geometry = stations[d.stationID];
					collection.features.push(obj);
				}
			}
			
			cb(collection);
	 	})
	 }

	function drawStationPoints(collection) {
		stations = mapDIV.selectAll('.station-point')
			.data(collection.features);

		stations.exit().remove();

		stations.enter().append('div');

		stations.attr('class', 'station-point')
			.attr('id',function(d){
				return 'map_station_'+d.properties.stationID;
			})
			.style('background', function(d) {
				return (d.properties.type == 'wim' ? '#081d58' : '#d94801');
			})
			.style('opacity', 0.66)
			.style('left', function(d) {
				return (projection(d.geometry.coordinates)[0]-10)+"px";
			})
			.style('top', function(d) {
				return (projection(d.geometry.coordinates)[1]-10)+"px";
			})
			.on('mouseover', function(d) {
				d3.select(this)
					.style('opacity', 1.0);
				adjustPopup(d);
			})
			.on('mouseout', function(d) {
				d3.select(this)
					.style('opacity', 0.66);
				popup.style('display', 'none')
			})
			.on('mousemove', adjustPopup)
			.on('click', function(d) {
				var _URL = '/station/' + 
					d.properties.type + '/' +
					d.properties.stationID+"_"+$scope.state;
				open(_URL, '_self');
			})
	}

	function adjustPopup(d) {
		var wdth = popup.node().offsetWidth,//162//parseInt(popup.style('width')),
			hght = popup.node().offsetHeight;//60//parseInt(popup.style('height'));

		var left = projection(d.geometry.coordinates)[0] - wdth - 5,
			top = projection(d.geometry.coordinates)[1] - hght - 5;

		if (left < 0) {
			left += wdth + 10;
		}
		if (top < 0) {
			top += hght + 10;
		}
		popup.style('left', left + 'px')
			.style('top', top + 'px')
			.style('display', 'block')
			.html('<b>Station ID:</b> ' + d.properties.stationID + '<br>' +
				  '<b>Type:</b> ' + d.properties.type.toUpperCase())
	}

	function getStationData(id) {
		var URL = '/state/classStations';
		var stationsClass = [];
		wimXHR.post(URL, {statefips:id},function(error, data) {
			if (error) {
        		console.log(error);
        		return;
        	}
        	if(data){
	        	if(data.rows != undefined){
			  		data.rows.forEach(function(row){
				  			var rowStation = row.f[0].v;
				  			for(var x = 0;x<rowStation.length;x++){
	                                        if(rowStation[x] === " "){
	                                            rowStation = rowStation.substr(0, x) + '0' + rowStation.substr(x + 1)
	                                        }
	                                    }
				  			if(getStationIndex(rowStation,"class") == -1) {
				  				stationsClass.push({'stationId':rowStation, years:[],heights:[],'AAPT':0,'AASU':0,'AATT':0})
				  				stationsClass[getStationIndex(rowStation,"class")].heights.push({'y0':0,'y1':0})
				  				stationsClass[getStationIndex(rowStation,"class")].heights.push({'y0':0,'y1':0})
				  				stationsClass[getStationIndex(rowStation,"class")].heights.push({'y0':0,'y1':0})
				  			}
				  			stationsClass[getStationIndex(rowStation,"class")].years.push({'year':row.f[1].v,'ADT':Math.round(row.f[2].v),'APT':Math.round(row.f[3].v),'ASU':Math.round(row.f[4].v),'ATT':Math.round(row.f[5].v)});
				  			
			  		});
		  		}
		  	}
	  		if (clicked) {
				$scope.$apply(function(){
		  			$scope.getStations = false
		  			$scope.stations = stationsClass;
		  			$scope.state = id;
				});
		  	}

		});

	  	function getStationIndex(stationID,classT){
	  		if(classT != "class"){
	  			return stations.map(function(el) {return el.stationId;}).indexOf(stationID)
	  		}
	  		else{
	  			return stationsClass.map(function(el) {return el.stationId;}).indexOf(stationID)
	  		}
	  	}
	}

	this.wimstates2 = wimstates;
})()