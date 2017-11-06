module.exports = ['$rootScope', '$http', '$log', 'principal', function($rootScope, $http, $log, principal) {
    return {
        getAllUsers: function(per_page, page) {
            $log.debug("[USER] Sending GET all users request", per_page);
            var per_pageExt = "";
            var pageExt = "";
            if (per_page) {
                per_pageExt = '?per_page=' + per_page;
            }
            if (page) {
                pageExt = '& page=' + page;
            }

            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'users/' + per_pageExt + pageExt,
                headers: principal.getHeaders()
            });
        },
        get: function(id) {
            $log.debug("[USER] Sending GET request");

            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'users/' + id,
                headers: principal.getHeaders()
            });
        },
        getUserInfo: function(id) {
            $log.debug("[USER] Sending GET user request");
            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'users/me',
                headers: principal.getHeaders()
            });
        },

        create: function(acct) {
            $log.debug("[USER] Sending Create request");
            $log.debug(acct);


            return $http({
                method: 'POST',
                url: $rootScope.apiBase + 'users',
                headers: principal.getHeadersWithCsrf(),
                withCredentials: true,
                data: { "user": acct }
            });
        },

        sendPasswordResetRequest: function(email) {
            $log.debug("[USER] Sending reset password request");
            $log.debug(email);

            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'users/passwords/reset',
                headers: principal.getHeadersWithCsrf(),
                params: { "email": email }
            });
        },

        resetPassword: function(token, password, confirmPassword) {
            $log.debug("[USER] Sending new password");

            return $http({
                method: 'PUT',
                url: $rootScope.apiRoute + 'users/passwords/reset',
                headers: principal.getHeadersWithCsrf(),
                data: {
                    "reset_password_token": token,
                    "password": password,
                    "password_confirmation": confirmPassword
                }
            });
        },

        postAvatar: function(avatar) {
            $log.debug("[USER] Sending avatar post request");
            return $http({
                method: 'POST',
                url: $rootScope.apiRoute + 'users/avatar',
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined },
                data: avatar
            });
        },

        updateName: function(firstName, lastName) {
            $log.debug("[USER] Sending name change request");
            return $http({
                method: 'PUT',
                url: $rootScope.apiRoute + 'users',
                headers: principal.getHeadersWithCsrf(),
                data: {
                    "first_name": firstName,
                    "last_name": lastName
                }
            });
        }
    };
}];
