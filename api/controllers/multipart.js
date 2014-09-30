var requestC = '--xxx\n' +
					'Content-Type: application/json; charset=UTF-8\n' + '\n' +
					'{\n'+
					'	"configuration": {\n'+
					'	    "load": {\n'+
					'	        "sourceFormat":"NEWLINE_DELIMITED_JSON",\n'+
					'	        "schema": {\n'+
					'	            "fields": [\n'+
					'						{\n'+
					'						"name":"record_type",\n'+
					'						"type":"STRING"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"state_fips",\n'+
					'						"type":"STRING"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"station_id",\n'+
					'						"type":"STRING"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"dir",\n'+
					'						"type":"INTEGER"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"lane",\n'+
					'						"type":"INTEGER"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"year",\n'+
					'						"type":"INTEGER"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"month",\n'+
					'						"type":"INTEGER"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"day",\n'+
					'						"type":"INTEGER"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"hour",\n'+
					'						"type":"INTEGER"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"total_vol",\n'+
					'						"type":"INTEGER"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"class1",\n'+
					'						"type":"INTEGER"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"class2",\n'+
					'						"type":"INTEGER"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"class3",\n'+
					'						"type":"INTEGER"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"class4",\n'+
					'						"type":"INTEGER"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"class5",\n'+
					'						"type":"INTEGER"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"class6",\n'+
					'						"type":"INTEGER"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"class7",\n'+
					'						"type":"INTEGER"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"class8",\n'+
					'						"type":"INTEGER"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"class9",\n'+
					'						"type":"INTEGER"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"class10",\n'+
					'						"type":"INTEGER"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"class11",\n'+
					'						"type":"INTEGER"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"class12",\n'+
					'						"type":"INTEGER"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"class13",\n'+
					'						"type":"INTEGER"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"class14",\n'+
					'						"type":"INTEGER"\n'+
					'						},\n'+
					'						{\n'+
					'						"name":"class15",\n'+
					'						"type":"INTEGER"\n'+
					'						}\n'+
					'					]\n'+
					'	        },\n'+
					'	        "destinationTable": {\n'+
					'	            "projectId": "avail-wim",\n'+
					'	            "datasetId": "tmasWIM12",\n'+
					'	            "tableId": "TestData"\n'+
					'	        }\n'+
					'	    }\n'+
					'	}\n'+
					'}\n'+
					'--xxx\n' +
					'Content-Type: application/octet-stream\n' +
					'\n'
					+rowsToInsertString
					+'--xxx--\n'