module.exports = ['$rootScope', '$scope', '$log', '$state', '$q', 'principal', 'toaster', function($rootScope, $scope, $log, $state, $q, principal, toaster) {
    $scope.email = '';
    $scope.password = '';
    $scope.loading = false;

    if (principal.isAuthenticated()) {
        $state.go('home.feed');
    }

    $scope.doLogin = function() {
        try {
            if ($scope.email.length > 0 && $scope.password.length > 0) {
                $scope.loading = true;
                principal.login($scope.email, $scope.password).then(function(loggedIn) {
                    if (loggedIn) {
                        var user = principal.getUser();
                        mixpanel.track($scope.$root.env + ':login');
                        if (user.last_login !== null || user.last_login !== undefined) {
                            $state.go('home.feed');
                        } else {
                            $state.go('profile_create');
                        }
                    }
                    $scope.loading = false;
                });
            } else {
                throw "non valid email/password";
            }
        } catch (error) {
            var toastContent;
            if (error === "non valid email/password") {
                toastContent = "Please enter a valid email/password";
            } else {
                toastContent = "Something went wrong. Please try again later.";
            }
            toaster.warn(toastContent);
        }
    };
}];
