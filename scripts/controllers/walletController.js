'use strict';

angular.module('walletApp')
.controller('WalletController', function(
    $q,
    $scope,
    $timeout,
    $localStorage,
    BitcoinDataService,
    BitcoreService,
    UtilsService,
    UndoActionService,
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

    var findAddressRow = function(address) {
        var wallet = $scope.wallet;
        for (var i = 0, l = wallet.length; i < l; ++i) {
            if (wallet[i].address === address) return wallet[i];
        }
        return false;
    };

    var isValidAddress = function(address) {
        var addr = new BitcoreService.Address(address);
        return addr.isValid();
    };

    $scope.sortByBalance = function() {
        $scope.wallet = $scope.wallet.sort(function(rowA, rowB) {
            var balance = {
                a: rowA.balance || 0,
                b: rowB.balance || 0
            };
            return balance.b - balance.a;
        });
    };

    $scope.addAddresses = function(addresses) {
        _.map(addresses, function(row) {
            $scope.wallet.push(row);
            updateAddressBalance(row);
        });
    };

    $scope.addAddress = function() {
        var addressRow = findAddressRow($scope.address);
        var row;
        if (!isValidAddress($scope.address)) {
            // address is invalid
            $scope.address = '';

        } else if (!!addressRow) {
            // address exists in wallet
            addressRow.blink = true;
            $timeout(function() {
                delete addressRow.blink;
            }, 0);
        } else {
            row = {
                address: $scope.address
            };
            $scope.wallet.push(row);
            updateAddressBalance(row);
        }
    };

    $scope.deleteRow = function(row) {
        var index = $scope.wallet.indexOf(row);
        if (index === -1) return UtilsService.noop;

        UndoActionService.doAction(function() {
            $scope.wallet.splice(index, 1);
            return {
                reverse: function() {
                    $scope.wallet.splice(index, 0, row);
                },
                translationKey: 'DELETE_WALLET_ENTRY'
            };
        });
    };

    $scope.checkBalances = function() {
        var i = 0;

        (function loop() {
            var row = $scope.wallet[i++];
            if (i > $scope.wallet.length) return;

            updateAddressBalance(row).then(loop);
        })();
    };

    $scope.sumBalances = function(type) {
        type = type || 'balance';
        return _.reduce($scope.wallet, function(sum, row) {
            var val = row[type]+0 ? row[type] : 0;
            return sum + val;
        }, 0);
    };

});
