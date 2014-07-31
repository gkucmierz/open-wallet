'use strict';

angular.module('walletApp').service('DataQueueService', function(
    $http,
    $q
) {
    var queue = [];
    var simultaneouslyConnections = {
        limit: 5,
        current: 0
    };
    
    var resolveQueue = function() {
        if (simultaneouslyConnections.current >= simultaneouslyConnections.limit) {
            return;
        }

        var request = queue.shift();

        if (angular.isUndefined(request)) {
            // end of queue
            return;
        }
        ++simultaneouslyConnections.current;

        $http({method: 'GET', url: request.url})
        .success(function(data) {
            --simultaneouslyConnections.current;
            request.deferred.resolve(data);
        })
        .error(function(error) {
            --simultaneouslyConnections.current;
            request.deferred.reject(error);
        });

        request.startRequestFn();
    };


    return {
        get: function(url, startRequestFn) {
            var deferred = $q.defer();

            queue.push({
                url: url,
                startRequestFn: startRequestFn,
                deferred: deferred
            });

            resolveQueue();

            return deferred.promise;
        }
    };
});
