'use strict';

angular.module('walletApp').directive('bulkAdd', function (
    PathGeneratorService
) {

    return {
        restrict: 'C',
        templateUrl: PathGeneratorService.getView('wallet', 'bulk-add'),
        scope: {},
        link: function() {
        }
    };
});
