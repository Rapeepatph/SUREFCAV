
app.service('myService', ['$http', '$q', '$resource', function ($http, $q, $resource) {
    var staticItems = [];
    var dynamicItems = [];
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
    var uploadItem = function (points,typ) {
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
                    message: element.Name + " [ "+layertyp.toUpperCase()+" | SIC =" + element.SIC + "]"
                };
                staticItems.push(plot);
            });
        }
        else {
            console.log("Error ADSBPosition data upload");
        }
    }
    var addressPointsToMarkers = function (points, typ) {
        var surtyp = typ == 1 ? 'adsb' : 'ssr';
        var icontyp = typ == 1 ? icons.blue : icons.red;
        return points.map(function (ap) {
            dynamicItems.push({
                layer: surtyp,
                lat: ap[1],
                lng: ap[2],
                icon: icontyp
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
    this.uploadStaticItem = function () {
        $http.get('/Map/getAdsb').success(function (data) {
            uploadItem(data,1);
        })
        $http.get('/Map/getSSR').success(function (data) {
            uploadItem(data, 2);
        })
        return staticItems;
    }
    this.uploadDynamicItem = function (dt, int1, int2, int3, int4, dtForTrack) {
        var list = [];
        var deferred = $q.defer();
        var Alldata = "";
        list.push($http.get('/search/getFlight?dt=' + dt + '&int1=' + int1 + '&int2=' + int2 + '&int3=' + int3 + '&int4=' + int4));
        $q.all(list).then(function success(res) {
            Alldata = res[0].data;
            callFlight(res[0].data, dtForTrack);
            deferred.resolve(dynamicItems);
            return deferred.promise;
        })
    }
    this.getDistance = function (aLat, aLng, bLat, bLng) {
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
    this.findAngle = function (vx, vy) {
        var z = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
        var result = 0;
        if (vx >= 0 && vy > 0) {
            var theta = (Math.asin(vx / z)) * 180 / Math.PI;
            result = theta;
        }
        else if (vx >= 0 && vy < 0) {
            var theta = (Math.asin(-vy / z)) * 180 / Math.PI;
            result = (theta + 90);
        }
        else if (vx < 0 && vy <= 0) {
            var theta = (Math.asin(-vx / z)) * 180 / Math.PI;
            result = (theta + 180);
        }
        else if (vx < 0 && vy >= 0) {
            var theta = Math.asin(vy / z) * 180 / Math.PI;
            result = (theta + 270);
        }
        else {
            return null;
        }
        return parseFloat((Math.round(result * 100) / 100).toFixed(2));
    }
}]);

