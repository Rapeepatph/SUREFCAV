app.controller('mapController', ['$scope', '$http', 'leafletData', '$q', '$compile', '$rootScope','$routeParams', function ($scope, $http, leafletData, $q, httpFactory, $compile, $rootScope, $routeParams) {
    var staticitems = [];
    var dynamicitems = [];
    var staticlist = [];
    var dynamiclist = [];
    var result = [];
    var plot = {};
    var staticPath = [];
    var dynamicPath = [];
    var distributionNucps=[];
    var nucpDatas=[];
    var AircraftID = $("#Id").val();
    var yAxisLabels = [];
    var yAxislabelsChart8 = [];
    var yAxislabelsChart9 = [];
    var yAxislabelsTimeChart = [];
    var selDate = $("#Date").val();
    var Seltyp = $("#Typ").val();
    var selTopic = $("#Topic").val();
    var dtSet = $("#dtSet").val();
    var newDate = new Date(dtSet);
    var bool62 = function () {
        if (selTopic == 'R4'||selTopic=='R5'||selTopic=='R11') {
            return true;
        }
        else if (Seltyp == 'SSR/MRT') {
            return true;
        }
        
        return false;
    }
    var bool21 = function () {
        if (selTopic == 'R4' || selTopic == 'R5' || selTopic == 'R11') {
            return true;
        }
        else if (Seltyp == 'ADS-B') {
            return true;
        }
        return false;
    }
    var getDateTime = function (s) {
        var d = moment.utc(s, "YYYY/MM/DD HH:mm:ss.SSS");
        return d.format("DD MMM YYYY HH:mm:ss.SSS");
    };
    var modifyDate = function (s) {
        var d = moment.utc(s, "YYYY/MM/DD HH:mm:ss.SSS");
        $scope.dtutc = d.format("YYYY/MM/DD HH:mm:ss.SSS");
}
    var getTimeForChart = function (s) {
        var d = moment.utc(s, "YYYY/MM/DD HH:mm:ss.SSS");
        return d.valueOf();
    }
    var getNameSur = function (s) {
        var result = staticitems.filter(function (obj) {
            return obj.sic == s;
        })
        return result ? result[0].name:null;
    }
    var change =function(sic) {
        switch(sic){
            case 82: return 'Suratthani SSR';
                break;
            case 66: return 'Phuket SSR';
                break;
            case 162: return 'Ubonratchathani SSR';
                break;
            case 50: return 'Hatyai SSR';
                break;
            case 98: return 'Chiang Mai SSR';
                break;
            case 18: return 'Donmueang SSR';
                break;
            case 114: return 'Pitsanulok SSR';
                break;
            case 146: return 'Udonthani SSR';
                break;
            case 178: return 'Roi-Et SSR';
                break;
            case 210: return 'Chumphon SSR';
                break;
            case 194: return 'Chiangrai SSR';
                break;
            case 5: return 'Tungmahamek ADSB';
                break;
            case 100: return 'Chiang Mai ADSB';
                break;
            case 51: return 'Hatyai ADSB';
                break;
            case 83: return 'Samui ADSB';
                break;
            case 163: return 'Ubonratchathani ADSB';
                break;
            case 147: return 'Udonthani ADSB';
                break;
        }
        
    };
    var changeData = function (typ) {
        switch (typ) {
            case 0: return 'Data Capture';
                break;
            case 1: return 'Horizontal Position'
                break;
            case 2: return 'Flight Level'
                break;
            case 3: return 'Aircraft Identification'
                break;
        }
    }
    var findIndexchart2 = function (param) {
        var result = yAxisLabels.indexOf(param);
        return result==-1?null:result;
    }
    var findIndexchart8 = function (param) {
        var result = yAxislabelsChart8.indexOf(param);
        return result == -1 ? null : result;
    }
    var findIndexchart9 = function (param) {
        var result = yAxislabelsChart9.indexOf(param);
        return result == -1 ? null : result;
    }
    var findIndexTimeChart = function (param) {
        var result = yAxislabelsTimeChart.indexOf(param);
        return result == -1 ? null : result;
    }
    var findMean = function (params) {
        var sum = 0;
        for (var i = 0; i < params.length; i++)
        {
            sum += params[i][1];
        }
        return (sum / params.length).toFixed(2);
    }
    var findAngle = function (vx, vy) {
        var z = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
        var result = 0;
        if (vx >= 0 && vy > 0) {
            var theta = (Math.asin(vx / z))*180/Math.PI;
            result= theta;
        }
        else if (vx >= 0 && vy < 0) {
            var theta = (Math.asin(-vy/z))*180/Math.PI;
            result = (theta + 90);
        }
        else if (vx < 0 && vy <= 0) {
            var theta = (Math.asin(-vx / z))*180/Math.PI;
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
    var insertDataDistibution = function (param) {
        var index = distributionNucps.indexOf(param);
        if (index == -1) {
            distributionNucps.push(param);
            nucpDatas.push(1);
        }
        else {
            nucpDatas[index] += 1;
        }
    }
    var addDataToChart6 = function () {
        for(var i=0;i<distributionNucps.length;i++)
        {
            $scope.nucpDistributionChart.push([distributionNucps[i], nucpDatas[i]]);
        }
    }
    var addDataToChart8 = function (time,callsign, aircraftAddress,trackNo) {
        if (findIndexchart8(callsign) == null) {
            yAxislabelsChart8.push(callsign);
        }
        var CallSignPlot = [getTimeForChart(time), findIndexchart8(callsign)];
        $scope.ssrCallsignChart.push(CallSignPlot);
        if (findIndexchart8(aircraftAddress) == null) {
            yAxislabelsChart8.push(aircraftAddress);
        }
        var AircraftIdentPlot = [getTimeForChart(time), findIndexchart8(aircraftAddress)];
        $scope.ssrAircraftIDChart.push(AircraftIdentPlot);

        if (findIndexchart8(trackNo) == null) {
            yAxislabelsChart8.push(trackNo);
        }
        var TrackNoPlot = [getTimeForChart(time), findIndexchart8(trackNo)];
        $scope.ssrTrackNoChart.push(TrackNoPlot);
    }
    var addDataToChart9 = function (time, callsign, aircraftAddress,trackNo) {
        if (findIndexchart9(callsign) == null) {
            yAxislabelsChart9.push(callsign);
        }
        var CallSignPlot = [getTimeForChart(time), findIndexchart9(callsign)];
        $scope.adsbCallsignChart.push(CallSignPlot);
        if (findIndexchart9(aircraftAddress) == null) {
            yAxislabelsChart9.push(aircraftAddress);
        }
        var AircraftIdentPlot = [getTimeForChart(time), findIndexchart9(aircraftAddress)];
        $scope.adsbAircraftIDChart.push(AircraftIdentPlot);
        if (findIndexchart9(trackNo) == null) {
            yAxislabelsChart9.push(trackNo);
        }
        var TrackNoPlot = [getTimeForChart(time), findIndexchart9(trackNo)];
        $scope.adsbTrackNoChart.push(TrackNoPlot);
    }
    var addDataToChart10 = function (time, flAge) {
        var plot = [getTimeForChart(time), flAge]
        $scope.FLAge.push(plot);
    }
    var addDataToTimeChart = function () {

    }
    //$scope.date = "20161115";
    //$scope.FlightID = "71bd61";
    $scope.paths = [];
    $scope.adsbDataChart = [];
    $scope.ssrDataChart = [];
    $scope.adsbSICDataChart = [];
    $scope.ssrSICDataChart = [];
    $scope.ssrGeoHeightChart = [];
    $scope.ssrBaroHeightChart = [];
    $scope.adsbGeoHeightChart = [];
    $scope.ssrAngleChart = [];
    $scope.adsbAircraftIDChart = [];
    $scope.adsbCallsignChart = [];
    $scope.adsbTrackNoChart = [];
    $scope.ssrAircraftIDChart = [];
    $scope.ssrCallsignChart = [];
    $scope.ssrTrackNoChart = [];
    $scope.nucpChart = [];
    $scope.FLAge = [];
    $scope.nucpDistributionChart = [];
    $scope.ssrClimbChart = [];
    $scope.avgNucp = 0;
    $scope.ssrGroundSpeedData=[];
    $scope.adsbGroundSpeedChart = [];
    $scope.latLngTime = [];
    $scope.dataCapTime = [];
    $scope.flightLevelTime=[];
    $scope.aircraftIDTime=[];
    $scope.adsbLatData = [];
    $scope.adsbLngData = [];
    $scope.ssrLatData = [];
    $scope.ssrLngData = [];
    $scope.chartConfig = {
        options: {
            chart: {
                type:'scatter'
            },
            tooltip: {
                formatter: function () {
                    return "Time = " + moment(this.x).utc().format('HH:mm:ss.SSS') + ", Altitude = " + this.y ;
                }
            }
            
        },
        title: {
            text: 'Flight Level Versus Time of Flight ID ' + AircraftID
        },
        series: [
            {
                data: $scope.adsbDataChart,
                name: 'CAT21',
                color:'blue',
                marker: {
                    enabled: true,
                    radius: 2
                }
            },
            {
                data: $scope.ssrDataChart,
                name: 'CAT62',
                color:'red',
                marker: {
                    enabled: true,
                    radius: 2
                }
            }
        ],
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                millisecond: "%H:%M:%S.%L"
            }
        },
        yAxis:{
            title: {
                text: 'Flight Level'
            },
            tickInterval: 20,
            allowDecimals: true
        },
        loading: true,
        //size: {
        //    width: 400,
        //    height: 300
        //},
    };
    $scope.chart2Config = {
        options: {
            chart: {
                type: 'line'
            },
            tooltip: {
                formatter: function () {
                    return "Time = " + moment(this.x).utc().format('HH:mm:ss.SSS') + " : " + yAxisLabels[this.y];
                }
            }

        },
        title: {
            text: 'Site Versus Time of Flight ID ' + AircraftID
        },
        series: [
            {
                data: $scope.adsbSICDataChart,
                name: 'CAT21',
                color: 'blue',
                marker: {
                    enabled: true,
                    radius: 2
                },
                visible:false
            },
            {
                data: $scope.ssrSICDataChart,
                name: 'CAT62',
                color: 'red',
                marker: {
                    enabled: true,
                    radius: 2
                }
            }
        ],
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                millisecond: "%H:%M:%S.%L"
            }
        },
        yAxis: {
            title: {
                text: 'Site Name'
            },
            tickInterval: 1,
            labels:{
                formatter: function (){
                    //var result = change[this.value];
                    //return value !== 'undefined' ? value : this.value;
               
                    return yAxisLabels[this.value];
                }
            }
        },
        loading: true
    };
///////////////////////////////////////////////////////////////////////////////////////////
    $scope.chart3Config = {
        options: {
            chart: {
                type: 'scatter'
            },
            tooltip: {
                formatter: function () {
                    return "Time = " + moment(this.x).utc().format('HH:mm:ss.SSS') + " : FL " + this.y;
                }
            }

        },
        title: {
            text: 'Height Versus Time of Flight ID ' + AircraftID
        },
        series: [
            {
                data: $scope.ssrGeoHeightChart,
                name: 'GeoMetric',
                color: 'green',
                marker: {
                    enabled: true,
                    radius: 2
                }
                
            },
            {
                data: $scope.ssrBaroHeightChart,
                name: 'BaroMetric',
                color: 'black',
                marker: {
                    enabled: true,
                    radius: 2
                }
            },
            {
                data: $scope.ssrDataChart,
                name: 'Flight Level',
                color: 'purple',
                marker: {
                    enabled: true,
                    radius: 2
                }
            }
        ],
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                millisecond: "%H:%M:%S.%L"
            }
        },
        yAxis: {
            title: {
                text: 'Flight Level'
            },
            tickInterval: 20,
            allowDecimals: true
        },
        loading: true
    };
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $scope.chart4Config = {
        options: {
            chart: {
                type: 'scatter'
            },
            tooltip: {
                formatter: function () {
                    return "Time = " + moment(this.x).utc().format('HH:mm:ss.SSS') + " : FL " + this.y;
                }
            }

        },
        title: {
            text: 'Height Versus Time of Flight ID ' + AircraftID
        },
        series: [
            {
                data: $scope.adsbGeoHeightChart,
                name: 'GeoMetric',
                color: 'green',
                marker: {
                    enabled: true,
                    radius: 2
                }

            },
            {
                data: $scope.adsbDataChart,
                name: 'Flight Level',
                color: 'purple',
                marker: {
                    enabled: true,
                    radius: 2
                }
            }
        ],
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                millisecond: "%H:%M:%S.%L"
            }
        },
        yAxis: {
            title: {
                text: 'Flight Level'
            },
            tickInterval: 20,
            allowDecimals: true
        },
        loading: true
    };
