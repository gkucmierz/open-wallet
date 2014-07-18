'use strict';

angular.module('walletApp').service('WalletDataService', function(
    $q,
    $timeout,
    StorageService,
    UtilsService,
    UndoActionService,
    BitcoinDataService,
    BitcoreService
) {
    var storageKey = 'wallet';
    var data, _this;

    var compress = function(data) {
        return _.map(data, function(fullRow) {
            var res = {
                a: fullRow.address
            };
            if (!_.isUndefined(fullRow.received)) res.r = fullRow.received;
            if (!_.isUndefined(fullRow.sent)) res.s = fullRow.sent;
            return res;
        });
    };

    var decompress = function(data) {
        return _.map(data, function(smallRow) {
            var res = {
                address: smallRow.a
            };
            if (!_.isUndefined(smallRow.r)) res.received = smallRow.r;
            if (!_.isUndefined(smallRow.s)) res.sent = smallRow.s;
            if (!_.isUndefined(smallRow.r) && !_.isUndefined(smallRow.s)) {
                res.balance = smallRow.r - smallRow.s;
            }
            return res;
        });
    };

    var isValidAddress = function(address) {
        var addr = new BitcoreService.Address(address);
        return addr.isValid();
    };

    var findAddressRow = function(address) {
        for (var i = 0, l = data.length; i < l; ++i) {
            if (data[i].address === address) return data[i];
        }
        return false;
    };

    var updateAddressBalance = function(row) {
        var deferred = $q.defer();
        var maxAttemps = 3; // TODO: make config

        row.loading = true;

        var stopLoading = function() {
            delete row.loading;
        };

        (function loop() {
            BitcoinDataService.getBalance(row.address).then(function(data) {
                _.extend(row, data);
                _this.save();

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

    (function() {
        // init
        data = decompress(StorageService.default(storageKey, compress([
            {address: '1grzes2zcfyRHcmXDLwnXiEuYBH7eqNVh'}
        ])));
    })();
    
    _this = {
        getSum: function(property) {
            property = property || 'balance';
            return _.reduce(data, function(sum, row) {
                var val = row[property]+0 ? row[property] : 0;
                return sum + val;
            }, 0);
        },
        deleteRow: function(row) {
            var index = data.indexOf(row);
            if (index === -1) return UtilsService.noop;

            UndoActionService.doAction(function() {
                data.splice(index, 1);
                _this.save();
                return {
                    reverse: function() {
                        data.splice(index, 0, row);
                        _this.save();
                    },
                    translationKey: 'DELETE_WALLET_ENTRY'
                };
            });
        },
        addAddress: function(address) {
            var addressRow = findAddressRow(address);
            var row;
            if (!isValidAddress(address)) {
                // address is invalid
                return false;
            } else if (!!addressRow) {
                // address exists in wallet
                addressRow.blink = true;
                $timeout(function() {
                    delete addressRow.blink;
                }, 0);
                return false;
            }
            
            row = {
                address: address
            };
            data.push(row);
            _this.save();

            updateAddressBalance(row);

            return true;
        },
        checkBalances: function() {
            var i = 0;

            (function loop() {
                var row = data[i++];
                if (i > data.length) return;

                updateAddressBalance(row).then(loop);
            })();
        },
        save: function() {
            StorageService.set(storageKey, compress(data));
        },
        data: data
    };
    return _this;
});
