module.exports = ['$rootScope', '$http', '$log', 'principal', function($rootScope, $http, $log, principal) {
    return {
        get: function(id) {
            $log.debug("[PROJECT ROLE] Sending Get request");
            $log.debug(id);

            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'roles/' + id,
                headers: principal.getHeaders()
            });
        },

        create: function(role) {
            $log.debug("[PROJECT ROLE] Sending Create request");
            $log.debug(role);

            return $http({
                method: 'POST',
                url: $rootScope.apiRoute + 'roles',
                headers: principal.getHeaders(),
                data: role
            });
        },

        update: function(role) {
            $log.debug("[PROJECT ROLE] Sending update request");
            $log.debug(role);

            return $http({
                method: 'PUT',
                url: $rootScope.apiRoute + 'roles/' + role.id,
                headers: principal.getHeaders(),
                data: role
            });
        },

        delete: function(id) {
            $log.debug("[PROJECT ROLE] Sending delete request");
            $log.debug(id);

            return $http({
                method: 'DELETE',
                url: $rootScope.apiRoute + 'roles/' + id,
                headers: principal.getHeaders()
            });
        },

        isValid: function(role) {
            return (role.title.length > 0);
        }
    };
}];
