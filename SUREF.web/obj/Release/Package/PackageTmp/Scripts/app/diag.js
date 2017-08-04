app.controller('diagController', ['$scope', '$http', 'NgTableParams', '$q', function ($scope, $http, NgTableParams, $q) {
    var date = $("#Date").val();
    var newDate = new Date(date);
    var typ = $("#Typ").val();
    var aircraftId = $("#Id").val();
    var dynamiclist = [];
    var dynamicPath = [];
    var dynamicCircle = [];
    var pointNoArray = [];
    var getDateTime = function (s) {
        var d = moment.utc(s, "YYYY/MM/DD HH:mm:ss.SSS");
        return d.format("YYYY-MM-DD ");
    };
    $scope.paths=[];
    var createTable = function (data) {
        $scope.tableParams = new NgTableParams({
            page: 1,
            count: 35,
            sorting: {
                //R2_5M: 'asc',
                //R3_5M: "asc",
                //R7_5M: 'desc',
                //R8_5M: 'desc',
                //R9_5M: 'desc',
                //R14_5M: 'desc',
                //R4: 'desc',
                //R5: 'desc',
                //R11: 'desc',
                // R2_5M: "asc",
            }
        }, {
            dataset: data
        })
    }
    var createMap = function () {
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
                    track: {
                        type: 'group',
                        name: 'Track',
                        visible: true
                    },
                    path: {
                        type: 'group',
                        name: 'Path',
                        visible: true
                    },
                    trackRef:{
                        type: 'group',
                        name: 'Ref-Track',
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
    }
    var icons = {
        blue: {
            type: 'div',
            iconSize: [10, 10],
            className: 'blue',
            iconAnchor: [5, 5]
        },
        red: {
            type: 'div',
            iconSize: [10, 10],
            className: 'red',
            iconAnchor: [5, 5]
        },
        green: {
            type: 'div',
            iconSize: [10, 10],
            className: 'green',
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
        },
        destGreen: {
            type: 'extraMarker',
            icon: 'fa-star',
            prefix: 'fa',
            shape: 'square',
            markerColor: 'green'
        }
    }
    var getDistance = function (aLat, aLng, bLat, bLng) {
        var atan2 = Math.atan2
        var cos = Math.cos
        var sin = Math.sin
        var sqrt = Math.sqrt
        var PI = Math.PI
        // (mean) radius of Earth (meters)
        var R = 6378137
        function squared(x) { return x * x }
        function toRad(x) { return x * PI / 180.0 }
        var dLat = toRad(bLat - aLat)
        var dLon = toRad(bLng - aLng)
        var f = squared(sin(dLat / 2.0)) + cos(toRad(aLat)) * cos(toRad(bLat)) * squared(sin(dLon / 2.0));
        var c = 2 * atan2(sqrt(f), sqrt(1 - f));
        var result = ((R * c) / 1000).toFixed(2);
        return result;
    }
    var mergeList = function (Data1, Data2) {
        result = [];
        Data1.forEach(function (entry) { result.push(entry) });
        Data2.forEach(function (entry) { result.push(entry) });
        return result;
    }
    var createPath = function (anslat, anslng, reflat, reflng,time) {
        var dist = getDistance(anslat, anslng, reflat, reflng);
        var p = {
            layer: 'path',
            color: 'black',
            weight: 5,
            latlngs: [
                { lat: anslat, lng: anslng },
                { lat: reflat, lng: reflng }
            ],
            dashArray: null,
            time:time,
            message: dist.toString()
        };
        return p;
    }
    var selectPoints = function (selectPoint) {
        
        dynamiclist.forEach(function (entry) {
            if (selectPoint.point==entry.point) {
                var line = createPath(selectPoint.lat, selectPoint.lng, entry.lat, entry.lng,selectPoint.time);
                dynamicPath.push(line);
            }
        })
        //var line = createPath(51.50, -0.082, 48.83, 2.37)
        //dynamicPath.push(line);
        $scope.paths = dynamicPath;
    }
    
    //var getdynamicTrack = function (ap, isLast, plotLatgLng) {
        
    //    if (isLast) {
    //        var refLat = parseFloat(ap.REF_LAT);
    //        var refLng = parseFloat(ap.REF_LNG);
    //        pushInList(refLat, refLng, "ref", isLast, ap.PointNo, ap.Time,true);
    //    }
    //    else {
    //        if (plotLatgLng) {
    //            var lat = parseFloat(ap.LAT);
    //            var lng = parseFloat(ap.LNG);
    //            pushInList(lat, lng, "ans", isLast, ap.PointNo, ap.Time,false);
    //        }
    //        var refLat = parseFloat(ap.REF_LAT);
    //        var refLng = parseFloat(ap.REF_LNG);
    //        pushInList(refLat, refLng, "ref", isLast, ap.PointNo, ap.Time,true);
    //    }
    //}
    //var findIndexPointNo = function (param) {
    //    var result = pointNoArray.indexOf(param);
    //    if (result == -1) {
    //        pointNoArray.push(param);
    //    }
    //    return result == -1 ? true : false;
    //}
    var pushInList = function (latp, lngp, typ, isLast, time,pointNo,lay) {
        dynamiclist.push({
            layer: lay,
            lat: latp,
            lng: lngp,
            icon: isLast ? (typ == "latlng" ? icons.destRed : (typ == "ref" ? icons.destGreen : icons.destBlue)) : (typ == "latlng" ? icons.red: (typ == "ref" ?icons.green:icons.blue)  ),
            time: time,
            point:pointNo,
            message: isLast ? 'Last Point' : null
            //getMessageScope: function () { return $scope; }
        });
    }
    var createCircle = function (data) {
        dynamicCircle = [];
        dynamicCircle.push({
            type: 'circle',
            radius: 10 * 10,
            latlngs: {
                lat: data.lat,
                lng: data.lng
            },
            layer: 'path',
            opacity: 0.2,
            weight: 0.3,
            fillColor: 'yellow',
            fillOpacity: 0.1
        })
    }
    var createPoint = function (points) {
        var i = 0;
        var isLast = false;
        if (points.length > 0) {
            return points.map(function (ap) {
                i++;
                if (i == points.length) {
                    isLast = true;
                }
                pushInList(parseFloat(ap.LAT), parseFloat(ap.LNG), "latlng", isLast, ap.Time, ap.PointNo,'track')
                pushInList(parseFloat(ap.REF_LAT), parseFloat(ap.REF_LNG), "ref", isLast, ap.Time, ap.PointNo, 'trackRef');
                var line = createPath(parseFloat(ap.LAT),parseFloat( ap.LNG),parseFloat( ap.REF_LAT),parseFloat(ap.REF_LNG),ap.Time);
                dynamicPath.push(line);
                //pushInList(parseFloat(ap.REF1_LAT), parseFloat(ap.REF1_LNG), "ref1", false, ap.REF1_TICK, ap.PointNo, 'trackRef');
                //pushInList(parseFloat(ap.REF2_LAT), parseFloat(ap.REF2_LNG), "ref1", isLast, ap.REF2_TICK,ap.PointNo,'trackRef');

            })
        }
        
    }
    $scope.init = function () {
        createMap();
        var list = [];
        dynamiclist = [];
        dynamicPath = [];
        var modifydate = getDateTime(newDate);
        list.push($http.get('/diag/getdata/' + aircraftId + '?&typ=' + typ + '&dt=' + modifydate));
        $q.all(list).then(function success(res) {
            if(res[0].data.length>0){
                data = res[0].data;
                console.log(data);
                createTable(data);
                createPoint(data);
                $scope.markers = dynamiclist;
                $scope.paths = dynamicPath;
            }
            else {
                alert("No Data On MappedFlight Database")
            }
        })
    }
    $scope.init();
    $scope.$on('leafletDirectiveMarker.map.click', function (event, args) {
        //dynamicPath = [];
        //$scope.paths = dynamicPath;
        //console.log(args.model);
        //if (!args.model.ref) {
        //    selectPoints(args.model);
        //}
        createCircle(args.model);
        $scope.paths = mergeList(dynamicPath, dynamicCircle);
        $scope.detailOfMarker = "Point No. = " + (args.model.point + 1) + ", LAT = " + args.model.lat + " , LNG = " + args.model.lng+" , Time= "+args.model.time;
    });
    //$scope.$on("leafletDirectiveMap.map.click", function (event, args) {
    //    dynamicPath = [];
    //    $scope.paths = dynamicPath;
    //});
    $scope.$on('leafletDirectivePath.map.mouseover', function (event, path) {
        console.log(path.leafletObject.options.message);
        $scope.detailOfPath = "Distance " + path.leafletObject.options.message + " Km" + " , Time = " + path.leafletObject.options.time;
    });
    $scope.$on('leafletDirectivePath.map.mouseout', function (event, path) {
        $scope.detailOfPath = '';
    });
}]);