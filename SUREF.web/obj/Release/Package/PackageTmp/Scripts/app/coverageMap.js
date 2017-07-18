app.controller('coverageMapController', ['$scope', '$http', '$q', function ($scope, $http, $q) {
    var dynamicList = [];
    var getDateTime = function (s) {
        var d = moment.utc(s, "YYYY/MM/DD HH:mm:ss.SSS");

        return d.format("YYYY-MM-DD ");
    };
    var getDate = function (s) {
        var d = moment.utc(s, "YYYY/MM/DD HH:mm:ss.SSS");

        return d.format("YYYYMMDD ");
    }
    var icons = {
        blue: {
            type: 'div',
            iconSize: [1, 1],
            className: 'blue',
            iconAnchor: [5, 5]
        },
        red: {
            type: 'div',
            iconSize: [1, 1],
            className: 'red',
            iconAnchor: [5, 5]
        }
    }
    var getRandom = function (length) {
        return Math.floor(Math.random() * (length));
    }
    var getRandomSample = function (array, size) {
        var length = array.length, start = getRandom(length);

        for (var i = size; i--;) {
            var index = (start + i) % length, rindex = getRandom(length);
            var temp = array[rindex];
            array[rindex] = array[index];
            array[index] = temp;
        }
        var end = start + size, sample = array.slice(start, end);
        if (end > length)
            sample = sample.concat(array.slice(0, end - length));
        return sample;
    }
    var getTrack = function (point,typ) {
        var surtyp = typ == 1 ? 'adsb' : 'ssr';
        var icontyp = typ == 1 ? icons.blue : icons.red;
        dynamicList.push({
            layer: surtyp,
            lat: point[1],
            lng: point[2],
            icon: icontyp
        });
        
    }
    
    var createTrack = function (points, typ,samplePerFlight) {
        if (points.length > 0) {
            var sample = getRandomSample(points, samplePerFlight);
            return sample.map(function (ap) {
                getTrack(ap, typ);
            })
            //return points.map(function (ap) {
            //    getTrack(ap, typ);
            //})
        }
    }
    var addressPointsToMarkers = function (points, typ, samplePerFlight) {
        var surtyp = typ == 1 ? 'adsb' : 'ssr';
        var icontyp = typ == 1 ? icons.blue : icons.red;
        var sample = getRandomSample(points, samplePerFlight);
        return sample.map(function (ap) {
            dynamicList.push( {
                layer: surtyp,
                lat: ap[1],
                lng: ap[2],
                icon: icontyp
            });
        });
    };
    var callFlight = function(data,typ){
        var dt = getDate($scope.strtdate);
        var samplePerFlight = parseInt(5000/ data.length);
        console.log(samplePerFlight);
        angular.forEach(data, function (element) {
            if (element.AircraftID != "X") {
                $http.get('/Map/getTrack?sensor=' + typ + '&date=' + dt + '&id=' + element.AircraftID).success(function (points) {
                    //setTimeout(createTrack, 1000, points.data, typ, samplePerFlight);
                    //createTrack(points, typ, samplePerFlight);
                    //console.log(points);
                    addressPointsToMarkers(points, typ, samplePerFlight);
                })
            }
        })
        
    };
    
    $scope.strtdate = new Date(Date.UTC(2017, 0, 24, 0, 0, 0));
    $scope.loadData = function () {
        var list = [];
        var dt = getDateTime($scope.strtdate);
        dynamicList = [];
        //$http.get('/summary/GetFlight?dt=' + dt + '&typ=ADS-B').then(function (response) {
        //    //console.log(response.data);
        //    callFlight(response.data, 1);
        //});
        //$http.get('/summary/GetFlight?dt=' + dt + '&typ=SSR/MRT').then(function (response) {
        //    //console.log(response.data);
        //    callFlight(response.data, 2);
        //});
        
        list.push($http.get('/summary/GetFlight?dt=' + dt + '&typ=ADS-B'));
        list.push($http.get('/summary/GetFlight?dt=' + dt + '&typ=SSR/MRT'));
        $q.all(list).then(function success(res) {
            callFlight(res[0].data, 1)
            callFlight(res[1].data, 2)
            $scope.markers = dynamicList;
        })
        
    }
    
    $scope.init = function () {
        $scope.selectedDate = getDateTime($scope.strtdate);
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
                    adsb: {
                        name: 'ADS-B',
                        type: 'markercluster',
                        visible: true
                    },
                    ssr: {
                        name: 'SSR',
                        type: 'markercluster',
                        visible: true
                    }
                },
            },
        
            toggleLayer: function (type) {
                $scope.layers.overlays[type].visible = !$scope.layers.overlays[type].visible;
            }
        });
    }
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
}])