module.exports = ['$rootScope', '$http', '$log', 'principal', function($rootScope, $http, $log, principal) {
    return {
        list: function(page) {
            page |= 0;
            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'feeds',
                params: { page: page },
                headers: principal.getHeaders()
            });
        },

        listUserActivity: function(uid, page) {
            page |= 0;
            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'walls/' + uid,
                params: { page: page },
                headers: principal.getHeaders()
            });
        },
    };
}];
