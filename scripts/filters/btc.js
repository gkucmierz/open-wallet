'use strict';

angular.module('walletApp')
.filter('btc', function () {
    return function (input) {
        var vol = parseInt(input) * 1e-8;
        return isNaN(vol) ? '-' : vol.toFixed(8);
    };
});