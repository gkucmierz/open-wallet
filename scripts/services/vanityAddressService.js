'use strict';

angular.module('walletApp').service('VanityAddressService', function(
    BitcoreService
) {

    var generateRandom = function() {
        var key = BitcoreService.Key.generateSync();
        return {
            key: key,
            address: BitcoreService.Address.fromKey(key)
        };
    };

    return {
        fromRegExp: function(regexp) {

        }
    };
});
