module.exports = ['$scope', '$state', '$log', '$q', 'users', 'principal', 'toaster', function($scope, $state, $log, $q, users, principal, toaster) {
    $scope.acct = {
        email: "",
        first_name: "",
        last_name: "",
        password: ""
    };

    if (principal.isAuthenticated()) {
        $state.go('home.feed');
    }


    $scope.validate = function() {
        var result = ($scope.acct.email.length > 0 &&
            $scope.acct.first_name.length > 0 &&
            $scope.acct.last_name.length > 0 &&
            $scope.acct.password.length > 0);
        return result;
    };

    $scope.doCreateUser = function() {
        if ($scope.validate()) {
            users.create($scope.acct).then(function(data, status, headers, config) {
                $log.debug(data);
                if (data.data.id) {
                    mixpanel.track($scope.$root.env + ':signup');
                    $state.go('login');
                } else {
                    $log.debug("[USER] Create error");
                    if (data.error) { $log.debug(data.error); }
                    toaster.error("User could not be created.");
                }
            }, function(err) {
                var msg = [];
                var keys = Object.keys(err.data.errors);
                for (var i = 0; i < keys.length; i++) {
                    err.data.errors[keys[i]].forEach(function(errmsg) {
                        msg.push(keys[i] + " " + err.data.errors[keys[i]][0]);
                    });
                }
                msg.forEach(function(m) { toaster.error(m); });
            });
        } else {
            toaster.error("Please ensure that you entered data in all of the fields");
        }
    };
}];
