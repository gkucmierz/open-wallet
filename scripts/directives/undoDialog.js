'use strict';

angular.module('walletApp').directive('undoDialog', function (
    PathGeneratorService
) {
    return {
        restrict: 'A',
        templateUrl: PathGeneratorService.getDirective('undo-dialog'),
        link: function postLink() {
        }
    };
});
