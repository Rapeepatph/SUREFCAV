app.controller('mapController', ['$scope', '$http', 'leafletData', '$q', 'httpFactory', function ($scope, $http, leafletData, $q, httpFactory) {
    var staticitems = [];
    var dynamicitems = [];
    var staticlist = [];
    var dynamiclist = [];
    var result = [];
    var plot = {};
    $scope.date = "20161102";
    $scope.FlightID = "71bd61";
    $scope.paths = [];
    var getDateTime = function (s) {
        var d = moment.utc(s, "YYYY/MM/DD HH:mm:ss.SSS");
        return d.format("DD MMM YYYY HH:mm:ss.SSS");
    };
    
    var adsbTrack = function (points) {
        if (points.length > 0)
        {
            return points.map(function (ap) {
                return dynamicitems.push({
                    layer: 'track',
                    lat: ap[1],
                    lng: ap[2],
                    icon: icons.blue,
                    message: "[ADSB]" + getDateTime(ap[0]) + " - [ " + ap[1] + ", " + ap[2] + " ]"
                });
            });
        }
        else {
            return
            console.log("Error about data of track. ADSB has not a data");
        }
        
    };
    
    var ssrTrack = function (points) {
        if (points.length > 0) {
            return points.map(function (ap) {
                return dynamicitems.push({
                    layer: 'track',
                    lat: ap[1],
                    lng: ap[2],
                    icon: icons.red,
                    message: "[SSR]" + "<p> " + getDateTime(ap[0]) + " <p> [ " + ap[1] + ", " + ap[2] + " ]" + "<p>" + "Height :" + ap[3]                   
                });
            });
        }
        else {
            return
            console.log("Error about data of track. SSR has not a data");
        }
    };

    var uploadAdsb = function (points) {
        if (points.length >0 )
        {
            angular.forEach(points, function (element) {
                plot = {
                    layer: 'adsb',
                    lat: element.Lat,
                    lng: element.Lng,
                    icon: icons.adsb,
                    message: element.Name + " [ ADSB | SIC =" + element.SIC + "]"
                };
                staticitems.push(plot);
                var circlePlot = {
                    type: 'circle',
                    radius: 300 * 1000,
                    latlngs: {
                        lat: element.Lat,
                        lng: element.Lng
                    },
                    layer: 'coverageADSB',
                    opacity: 0.2,
                    weight: 0.3,
                    fillColor: 'blue',
                    fillOpacity: 0.1
                }
                $scope.paths.push(circlePlot);
            });
        }
        else {
            console.log("Error ADSBPosition data upload");
        }
    }

    var uploadSSR = function (points) {
        if (points.length > 0) {
            angular.forEach(points, function (element) {
                plot = {
                    layer: 'ssr',
                    lat: element.Lat,
                    lng: element.Lng,
                    icon: icons.ssr,
                    message: element.Name + " [ SSR | SIC =" + element.SIC + "]"
                };
                staticitems.push(plot);
                var circlePlot = {
                    type: 'circle',
                    radius: 250 * 1000,
                    latlngs: {
                        lat: element.Lat,
                        lng: element.Lng
                    },
                    layer: 'coverageSSR',
                    opacity: 0.1,
                    weight: 0.3,
                    fillColor: 'red',
                    fillOpacity: 0.1
                }
                $scope.paths.push(circlePlot);
            });
        }
        else {
            console.log("Error SSRPosition data upload");
        }
    }

    var icons = {
        blue:{
            type: 'div',
            iconSize: [10, 10],
            className: 'blue',
            iconAnchor:  [5, 5]
        },
        red: {
            type: 'div',
            iconSize: [10, 10],
            className: 'red',
            iconAnchor:  [5, 5]
        },
        adsb: {
            iconUrl: '/images/marker-icon.png',
            iconSize: [20, 30]
        },
        ssr: {
            iconUrl: '/images/map-marker-icon.png',
            iconSize: [30, 30]
        }
    }

    $scope.loadData = function () {
        dynamiclist = [];
        dynamiclist.push($http.get('/Map/getTrack?sensor=1&date=' + $scope.date + '&id=' + $scope.FlightID));
        dynamiclist.push($http.get('/Map/getTrack?sensor=2&date=' + $scope.date + '&id=' + $scope.FlightID));
        $q.all(dynamiclist).then(function success(res) {
            dynamicitems = [];
            adsbTrack(res[0].data);
            ssrTrack(res[1].data);
            result = [];
            staticitems.forEach(function (entry) { result.push(entry) });
            dynamicitems.forEach(function (entry) { result.push(entry) });
            $scope.markers = result;
            console.log(staticlist);

        }, function error(response) { }
        ).finally(function () { });
    };
    var init = function () {
        angular.extend($scope, {
            bangkok: {
                lat: 13.715560,
                lng: 100.540599,
                zoom: 6
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
                        name: 'SSR',
                        visible: false
                    },

                    adsb: {
                        type: 'group',
                        name: 'ADS-B',
                        visible: false
                    },
                    track: {
                        type: 'group',
                        name: 'Track',
                        visible: false
                    },
                    coverageSSR: {
                        type: 'group',
                        name: 'CoverageSSR',
                        visible: false
                    },
                    coverageADSB: {
                        type: 'group',
                        name: 'CoverageADSB',
                        visible: false
                    }
                },
},
            toggleLayer: function (type) {
                $scope.layers.overlays[type].visible = !$scope.layers.overlays[type].visible;
            }
        });

        //qlist.push($http.get('/Data/21_136.json'));
        //qlist.push($http.get('/Data/62_106.json'));
        
        staticlist.push($http.get('/Map/getAdsb'));
        staticlist.push($http.get('/Map/getSSR'));

        $q.all(staticlist).then(function success(res) {
            
            uploadAdsb(res[0].data);
            uploadSSR(res[1].data);
            //leafletData.getMap("map").then(
            //    function (map) {
            //        var coverage = new L.layerGroup();
            //        for (var n = 0; n < circlePlots.length; n++) {
            //            var circle = L.circle([circlePlots[n].lat,circlePlots[n].lng], {
            //                color: 'green',
            //                fillColor: '#f03',
            //                fillOpacity: 0.5,
            //                radius: 50000
            //            }).addTo(coverage);
            //        }
            //        var baseLayers = {

            //        };
            //        var overlays = {
            //            "Coverage": coverage
            //        };
            //        L.control.layers(baseLayers, overlays).addTo(map);
            //    }
            //   );

           }, function error(response) {}
        ).finally(function () { });
        $scope.loadData();        
        httpFactory.http('/Map/getSSR').then(function(result){
            console.log(result.length);
        });
    };
    init();
    
}]);

