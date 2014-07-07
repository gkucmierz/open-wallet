'use strict';

angular.module('walletApp')
.service('BitcoinDataService', function($http, $q) {
    
    var proxyUrl = function(url) {
        var proxy = 'http://www.corsproxy.com/';
        return proxy + (url+'').replace(/^https?\:\/{2}/, '');
    };

    var pick = function(obj, prop) {
        return obj[prop];
    };
    
    return {
        getBalance: function(address) {
            var deferred = $q.defer();
            var patternUrl = 'http://blockchain.info/address/%1?format=json';
            var url = proxyUrl(patternUrl.replace('%1', address));

            $http({method: 'GET', url: url})
            .success(function(data) {
                var received = pick(data, 'total_received');
                var sent = pick(data, 'total_sent');
                var res = {
                    received: received,
                    sent: sent,
                    balance: received - sent
                };
                deferred.resolve(res);
            })
            .error(deferred.reject);

            return deferred.promise;
        }
    };
});
