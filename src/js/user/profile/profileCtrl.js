module.exports =  ['$scope', '$state', '$stateParams', '$log', 'toaster', 'users', function($scope, $state, $stateParams, $log, toaster, users) {
	$scope.loadComplete = false;
	$scope.user = null;

	users.get($stateParams.id).then(function(result) {
		$log.debug(result.data);
		$scope.user = result.data;
		$scope.loadComplete = true;
	});
}];
