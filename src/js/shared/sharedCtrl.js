module.exports = ['$rootScope', '$scope', '$state', '$stateParams', '$log', '$q', 'notifications', 'routeUtils', 'principal', 'users', function($rootScope, $scope, $state, $stateParams, $log, $q, notifications, routeUtils, principal, users) {
    $scope.newNotifications = {};
    $scope.allNotifications = {};

    $scope.$on('notifications', function(event, updatedNotifications) {
        $scope.allNotifications = updatedNotifications;
        $scope.newNotifications = notifications.getNew();
    });

    $scope.$on('Avatar_Update', function() {
        $scope.getUserAvatar();
        $log.debug('[HEADER] avatar update');
    });

    $scope.getUserAvatar = function() {
        $log.debug("Getting user avatar");
        users.getUserInfo().then(function(response) {
            $scope.avatarURL = "url(" + response.data.links.avatar + ")";
        });
    };

    $scope.doLogout = function() {
        principal.logout().then(function() {
            mixpanel.track($scope.$root.env + ':logout');
            $state.go('login');
        });
    };

    $scope.doViewProfile = function() {
        $state.go('user', { id: principal.getUser().id });
    };

    $scope.resolveLink = function(n) {
        routeUtils.resolveEntityLinkAndGo(n.links.notifier, n, notifications.linkParamResolveStrategy);
    };

    $scope.setRead = function(open) {
        if (!open) {
            $log.debug('setting read');
            $scope.readNotifications = angular.copy($scope.allNotifications);

            var totalRead = ($scope.readNotifications.length > 10 ? 10 : $scope.readNotifications.length);
            for (var i = 0; i < totalRead; i++) {
                if ($scope.readNotifications[i].read === false) {
                    notifications.setRead($scope.readNotifications[i].id);
                }
            }
        }
    };
}];
