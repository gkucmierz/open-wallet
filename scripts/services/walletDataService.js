'use strict';

angular.module('walletApp').service('WalletDataService', function(
) {
    // var storageKey = 'wallet';
    var data = [{address: '1grzes2zcfyRHcmXDLwnXiEuYBH7eqNVh'}];

    return {
        save: function() {
        },
        data: data
    };
});
