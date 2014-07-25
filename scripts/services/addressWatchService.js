'use strict';

angular.module('walletApp').service('AddressWatchService', function(
    $log,
    EventListenerService
) {
    var eventListener = new EventListenerService(['connect', 'receiveCoins']);
    var watched = [];
    var watchQueue = [];

    var ws = new WebSocket('wss://ws.blockchain.info/inv');

    ws.onopen = function() {
        eventListener.emit('connect');
        $log.info('Socket has been opened!');
    };

    var watch = function(address) {
        if (ws.readyState) {
            ws.send(angular.toJson({
                'op': 'addr_sub',
                'addr': address
            }));
            $log.info('watching address: ' + address);
        } else {
            watchQueue.push(address);
        }
    };

    eventListener.once('connect', function() {
        _.map(watchQueue, function(address) {
            watch(address);
        });
        watchQueue = [];
    });

    return {
        watch: function(address) {
            var i = watched.indexOf(address);
            if (i === -1) {
                watched.push(address);
                watch(address);
                return true;
            }
            $log.warn('this address is watched already');
            return false;
        },
        unwatch: function(address) {
            var i = watched.indexOf(address);
            if (i !== -1) {
                watched.splice(i, 1);
                return true;
            }
            $log.warn('this address was not watched');
            return false;
        },
        eventListener: eventListener
    };
});