//////////////////////////////////////////////////////////////////////////////////
$scope.chart5Config = {
        options: {
            chart: {
                type: 'line'
            },
            tooltip: {
                formatter: function () {
                    return "Time = " + moment(this.x).utc().format('HH:mm:ss.SSS') + " : NuCp " + this.y;
                }
            }

        },
        title: {
            text: 'NuCp Versus Time of Flight ID ' + AircraftID
        },
        series: [
            {
                data: $scope.nucpChart,
                name: 'Nucp from CAT21',
                color: 'green',
                marker: {
                    enabled: true,
                    radius: 2
                }

            }
        ],
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                millisecond: "%H:%M:%S.%L"
            }
        },
        yAxis: {
            title: {
                text: 'Value'
            },
            allowDecimals: false
        },
        loading: true
    };
//////////////////////////////////////////////////////////////////////////
$scope.chart6Config = {
    options: {
        chart: {
            type: 'column'
        },
        tooltip: {
            formatter: function () {
                return 'The frequency of '+this.x+' is <b>' 
                     + this.y + '</b>';
            }
        }
    },
    title: {
        text: 'NUCp Distribution of Flight ID ' + AircraftID
    },
    series: [
        {
            data: $scope.nucpDistributionChart,
            name: 'Distribution NUCp',
            color: 'green',
            pointWidth: 25,
            dataLabels: {
                enabled: true,
                format: '{point.y}', 
                align: 'center'
            }
        }
    ],
    xAxis: {
        title: {
            text: 'Value of NUCp'
        },
        allowDecimals: true,
        min: 0,
max:8
    },
    yAxis: {
        title: {
            text: 'Frequency'
        },
        allowDecimals: true
    },
    loading: true
};
/////////////////////////////////////////////////////////////////////////////////  
$scope.chart7Config = {
    options: {
        chart: {
            type: 'scatter'
        },
        tooltip: {
            formatter: function () {
                return "Time = " + moment(this.x).utc().format('HH:mm:ss.SSS') + " : Angle " + this.y+" degrees";
            }
        }

    },
    title: {
        text: 'Angle Versus Time of Flight ID ' + AircraftID
    },
    series: [
        {
            data: $scope.ssrAngleChart,
            name: 'Angle from CAT62',
            color: 'green',
            marker: {
                enabled: true,
                radius: 2
            }

        }
    ],
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
            millisecond: "%H:%M:%S.%L"
        }
    },
    yAxis: {
        title: {
            text: 'Angle (Degree)'
        },
        allowDecimals: false,
        max:360
    },
    loading: true
};


    ///////////////////////////////////////////////////////////////////////////////// 
