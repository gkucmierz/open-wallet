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
    UndoActionService
) {

    $scope.$storage = $localStorage.$default({
        wallet: [
            {address: '1grzes2zcfyRHcmXDLwnXiEuYBH7eqNVh'}
        ]
    });

    var updateAddressBalance = function(row) {
        var deferred = $q.defer();
        var maxAttemps = 3;

        (function loop() {
            BitcoinDataService.getBalance(row.address).then(function(data) {
                _.extend(row, data);
                deferred.resolve();
            }, function() {
                if (--maxAttemps > 0) {
                    loop();
                } else {
                    deferred.resolve();
                }
            });
        })();

        return deferred.promise;
    };

    var findAddressRow = function(address) {
        var wallet = $scope.$storage.wallet;
        for (var i = 0, l = wallet.length; i < l; ++i) {
            if (wallet[i].address === address) return wallet[i];
        }
        return false;
    };

    var isValidAddress = function(address) {
        var addr = new BitcoreService.Address(address);
        return addr.isValid();
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
            $scope.$storage.wallet.push(row);
            updateAddressBalance(row);
        }
    };

    $scope.deleteRow = function(row) {
        var index = $scope.$storage.wallet.indexOf(row);
        if (index === -1) return UtilsService.noop;

        UndoActionService.doAction(function() {
            $scope.$storage.wallet.splice(index, 1);
            return {
                reverse: function() {
                    $scope.$storage.wallet.splice(index, 0, row);
                },
                translationKey: 'DELETE_WALLET_ENTRY'
            };
        });
    };

    $scope.checkBalances = function() {
        var i = 0;

        (function loop() {
            var row = $scope.$storage.wallet[i++];
            if (i > $scope.$storage.wallet.length) return;

            updateAddressBalance(row).then(loop);
        })();
    };

    $scope.sumBalances = function(type) {
        type = type || 'balance';
        return _.reduce($scope.$storage.wallet, function(sum, row) {
            var val = row[type]+0 ? row[type] : 0;
            return sum + val;
        }, 0);
    };

});
