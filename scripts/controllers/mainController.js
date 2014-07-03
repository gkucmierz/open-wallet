'use strict';

angular.module('walletApp')
.controller('MainController', function($scope, $translate) {

    $scope.setTranslation = function(lang) {
        localStorage.lang = lang;
        $translate.use(localStorage.lang);
    };
});
