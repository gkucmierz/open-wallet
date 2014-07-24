'use strict';

angular.module('walletApp').service('AddressWatchService', function(
    $log,
    EventListenerService
) {
    var eventListener = new EventListenerService(['connect', 'receiveCoins']);
    var watched = [];

    var watch = function() {

    };

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
