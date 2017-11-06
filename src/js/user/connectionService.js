module.exports = ['$rootScope', '$http', '$log', 'principal', function($rootScope, $http, $log, principal) {
    return {
        getMyConnections: function() {
            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'connections',
                headers: principal.getHeaders()
            });
        },

        getMyRequests: function() {
            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'connections/requests',
                headers: principal.getHeaders()
            });
        },

        get: function(userId) {
            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'connections',
                headers: principal.getHeaders(),
                data: { 'user': userId }
            });
        },

        create: function(userId) {
            return $http({
                method: 'POST',
                url: $rootScope.apiRoute + 'connections',
                headers: principal.getHeaders(),
                data: { 'connection': userId }
            });
        },

        update: function(id, status) {
            return $http({
                method: 'PUT',
                url: $rootScope.apiRoute + 'connections/' + id,
                headers: principal.getHeaders(),
                data: { 'status': status }
            });
        },

        updateByUser: function(userId, status) {
            return $http({
                method: 'PUT',
                url: $rootScope.apiRoute + 'connections',
                headers: principal.getHeaders(),
                data: { 'status': status, 'user': userId }
            });
        },

        delete: function(id) {
            return $http({
                method: 'DELETE',
                url: $rootScope.apiRoute + 'connections/' + id,
                headers: principal.getHeaders()
            });
        },

        deleteByUser: function(userId) {
            return $http({
                method: 'DELETE',
                url: $rootScope.apiRoute + 'connections',
                headers: principal.getHeaders(),
                data: { 'user': userId }
            });
        }
    };
}];
