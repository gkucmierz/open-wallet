'use strict';

angular.module('walletApp').service('PathGeneratorService', function() {
    var templatesUrl = 'templates';
    var templatesExtension = '.html';

    var path = function() {
        return _.toArray(arguments).join('/');
    };

    return {
        getDirective: function(name) {
            return path(templatesUrl, 'directives', name + templatesExtension);
        }
    };
});
