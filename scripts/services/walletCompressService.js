'use strict';

angular.module('walletApp').service('WalletCompressService', function(
    WalletEntryService
) {
    
    return {
        // a = address
        // r = received
        // s = sent
        // p = privkey
        compress: function(data) {
            return _.map(data, function(fullEntry) {
                var res = {
                    a: fullEntry.address
                };

                if (!_.isUndefined(fullEntry.received)) res.r = fullEntry.received;
                if (!_.isUndefined(fullEntry.sent)) res.s = fullEntry.sent;
                if (!_.isUndefined(fullEntry.privkey)) {
                    delete res.a;
                    res.p = fullEntry.privkey;
                }

                return res;
            });
        },
        decompress: function(data) {
            return _.map(data, function(smallEntry) {
                var res = {};

                if (!_.isUndefined(smallEntry.a)) res.address = smallEntry.a;
                if (!_.isUndefined(smallEntry.p)) res.privkey = smallEntry.p;
                if (!_.isUndefined(smallEntry.r)) res.received = smallEntry.r;
                if (!_.isUndefined(smallEntry.s)) res.sent = smallEntry.s;
                if (!_.isUndefined(smallEntry.r) && !_.isUndefined(smallEntry.s)) {
                    res.balance = smallEntry.r - smallEntry.s;
                }
                WalletEntryService.determineType(res);
                WalletEntryService.recalculateParticulars(res);

                return res;
            });
        }
    };
});
