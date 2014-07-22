'use strict';

angular.module('walletApp').service('BitcoinUtilsService', function(
    $log,
    BitcoreService
) {

    return {
        isValidAddress: function(address) {
            var addr = new BitcoreService.Address(address);
            return addr.isValid();
        },
        privkeyToAddress: function(privkey) {
            var opts = {
                network: BitcoreService.networks.livenet
            };
            try {
                var wk = new BitcoreService.WalletKey(opts);
                wk.fromObj({ priv: privkey });
                return wk.storeObj().addr;
            } catch (e) {
                $log.warn('given privkey is not properly');
                return false;
            }
        },
        generatePrivkey: function() {
            var opts = {
                network: BitcoreService.networks.livenet
            };
            var wk = new BitcoreService.WalletKey(opts);
            wk.generate();
            return wk.storeObj().priv;
        }
    };
});
