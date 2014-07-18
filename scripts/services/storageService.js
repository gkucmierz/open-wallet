'use strict';

angular.module('walletApp').service('StorageService', function(
) {
    var keyPrefix = 'storage-';

    return {
        get: function(key) {
            return localStorage[keyPrefix + key];
        },
        set: function(key, value) {
            localStorage[keyPrefix + key] = value;
        }
    };
});
