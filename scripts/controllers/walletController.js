'use strict';

angular.module('walletApp')
.controller('WalletController', function(
    $q,
    $scope,
    $timeout,
    $localStorage,
    BitcoinDataService,
    BitcoreService,
    WalletDataService
) {

    $scope.wallet = WalletDataService.data;

    var updateAddressBalance = function(row) {
        var deferred = $q.defer();
        var maxAttemps = 3;

        row.loading = true;

        var stopLoading = function() {
            delete row.loading;
        };

        (function loop() {
            BitcoinDataService.getBalance(row.address).then(function(data) {
                _.extend(row, data);
                WalletDataService.save();
                stopLoading();
                deferred.resolve();
            }, function() {
                if (--maxAttemps > 0) {
                    loop();
                } else {
                    stopLoading();
                    deferred.resolve();
                }
            });
        })();

        return deferred.promise;
    };

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
        _.map(addresses, function(row) {
            $scope.wallet.push(row);
            updateAddressBalance(row);
        });
        WalletDataService.save();
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
