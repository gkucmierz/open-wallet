'use strict';

angular.module('walletApp')
.filter('btc', function () {
    return function (input) {
        var vol = parseFloat(input);
        return isNaN(vol) ? '-' : vol.toFixed(8);
    };
});