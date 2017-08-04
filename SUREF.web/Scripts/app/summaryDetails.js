app.controller('summaryDetails', ['$scope', '$http', 'NgTableParams', '$q', '$resource', function ($scope, $http, NgTableParams, $q, $resource, $filter) {
    var topic = $("#Topic").val();
    var date = $("#Date").val();
    var x = $("#Xe").val();
    var newDate = new Date(x);
    var typ = $("#Typ").val();
    var dt = $("#dt").val();
    var getDateTime = function (s) {
        var d = moment.utc(s, "YYYY/MM/DD HH:mm:ss.SSS");
        $scope.dt = d.format("YYYY/MM/DD HH:mm:ss.SSS");
        return d.format("YYYY-MM-DD ");
    };
    $scope.fractionsize = function (input) {
        if (input == 1||input==0) {
            return 0;
        }
        else {
            return 2;
        }
    }
    $scope.btnmsg = function (data) {
        return data == 1 ? 'Included' : 'Excluded';
    }
    $scope.btnClass = function (data) {
        return data == 1 ? 'success' : 'danger';
    }
    $scope.AddDatatoDb = function (aircraftId,dt) {
        var dataparams = { aircraftid: aircraftId, dtInput: dt }
        $http.post('/api/summaryapi/post', { aircraftid: aircraftId, dtInput: dt }).success(function (result) {
            //alert('Success!' + result);
            if (result < 3) {
                $scope.btnmsg(result);
                $scope.init();
            }
            else {
                console.log(result);
            }
        }).error(function (data) {
            alert("Error!");
        });
        
    }
    
    var applySelectedSort = function () {
        if (topic == 'R2') {
            $scope.tableParams.sorting('R2_5M', 'asc');
        }
        else if (topic == 'R2R') {
            $scope.tableParams.sorting('R2_5R', 'asc');
        }
        else if (topic == 'R3') {
            $scope.tableParams.sorting('R3_5M', 'asc');
        }
        else if (topic == 'R7') {
            $scope.tableParams.sorting('R7_5M', 'asc');
        }
        else if (topic == 'R7R') {
            $scope.tableParams.sorting('R7_5R', 'asc');
        }
        else if (topic == 'R8') {
            $scope.tableParams.sorting('R8_5M', 'asc');
        }
        else if (topic == 'R9') {
            $scope.tableParams.sorting('R9_5M', 'asc');
        }
        else if (topic == 'R14') {
            $scope.tableParams.sorting('R14_5M', 'asc');
        }
        else if (topic == 'R14R') {
            $scope.tableParams.sorting('R14_5R', 'asc');
        }
        else if (topic == 'R4') {
            $scope.tableParams.sorting('R4', 'asc');
        }
        else if (topic == 'R5') {
            $scope.tableParams.sorting('R5', 'asc');
        }
        else if (topic == 'R11') {
            $scope.tableParams.sorting('R11', 'asc');
        }
        
    }
    
    $scope.init = function () {
        var list = [];
        var modifyDate = getDateTime(newDate);
        $scope.selectedDate = dt;
        $scope.Topic = topic;
        $scope.selectedateString = newDate.toUTCString();
        list.push($http.get('/summary/GetFlight?dt=' + modifyDate + '&typ=' + typ + '&tp=' + topic));
        $q.all(list).then(function success(res) {
            data = res[0].data;
            $scope.tableParams = new NgTableParams({
                page: 1,
                count: 25,
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
                    R2_5M: "asc",
                }
            }, {
                dataset: data
            })
            applySelectedSort();
        });
    }
    $scope.init();
}])