'use strict';

angular.module('walletApp').service('WalletDataService', function(
    $q,
    $timeout,
    StorageService,
    UtilsService,
    UndoActionService,
    BitcoinDataService,
    BitcoreService,
    WalletEntryService
) {
    var storageKey = 'wallet';
    var data, _this;

    var compress = function(data) {
        return _.map(data, function(fullEntry) {
            var res = {
                a: fullEntry.address
            };
            if (!_.isUndefined(fullEntry.received)) res.r = fullEntry.received;
            if (!_.isUndefined(fullEntry.sent)) res.s = fullEntry.sent;
            return res;
        });
    };

    var decompress = function(data) {
        return _.map(data, function(smallEntry) {
            var res = {
                address: smallEntry.a
            };
            if (!_.isUndefined(smallEntry.r)) res.received = smallEntry.r;
            if (!_.isUndefined(smallEntry.s)) res.sent = smallEntry.s;
            if (!_.isUndefined(smallEntry.r) && !_.isUndefined(smallEntry.s)) {
                res.balance = smallEntry.r - smallEntry.s;
            }
            WalletEntryService.determineType(res);

            return res;
        });
    };

    var isValidAddress = function(address) {
        var addr = new BitcoreService.Address(address);
        return addr.isValid();
    };

    var findAddress = function(address) {
        for (var i = 0, l = data.length; i < l; ++i) {
            if (data[i].address === address) return data[i];
        }
        return false;
    };

    var updateAddressBalance = function(entry) {
        var deferred = $q.defer();
        var maxAttemps = 3; // TODO: make config

        entry.loading = true;

        var stopLoading = function() {
            delete entry.loading;
        };

        (function loop() {
            BitcoinDataService.getBalance(entry.address).then(function(data) {
                _.extend(entry, data);
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

    var privkeyToAddress = function(privkey) {
        var opts = {
            network: BitcoreService.networks.livenet
        };
        try {
            var wk = new BitcoreService.WalletKey(opts);
            wk.fromObj({ priv: privkey });
            var address = BitcoreService.Address.fromKey(wk.privKey) + '';
            return address;
        } catch (e) {
            return false;
        }
    };

    var addPrivkey = function(privkey) {
        var address = privkeyToAddress(privkey);
        var walletEntry;

        if (addAddress(address)) {
            walletEntry = findAddress(address);
            walletEntry.privkey = privkey;
            WalletEntryService.determineType(walletEntry);
        }
    };

    var addAddress = function(address) {
        var walletEntry = findAddress(address);
        var newEntry;

        if (!!walletEntry) {
            // address exists in wallet
            walletEntry.blink = true;
            $timeout(function() {
                delete walletEntry.blink;
            }, 0);
            return false;
        }
        
        newEntry = {
            address: address
        };
        data.push(newEntry);
        _this.save();

        WalletEntryService.determineType(newEntry);
        updateAddressBalance(newEntry);

        return true;
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
            return _.reduce(data, function(sum, entry) {
                var val = entry[property]+0 ? entry[property] : 0;
                return sum + val;
            }, 0);
        },
        deleteRow: function(entry) {
            var index = data.indexOf(entry);
            if (index === -1) return UtilsService.noop;

            UndoActionService.doAction(function() {
                data.splice(index, 1);
                _this.save();
                return {
                    reverse: function() {
                        data.splice(index, 0, entry);
                        _this.save();
                    },
                    translationKey: 'DELETE_WALLET_ENTRY'
                };
            });
        },
        addEntry: function(inputEntry) {
            var address = privkeyToAddress(inputEntry);

            // check if it is privkey
            if (address !== false) {
                addPrivkey(inputEntry);
                return true;
            }
            // or address…
            if (isValidAddress(inputEntry)) {
                addAddress(inputEntry);
                return true;
            }
            return false;
        },
        addAddresses: function(addresses) {
            _.map(addresses, function(address) {
                _this.addAddress(address);
            });
        },
        checkBalances: function() {
            var i = 0;

            (function loop() {
                var entry = data[i++];
                if (i > data.length) return;

                updateAddressBalance(entry).then(loop);
            })();
        },
        save: function() {
            StorageService.set(storageKey, compress(data));
        },
        data: data
    };
    return _this;
});
