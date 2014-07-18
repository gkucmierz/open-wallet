'use strict';

angular.module('walletApp')
.controller('WalletController', function(
    $scope,
    WalletDataService
) {

    $scope.wallet = WalletDataService.data;

    $scope.sortByBalance = function() {
        $scope.wallet = $scope.wallet.sort(function(rowA, rowB) {
            var balance = {
                a: rowA.balance || 0,
                b: rowB.balance || 0
            };
            return balance.b - balance.a;
        });
        WalletDataService.save();
    };

    $scope.addAddresses = function(addresses) {
        WalletDataService.addAddresses(addresses);
    };

    $scope.addAddress = function() {
        WalletDataService.addAddress($scope.address);
    };

    $scope.deleteRow = function(row) {
        WalletDataService.deleteRow(row);
    };

    $scope.checkBalances = function() {
        WalletDataService.checkBalances();
    };

    $scope.sumBalances = function(type) {
        return WalletDataService.getSum(type);
    };

});
