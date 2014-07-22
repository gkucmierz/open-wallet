'use strict';

angular.module('walletApp').service('WalletEntryService', function() {
    var ENTRY_TYPES = {
        ADDRESS: 0,
        PRIVKEY: 1,
        ENCRYPTED_PRIVKEY: 2
    };

    return {
        determineType: function(entry) {
            if (!_.isUndefined( entry.encryptedPrivkey )) {
                entry.type = ENTRY_TYPES.ENCRYPTED_PRIVKEY;
            } else if (!_.isUndefined( entry.privkey )) {
                entry.type = ENTRY_TYPES.PRIVKEY;
            } else if (!_.isUndefined( entry.address )) {
                entry.type = ENTRY_TYPES.ADDRESS;
            }
        }
    };
});
