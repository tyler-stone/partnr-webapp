module.exports = ['$scope', '$rootScope','$state', '$stateParams', '$log','$q', 'projects', 'applications', 'principal', 'toaster', function($scope, $rootScope, $state, $stateParams, $log, $q, projects, applications, principal, toaster) {
	$scope.project = {};
	$scope.applications = [];
	$scope.isOwner = false;

	$scope.loadComplete = false;
	var loadSteps = 2;
	var loadStepsAchieved = 0;

	applications.list({'project' : $stateParams.project_id}).then(function(result) {
		$scope.applications = result.data;
		doLoadStep();
	});

	projects.get($stateParams.project_id).then(function(result) {
		$scope.project = result.data;
		$scope.isOwner = result.data.owner.id === principal.getUser().id;
		doLoadStep();
	});

	$scope.doAccept = function(application) {
		applications.accept(application.id);
		toaster.success("Application Accepted!");
    mixpanel.track($scope.$root.env + ':project.application.accept');
		$scope.doReload();
	};

	$scope.doReject = function(application) {
		applications.reject(application.id);
		toaster.success("Application Rejected.");
    mixpanel.track($scope.$root.env + ':project.application.reject');
		$scope.doReload();
	};

	$scope.doReload = function() {
		$scope.loadComplete = false;
		applications.list({'project' : $stateParams.project_id}).then(function(result) {
			$log.debug(result.data);
			$scope.applications = result.data;
			$scope.loadComplete = true;
		});
	};

	var doLoadStep = function() {
		loadStepsAchieved += 1;
		if (loadStepsAchieved >= loadSteps) {
			$scope.loadComplete = true;
		}
	};
}];
