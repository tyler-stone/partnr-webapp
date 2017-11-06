module.exports = ['$rootScope', '$http', '$log', '$q', 'toaster', function($rootScope, $http, $log, $q, toaster) {
    var identityPrechecked = false;

    var user;
    var authenticated = false;
    var csrfToken;

    function fetchCsrf() {
        $log.debug("[AUTH] Requesting CSRF from server");
        /* Gets the csrf token from the user */
        var deferred = $q.defer();

        $http.get($rootScope.apiBase + 'users/sign_in')
            .success(function(data, status, headers, config) {
                if (data.csrfToken) {
                    csrfToken = data.csrfToken;
                    $log.debug('[AUTH] CSRF token acquired from server');
                    $log.debug(data.csrfToken);
                    deferred.resolve();
                }
            })
            .error(function(data, status, headers, config) {
                $log.error('[AUTH] CSRF request failure');
                deferred.resolve();
            });

        return deferred.promise;
    }

    function setCsrf(csrf) {
        csrfToken = csrf;
    }

    function getHeaders() {
        return {
            'Content-Type': 'application/json'
        };
    }

    function getHeadersWithCsrf() {
        var deferred = $q.defer();

        return {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
        };
    }

    function authenticate(dataUser) {
        /* Set all user data */
        user = dataUser;

        /** FOR NOW, ALL USERS ARE SUPERUSERS **/
        user.roles = ['Admin'];
        /** REMOVE FOR ROLE-BASED AUTH **/

        authenticated = true;
        $log.debug('[AUTH] User authenticated');
        $log.debug(user);

        $rootScope.$broadcast('auth', {
            status: 'login_success'
        });
    }

    return {
        fetchCsrf: fetchCsrf,
        getHeaders: getHeaders,
        getHeadersWithCsrf: getHeadersWithCsrf,
        identity: function(force) {
            /* This function will check for an existing session and
               if so, a request will check the validity of that session
               and store the resulting user value if it's still valid
            */
            $log.debug('[AUTH] Identity Pre-checked: ' + identityPrechecked);
            var deferred = $q.defer();
            if (!user && !identityPrechecked || force) {
                $log.debug('[AUTH] Checking if user session exists');
                $http({
                        method: 'GET',
                        url: $rootScope.apiRoute + 'users/me'
                    }).success(function(data, status, headers, config) {
                        if (data.email) {
                            $log.debug('[AUTH] Cookie valid, storing user data');
                            authenticate(data);
                            identityPrechecked = true;
                            deferred.resolve(user);
                        } else {
                            $log.debug('[AUTH] No preset user');
                            deferred.resolve();
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $log.error('[AUTH] Request to server failed');
                        deferred.resolve();
                    });
            } else {
                deferred.resolve();
            }

            identityPrechecked = true;
            return deferred.promise;
        },

        login: function(email, password) {
            /* Send login request to server */
            $log.debug('[AUTH] About to log in...');
            var deferred = $q.defer();

            fetchCsrf().then(function() {
                var request = {
                    'user': {
                        'email': email,
                        'password': password
                    }
                };

                $log.debug(getHeaders());
                $log.debug(request);

                $http({
                        method: 'POST',
                        url: $rootScope.apiBase + 'users/sign_in',
                        headers: {
                            'X-CSRF-Token': csrfToken,
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true,
                        data: request
                    })
                    .success(function(data, status, headers, config) {
                        if (data.user) {
                            $log.debug(data);
                            var newUser = data.user;
                            newUser.last_login = data.last_sign_in_at;
                            authenticate(newUser);
                            deferred.resolve(true);
                        } else {
                            $log.error('[AUTH] Log in failure');
                            toaster.error("Invalid email/password");
                            deferred.resolve(false);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $log.error('[AUTH] Log in failure');
                        toaster.error("Invalid email/password");
                        deferred.resolve(false);
                    });
            });

            return deferred.promise;
        },

        logout: function() {
            /* Send logout request to server */
            $log.debug('[AUTH] Logging out...');
            $log.debug(getHeaders());

            var deferred = $q.defer();

            fetchCsrf().then(function() {
                $http({
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-Token': csrfToken,
                        'Content-Type': 'application/json'
                    },
                    url: $rootScope.apiBase + 'users/sign_out'
                }).success(function(data, status, headers, config) {
                    user = undefined;
                    authenticated = false;
                    identityPrechecked = false;
                    fetchCsrf();
                    $log.debug('[AUTH] User signed out');

                    $rootScope.$broadcast('auth', {
                        status: 'logout_success'
                    });

                    deferred.resolve(true);
                }).error(function(data, status, headers, config) {
                    $log.error('[AUTH] Log out error');
                    toaster.error("Could not connect to server");
                    deferred.resolve(false);
                });
            });

            return deferred.promise;
        },

        hasUser: function() {
            return angular.isDefined(user);
        },

        getUser: function() {
            return user;
        },
        updateUserName: function(firstName, lastName) {
            user.first_name = firstName;
            user.last_name = lastName;
        },

        hasRole: function(role) {
            /* checks to see if a user has a specified role */
            if (!authenticated || !user.roles) return false;

            return user.roles.indexOf(role) != -1;
        },

        hasAnyRole: function(roles) {
            /* checks to see if a user has any of the specified roles */
            if (!authenticated || !user.roles) return false;

            for (var i = 0; i < roles.length; i++) {
                if (this.hasRole(roles[i])) return true;
            }

            return false;
        },

        isAuthenticated: function() {
            return authenticated;
        }
    };
}];
