app.controller('searchController', ['$scope', '$http','$q','myService', function ($scope, $http,$q, myService) {
    var inputDate = $("#Date").val();
    var selDate = [];
    selDate = inputDate.split('-');
    var staticItems = [];
    var qlist = [];
    var dynamicItems = [];
    var dynamicPath = [];
    var sensorList = [];
    var icons = {
        blue: {
            type: 'div',
            iconSize: [6, 6],
            className: 'blue',
            iconAnchor: [5, 5]
        },
        red: {
            type: 'div',
            iconSize: [6, 6],
            className: 'red',
            iconAnchor: [5, 5]
        },
        adsb: {
            iconUrl: '/images/marker-icon.png',
            iconSize: [20, 30]
        },
        ssr: {
            iconUrl: '/images/map-marker-icon.png',
            iconSize: [30, 30]
        },
        tri: {
            type: 'div',
            iconSize: [10, 10],
            className: 'triangle',
            iconAnchor: [5, 5]
        },
        destRed: {
            type: 'extraMarker',
            icon: 'fa-star',
            prefix: 'fa',
            shape: 'square',
            markerColor: 'red'
        },
        destBlue: {
            type: 'extraMarker',
            icon: 'fa-star',
            prefix: 'fa',
            shape: 'square',
            markerColor: 'blue'
        }
    }
    
    var getDateTime = function (s) {
        var d = moment.utc(s, "YYYY/MM/DD HH:mm:ss.SSS");

        return d.format("YYYY-MM-DD ");
    };
    var getDate = function (s) {
        var d = moment.utc(s, "YYYY/MM/DD HH:mm:ss.SSS");

        return d.format("YYYYMMDD ");
    }
    var getDateTimeforDetail = function (s) {
        var d = moment.utc(s, "YYYY/MM/DD HH:mm:ss.SSS");
        return d.format("DD MMM YYYY HH:mm:ss.SSS");
    };
    var addressPointsToMarkers = function (points, typ) {
        var surtyp = typ == 1 ? 'adsbtrack' : 'ssrtrack';
        var icontyp = typ == 1 ? icons.blue : icons.red;
        var i = 0;
        var lastPoint=false;
        return points.map(function (ap) {
            i++;
            if (i == points.length) {
                lastPoint = true;
            }
            dynamicItems.push( {
                layer: surtyp,
                lat: ap[1],
                lng: ap[2],
                icon: lastPoint?(typ == 1 ? icons.destBlue : icons.destRed ):icontyp ,
                height: ap[3],
                sic: ap[4],
                cat: ap[6],
                nucp: ap[9],
                climbRate: ap[10],
                dt: getDateTimeforDetail(ap[0]),
                siclist: ap[5],
                vx: ap[11],
                vy: ap[12],
                angle: myService.findAngle(ap[11], ap[12]),
                flightLevelAge: ap[13],
                callsign: ap[14],
                aircraftAddress: ap[15],
                modecode: ap[16],
                gSpeed: ap[18],
                message: lastPoint ? 'Last Point' : null
            });
        });
    };
    var callFlight = function (flights, dt) {
        angular.forEach(flights, function (element) {
            if (element.AircraftID != "X") {
                $http.get('/Map/getTrack?sensor=' + element.SensorID + '&date=' + dt + '&id=' + element.AircraftID).success(function (points) {
                   
                    addressPointsToMarkers(points, element.SensorID);
                    
                })
            }
        })
    }
    var uploadItem = function (points, typ) {
        if (points.length > 0) {
            var layertyp = typ == 1 ? 'adsb' : 'ssr';
            var icontyp = typ == 1 ? icons.adsb : icons.ssr;
            angular.forEach(points, function (element) {
                plot = {
                    layer: layertyp,
                    lat: element.Lat,
                    lng: element.Lng,
                    icon: icontyp,
                    sic: element.SIC,
                    name: element.Name,
                    message: element.Name + " [ " + layertyp.toUpperCase() + " | SIC =" + element.SIC + "]"
                };
                dynamicItems.push(plot);
                staticItems.push(plot);
            });
        }
        else {
            console.log("Error ADSBPosition data upload");
        }
    }
    $scope.showDate = inputDate;
    $scope.myVar = true;
    $scope.paths = [];
    $scope.markers = [];
    $scope.strtdate = new Date(Date.UTC(selDate[2], selDate[1] - 1, selDate[0], 0, 0, 0));
    $scope.input1 = "";
    $scope.input2 = "";
    $scope.input3 = "";
    $scope.input4 = "";
    $scope.input1disabled = false;
    $scope.input2disabled = true;
    $scope.input3disabled = true;
    $scope.input4disabled = true;
    $scope.Alldata = [];
    $scope.btnStatus = 'btn btn-primary disabled';
    $scope.getNameofSensor = function (sensorId) {
        var target = sensorList.filter(x=>x.ID == sensorId);
        var name = target[0].Name
        return name;
    }
    $scope.loadData = function () {
        $scope.myVar = false;
        dynamicItems = [];
        $scope.Alldata = [];
        qlist = [];
        var dt = getDateTime($scope.strtdate);
        $scope.selectedDate = dt.toString();
        $scope.dtime = dt;
        var dtForTrack = getDate($scope.strtdate);
        var int1 = $scope.input1;
        var int2 = $scope.input2;
        var int3 = $scope.input3;
        var int4 = $scope.input4;
        
        qlist.push($http.get('/search/getFlight?dt=' + dt + '&int1=' + int1 + '&int2=' + int2 + '&int3=' + int3 + '&int4=' + int4));
        qlist.push($http.get('/Map/getAdsb'));
        qlist.push($http.get('/Map/getSSR'));
        $q.all(qlist).then(function success(res) {
            if (res[0].data.length > 0) {
                callFlight(res[0].data, dtForTrack);
                uploadItem(res[1].data, 1);
                uploadItem(res[2].data, 2);
                //$scope.markers = mergeList(staticItems,dynamicItems);
                $scope.markers = dynamicItems;
                $scope.Alldata = res[0].data;
            }
            else {
                alert("No Data of This Aircraft address or Call Sign on Selected Day")
            }
        })
    }
    $scope.init = function () {
        angular.extend($scope, {
            bangkok: {
                lat: 13.715560,
                lng: 100.540599,
                zoom: 5
            },
            layers: {
                baselayers: {
                    openStreetMap: {
                        name: 'OpenStreetMap',
                        type: 'xyz',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    }
                },
                overlays: {
                    ssr: {
                        type: 'group',
                        name: 'SSR Site',
                        visible: false
                    },

                    adsb: {
                        type: 'group',
                        name: 'ADS-B Site',
                        visible: false
                    },
                    ssrtrack: {
                        type: 'group',
                        name: 'SSR Track',
                        visible: true
                    },
                    adsbtrack: {
                        type: 'group',
                        name: 'ADS-B Track',
                        visible: false
                    },
                    path: {
                        type: 'group',
                        name: 'Reference Sites',
                        visible: true
                    }
                },
                decorations: {
                    markers: {
                        coordinates: [[51.9, -0.4], [51.505, -0.09], [51.0, -0.4]],
                        patterns: [
                            { offset: 12, repeat: 25, symbol: L.Symbol.dash({ pixelSize: 10, pathOptions: { color: '#f00', weight: 2 } }) },
                            { offset: 0, repeat: 25, symbol: L.Symbol.dash({ pixelSize: 0 }) }
                        ]
                    }
                }
            },
            events: {
                markers: {
                    enable: ['click']
                    //logic: 'emit'
                }
            },
            toggleLayer: function (type) {
                $scope.layers.overlays[type].visible = !$scope.layers.overlays[type].visible;
            }
        });
        $http.get('/Search/getSensor').success(function (res) {
            angular.forEach(res, function (data) {
                sensorList.push(data);
            })
        })
        console.log(sensorList);
    }
    $scope.$watch('[input1,input2,input3,input4]', function () {
        if ($scope.input1.length==0 && $scope.input2.length == 0 && $scope.input3.length == 0 && $scope.input4.length==0) {
            $scope.btnStatus = 'btn btn-primary disabled';
            $scope.input2disabled = true;
            $scope.input3disabled = true;
            $scope.input4disabled = true;
        }
        else {
            if($scope.input1.length >0){
                if($scope.input1.length >=4){
                    $scope.btnStatus = 'btn btn-primary ';
                    $scope.input2disabled = false;
                }
                else{
                    $scope.btnStatus = 'btn btn-primary disabled';
                }
            }
            if ($scope.input2.length > 0) {
                if ($scope.input2.length >= 4) {
                    if ($scope.input1.length >= 4 || $scope.input1.length==0) {
                        $scope.btnStatus = 'btn btn-primary';
                        $scope.input3disabled = false;
                    }
                    else{
                        $scope.btnStatus = 'btn  btn-primary disabled';
                    }
                }
                else {
                    $scope.btnStatus = 'btn btn-primary disabled';
                }
            }
            if ($scope.input3.length > 0) {
                if ($scope.input3.length >= 4) {
                    if (($scope.input1.length >= 4 || $scope.input1.length == 0) && ($scope.input2.length >= 4|| $scope.input2.length==0)) {
                        $scope.btnStatus = 'btn btn-primary';
                        $scope.input4disabled = false;
                    }
                    else {
                        $scope.btnStatus = 'btn btn-primary disabled';
                    }
                }
                else {
                    $scope.btnStatus = 'btn btn-primary disabled';
                }
            }
            if ($scope.input4.length > 0) {
                if ($scope.input4.length >= 4) {
                    if (($scope.input1.length >= 4 || $scope.input1.length == 0) && ($scope.input2.length >= 4 || $scope.input2.length == 0) && ($scope.input3.length >= 4 || $scope.input3.length==0)) {
                        $scope.btnStatus = 'btn btn-primary';
                    }
                    else {
                        $scope.btnStatus = 'btn btn-primary disabled';
                    }
                }
                else {
                    $scope.btnStatus = 'btn btn-primary disabled';
                }
            }
            
        }
    })
    $scope.init();

    //------------- Calendar---------------------- 
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };
    $scope.maxDate = new Date();

    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };

    $scope.formats = ['yyyy-MM-dd', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };
    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(),
        startingDay: 1
    };
    //------------- Calendar---------------------- 
    //---------------event on mouse ----------------
    var getColor = function (ssrList, adsbList, sic) {
        var ssrTarget = ssrList.filter(x => x.SIC == sic);
        if (ssrTarget.length != 0) {
            return 'red';
        }
        else {
            return 'blue';
        }
    }
    var getLine = function (list, lat, lng, sic, color, text, width, dash) {
        var target = list.filter(x => x.SIC == sic);
        
        if (target.length > 0) {
            var distance = myService.getDistance(target[0].Lat, target[0].Lng, lat, lng);
            var p = {
                layer: 'path',
                color: color,
                weight: width,
                latlngs: [
                    { lat: target[0].Lat, lng: target[0].Lng },
                    { lat: lat, lng: lng }
                ],
                dashArray: dash,
                message: target[0].Name + '(' + text + "), Distance : " + distance + " km"

            };
            return p;
        }
        else {
            return null;
        }
    }
    var createPathToSur = function (lat, lng, sic, sicList, cat) {
        var adsbList = qlist[1].$$state.value.data;
        var ssrList = qlist[2].$$state.value.data;
        var list = ssrList.concat(adsbList);
        var color = '';
        dynamicPath = [];

        color = getColor(ssrList, adsbList, sic);

        var line = getLine(list, lat, lng, sic, color, 'selected', 2, null);
        if (line != null) dynamicPath.push(line);

        var aList = sicList.split('_');
        if (aList != "") {
            aList.forEach(function (entry) {
                if (entry != sic) {
                    color = getColor(ssrList, adsbList, entry);
                    var templine = getLine(list, lat, lng, entry, color, 'available', 2, '8,4');
                    if (templine != null) dynamicPath.push(templine);
                }
            });
        }
        $scope.paths =  dynamicPath;
    };
    var getNameBySIC = function (sic) {
        var adsbList = qlist[1].$$state.value.data;
        var ssrList = qlist[2].$$state.value.data;
        var list = ssrList.concat(adsbList);
        var target = list.filter(x=>x.SIC == sic);
        return target;

    }
    var inArray = function (target, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === target) {
                return true;
            }
        }
        return false;
    }
    $scope.$on("leafletDirectiveMarker.map.click", function (event, args) {
        console.log(args.model);                      //test 
        if (args.model.dt != null) {
            $scope.detailLat = args.model.lat.toFixed(2);
            $scope.detailLng = args.model.lng.toFixed(2);
            var nameSic = getNameBySIC(args.model.sic);
            $scope.detailSic = nameSic[0].Name + '(' + args.model.sic + ')';
            $scope.detailNucp = args.model.nucp;
            $scope.detailCat = args.model.cat;
            $scope.detailDatetime = args.model.dt;
            $scope.detailHeight = args.model.height;
            $scope.detailClimbRate = args.model.climbRate;
            $scope.detailAngle = args.model.angle;
            $scope.detailAllDistance =[];
            $scope.detailCallSign = args.model.callsign;
            for (var i = 0; i < args.model.siclist.length; i++) {
                var obj = getNameBySIC(args.model.siclist[i]);
                var typname = '';
                if (obj.length > 0) {
                    if (obj[0].Type.substring(0, 4) == 'MSSR') {
                        typname = 'SSR';
                    }
                    else {
                        typname = 'ADS-B';
                    }
                    var status = 'A';
                    var distance = myService.getDistance(obj[0].Lat, obj[0].Lng, args.model.lat, args.model.lng)
                    if (args.model.sic == obj[0].SIC) {
                        status = 'S';
                    }
                    $scope.detailAllDistance.push({
                        name: obj[0].Name,
                        selected: status,
                        dist: distance,
                        typ: typname
                    });
                }
            }
            if (!inArray(args.model.sic, args.model.siclist)) {
                var obj = getNameBySIC(args.model.sic);
                var status = 'S';
                var distance = myService.getDistance(obj[0].Lat, obj[0].Lng, args.model.lat, args.model.lng)
                $scope.detailAllDistance.push({
                    name: obj[0].Name,
                    selected: status,
                    dist: distance,
                    typ: obj[0].Type.substring(0, 4)
                });
                //$scope.detailAllDistance += obj[0].Name + "(" + status + ") : " + distance + " km" + '\r\n';
            }
            var sicList = args.model.siclist.join('_');
            createPathToSur(args.model.lat, args.model.lng, args.model.sic, sicList, args.model.cat)
        }
    });
    $scope.$on("leafletDirectiveMap.map.click", function (event, args) {
        dynamicPath = [];
        $scope.paths =  dynamicPath;
    });
    $scope.$on('leafletDirectivePath.map.mouseover', function (event, path) {
        console.log(path.leafletObject.options.message);
        $scope.detailOfPath = path.leafletObject.options.message;
    });
    $scope.$on('leafletDirectivePath.map.mouseout', function (event, path) {
        $scope.detailOfPath = '';
    });
    //----------------------------------------------

}])