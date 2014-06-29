'use strict';

angular.module('walletApp')
.controller('WalletController', function($scope) {

    $scope.wallet = [{
        address: '1grzes2zcfyRHcmXDLwnXiEuYBH7eqNVh'
    }];

    $scope.addAddress = function() {
        $scope.wallet.push({
            address: $scope.address
        });
    };
});
