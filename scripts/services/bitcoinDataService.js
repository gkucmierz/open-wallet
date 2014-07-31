'use strict';

angular.module('walletApp').service('BitcoinDataService', function(
    DataQueueService
) {
    
    var proxyUrl = function(url) {
        var proxy = 'http://www.corsproxy.com/';
        return proxy + (url+'').replace(/^https?\:\/{2}/, '');
    };

    var pick = function(obj, prop) {
        return obj[prop];
    };
    
    return {
        getBalance: function(address, startRequestFn) {
            var patternUrl = 'http://blockchain.info/address/%1?format=json';
            var url = proxyUrl(patternUrl.replace('%1', address));

            return DataQueueService.get(url, {
                startRequestFn: startRequestFn,
                prepareOutput: function(data) {
                    var received = pick(data, 'total_received');
                    var sent = pick(data, 'total_sent');
                    return {
                        received: received,
                        sent: sent,
                        balance: received - sent
                    };
                }
            });
        }
    };
});
