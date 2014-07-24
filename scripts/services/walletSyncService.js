'use strict';

angular.module('walletApp').service('WalletSyncService', function(
) {

    return {
        watch: function(address, walletEntry) {
            void(address, walletEntry);
        },
        unwatch: function(address) {
            void(address);
        }
    };
});
