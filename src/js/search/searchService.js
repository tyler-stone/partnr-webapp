module.exports = ['$rootScope', '$http', '$log', 'principal', function($rootScope, $http, $log, principal) {
	return {
		createNew : function() {
			return {
				keywords: "",
				result: {},
				queried: false
			};
		},

    query : function(keywords, entities) {
      if(!Array.prototype.isPrototypeOf(entities))
        entities = [];
      $log.debug('[SEARCH] Sending get request for entities ' + entities + ' and keywords ' + keywords);

      return $http({
        method: 'GET',
        url: $rootScope.apiRoute + 'search',
        headers: principal.getHeaders(),
        params: { query: keywords, 'entities[]': entities }
      });
    },

		queryProjects : function(keywords) {
			$log.debug('[SEARCH] Sending get request for projects with keywords ' + keywords);
			return $http({
				method: 'GET',
				url: $rootScope.apiRoute + 'search',
				headers: principal.getHeaders(),
				params: { entities: ['Project'], query: keywords }
			});
		},

		queryRoles : function(keywords) {
			$log.debug('[SEARCH] Sending get request for roles with keywords ' + keywords);

			return $http({
				method: 'GET',
				url: $rootScope.apiRoute + 'search',
				headers: principal.getHeaders(),
				params: { entities: ['Role'], query: keywords }
			});
		}
	};
}];