$scope.chart8Config = {
    options: {
        chart: {
            type: 'scatter'
        },
        tooltip: {
            formatter: function () {
                return "Time = " + moment(this.x).utc().format('HH:mm:ss.SSS') + " : " + yAxislabelsChart8[this.y];
            }
        }

    },
    title: {
        text: 'Aircraft Identification / MRT ' 
    },
    series: [
        {
            data: $scope.ssrAircraftIDChart,
            name: 'AircraftID',
            color: 'blue',
            marker: {
                enabled: true,
                radius: 2
            },
            visible: false
        },
        {
            data: $scope.ssrCallsignChart,
            name: 'CallSign',
            color: 'red',
            marker: {
                enabled: true,
                radius: 2
            }
        }, {
            data: $scope.ssrTrackNoChart,
            name: 'TrackNo',
            color: 'green',
            marker: {
                enabled: true,
                radius: 2
            },
            visible: false
        }
    ],
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
            millisecond: "%H:%M:%S.%L"
        }
    },
    yAxis: {
        title: {
            text: ''
        },
        tickInterval: 1,
        labels: {
            formatter: function () {
                //var result = change[this.value];
                //return value !== 'undefined' ? value : this.value;

                return yAxislabelsChart8[this.value];
            }
        }
    },
    loading: true
};
    ///////////////////////////////////////////////////////////////////////////////////////////
