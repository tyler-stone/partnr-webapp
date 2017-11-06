module.exports = ['$rootScope', '$http', '$log', 'principal', function($rootScope, $http, $log, principal) {
    return {
        get: function(id) {
            $log.debug('[PROJECT] Sending get request for project ' + id);
            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'projects/' + id,
                headers: principal.getHeaders()
            });
        },

        listByUser: function(id) {
            $log.debug('[PROJECT] Sending list for user');
            $log.debug(id);

            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'projects',
                headers: principal.getHeaders(),
                params: { user: id }
            });
        },

        list: function() {
            $log.debug('[PROJECT] Sending list request');

            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'projects',
                headers: principal.getHeaders()
            });
        },

        create: function(project) {
            $log.debug("[PROJECT] Sending create request");

            project.append("owner", principal.getUser().id);
            $log.debug(project);

            return $http({
                method: 'POST',
                url: $rootScope.apiRoute + 'projects',
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity,
                data: project
            });
        },

        update: function(project) {
            $log.debug("[PROJECT] Sending update request");
            $log.debug(project);

            return $http({
                method: 'PUT',
                url: $rootScope.apiRoute + 'projects/' + project.get('id'),
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity,
                data: project
            });
        },

        delete: function(id) {
            $log.debug("[PROJECT] Sending delete request");

            return $http({
                method: 'DELETE',
                url: $rootScope.apiRoute + 'projects/' + id,
                headers: principal.getHeaders()
            });
        }
    };
}];
