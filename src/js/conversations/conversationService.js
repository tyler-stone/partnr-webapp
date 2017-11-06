module.exports = ['$rootScope', '$http', '$log', 'principal', function($rootScope, $http, $log, principal) {
    return {

        list: function() {
            $log.debug('[CONVERSATION] Sending list request');

            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'conversations',
                headers: principal.getHeaders()
            });
        },

        get: function(id) {
            $log.debug('[CONVERSATION] Sending get request for conversation ' + id);
            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'conversations/' + id,
                headers: principal.getHeaders()
            });
        },

        getByProject: function(id) {
            $log.debug('[CONVERSATION] Sending get request based on project ' + id);
            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'conversations',
                params: {
                    'project': id
                },
                headers: principal.getHeaders()
            });
        },

        create: function(conversation) {
            $log.debug('[CONVERSATION] Sending create request');
            $log.debug(conversation);

            return $http({
                method: 'POST',
                url: $rootScope.apiRoute + 'conversations',
                headers: principal.getHeaders(),
                data: conversation
            });
        },
        addMessage: function(id, message) {
            $log.debug('[CONVERSATION] Sending add message request');
            $log.debug(message);

            return $http({
                method: 'PUT',
                url: $rootScope.apiRoute + 'conversations/' + id,
                headers: principal.getHeaders(),
                data: {
                    'message': message
                }
            });
        },
        changeIsRead: function(id, isRead) {
            $log.debug('[CONVERSATION] Sending change read status request');
            $log.debug(isRead);

            return $http({
                method: 'PUT',
                url: $rootScope.apiRoute + 'conversations/' + id,
                headers: principal.getHeaders(),
                data: {
                    'is_read': isRead
                }
            });
        }
    };
}];