$scope.chart9Config = {
    options: {
        chart: {
            type: 'scatter'
        },
        tooltip: {
            formatter: function () {
                return "Time = " + moment(this.x).utc().format('HH:mm:ss.SSS') + " : " + yAxislabelsChart9[this.y];
            }
        }

    },
    title: {
        text: 'Aircraft Identification / ADS-B '
    },
    series: [
        {
            data: $scope.adsbAircraftIDChart,
            name: 'AircraftID',
            color: 'blue',
            marker: {
                enabled: true,
                radius: 2
            },
            visible: false
        },
        {
            data: $scope.adsbCallsignChart,
            name: 'CallSign',
            color: 'red',
            marker: {
                enabled: true,
                radius: 2
            }
        },
        {
            data: $scope.adsbTrackNoChart,
            name: 'TrackNo',
            color: 'green',
            marker: {
                enabled: true,
                radius: 2
            },
            visible: false
        }
    ],
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
            millisecond: "%H:%M:%S.%L"
        }
    },
    yAxis: {
        title: {
            text: ''
        },
        tickInterval: 1,
        labels: {
            formatter: function () {
                //var result = change[this.value];
                //return value !== 'undefined' ? value : this.value;

                return yAxislabelsChart9[this.value];
            }
        }
    },
    loading: true
};
    ///////////////////////////////////////////////////////////////////////////////////////////
$scope.chart10Config = {
    options: {
        chart: {
            type: 'scatter'
        },
        tooltip: {
            formatter: function () {
                return "Time = " + moment(this.x).utc().format('HH:mm:ss.SSS') + " :  " + this.y;
            }
        }

    },
    title: {
        text: 'Forward Altitude Age ' 
    },
    series: [
        {
            data: $scope.FLAge,
            name: 'CAT62',
            color: 'green',
            marker: {
                enabled: true,
                radius: 2
            }

        }
    ],
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
            millisecond: "%H:%M:%S.%L"
        }
    },
    yAxis: {
        title: {
            text: 'Value'
        },
        allowDecimals: false
    },
    loading: true
};
    ///////////////////////////////////////////////////////////////////////////////////////////
