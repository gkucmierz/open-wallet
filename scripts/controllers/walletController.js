'use strict';

angular.module('walletApp')
.controller('WalletController', function($scope, $http, $localStorage) {

    $scope.$storage = $localStorage.$default({
        wallet: [
            {address: '1grzes2zcfyRHcmXDLwnXiEuYBH7eqNVh'}
        ]
    });

    $scope.addAddress = function() {
        $scope.$storage.wallet.push({
            address: $scope.address
        });
    };

    $scope.deleteRow = function(row) {
        var index = $scope.$storage.wallet.indexOf(row);
        if (index !== -1) {
            $scope.$storage.wallet.splice(index, 1);
        }
    };

    $scope.checkBalances = function() {
        var pattern = 'http://www.corsproxy.com/blockchain.info/address/%address%?format=json';
        var i = 0;

        (function loop() {
            var row = $scope.$storage.wallet[i++];
            if (i > $scope.$storage.wallet.length) return;

            var url = pattern.replace('%address%', row.address);

            $http({method: 'GET', url: url})
            .success(function(data, status, headers, config) {
                row.received = data.total_received;
                row.sent = data.total_sent;
                row.balance = row.received - row.sent;
                loop();
            })
            .error(function(data, status, headers, config) {
                --i;
                loop(); // try again
            });
        })();
    };

    $scope.sumBalances = function(type) {
        type = type || 'balance';
        return _.reduce($scope.$storage.wallet, function(sum, row) {
            return sum + row[type];
        }, 0);
    };
});
