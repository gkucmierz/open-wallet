'use strict';

angular.module('walletApp').service('VanityAddressService', function(
    $q,
    BitcoreService,
    ConfigService
) {

    var generateRandom = function() {
        var key = BitcoreService.Key.generateSync();
        return {
            key: key,
            address: BitcoreService.Address.fromKey(key)
        };
    };

    var str2regExp = function(str) {
        if (!str.match(/^[123]/)) {
            str = '1' + str;
        }
        return new RegExp('^' + str);
    };

    return {
        fromRegExp: function(regexp) {
            var deferred = $q.defer();

            var t = {
                last: new Date()
            };
            var resolve = function(obj) {
                deferred.resolve({
                    address: obj.address + '',
                    privkey: obj.key.private.toString('hex')
                });
            };

            (function loop() {
                while (1) {
                    t.current = new Date();
                    var rand = generateRandom();
                    if ((rand.address + '').match(regexp)) {
                        resolve(rand);
                        return;
                    }
                    if (t.current - t.last > ConfigService.maxUnblockingTime) {
                        break;
                    }
                }
                setTimeout(loop, 0);
            })();

            return deferred.promise;
        },
        fromString: function(string) {
            return this.fromRegExp(str2regExp(string));
        }
    };
});
