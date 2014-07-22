'use strict';

angular.module('walletApp').service('BitcoinUtilsService', function(
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
                var address = BitcoreService.Address.fromKey(wk.privKey) + '';
                return address;
            } catch (e) {
                return false;
            }
        }
    };
});
