'use strict';

angular.module('walletApp').service('StorageService', function() {

    var getKey = function(key) {
        var prefix = 'myStorage-';
        return prefix + key;
    };

    return {
        get: function(key) {
            var res = localStorage[getKey(key)];
            return _.isUndefined(res) ? res : angular.fromJson(res);
        },
        set: function(key, value) {
            localStorage[getKey(key)] = angular.toJson(value);
        },
        default: function(key, value) {
            if (_.isUndefined(this.get(key))) {
                this.set(key, value);
            }
            return this.get(key);
        }
    };
});
