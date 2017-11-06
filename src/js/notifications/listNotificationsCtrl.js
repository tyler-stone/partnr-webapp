module.exports = ['$scope', '$state', '$stateParams', '$log', 'notifications', 'routeUtils', function($scope, $state, $stateParams, $log, notifications, routeUtils) {
    $scope.loadComplete = true;
    $scope.notifications = notifications;
    $scope.allNotifications = notifications.get();

    $scope.resolveLink = function(n) {
        routeUtils.resolveEntityLinkAndGo(n.links.notifier, n, notifications.linkParamResolveStrategy);
    };

    $scope.$on("notifications", function(event, notificationList) {
        $log.debug(notificationList);

        $scope.allNotifications = notificationList;
        $scope.readNotifications = angular.copy($scope.allNotifications);
        for (var i = 0; i < $scope.readNotifications.length; i++) {
            if ($scope.readNotifications[i].read === false) {
                notifications.setRead($scope.readNotifications[i].id);
            }
        }
    });
}];
