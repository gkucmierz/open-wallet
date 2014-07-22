'use strict';

angular.module('walletApp')
.controller('WalletController', function(
    $scope,
    WalletDataService
) {

    $scope.wallet = WalletDataService.data;

    $scope.sortByBalance = function() {
        $scope.wallet = $scope.wallet.sort(function(entryA, entryB) {
            var balance = {
                a: entryA.balance || 0,
                b: entryB.balance || 0
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

    $scope.deleteEntry = function(entry) {
        WalletDataService.deleteRow(entry);
    };

    $scope.checkBalances = function() {
        WalletDataService.checkBalances();
    };

    $scope.sumBalances = function(type) {
        return WalletDataService.getSum(type);
    };

});
