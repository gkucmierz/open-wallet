'use strict';

angular.module('walletApp').service('UndoActionService', function(
) {
    var isDialogConnected = false;
    var dialogScope;

    var getTranslationKey = function(undoName) {
        return 'UNDO_MESSAGES.' + undoName;
    };

    return {
        // every undoable action should be passed to this function
        // and should return function that can reverse changes
        doAction: function(fn) {
            var res,
                isResFunction,
                undoObj;

            if (isDialogConnected) {
                res = fn();
                isResFunction = _.isFunction(res);

                undoObj = {
                    reverse: isResFunction ? res : res.reverse,
                    translationKey: getTranslationKey(
                        isResFunction ? 'DEFAULT' : res.msgKey
                    )
                };

                dialogScope.undos.push(undoObj);
            } else {
                console.log('can`t run this action');
            }
        },
        registerDialog: function(scope) {
            if (!isDialogConnected) {
                isDialogConnected = true;
                dialogScope = scope;
            } else {
                console.log('dialog is connected now');
            }
        }
    };
});
