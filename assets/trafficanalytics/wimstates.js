(function() {
	var wimstates = {
		version: 0.3,
	}

	var mapDIV = null,
		popup = null,
		__JSON__ = {},
		$scope = null,
		clicked = null,
		prevMarker = null,
		prevColor = null,
		stations = null,
		XHR = null,
		dataCollection = {
			type: 'FeatureCollection',
			features: []
		};

	var AVLmap = null,
		resetZoom,
		resetState,
		width = 1000,
		height = 500;

	var projection = null,
		zoom = null,
		path = null;

	var colorScale = d3.scale.linear()
		.range(['#deebf7', '#08306b']);

	function _drawMap() {
    	var states = mapDIV.append('svg')
    		.style('position', 'absolute')
    		.selectAll('path')
    		.data(dataCollection.features);

    	states.enter()
    		.append('path')
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
	    		var marker = avl.MapMarker(projection.invert(path.centroid(d)),
					{name: d.id, BGcolor: colorScale(d.properties.stations.length),
						click: function(m) {
							_clicked(m, d);
						}
					});
	    		AVLmap.addMarker(marker);
				marker.marker()
					.on('mouseover', function() {
						mouseover(d.id, marker);
					})
					.on('mouseout', function() {
						mouseout(d, marker);
					})
    		});

		function mouseover(id, marker) {
			//if (!clicked) {
				d3.select('#state-'+id).attr('fill', '#fdae6b');
				marker.BGcolor('#fdae6b');
			//}
		}
		function mouseout(d, marker) {
			d3.select('#state-'+d.id).attr('fill', function(d) {
						return colorScale(d.properties.stations.length);
		    		})
			if (marker != clicked) {
				marker.BGcolor(colorScale(d.properties.stations.length));
			}
		}

    	resetZoom.click(function() {
    		// zoom to bounds of all data
    		_zoomToBounds(path.bounds(dataCollection));

    		// if there is a pending xhr, then abort it
    		if (XHR) {
    			XHR.abort();
    		}
    		// if there is an active state, then clear it
    		if (clicked) {
    			_clicked(clicked);
    		}
    	});

    	AVLmap.addAlert(_update);

    	function _update() {
    		states.attr('d', path);
    		if (stations) {
    			_updateStations();
    		}
    	}

		function _updateStations() {
			stations
				.style('left', function(d) {
					return (projection(d.geometry.coordinates)[0]-10)+"px";
				})
				.style('top', function(d) {
					return (projection(d.geometry.coordinates)[1]-10)+"px";
				})
		};

		function _clicked(marker, d) {
	  		if (d3.event.defaultPrevented) return;

			var collection = {
					type: 'FeatureCollection',
					features: []
				};

			if (marker == clicked) {
				_drawStationPoints(collection);
				prevMarker.BGcolor(prevColor);
				clicked = prevMarker = prevColor = null;
				_updateScopeStations([]);
				resetState.toggle(false);
				return;
			}
			var name = marker.name();

			// set resetState control button to reset to bounds of current state on click
			resetState.click(function() {
    			_zoomToBounds(path.bounds(__JSON__[name]));
			});

			resetState.toggle(true);

	  		clicked = marker;

	  		if (prevMarker) {
				prevMarker.BGcolor(prevColor);
	  		}
	  		prevMarker = marker;
	  		prevColor = colorScale(d.properties.stations.length);

	  		marker.BGcolor("#fdae6b");

			_zoomToBounds(path.bounds(__JSON__[name]), _getStationPoints);

			_getStationData(name);

			function _getStationPoints() {
				var URL = '/state/'+name+'/allStationsGeo/';
				XHR = wimXHR.get(URL, function(error, data) {
	            	XHR = null;
	            	if (error) {
	            		console.log(error);
	            		return;
	            	}
	            	if (clicked) {
						_drawStationPoints(_formatData(__JSON__[name], data));
					}
				})
			}


			function _formatData(stateData, stationData) {
				// get valid geometries
				var stations = {};
				// need this to filter out bad geometry
				stationData.features.forEach(function(d) {
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
				return collection;
			}
		} // end _clicked

		function _drawStationPoints(collection) {
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
						.attr('opacity', 1.0);
					_popup(d);
				})
				.on('mouseout', function(d) {
					d3.selectAll('.station')
						.attr('opacity', 0.66);
					popup.style('display', 'none')
				})
				.on('mousemove', _popup)
				.on('click', function(d) {
					var URL = '/station/' + 
						d.properties.type + '/' +
						d.properties.stationID;
					open(URL, '_self');
				})
		}
		// this function queries backend for all stations
		// and then updates $scope.stations variable in
		// order to draw list of stations below map
		function _getStationData(id) {
			var URL = '/state/'+id+'/classStations';
			var stationsClass = [];

			wimXHR.get(URL, function(error, data) {
				if (error) {
            		console.log(error);
            		return;
            	}
            	if(data.rows != undefined){
			  		data.rows.forEach(function(row){
				  			var rowStation = row.f[0].v;
				  			if(getStationIndex(rowStation,"class") == -1) {
				  				stationsClass.push({'stationId':rowStation, years:[],heights:[],'AAPT':0,'AASU':0,'AATT':0})
				  				stationsClass[getStationIndex(rowStation,"class")].heights.push({'y0':0,'y1':0})
				  				stationsClass[getStationIndex(rowStation,"class")].heights.push({'y0':0,'y1':0})
				  				stationsClass[getStationIndex(rowStation,"class")].heights.push({'y0':0,'y1':0})
				  			}
				  			stationsClass[getStationIndex(rowStation,"class")].years.push({'year':row.f[1].v,'ADT':Math.round(row.f[2].v),'APT':Math.round(row.f[3].v),'ASU':Math.round(row.f[4].v),'ATT':Math.round(row.f[5].v)});
				  			
			  		});
		  		}
		  		if (clicked) {
		  			_updateScopeStations(stationsClass,id)
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
		function _updateScopeStations(data,id) {
	  		$scope.$apply(function(){
	  			$scope.stations = data;
	  			$scope.state = id;
  			});
		}
	}

    function _zoomToBounds(bounds, callback) {
    	var	wdth = bounds[1][0] - bounds[0][0],
    		hght = bounds[1][1] - bounds[0][1],
    		center = projection.invert([bounds[0][0] + wdth/2,
    								    bounds[0][1] + hght/2]),

    		k = Math.min(width/wdth, height/hght),
    		scale = zoom.scale()*k*0.95;

		zoom.scale(scale);
        projection
            .scale(zoom.scale() / 2 / Math.PI)
            .center(center)
            .translate([width / 2, height / 2])
            .translate(projection([0, 0]))
            .center([0, 0]);

        zoom.translate(projection.translate());

        if (callback) {
        	callback();
        }

        AVLmap.zoomMap();
    }

	function _popup(d) {
		var wdth = parseInt(popup.style('width')),
			hght = parseInt(popup.style('height'));

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
	wimstates.init = function(elem,$s){
		var state2fips = {"01": "Alabama","02": "Alaska","04": "Arizona","05": "Arkansas","06": "California","08": "Colorado","09": "Connecticut","10": "Delaware","11": "District of Columbia","12": "Florida","13": "Geogia","15": "Hawaii","16": "Idaho","17": "Illinois","18": "Indiana","19": "Iowa","20": "Kansas","21": "Kentucky","22": "Louisiana","23": "Maine","24": "Maryland","25": "Massachusetts","26": "Michigan","27": "Minnesota","28": "Mississippi","29": "Missouri","30": "Montana","31": "Nebraska","32": "Nevada","33": "New Hampshire","34": "New Jersey","35": "New Mexico","36": "New York","37": "North Carolina","38": "North Dakota","39": "Ohio","40": "Oklahoma","41": "Oregon","42": "Pennsylvania","44": "Rhode Island","45": "South Carolina","46": "South Dakota","47": "Tennessee","48": "Texas","49": "Utah","50": "Vermont","51": "Virginia","53": "Washington","54": "West Virginia","55": "Wisconsin","56": "Wyoming"};
    	var states ={};
		var URL = '/stations/allWIMStations',
        dataSources = 0,
        numRoutes = 2;

	    wimXHR.get(URL, function(error, data) {

	        data.rows.forEach(function(row){
	            var rowState = row.f[0].v;
	            var rowStation = row.f[1].v;


	            if (!(rowState in states)) {
	                states[rowState] = {
	                    'state_fips': rowState, 
	                    stations: {length: 0},
	                    name: state2fips[rowState]
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
	        if (++dataSources == numRoutes) {
	            wimstates.drawMap(elem, states, $s);
	        }
	    })

	    URL = '/stations/allClassStations';

	    wimXHR.get(URL, function(error, data) {
	        data.rows.forEach(function(row){
	            var rowState = row.f[0].v;
	            var rowStation = row.f[1].v;

	            if (!(rowState in states)) {
	                states[rowState] = {
	                    'state_fips': rowState, 
	                    stations: {length: 0},
	                    name: state2fips[rowState]
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
	        if (++dataSources == numRoutes) {
	            wimstates.drawMap(elem, states, $s);
	        }
	    });
	}
	// states is an array of state objects
	wimstates.drawMap = function(id, states, $scp) {
		mapDIV = d3.select(id);

		width = parseInt(mapDIV.style('width'));
		height = width*(2/3);

		mapDIV.style('height', height+"px");

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

			AVLmap = avl.Map({id: id, minZoom: 3})
				.addControl("zoom")
				.addControl("info");

			resetZoom = AVLmap.customControl({name: 'Reset Zoom', position: 'avl-top-left'});
			resetState = AVLmap.customControl({name: 'Zoom to State', position: 'avl-top-left'});
			resetState.toggle();

			projection = AVLmap.projection();
			zoom = AVLmap.zoom();
			path = d3.geo.path().projection(projection);

			_zoomToBounds(path.bounds(dataCollection));

			AVLmap.addLayer(avl.RasterLayer("http://{s}.tiles.mapbox.com/v3/am3081.map-lkbhqenw/{z}/{x}/{y}.png"))

			_drawMap();

		})
	}

	this.wimstates = wimstates;
})()