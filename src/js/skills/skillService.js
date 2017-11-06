module.exports = ['$rootScope', '$http', '$log', 'principal', function($rootScope, $http, $log, principal) {
    return {
        listCategories: function(id) {
            $log.debug('[SKILL] Sending get request for categories');
            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'categories',
                headers: principal.getHeaders()
            });
        },

        get: function(id) {
            $log.debug('[SKILL] Sending get request for skill ' + id);
            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'skills/' + id,
                headers: principal.getHeaders()
            });
        },

        list: function() {
            $log.debug('[SKILL] Sending list request');

            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'skills',
                headers: principal.getHeaders()
            });
        },

        create: function(skill) {
            $log.debug("[SKILL] Sending create request");
            $log.debug(skill);

            return $http({
                method: 'POST',
                url: $rootScope.apiRoute + 'skills',
                headers: principal.getHeaders(),
                data: skill
            });
        },

        update: function(skill) {
            $log.debug("[SKILL] Sending update request");
            $log.debug(skill);

            return $http({
                method: 'PUT',
                url: $rootScope.apiRoute + 'skills/' + skill.id,
                headers: principal.getHeaders(),
                data: skill
            });
        },

        delete: function(id) {
            $log.debug("[SKILL] Sending delete request");

            return $http({
                method: 'DELETE',
                url: $rootScope.apiRoute + 'skills/' + id,
                headers: principal.getHeaders()
            });
        },

        hexToRgb: function(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
    };
}];
