
app.factory('httpFactory', ['$http', '$q', '$resource', function ($http, $q, $resource) {
    var service = {};
    var resources = {
        "search": $resource('/Map/getSSR', {}, {
            get: {
                method: 'GET',
                isArray: true
            }
        })
    };

    service.get = function (key) {
        var deferred = $q.defer();
        resources[key].get({},
            function success(response) {
                deferred.resolve(response);
            },
            function error(msg) {
                deferred.reject(msg);
            }
        );
        return deferred.promise;
    };
    service.get = function (key, item) {
        var deferred = $q.defer();
        resources[key].get(item,
            function success(response) {
                deferred.resolve(response);
            },
            function error(msg) {
                deferred.reject(msg);
            }
        );
        return deferred.promise;
    };
    service.http = function (url) {
        var deferred = $q.defer();
        $http.get(url)
            .success(function (data) {
                deferred.resolve(data);
            }).error(function (msg) {
                deferred.reject(msg);
            });
        return deferred.promise;
    };

    return service;
}]);


