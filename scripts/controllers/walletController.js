'use strict';

angular.module('walletApp')
.controller('WalletController', function($scope, $timeout, $localStorage, BitcoinDataService) {

    $scope.$storage = $localStorage.$default({
        wallet: [
            {address: '1grzes2zcfyRHcmXDLwnXiEuYBH7eqNVh'}
        ]
    });

    var findAddressRow = function(address) {
        var wallet = $scope.$storage.wallet;
        for (var i = 0, l = wallet.length; i < l; ++i) {
            if (wallet[i].address === address) return wallet[i];
        }
        return false;
    };

    $scope.addAddress = function() {
        var addressRow = findAddressRow($scope.address);
        if (!addressRow) {
            $scope.$storage.wallet.push({
                address: $scope.address
            });
        } else {
            addressRow.blink = true;
            $timeout(function() {
                delete addressRow.blink;
            }, 0);
        }
    };

    $scope.deleteRow = function(row) {
        var index = $scope.$storage.wallet.indexOf(row);
        if (index !== -1) {
            $scope.$storage.wallet.splice(index, 1);
        }
    };

    $scope.checkBalances = function() {
        var i = 0;

        (function loop() {
            var row = $scope.$storage.wallet[i++];
            if (i > $scope.$storage.wallet.length) return;

            BitcoinDataService.getBalance(row.address)
            .then(function(data) {
                _.extend(row, data);
                loop();
            }, function() {
                --i;
                loop();
            });
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
