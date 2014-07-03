'use strict';

angular.module('walletApp', [
    'pascalprecht.translate',
    'ngStorage'
]);

angular.module('walletApp')
.config(function($httpProvider, $translateProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/locale-',
        suffix: '.json'
    });

    localStorage.lang  = localStorage.lang || 'en';
    $translateProvider.preferredLanguage(localStorage.lang);
});
