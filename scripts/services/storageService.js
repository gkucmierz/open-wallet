'use strict';

angular.module('walletApp').service('StorageService', function() {

    var getKey = function(key) {
        var prefix = 'myStorage-';
        return prefix + key;
    };

    return {
        get: function(key) {
            var res = localStorage[getKey(key)];
            return typeof res === 'undefined' ? res : angular.fromJson(res);
        },
        set: function(key, value) {
            localStorage[getKey(key)] = angular.toJson(value);
        },
        default: function(key, value) {
            if (typeof this.get(key) === 'undefined') {
                this.set(key, value);
            }
            return this.get(key);
        }
    };
});
