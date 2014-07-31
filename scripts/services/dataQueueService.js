'use strict';

angular.module('walletApp').service('DataQueueService', function(
    $http,
    $q,
    UtilsService
) {
    var queue = [];
    var simultaneouslyConnections = {
        limit: 8,
        current: 0
    };
    
    var resolveQueue = function() {
        console.log(simultaneouslyConnections.current);
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
            request.deferred.resolve(
                request.opts.prepareOutput(data)
            );
            resolveQueue();
        })
        .error(function(error) {
            --simultaneouslyConnections.current;
            request.deferred.reject(error);
            resolveQueue();
        });

        request.opts.startRequestFn();
    };


    return {
        get: function(url, opts) {
            opts = opts || {};
            _.defaults(opts, {
                startRequestFn: UtilsService.noop,
                prepareOutput: function(data) {
                    return data;
                }
            });
            var deferred = $q.defer();

            queue.push({
                url: url,
                opts: opts,
                deferred: deferred
            });

            resolveQueue();

            return deferred.promise;
        }
    };
});
