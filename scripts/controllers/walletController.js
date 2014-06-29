'use strict';

angular.module('walletApp')
.controller('WalletController', function($scope) {

    $scope.wallet = [];

    $scope.addAddress = function() {
        $scope.wallet.push({
            address: $scope.address
        });
    };
});
