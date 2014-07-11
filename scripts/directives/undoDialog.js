'use strict';

angular.module('walletApp').directive('undoDialog', function (
    PathGeneratorService
) {
    return {
        restrict: 'A',
        templateUrl: PathGeneratorService.getDirective('undo-dialog'),
        scope: {},
        link: function(scope) {

            scope.undos = [{
                action: 'action'
            }, {
                action: 'action 2'
            }];

        }
    };
});
