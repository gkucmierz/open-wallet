'use strict';

angular.module('walletApp').service('WalletDataService', function(
    StorageService,
    UtilsService,
    UndoActionService
) {
    var storageKey = 'wallet';
    var data;

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

    data = decompress(StorageService.default(storageKey, compress([
        {address: '1grzes2zcfyRHcmXDLwnXiEuYBH7eqNVh'}
    ])));

    return {
        getSum: function(property) {
            property = property || 'balance';
            return _.reduce(data, function(sum, row) {
                var val = row[property]+0 ? row[property] : 0;
                return sum + val;
            }, 0);
        },
        deleteRow: function(row) {
            var _this = this;
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
        save: function() {
            StorageService.set(storageKey, compress(data));
        },
        data: data
    };
});
