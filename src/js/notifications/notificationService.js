module.exports = ['$rootScope', '$http', '$log', '$q', '$timeout', 'principal', function($rootScope, $http, $log, $q, $timeout, principal) {
    var polling = false;
    var notifications = {};

    var poller = function(callback) {
        if (polling) {
            $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'notifications',
                headers: principal.getHeaders()
            }).then(function(result) {
                callback(result.data);

                if (polling) {
                    $timeout(function() {
                        poller(callback);
                    }, $rootScope.pollDuration);
                }
            });
        }
    };

    var processPollResult = function(result) {
        var old = notifications;
        notifications = result;

        for (var i = 0; i < notifications.length; i++) {
            notifications[i].parsedMessage = parse(notifications[i]);
        }

        if (angular.toJson(notifications) !== angular.toJson(old)) {
            $log.debug("[NOTIFICATIONS] new notifications");
            $log.debug(notifications);
            $rootScope.$broadcast('notifications', notifications);
        }
    };

    var enablePolling = function() {
        $log.debug("[NOTIFICATIONS] polling enabled");
        polling = true;
    };

    var disablePolling = function() {
        $log.debug("[NOTIFICATIONS] polling disabled");
        polling = false;
    };

    var parse = function(notification) {
        var result = notification.message;

        for (var k in notification.notifier) {
            if(!!notification.notifier[k] && 'title' in notification.notifier[k])
              result = result.replace('{' + k + '}', notification.notifier[k].title);
        }

        return result;
    };

    var linkParamResolveStrategy = function(apiLink, route, notification) {
        // documentation about this function can be found in routeUtils

        var deferred = $q.defer();

        if (Object.keys(route.params).length > 0) {
            for (var key in route.params) {
                if (key.indexOf("_") > -1) {
                    var pattern = new RegExp("^(\\w+)_(\\w+)$");
                    var matches = pattern.exec(key);

                    if (matches !== null) {
                        var dependencyName = matches[1];
                        var dependencyAttr = matches[2];

                        var attrValue = notification.notifier[dependencyName][dependencyAttr];
                        route.params[key] = attrValue;
                    } else {
                        $log.debug("[NOTIFICATIONS] Error parsing key: " + key);
                    }
                } else {
                    var pattern = new RegExp("^(\\w+)_?");
                    var matches = pattern.exec(route.name);

                    if (matches !== null) {
                        var parentEntity = matches[1];

                        if (notification.notifier[parentEntity] !== undefined) {
                            route.params[key] = notification.notifier[parentEntity][key];
                        } else {
                            $log.debug("[NOTIFICATIONS] Cannot find necessary value for entity: " + parentEntity);
                        }
                    } else {
                        $log.debug("[NOTIFICATIONS] Error parsing key: " + key);
                    }
                }

                if (route.params[key] === undefined) {
                    $log.debug("[NOTIFICATIONS] Error retrieving URL parameter for " + key + " from notification object");
                }
            }

            $log.debug("[NOTIFICATIONS] Route params resolved");
            $log.debug(route.params);

            deferred.resolve(route.params);
        } else {
            $log.debug("[NOTIFICATIONS] Route params resolved");
            $log.debug(route.params);
            deferred.resolve(route.params);
        }

        return deferred.promise;
    };

    $rootScope.$on('auth', function(event, eventData) {
        if (eventData.status === "login_success") {
            enablePolling();
            poller(processPollResult);
        } else if (eventData.status === "logout_success") {
            disablePolling();
            notifications = {};
        }
    });

    return {
        poller: poller,
        enablePolling: enablePolling,
        disablePolling: disablePolling,
        parse: parse,
        linkParamResolveStrategy: linkParamResolveStrategy,

        get: function() {
            return angular.copy(notifications);
        },

        getNew: function() {
            return notifications.filter(function(n) {
                return !(n.read);
            });
        },

        setRead: function(id) {
            $log.debug("[NOTIFICATIONS] Sending read request");
            $log.debug(id);

            return $http({
                method: 'PUT',
                url: $rootScope.apiRoute + 'notifications/' + id,
                headers: principal.getHeaders(),
                data: {
                    read: true
                }
            });
        }
    };
}];
