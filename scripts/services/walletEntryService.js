'use strict';

angular.module('walletApp').service('WalletEntryService', function(
    $timeout,
    BitcoinUtilsService,
    UtilsService
) {
    var ENTRY_TYPES = {
        ADDRESS: 0,
        PRIVKEY: 1,
        ENCRYPTED_PRIVKEY: 2
    };

    return {
        ENTRY_TYPES: ENTRY_TYPES,
        determineType: function(entry) {
            if (!_.isUndefined( entry.encryptedPrivkey )) {
                entry.type = ENTRY_TYPES.ENCRYPTED_PRIVKEY;
            } else if (!_.isUndefined( entry.privkey )) {
                entry.type = ENTRY_TYPES.PRIVKEY;
            } else if (!_.isUndefined( entry.address )) {
                entry.type = ENTRY_TYPES.ADDRESS;
            }
        },
        recalculateParticulars: function(entry) {
            // calculate address from privkey
            if (_.isUndefined(entry.address)) {
                entry.address = BitcoinUtilsService.privkeyToAddress(entry.privkey);
            }
            // calculate balance
            if (!_.isUndefined(entry.received) && !_.isUndefined(entry.sent)) {
                entry.balance = entry.received - entry.sent;
            }
        },
        blink: function(entry, type) {
            var property = 'blink' + UtilsService.capitalize(type);
            
            entry[property] = true;
            $timeout(function() {
                delete entry[property];
            }, 50);
        },
        isPrivkey: function(entry) {
            return entry.type === ENTRY_TYPES.PRIVKEY;
        }
    };
});
