'use strict';

angular.module('walletApp').service('UtilsService', function() {
    
    return {
        noop: function() {
        },
        capitalize: function(string) {
            return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
        }
    };
});
