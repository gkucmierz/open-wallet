'use strict';

angular.module('walletApp')
.controller('MainController', function($scope, $translate) {

    $scope.setTranslation = function(lang) {
        $translate.use(lang);
    };
});
