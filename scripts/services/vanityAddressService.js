'use strict';

angular.module('walletApp').service('VanityAddressService', function(
    $q,
    BitcoreService
) {
    var maxUnblockingTime = 30;

    var generateRandom = function() {
        var key = BitcoreService.Key.generateSync();
        return {
            key: key,
            address: BitcoreService.Address.fromKey(key)
        };
    };

    return {
        fromRegExp: function(regexp) {
            var deferred = $q.defer();

            var t = {
                last: new Date()
            };
            var resolve = function(obj) {
                obj.address += '';
                deferred.resolve(obj);
            };

            (function loop() {
                console.log('dupa');
                while (1) {
                    t.current = new Date();
                    var rand = generateRandom();
                    if ((rand.address + '').match(regexp)) {
                        resolve(rand);
                        return;
                    }
                    if (t.current - t.last > maxUnblockingTime) {
                        break;
                    }
                }
                loop();
            })();

            return deferred.promise;
        }
    };
});
