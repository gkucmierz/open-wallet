'use strict';

angular.module('walletApp').service('WalletDataService', function(
    StorageService
) {
    var storageKey = 'wallet';
    var data;


    data = StorageService.default(storageKey, [
        {address: '1grzes2zcfyRHcmXDLwnXiEuYBH7eqNVh'}
    ]);

    return {
        save: function() {
            StorageService.set(storageKey, data);
        },
        data: data
    };
});
