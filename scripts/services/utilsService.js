'use strict';

angular.module('walletApp').service('UtilsService', function() {
    
    return {
        noop: function() {
        },
        capitalize: function(string) {
            return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
        },
        // move all array elements from one to another
        moveArray: function(array1, array2) {
            var tmp;
            while (1) {
                tmp = array1.shift();
                if (angular.isUndefined(tmp)) break;
                array2.push(tmp);
            }
        }
    };
});
