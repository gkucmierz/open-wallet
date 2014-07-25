'use strict';

angular.module('walletApp').service('EventListenerService', function() {

    return function(eventNames) {
        var events = {};
        
        for (var i = 0; i < eventNames.length; ++i) {
            events[eventNames[i]] = [];
        }

        return {
            add: function(eventName, fn) {
                var i = events[eventName].push(fn) - 1;
                return {
                    detach: function() {
                        delete events[eventName][i];
                    }
                };
            },
            once: function(eventName, fn) {
                var originalEvent = this.add(eventName, fn);
                var helperEvent = this.add(eventName, function() {
                    originalEvent.detach();
                    helperEvent.detach();
                });
            },
            remove: function(eventName, fn) {
                delete events[eventName][
                    events[eventName].indexOf(fn)
                ];
            },
            emit: function(eventName) {
                var arg = [].slice.call(arguments, 1);
                var res = [];
                for (var i in events[eventName]) {
                    if (events[eventName].hasOwnProperty(i)) {
                        res.push(events[eventName][i].apply(this, arg));
                    }
                }
                return res;
            }
        };
    };
});