$scope.chart11Config = {
    options: {
        chart: {
            type: 'scatter'
        },
        tooltip: {
            formatter: function () {
                return "Time = " + moment(this.x).utc().format('HH:mm:ss.SSS') + " :  " + this.y;
            }
        }

    },
    title: {
        text: 'Rate of Climb / Descend '
    },
    series: [
        {
            data: $scope.ssrClimbChart,
            name: 'CAT62',
            color: 'green',
            marker: {
                enabled: true,
                radius: 2
            }

        }
    ],
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
            millisecond: "%H:%M:%S.%L"
        }
    },
    yAxis: {
        title: {
            text: 'Value'
        },
        allowDecimals: false
    },
    loading: true
};
$scope.groundSpeedChartConfig = {
    options: {
        chart: {
            type: 'scatter'
        },
        tooltip: {
            formatter: function () {
                return "Time = " + moment(this.x).utc().format('HH:mm:ss.SSS') + ", Altitude = " + this.y;
            }
        }

    },
    title: {
        text: 'Ground Speed Versus Time of Flight ID ' + AircraftID
    },
    series: [
        {
            data: $scope.adsbGroundSpeedChart,
            name: 'CAT21',
            color: 'blue',
            marker: {
                enabled: true,
                radius: 2
            }
        },
        {
            data: $scope.ssrGroundSpeedData,
            name: 'CAT62',
            color: 'red',
            marker: {
                enabled: true,
                radius: 2
            }
        }
    ],
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
            millisecond: "%H:%M:%S.%L"
        }
    },
    yAxis: {
        title: {
            text: 'Speed'
        },
        tickInterval: 20,
        allowDecimals: true
    },
    loading: true,
    //size: {
    //    width: 400,
    //    height: 300
    //},
};
$scope.timeChartConfig = {
    options: {
        chart: {
            type: 'scatter'
        },
        tooltip: {
            formatter: function () {
                return "Time = " + moment(this.x).utc().format('HH:mm:ss.SSS') ;
            }
        }

    },
    title: {
        text: ' Time of Flight ID ' + AircraftID 
    },
    series: [
        {
            data: $scope.latLngTime,
            name: 'LAT,LNG',
            color: 'blue',
            marker: {
                enabled: true,
                radius: 2
            }
        },
        {
            data: $scope.dataCapTime,
            name: 'Data Captured',
            color: 'green',
            marker: {
                enabled: true,
                radius: 2
            }
        },
        {
            data: $scope.flightLevelTime,
            name: 'Flight Level',
            color: 'red',
            marker: {
                enabled: true,
                radius: 2
            }
        },
        {
            data: $scope.aircraftIDTime,
            name: 'Aircraft Identification',
            color: 'purple',
            marker: {
                enabled: true,
                radius: 2
            }
        },
    ],
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
            millisecond: "%H:%M:%S.%L"
        }
    },
    yAxis: {
        title: {
            text: ''
        },
        tickInterval: 1,
        labels: {
            formatter: function () {
                //var result = change[this.value];
                //return value !== 'undefined' ? value : this.value;

                return yAxislabelsTimeChart[this.value];
            }
        }
    },
    loading: true,
    //size: {
    //    width: 400,
    //    height: 300
    //},
};
$scope.diffLatLngChartConfig = {
    options: {
        chart: {
            type: 'scatter'
        },
        tooltip: {
            formatter: function () {
                return "Time = " + moment(this.x).utc().format('HH:mm:ss.SSS') + ", Lat/Lng = " + this.y;
            }
        }

    },
    title: {
        text: 'Lat/Lng Versus Time of Flight ID ' + AircraftID
    },
    series: [
        {
            data: $scope.adsbLatData,
            name: 'CAT21-Lat',
            color: 'blue',
            marker: {
                enabled: true,
                radius: 2
            },
            visible: bool21()
        },
        {
            data: $scope.adsbLngData,
            name: 'CAT21-Lng',
            color: 'blue',
            marker: {
                enabled: true,
                radius: 2
            },
            visible: bool21()
        },
        {
            data: $scope.ssrLatData,
            name: 'CAT62-Lat',
            color: 'red',
            marker: {
                enabled: true,
                radius: 2
            },
            visible: bool62()
        },
        {
            data: $scope.ssrLngData,
            name: 'CAT62-Lng',
            color: 'red',
            marker: {
                enabled: true,
                radius: 2
            },
            visible: bool62()
        }
    ],
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
            millisecond: "%H:%M:%S.%L"
        }
    },
    yAxis: {
        title: {
            text: 'Lat/Lng'
        },
        //tickInterval: 20,
        allowDecimals: true
    },
    loading: true,
    //size: {
    //    width: 400,
    //    height: 300
    //},
};
    ///////////////////////////////////////////////////////////////////////////////////////////
    var getDistance= function(aLat,aLng,bLat,bLng){
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
    var getNameBySIC = function (sic) {
        var adsbList = staticlist[0].$$state.value.data;
        var ssrList = staticlist[1].$$state.value.data;
        var list = ssrList.concat(adsbList);
        var target = list.filter(x=>x.SIC == sic);
        return target;

    }
    var getLine = function (list, lat, lng, sic, color, text,width,dash)
    {
        var target = list.filter(x => x.SIC == sic);
        var distance = getDistance(target[0].Lat, target[0].Lng, lat, lng);
        if (target.length != 0) {
             var p = {
                layer: 'path',
                color: color,
                weight: width,
                latlngs: [
                    { lat: target[0].Lat, lng: target[0].Lng },
                    { lat: lat, lng: lng }
                ],
                dashArray: dash,
                message:target[0].Name+'('+ text + "), Distance : " + distance + " km" 
                
            };
            return p;
        }
    }
    var getColor = function (ssrList, adsbList,sic) {
        var ssrTarget = ssrList.filter(x => x.SIC == sic);
        if (ssrTarget.length != 0) {
            return 'red';
        }
        else {
            return 'blue';
        }
    }
    var createPathToSur = function (lat, lng, sic, sicList, cat) {
        var adsbList = staticlist[0].$$state.value.data;
        var ssrList = staticlist[1].$$state.value.data;
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
                    var templine = getLine(list, lat, lng, entry, color, 'available', 3, '5,10');
                    if (templine != null) dynamicPath.push(templine);
                }
            });
        }
        $scope.paths = mergeList(staticPath, dynamicPath);
    };
    var inArray = function (target, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === target) {
                return true;
            }
        }
        return false;
    }
    //$scope.createPathToSur = function (lat, lng, sic, sicList,cat) {
    //    var adsbList = staticlist[0].$$state.value.data;
    //    var ssrList = staticlist[1].$$state.value.data;
    //    var list = ssrList.concat(adsbList);
    //    var color = '';
    //    dynamicPath = [];
        
    //    color = getColor(ssrList, adsbList, sic);

    //    var line = getLine(list, lat, lng, sic,color,'selected',6,null);
    //    if (line != null) dynamicPath.push(line);
    //    var aList = sicList.split('_');
    //    aList.forEach(function (entry) {
    //        if (entry != sic) {
    //            color = getColor(ssrList, adsbList, entry);
    //            var templine = getLine(list, lat, lng, entry, color, 'available',3,'5,10');
    //            if (templine != null) dynamicPath.push(templine);
    //        }
    //    });        

    //    $scope.paths = mergeList(staticPath, dynamicPath);
    //};
    
    var mergeList = function (staticData, dynamicData) {
        result = [];
        staticData.forEach(function (entry) { result.push(entry) });
        dynamicData.forEach(function (entry) { result.push(entry) });
        return result;
    }
    
    //var getPathtoSur = function (ap, type) {

    //    var sicList = ap[5].join('_');
    //    sicList = "'" + sicList + "'";
    //    var adsbTitle = '<span  class="glyphicon glyphicon-th-large" ng-click="createPathToSur(' + ap[1] + ',' + ap[2] + ',' + ap[4] + ',' +sicList +','+ap[6]+ ')"></span>';
    //    var adsbLinkFn = $compile(angular.element(adsbTitle));
    //    var adsbPopup = adsbLinkFn($scope);

    //    var ssrTitle = '<span  class="glyphicon glyphicon-th-large" ng-click="createPathToSur(' + ap[1] + ',' + ap[2] + ',' + ap[4] +  ',' + sicList + ',' + ap[6] + ')"></span>';
    //    var ssrLinkFn = $compile(angular.element(ssrTitle));
    //    var ssrPopup = ssrLinkFn($scope);

    //    if (type == "adsb")
    //    {
    //        //return "[ADSB] <p> Last update : " + getDateTime(ap[0]) + "<p> Position : " + ap[1] + ", " + ap[2] + "<p> " + "Height :" + ap[3] + "<p> SIC :" + ap[4] + "<p>" + adsbPopup[0].outerHTML;
    //        return "[ADSB] "+adsbPopup[0].outerHTML
    //    }
    //    else
    //    {
    //        //return "[SSR] <p> Last update : " + getDateTime(ap[0]) + "<p> Position : " + ap[1] + ", " + ap[2] + "<p> " + "Height :" + ap[3] + "<p> SIC :" + ap[4] + "<p>" + ssrPopup[0].outerHTML;
    //        return  "[SSR] "+ ssrPopup[0].outerHTML
    //    }
    //};
    var getdynamic = function (ap, type,isLast) {
        var typeSur = type == 0 ? 'adsbtrack' : 'ssrtrack';
        dynamicitems.push({
            layer: typeSur,
            lat: ap[1],
            lng: ap[2],
            height: ap[3],
            sic: ap[4],
            cat: ap[6],
            nucp: ap[9],
            climbRate: ap[10],
            dt: getDateTime(ap[0]),
            siclist: ap[5],
            icon:  isLast ? (type == 0 ? icons.destBlue : icons.destRed )  : ( type == 0 ? icons.blue : icons.red),
            vx: ap[11],
            vy: ap[12],
            angle: findAngle(ap[11], ap[12]),
            flightLevelAge: ap[13],
            callsign: ap[14],
            aircraftAddress: ap[15],
            modecode: ap[16],
            gSpeed:ap[18],
            message:isLast?'Last Point':null
            //getMessageScope: function () { return $scope; }
        });
}   
    var adsbTrack = function (points) {
        var i = 0;
        if (points.length > 0)
        {
            return points.map(function (ap) {
                i++;
                var plot = [getTimeForChart(ap[0]),parseFloat(ap[3])];
                $scope.adsbDataChart.push(plot);
                if (findIndexchart2(change(ap[4])) ==null )
                {
                    yAxisLabels.push(change(ap[4]));
                }
                var plotSic = [getTimeForChart(ap[0]), findIndexchart2(change(ap[4]))];
                $scope.adsbSICDataChart.push(plotSic);
                var geoPlot = [getTimeForChart(ap[0]), ap[7] / 100];
                $scope.adsbGeoHeightChart.push(geoPlot);
                var nucpPlot = [getTimeForChart(ap[0]), ap[9]];
                $scope.nucpChart.push(nucpPlot);
                var speedPlot = [getTimeForChart(ap[0]), ap[11]];
                $scope.adsbGroundSpeedChart.push(speedPlot);

                insertDataDistibution(ap[9]);
                addDataToChart9(ap[0], ap[14], ap[15], ap[17]);
                //---------------TimeChart--------------------------
                if (bool21()) {
                    if (findIndexTimeChart(changeData(0)) == null) {
                        yAxislabelsTimeChart.push(changeData(0));
                    }
                    var dataCapPlot = [getTimeForChart(ap[0]), findIndexTimeChart(changeData(0))];
                    $scope.dataCapTime.push(dataCapPlot);
                    if (ap[15] != null) {
                        if (findIndexTimeChart(changeData(3)) == null) {
                            yAxislabelsTimeChart.push(changeData(3));
                        }
                        var airId = [getTimeForChart(ap[0]), findIndexTimeChart(changeData(3))];
                        $scope.aircraftIDTime.push(airId);
                    }
                    if (ap[3] != null) {
                        if (findIndexTimeChart(changeData(2)) == null) {
                            yAxislabelsTimeChart.push(changeData(2));
                        }
                        var flPlot = [getTimeForChart(ap[0]), findIndexTimeChart(changeData(2))];
                        $scope.flightLevelTime.push(flPlot);
                    }

                    if (ap[1] != null) {
                        if (findIndexTimeChart(changeData(1)) == null) {
                            yAxislabelsTimeChart.push(changeData(1));
                        }
                        var plotTime = [getTimeForChart(ap[0]), findIndexTimeChart(changeData(1))];
                        $scope.latLngTime.push(plotTime);
                    }
                }
                //----------------------------------------------------
                //----------------Differential chart-------------------
                var pltLat = [getTimeForChart(ap[0]), ap[1]];
                $scope.adsbLatData.push(pltLat);
                var pltLng = [getTimeForChart(ap[0]), ap[2]];
                $scope.adsbLngData.push(pltLng);
                //------------------------------------------------------
                if (i < points.length) {
                    return getdynamic(ap, 0,false);
                }
                else if (i = points.length) {
                    return getdynamic(ap, 0,true);
                }
                //return dynamicitems.push({
                //    layer: 'track',
                //    lat: ap[1],
                //    lng: ap[2],
                //    height: ap[3],
                //    sic: ap[4],
                //    cat: ap[6],
                //    nucp: ap[9],
                //    datetime:getDateTime(ap[0]),
                //    icon: icons.blue,
                //    message: getPathtoSur(ap, "adsb"),
                //    getMessageScope: function () { return $scope; }
                //});
            });
        }
        else {
            return
            console.log("Error about data of track. ADSB has not a data");
        }
        
    };
    
    var ssrTrack = function (points) {
        var i = 0;
        if (points.length > 0) {
            return points.map(function (ap) {
                i++;
                
                var plot = [getTimeForChart(ap[0]), parseFloat(ap[3])];
                $scope.ssrDataChart.push(plot);
                if (findIndexchart2(change(ap[4])) == null) {
                    yAxisLabels.push(change(ap[4]));
                }
                var plotSic = [getTimeForChart(ap[0]), findIndexchart2(change(ap[4]))];
                $scope.ssrSICDataChart.push(plotSic);
                var geoPlot = [getTimeForChart(ap[0]), ap[7]/100];
                $scope.ssrGeoHeightChart.push(geoPlot);
                var baroPlot = [getTimeForChart(ap[0]), ap[8]];
                $scope.ssrBaroHeightChart.push(baroPlot);
                var anglePlot = [getTimeForChart(ap[0]), findAngle(ap[11], ap[12])];
                $scope.ssrAngleChart.push(anglePlot);
                var speedPlot = [getTimeForChart(ap[0]), ap[11]];
                $scope.ssrGroundSpeedData.push(speedPlot);

                addDataToChart8(ap[0], ap[14], ap[15],ap[17]);
                addDataToChart10(ap[0], ap[13]);
                var climbRate = [getTimeForChart(ap[0]), ap[10]];
                $scope.ssrClimbChart.push(climbRate);
                //-----------TimeChart-------------------------------
                if (bool62()) {
                    if (findIndexTimeChart(changeData(0)) == null) {
                        yAxislabelsTimeChart.push(changeData(0));
                    }
                    var dataCapPlot = [getTimeForChart(ap[0]), findIndexTimeChart(changeData(0))];
                    $scope.dataCapTime.push(dataCapPlot);
                    if (ap[15] != null) {
                        if (findIndexTimeChart(changeData(3)) == null) {
                            yAxislabelsTimeChart.push(changeData(3));
                        }
                        var airId = [getTimeForChart(ap[0]), findIndexTimeChart(changeData(3))];
                        $scope.aircraftIDTime.push(airId);
                    }
                    if (ap[3] != null) {
                        if (findIndexTimeChart(changeData(2)) == null) {
                            yAxislabelsTimeChart.push(changeData(2));
                        }
                        var flPlot = [getTimeForChart(ap[0]), findIndexTimeChart(changeData(2))];
                        $scope.flightLevelTime.push(flPlot);
                    }
                    if (ap[1] != null) {
                        if (findIndexTimeChart(changeData(1)) == null) {
                            yAxislabelsTimeChart.push(changeData(1));
                        }
                        var plotTime = [getTimeForChart(ap[0]), findIndexTimeChart(changeData(1))];
                        $scope.latLngTime.push(plotTime);

                    }
                }
                //--------------------------------------------------------
                //----------------Differential chart-------------------
                var pltLat = [getTimeForChart(ap[0]), ap[1]];
                $scope.ssrLatData.push(pltLat);
                var pltLng = [getTimeForChart(ap[0]), ap[2]];
                $scope.ssrLngData.push(pltLng);
                //-----------------------------------------------------
                if (i < points.length) {
                    return getdynamic(ap, 1,false);
                }
                else if (i = points.length) {
                    return getdynamic(ap, 1,true);
                }
                //return dynamicitems.push({
                //    layer: 'track',
                //    lat: ap[1],
                //    lng: ap[2],
                //    sic: ap[4],
                //    cat: ap[6],
                //    nucp: ap[9],
                //    dt: getDateTime(ap[0]),
                //    icon: icons.red,
                //    message: getPathtoSur(ap, "ssr"),
                //    getMessageScope: function () { return $scope; }
                //});
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
                    sic: element.SIC,
                    name:element.Name,
                    message: element.Name + " [ ADSB | SIC =" + element.SIC + "]"
                };
                staticitems.push(plot);
                var circlePlot = {
                    type: 'circle',
                    radius: 300 * 1000,            //meters
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
                staticPath.push(circlePlot);
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
                    sic: element.SIC,
                    name: element.Name,
                    message: element.Name + " [ SSR | SIC =" + element.SIC + "]"
                };
                staticitems.push(plot);
                var circlePlot = {
                    type: 'circle',
                    radius: 250 * 1000,    //meters
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
                staticPath.push(circlePlot);
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
        },
        tri: {
            type: 'div',
            iconSize: [10, 10],
            className: 'triangle',
            iconAnchor: [5, 5]
        },
        destRed: {
            type:'extraMarker',
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

    $scope.loadData = function () {
        dynamiclist = [];
        dynamicPath = [];
        yAxisLabels = [];
        $scope.ssrDataChart.length = 0;
        $scope.adsbDataChart.length = 0;
        //$scope.chartConfig.title.text = 'Flight Level Versus Time of Flight ID ' + AircraftID;
        dynamiclist.push($http.get('/Map/getTrack?sensor=1&date=' + selDate + '&id=' + AircraftID));
        dynamiclist.push($http.get('/Map/getTrack?sensor=2&date=' + selDate + '&id=' + AircraftID));
        $q.all(dynamiclist).then(function success(res) {
            dynamicitems = [];
            adsbTrack(res[0].data);
            ssrTrack(res[1].data);
            addDataToChart6();
            $scope.avgNucp = findMean($scope.nucpChart);
            $scope.avgFLAge = findMean($scope.FLAge);
            $scope.markers = mergeList(staticitems, dynamicitems);
            $scope.paths = mergeList(staticPath, dynamicPath);

        }, function error(response) { }
        ).finally(function () { });
    };
    var init = function () {
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
                        visible: true
                    },
                    coverageSSR: {
                        type: 'group',
                        name: 'SSR Coverage',
                        visible: false
                    },
                    coverageADSB: {
                        type: 'group',
                        name: 'ADS-B Coverage',
                        visible: false
                    },
                    path: {
                        type: 'group',
                        name: 'Reference Sites',
                        visible:true
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
            events:{
                markers: {
                    enable: ['click']
                    //logic: 'emit'
                }
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
           }, function error(response) {}
        ).finally(function () {
            $scope.paths = staticPath;
        });

        modifyDate(newDate);
        $scope.loadData();        
        //httpFactory.http('/Map/getSSR').then(function(result){
        //    //console.log(result.length);
        //});
    };
    init();
    $scope.$on("leafletDirectiveMarker.map.click", function (event, args) {
        console.log(args.model);                      //test 
        if (args.model.dt != null)
        {
            $scope.detailLat = args.model.lat.toFixed(2);
            $scope.detailLng = args.model.lng.toFixed(2);
            var nameSic = getNameBySIC(args.model.sic);
            $scope.detailSic = nameSic[0].Name + '(' + args.model.sic+')';
            $scope.detailNucp = args.model.nucp;
            $scope.detailCat = args.model.cat;
            $scope.detailDatetime = args.model.dt;
            $scope.detailHeight = args.model.height;
            $scope.detailClimbRate = args.model.climbRate;
            $scope.detailAngle = args.model.angle;
            $scope.detailAllDistance = '';
            $scope.detailCallSign = args.model.callsign;
            for (var i = 0; i < args.model.siclist.length; i++) {
                var obj = getNameBySIC(args.model.siclist[i]);
                var status = 'A';
                var distance = getDistance(obj[0].Lat, obj[0].Lng, args.model.lat, args.model.lng)
                if (args.model.sic == obj[0].SIC) {
                     status = 'S';
                }
                $scope.detailAllDistance += obj[0].Name +"("+status+ ") : " + distance+" km"+'\r\n';
            }
            if (!inArray(args.model.sic, args.model.siclist)) {
                var obj = getNameBySIC(args.model.sic);
                var status = 'S';
                var distance = getDistance(obj[0].Lat, obj[0].Lng, args.model.lat, args.model.lng)
                $scope.detailAllDistance += obj[0].Name + "(" + status + ") : " + distance + " km" + '\r\n';
            }
            var sicList = args.model.siclist.join('_');
            createPathToSur(args.model.lat, args.model.lng, args.model.sic, sicList, args.model.cat)
        }
    });
    $scope.$on("leafletDirectiveMap.map.click", function (event, args) {
        dynamicPath = [];
        $scope.paths = mergeList(staticPath, dynamicPath);
    });
    $scope.$on('leafletDirectivePath.map.mouseover', function (event, path) {
        console.log(path.leafletObject.options.message);
        $scope.detailOfPath = path.leafletObject.options.message;
    });
    $scope.$on('leafletDirectivePath.map.mouseout', function (event, path) {
        $scope.detailOfPath = '';
    });
}]);

