'use strict';

angular.module('walletApp').directive('undoDialog', function (
    PathGeneratorService,
    UndoActionService
) {

    return {
        restrict: 'C',
        templateUrl: PathGeneratorService.getDirective('undo-dialog'),
        scope: {},
        link: function(scope) {
            scope.undos = [];

            scope.doUndo = function(undo) {
                var index = scope.undos.indexOf(undo);

                if (index !== -1) {
                    scope.undos.splice(index, 1);

                    undo.reverse();
                }
            };

            UndoActionService.registerDialog(scope);
        }
    };
});
