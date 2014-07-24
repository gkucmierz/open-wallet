'use strict';

angular.module('walletApp').service('WalletSyncService', function(
) {

    return {
        watch: function(walletEntry) {
            void(walletEntry);
        },
        unwatch: function(walletEntry) {
            void(walletEntry);
        }
    };
});
