'use strict';

angular.module('walletApp').directive('i18nDialog', function (
    PathGeneratorService
) {
    
    return {
        restrict: 'C',
        templateUrl: PathGeneratorService.getDirective('i18n-dialog')
    };
});
