'use strict';

angular.module('walletApp').directive('bulkAdd', function (
    $timeout,
    PathGeneratorService,
    BitcoinUtilsService
) {
    // https://en.bitcoin.it/wiki/Address
    // A Bitcoin address, or simply address, is an identifier of 27-34 alphanumeric characters, beginning with the number 1 or 3, that represents a possible destination for a Bitcoin payment.
    var bitcoinAddressRegExp = /[1-3][a-zA-Z0-9]{26,33}/g;
    var maxUnblockingTime = 30;

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
                scope.processing = true;

                setTimeout(function() {
                    var uniquePotentialAddresses = _.unique(inputText.match(bitcoinAddressRegExp));
                    var allEntries = [];

                    var i = 0;
                    var l = uniquePotentialAddresses.length;
                    var t = {
                        last: new Date()
                    };
                    (function loop() {
                        var address;
                        t.last = new Date();

                        do {
                            address = uniquePotentialAddresses[i++];
                            if (BitcoinUtilsService.isValidAddress(address)) {
                                allEntries.push({
                                    address: address
                                });
                            }
                            t.current = new Date();
                        } while (i < l && t.current - t.last < maxUnblockingTime);

                        if (i < l) {
                            setTimeout(loop, 0);
                        } else {
                            $timeout(function() {
                                scope.processing = false;
                                scope.foundEntries = allEntries;
                            }, 0);
                        }
                    })();
                }, 0);
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
                updateAddressesList(inputText);
            });

            scope.$watch('adding', function(adding) {
                if (adding === true) {
                    $('textarea', element).focus();
                }
            });

        }
    };
});
