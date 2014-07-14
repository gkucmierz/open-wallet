'use strict';

angular.module('walletApp')
.controller('MainController', function(
    $scope,
    $translate,
    PathGeneratorService
) {

    $scope.PathGeneratorService = PathGeneratorService;

    $scope.setTranslation = function(lang) {
        localStorage.lang = lang;
        $translate.use(localStorage.lang);
    };

});
