'use strict';

angular.module('walletApp').directive('bulkAdd', function (
    $timeout,
    PathGeneratorService
) {
    // https://en.bitcoin.it/wiki/Address
    // A Bitcoin address, or simply address, is an identifier of 27-34 alphanumeric characters, beginning with the number 1 or 3, that represents a possible destination for a Bitcoin payment.
    var bitcoinAddressRegExp = /[1-3][a-zA-Z0-9]{26,33}/g;

    // var isValidAddress = function(address) {
    //     var addr = new BitcoreService.Address(address);
    //     return addr.isValid();
    // };

    return {
        restrict: 'C',
        templateUrl: PathGeneratorService.getView('wallet', 'bulk-add'),
        scope: {
            addCallback: '='
        },
        link: function(scope, element) {
            scope.foundEntries = [];
            scope.inputText = '';

            var updateAddressesList = _.throttle(function(inputText) {
                var uniquePotentialAddresses = _.unique(inputText.match(bitcoinAddressRegExp));

                var allEntries = _.map(uniquePotentialAddresses, function(address) {
                    return {
                        address: address
                    };
                });

                scope.foundEntries = allEntries;
                // scope.foundEntries = _.filter(allEntries, function(entry) {
                //     return isValidAddress(entry.address);
                // });
            }, 5e2);

            scope.cancel = function() {
                scope.inputText = '';
                scope.adding = false;
            };

            scope.add = function() {
                var fetchedAddresses = _.map(scope.foundEntries, function(entry) {
                    return entry.address;
                });
                scope.addCallback(fetchedAddresses);
                scope.cancel();
            };

            scope.$watch('inputText', function(inputText) {
                $timeout(function() {
                    updateAddressesList(inputText);
                }, 0);
            });

            scope.$watch('adding', function(adding) {
                if (adding === true) {
                    $('textarea', element).focus();
                }
            });

        }
    };
});
