app.controller('summaryCavDetails', ['$scope', '$http', 'NgTableParams', '$q', '$resource', function ($scope, $http, NgTableParams, $q, $resource, $filter) {
    var topic = $("#Topic").val();
    var date = $("#Date").val();
    var x = $("#Xe").val();
    var newDate = new Date(x);
    var typ = $("#Typ").val();
    var dt = $("#dt").val();
    var getDateTime = function (s) {
        var d = moment.utc(s, "YYYY/MM/DD HH:mm:ss.SSS");

        return d.format("YYYY-MM-DD ");
    };
    $scope.init = function () {
        var list = [];
        var modifyDate = getDateTime(newDate);
        $scope.selectedDate = dt;
        $scope.Topic = topic;
        list.push($http.get('/summaryCav/GetFlight?dt=' + modifyDate + '&typ=' + typ + '&tp=' + topic));
        $q.all(list).then(function success(res) {
            data = res[0].data;
            $scope.tableParams = new NgTableParams({
                page: 1,
                count: 35,
                sorting: {
                    R2_5M: 'asc',
                    R3_5M: 'desc',
                    R7_5M: 'desc',
                    R8_5M: 'desc',
                    R9_5M: 'desc',
                    R14_5M: 'desc',
                    R4: 'desc',
                    R5: 'desc',
                    R11: 'desc',
                }
            }, {
                dataset: data
            })
        });
    }
    $scope.init();
}])