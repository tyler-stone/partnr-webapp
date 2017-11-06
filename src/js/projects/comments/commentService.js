module.exports =  ['$rootScope', '$http', '$log', 'principal', function($rootScope, $http, $log, principal) {
	return {
		get : function(id) {
			$log.debug("[PROJECT COMMENT] Sending Get request");
			$log.debug(id);

			return $http({
				method: 'GET',
				url: $rootScope.apiRoute + 'comments/' + id,
				headers: principal.getHeaders()
			});
		},

		create : function(comment) {
			$log.debug("[PROJECT COMMENT] Sending Create request");
			$log.debug(comment);

			return $http({
				method: 'POST',
				url: $rootScope.apiRoute + 'comments',
				headers: principal.getHeaders(),
				data: comment
			});
		},

		update : function(comment) {
			$log.debug("[PROJECT COMMENT] Sending update request");
			$log.debug(comment);

			return $http({
				method: 'PUT',
				url: $rootScope.apiRoute + 'comments/' + comment.id,
				headers: principal.getHeaders(),
				data: comment
			});
		},

		delete : function(id) {
			$log.debug("[PROJECT COMMENT] Sending delete request");
			$log.debug(id);

			return $http({
				method: 'DELETE',
				url: $rootScope.apiRoute + 'comments/' + id,
				headers: principal.getHeaders()
			});
		},

		isValid : function(comment) {
			return (comment.content.length > 0);
		}
	};
}];
