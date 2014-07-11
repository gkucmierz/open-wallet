'use strict';

angular.module('walletApp').directive('undoDialog', function (
    PathGeneratorService,
    UndoActionService
) {

    var removeUndo = function(undos, undo, callIt) {
        var index = undos.indexOf(undo);

        if (index !== -1) {
            undos.splice(index, 1);

            if (callIt) undo.reverse();
        }
    };

    return {
        restrict: 'C',
        templateUrl: PathGeneratorService.getDirective('undo-dialog'),
        scope: {},
        link: function(scope) {
            scope.undos = [];

            scope.removeUndo = function(undo) {
                removeUndo(scope.undos, undo, false);
            };

            scope.doUndo = function(undo) {
                removeUndo(scope.undos, undo, true);
            };

            UndoActionService.registerDialog(scope);
        }
    };
});
