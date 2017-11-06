module.exports = ['$rootScope', '$http', '$log', 'principal', function($rootScope, $http, $log, principal) {
    return {
        get: function(id) {
            $log.debug('[PROFILE] Sending get request for project ' + id);
            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'projects/' + id,
                headers: principal.getHeaders()
            });
        },

        addLocation: function(location) {
            $log.debug("[PROFILE] Sending location create request");
            $log.debug(location);

            return $http({
                method: 'POST',
                url: $rootScope.apiRoute + 'profiles/locations',
                headers: principal.getHeaders(),
                data: { "geo_string": location }
            });
        },

        addItem: function(item, entityName) {
            $log.debug("[PROFILE] Sending " + entityName + " create request");
            $log.debug(item);

            var entity = entityName + 's';

            return $http({
                method: 'POST',
                url: $rootScope.apiRoute + 'profiles/' + entity,
                headers: principal.getHeaders(),
                data: item
            });
        },

        updateItem: function(id, item, entityName) {
            $log.debug("[PROFILE] Sending " + entityName + " update request");
            $log.debug(item);

            var entity = entityName + 's';

            return $http({
                method: 'PUT',
                url: $rootScope.apiRoute + 'profiles/' + entity + '/' + id,
                headers: principal.getHeaders(),
                data: item
            });
        },

        deleteItem: function(id, entityName) {
            $log.debug("[PROFILE] Sending " + entityName + " delete request");

            var entity = entityName + 's';

            return $http({
                method: 'DELETE',
                url: $rootScope.apiRoute + 'profiles/' + entity + '/' + id,
                headers: principal.getHeaders()
            });
        },

        addSchool: function(school) {
            $log.debug("[PROFILE] Sending school create request");
            $log.debug(school);

            return $http({
                method: 'POST',
                url: $rootScope.apiRoute + 'profiles/schools',
                headers: principal.getHeaders(),
                data: school
            });
        },

        addPosition: function(position) {
            $log.debug("[PROFILE] Sending position create request");
            $log.debug(position);

            return $http({
                method: 'POST',
                url: $rootScope.apiRoute + 'profiles/positions',
                headers: principal.getHeaders(),
                data: position
            });
        },

        addInterest: function(interest) {
            $log.debug("[PROFILE] Sending interest create request");
            $log.debug(interest);

            return $http({
                method: 'POST',
                url: $rootScope.apiRoute + 'profiles/interests',
                headers: principal.getHeaders(),
                data: interest
            });
        },

        isValidItem: function(item, entityName) {
            switch (entityName) {
                case "location":
                    return this.isValidLocation(item);
                case "school":
                    return this.isValidSchool(item);
                case "position":
                    return this.isValidPosition(item);
                case "interest":
                    return this.isValidInterest(item);
            }
        },

        isValidLocation: function(location) {
            return (location.length > 0);
        },

        isValidSchool: function(school) {
            return (school.school_name.length > 0 &&
                school.grad_year.length >= 0 &&
                school.grad_year.length <= 4);
        },

        isValidPosition: function(position) {
            return (position.title.length > 0 &&
                position.company.length > 0);
        },

        isValidInterest: function(interest) {
            return (interest.title.length > 0);
        }
    };
}];
