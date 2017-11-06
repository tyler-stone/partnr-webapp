module.exports = ['$rootScope', '$http', '$log', 'principal', function($rootScope, $http, $log, principal) {
    return {
        list: function(filters) {
            $log.debug("[APPLICATION] Sending get request");
            $log.debug(filters);

            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'applications',
                params: filters,
                headers: principal.getHeaders()
            });
        },

        create: function(application) {
            $log.debug("[APPLICATION] Sending create request");
            $log.debug(application);

            return $http({
                method: 'POST',
                url: $rootScope.apiRoute + 'applications',
                headers: principal.getHeaders(),
                data: application
            });
        },

        accept: function(id) {
            $log.debug("[APPLICATION] Sending accept update");
            $log.debug(id);

            return $http({
                method: 'PUT',
                url: $rootScope.apiRoute + 'applications/' + id,
                headers: principal.getHeaders(),
                data: {
                    "id": id,
                    "status": "accepted"
                }
            });
        },

        reject: function(id) {
            $log.debug("[APPLICATION] Sending delete request");
            $log.debug(id);

            return $http({
                method: 'DELETE',
                url: $rootScope.apiRoute + 'applications/' + id,
                headers: principal.getHeaders()
            });
        }
    };
}];
