app.filter('customUserDateFilter', function ($filter) {
    //return function (values, dateString) {
    //    var filtered = [];
    //    if (typeof values != 'undefined' && typeof dateString != 'undefined') {
    //        angular.forEach(values, function (value) {
    //            var source = ($filter('date')(value.TimeFrom, 'DD MMM YYYY HH:mm:ss.SSS')).toLowerCase();
    //            var temp = dateString.toLowerCase();
    //            //if ($filter('date')(value.start_date).indexOf(dateString) >= 0) {
    //            //if (temp.indexOf(" ") >=0)
    //            //debugger;
    //            if (source.indexOf(temp) >= 0) {
    //                filtered.push(value);
    //            }
    //        });
    //    }
    //    return filtered;
    //}
})

.controller('flightController', ['$scope', '$http', 'NgTableParams', '$q', '$resource', function ($scope, $http, NgTableParams, $q, $resource, $filter) {
    
    var data = [];
    var today = new Date();
    //$scope.strtdate = new Date(today.setDate((today.getDate() - 1)));
    $scope.strtdate = new Date(2017,0,[24],7,0,0);                   //month start 0 - 11
    var getDateTime = function (s) {
        var d = moment.utc(s, "YYYY/MM/DD HH:mm:ss.SSS");

        return d.format("YYYY-MM-DD ");
    };
    $scope.getDate = function (dateString) {
        var tDate = new Date(parseInt(dateString.substr(6)));
        var d = moment(tDate, "YYYY/MM/DD HH:mm:ss.SSS");
        return d.format("DD MMM YYYY HH:mm:ss.SSS");
    };
    $scope.init = function () {
        var list = [];
        var dt = getDateTime($scope.strtdate);
        $scope.selectedDate = dt;
        list.push($http.get('/Flight/get?dt=' + dt));
        $q.all(list).then(function success(res) {
            data = res[0].data;
            $scope.tableParams = new NgTableParams({
                page: 1,
                count: 35
            }, {
                dataset:data
            })
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
}]);

    
