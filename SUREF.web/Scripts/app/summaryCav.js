app.controller('summaryCavController', ['$scope', '$http', '$q', function ($scope, $http, $q) {

    //     ****************initial**********************


    $scope.strtdate = new Date(Date.UTC(2017, 0, 24, 0, 0, 0));
    $scope.strtdatex = $scope.strtdate.toUTCString();
    $scope.catSurveillances = ['SSR/MRT', 'ADS-B']               //type of surveillance
    $scope.totalFlights = 0;
    $scope.radiobtn = {
        typ: 'SSR/MRT'                //initial type of surveillance
    };
    $scope.R2_5M = {
        quarantine: 0,
        clean: 0,
        globalPercent: 0,
        status: 'info',
        point: 0
    }
    $scope.R3_5M = {
        quarantine: 0,
        clean: 0,
        globalPercent: 0,
        status: 'info',
        sum: 0,
        nt: 0,
        mean: 0,
        point: 0
    }
    $scope.R7_5M = {
        quarantine: 0,
        clean: 0,
        globalPercent: 0,
        status: 'info',
        point: 0
    }
    $scope.R8_5M = {
        quarantine: 0,
        clean: 0,
        globalPercent: 0,
        status: 'info',
        point: 0
    }
    $scope.R9_5M = {
        quarantine: 0,
        clean: 0,
        globalPercent: 0,
        status: 'info',
        point: 0
    }
    $scope.R14_5M = {
        quarantine: 0,
        clean: 0,
        globalPercent: 0,
        status: 'info',
        point: 0
    }
    $scope.R4 = {
        quarantine: 0,
        clean: 0,
        globalPercent: 0,
        status: 'info',
        point: 0
    }
    $scope.R5 = {
        quarantine: 0,
        clean: 0,
        globalPercent: 0,
        status: 'info',
        point: 0
    }
    $scope.R11 = {
        quarantine: 0,
        clean: 0,
        globalPercent: 0,
        status: 'info',
        point: 0
    }
    //     ****************/initial**********************
    //****************functions**********************
    var getDateTime = function (s) {
        var d = moment.utc(s, "YYYY/MM/DD HH:mm:ss.SSS");

        return d.format("YYYY-MM-DD ");
    };
    var calPoint = function (percent) {
        var intPercent = parseInt(percent);
        if (intPercent <= 10 && intPercent > 0) {
            return 0.5
        }
        else if (intPercent <= 20) {
            return 1
        }
        else if (intPercent <= 30) {
            return 1.5
        }
        else if (intPercent <= 40) {
            return 2
        }
        else if (intPercent <= 50) {
            return 2.5
        }
        else if (intPercent <= 60) {
            return 3
        }
        else if (intPercent <= 70) {
            return 3.5
        }
        else if (intPercent <= 80) {
            return 4
        }
        else if (intPercent <= 90) {
            return 4.5
        }
        else if (intPercent <= 100) {
            return 5
        }
    }
    var calGlobalPercent = function (data, all) {
        var result = 0;
        result = ((data / all) * 100).toFixed(2);
        return result;
    }
    var R2_5M_Cal = function (data) {
        if (data < 0.97) {
            $scope.R2_5M.quarantine++;
        }
        else {
            $scope.R2_5M.clean++;
        }
    }
    var R3_5M_Cal = function (data, nt) {
        $scope.R3_5M.sum += data;
        $scope.R3_5M.nt += nt;
        if (data > 0) {
            $scope.R3_5M.quarantine++;
        }
        else {
            $scope.R3_5M.clean++;
        }
    }
    var R7_5M_Cal = function (data) {
        if (data < 0.97) {
            $scope.R7_5M.quarantine++;
        }
        else {
            $scope.R7_5M.clean++;
        }
    }
    var R8_5M_Cal = function (data) {
        if (data > 4) {
            $scope.R8_5M.quarantine++;
        }
        else {
            $scope.R8_5M.clean++;
        }
    }
    var R9_5M_Cal = function (data) {
        if (data >= 16) {
            $scope.R9_5M.quarantine++;
        }
        else {
            $scope.R9_5M.clean++;
        }
    }
    var R14_5M_Cal = function (data) {
        if (data < 0.97) {
            $scope.R14_5M.quarantine++;
        }
        else {
            $scope.R14_5M.clean++;
        }
    }
    var R4_Cal = function (data) {
        if (data > 0.55) {                                  //Kilometer unit
            $scope.R4.quarantine++;
        }
        else {
            $scope.R4.clean++;
        }
    }
    var R5_Cal = function (data) {
        if (data > 0.5) {
            $scope.R5.quarantine++;
        }
        else {
            $scope.R5.clean++;
        }
    }
    var R11_Cal = function (data) {
        if (data > 3) {                 //Flight Level unit
            $scope.R11.quarantine++;
        }
        else {
            $scope.R11.clean++;
        }
    }

    var calFlight = function (datas) {
        if (datas.length > 0) {
            angular.forEach(datas, function (element) {
                R2_5M_Cal(element.R2_5M);
                R3_5M_Cal(element.R3_5M, element.NT_5M);
                R7_5M_Cal(element.R7_5M);
                R8_5M_Cal(element.R8_5M);
                R9_5M_Cal(element.R9_5M);
                R14_5M_Cal(element.R14_5M);
            });
            $scope.R2_5M.globalPercent = calGlobalPercent($scope.R2_5M.clean, datas.length);
            $scope.R2_5M.point = calPoint($scope.R2_5M.globalPercent);
            $('#input-r2').rating('update', $scope.R2_5M.point);
            $scope.R2_5M.status = $scope.R2_5M.globalPercent < 100 ? 'danger' : 'success'

            $scope.R3_5M.globalPercent = calGlobalPercent($scope.R3_5M.quarantine, datas.length);
            $scope.R3_5M.mean = ($scope.R3_5M.sum / $scope.R3_5M.nt).toFixed(2);
            $scope.R3_5M.status = $scope.R3_5M.mean > 0.5 ? 'danger' : 'success'

            $scope.R7_5M.globalPercent = calGlobalPercent($scope.R7_5M.clean, datas.length);
            $scope.R7_5M.status = $scope.R7_5M.globalPercent < 96 ? 'danger' : 'success'
            $scope.R7_5M.point = calPoint($scope.R7_5M.globalPercent);
            $('#input-r7').rating('update', $scope.R7_5M.point);


            $scope.R8_5M.globalPercent = calGlobalPercent($scope.R8_5M.clean, datas.length);
            $scope.R8_5M.status = $scope.R8_5M.globalPercent < 100 ? 'danger' : 'success'
            $scope.R8_5M.point = calPoint($scope.R8_5M.globalPercent);
            $('#input-r8').rating('update', $scope.R8_5M.point);

            $scope.R9_5M.globalPercent = calGlobalPercent($scope.R9_5M.clean, datas.length);
            $scope.R9_5M.status = $scope.R9_5M.globalPercent < 100 ? 'danger' : 'success'
            $scope.R9_5M.point = calPoint($scope.R9_5M.globalPercent);
            $('#input-r9').rating('update', $scope.R9_5M.point);

            $scope.R14_5M.globalPercent = calGlobalPercent($scope.R14_5M.clean, datas.length);
            $scope.R14_5M.status = $scope.R14_5M.globalPercent < 98 ? 'danger' : 'success'
            $scope.R14_5M.point = calPoint($scope.R14_5M.globalPercent);
            $('#input-r14').rating('update', $scope.R14_5M.point);
        }
        else {
            console.log("No_data_queried");
            alert("No_data_queried");
        }
    }
    var calMapped = function (datas) {
        if (datas.length > 0) {
            angular.forEach(datas, function (element) {
                R4_Cal(element.R4_RMS);
                R5_Cal(element.R5);
                R11_Cal(element.R11);
            });
            $scope.R4.globalPercent = calGlobalPercent($scope.R4.clean, datas.length);
            $scope.R4.status = $scope.R4.globalPercent < 98 ? 'danger' : 'success'
            $scope.R4.point = calPoint($scope.R4.globalPercent);
            $('#input-r4').rating('update', $scope.R4.point);

            $scope.R5.globalPercent = calGlobalPercent($scope.R5.clean, datas.length);
            $scope.R5.status = $scope.R5.globalPercent < 100 ? 'danger' : 'success'
            $scope.R5.point = calPoint($scope.R5.globalPercent);
            $('#input-r5').rating('update', $scope.R5.point);

            $scope.R11.globalPercent = calGlobalPercent($scope.R11.clean, datas.length);
            $scope.R11.status = $scope.R11.globalPercent < 99.9 ? 'danger' : 'success'
            $scope.R11.point = calPoint($scope.R11.globalPercent);
            $('#input-r11').rating('update', $scope.R11.point);
        }

    }
    //****************/functions**********************
    $scope.init = function () {
        var list = [];
        //Set zero
        $scope.R2_5M = {
            quarantine: 0,
            clean: 0,
            globalPercent: 0,
            status: 'info',
            point: 0
        }
        $scope.R3_5M = {
            quarantine: 0,
            clean: 0,
            globalPercent: 0,
            status: 'info',
            sum: 0,
            nt: 0,
            mean: 0,
            point: 0
        }
        $scope.R7_5M = {
            quarantine: 0,
            clean: 0,
            globalPercent: 0,
            status: 'info',
            point: 0
        }
        $scope.R8_5M = {
            quarantine: 0,
            clean: 0,
            globalPercent: 0,
            status: 'info',
            point: 0
        }
        $scope.R9_5M = {
            quarantine: 0,
            clean: 0,
            globalPercent: 0,
            status: 'info',
            point: 0
        }
        $scope.R14_5M = {
            quarantine: 0,
            clean: 0,
            globalPercent: 0,
            status: 'info',
            point: 0
        }
        $scope.R4 = {
            quarantine: 0,
            clean: 0,
            globalPercent: 0,
            status: 'info',
            point: 0
        }
        $scope.R5 = {
            quarantine: 0,
            clean: 0,
            globalPercent: 0,
            status: 'info',
            point: 0
        }
        $scope.R11 = {
            quarantine: 0,
            clean: 0,
            globalPercent: 0,
            status: 'info',
            point: 0
        }
        //Set zero (End)
        $scope.totalFlights = 0;
        var dt = getDateTime($scope.strtdate);
        var typ = $scope.radiobtn.typ;
        $scope.selectedDate = dt;
        list.push($http.get('/summaryCav/GetFlight?dt=' + dt + '&typ=' + typ));
        list.push($http.get('/summaryCav/GetMappedFlight?dt=' + dt + '&typ=' + typ));
        $q.all(list).then(function success(res) {
            $scope.totalFlights = res[0].data.length;
            $scope.totalMappedFlights = res[1].data.length;
            calFlight(res[0].data);
            calMapped(res[1].data);

        })
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
    $(document).on('ready', function () {
        $('#input-r2').rating({ displayOnly: true, step: 0.5 });
        $('#input-r7').rating({ displayOnly: true, step: 0.5 });
        $('#input-r8').rating({ displayOnly: true, step: 0.5 });
        $('#input-r9').rating({ displayOnly: true, step: 0.5 });
        $('#input-r14').rating({ displayOnly: true, step: 0.5 });
        $('#input-r4').rating({ displayOnly: true, step: 0.5 });
        $('#input-r5').rating({ displayOnly: true, step: 0.5 });
        $('#input-r11').rating({ displayOnly: true, step: 0.5 });
    })
    $(document).ready(function () {
        $('[data-toggle="tooltip"]').tooltip({
            placement: 'right'
        });
    });

}]);