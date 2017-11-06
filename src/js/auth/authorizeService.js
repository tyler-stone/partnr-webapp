module.exports =  ['$rootScope', '$state', '$log', '$q', 'principal',function($rootScope, $state, $log, $q, principal) {
  return {
    authorize: function() {
      var deferred = $q.defer();
      // first check for existing session
      principal.identity().then(function() {
          var isAuthenticated = principal.isAuthenticated();

          $log.debug("[AUTH] Authorizing page access...");
          $log.debug("[AUTH] Authenticated: " + isAuthenticated);
          $log.debug("[AUTH] Roles Required: ");
          if ($rootScope.toState.data.roles) {
            $log.debug($rootScope.toState.data.roles);
          } else {
            $log.debug('None');
          }

          /* If the app state has roles associated with it
             and the user isn't a member of those roles */
          if ($rootScope.toState.data.roles &&
            $rootScope.toState.data.roles.length > 0 &&
            !principal.hasAnyRole($rootScope.toState.data.roles)) {

            $log.debug("[AUTH] User is not authorized to view this page");

            // do nothing for now, no restricted page built yet
            // if (isAuthenticated) {
            //     $log.debug("[AUTH] Redirecting user to restricted page");
            // } else {
            //     $log.debug("[AUTH] Redirecting user to login page");
            // }
            deferred.resolve(false);
          } else {
            $log.debug("[AUTH] User is authorized to view this page");
            deferred.resolve(true);
          }
        });
      return deferred.promise;
    }
  };
}];
