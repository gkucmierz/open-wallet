'use strict';

angular.module('walletApp').service('BitcoinDataService', function(
    DataQueueService
) {
    var _this;
    
    var proxyUrl = function(url) {
        return [
            'http://query.yahooapis.com/v1/public/yql?q=',
            encodeURIComponent('select * from json where url="' + url + '"'),
            '&format=json'
        ].join('');
    };

    var getJson = function(obj) {
        try {
            return obj.query.results.json;
        } catch (e) {
            return false;
        }
    };

    var pick = function(obj, prop) {
        return obj[prop];
    };

    var getBalance = function(address, startRequestFn) {
        var patternUrl = 'https://blockchain.info/address/%1?format=json';
        var url = proxyUrl(patternUrl.replace('%1', address));

        return DataQueueService.get(url, {
            startRequestFn: startRequestFn,
            prepareOutput: function(data) {
                var json = getJson(data);
                
                var received = pick(json, 'total_received');
                var sent = pick(json, 'total_sent');
                return {
                    received: received,
                    sent: sent,
                    balance: received - sent
                };
            }
        });
    };

    var getUnspent = function(address, startRequestFn) {
        var patternUrl = 'http://blockchain.info/unspent?active=%1';
        var url = proxyUrl(patternUrl.replace('%1', address));

        return DataQueueService.get(url, {
            startRequestFn: startRequestFn,
            prepareOutput: function(data) {
                var json = getJson(data);
                return pick(json, 'unspent_outputs');
            }
        });
    };
    
    var prepareMethod = function(fn) {
        return function() {
            return fn.apply(_this, arguments);
        };
    };

    _this = {
        getBalance: prepareMethod(getBalance),
        getUnspent: prepareMethod(getUnspent)
    };
    return _this;
});
