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
		$scope.checkBalances();
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
		var pick = function(obj, prop) {
                return obj[prop];
            };
		var check = function(){
				var row = $scope.$storage.wallet[i];
				var url = pattern.replace('%address%', row.address);

				$http({method: 'GET', url: url})
				.success(function(data) {
					row.received = pick(data, 'total_received');
					row.sent = pick(data, 'total_sent');
					row.balance = row.received - row.sent;
				})
				.error(function() {
					row.received = 'err';
					row.sent = 'err';
					row.balance = 'err';
				});
			};
		
		for(i in $scope.$storage.wallet){
			check();	
		}	
    };

    $scope.sumBalances = function(type) {
        type = type || 'balance';
        return _.reduce($scope.$storage.wallet, function(sum, row) {
            var val = row[type]+0 ? row[type] : 0;
            return sum + val;
        }, 0);
    };
});
