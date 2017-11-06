module.exports = ['$scope', '$state','$rootScope', '$stateParams', '$log', '$q', '$timeout', 'milestones', 'principal', 'modals', 'toaster', function($scope, $state, $rootScope, $stateParams, $log, $q, $timeout, milestones, principal, modals, toaster) {
    $scope.milestone = {
        title: '',
        due_date: '',
        project: $stateParams.project_id
    };

    $scope.crudState = ($state.current.name.includes('create') ? 'create' : 'edit');
    $scope.loadComplete = false;
    $scope.formLoading = false;

    if ($scope.crudState === 'edit') {
        milestones.get($stateParams.milestone_id).then(function(result) {
            $log.debug(result.data);
            $scope.milestone = result.data;
            $scope.loadComplete = true;
        });
    } else {
        $scope.loadComplete = true;
    }

    var creationFailCallback = function() {
        $scope.formLoading = false;
        toaster.error("Milestone could not be created. Please try again.");
    };

    $scope.createMilestone = function() {
        $scope.formLoading = true;

        if ($scope.milestone.due_date === '') {
            delete $scope.milestone.due_date;
        }

        milestones.create($scope.milestone).then(function(result) {
            $scope.formLoading = false;

            if (result.data.id) {
                mixpanel.track($scope.$root.env + ':project.taskmgr.milestone.create');
                $state.go('project_milestones', { project_id: $stateParams.project_id });
            }
        }, creationFailCallback);
    };

    $scope.saveMilestone = function() {
        $scope.formLoading = true;
        milestones.update($scope.milestone).then(function(result) {
            $scope.formLoading = false;

            if (result.data.id) {
                mixpanel.track($scope.$root.env + ':project.taskmgr.milestone.update');
                $state.go('project_milestones');
            }
        });
    };

    $scope.delete = function() {
        modals.confirm("Are you sure you want to delete this milestone?", function(result) {
            if (result) {
                $scope.formLoading = true;
                milestones.delete($scope.milestone.id).then(function() {
                    $scope.formLoading = false;
                    mixpanel.track($scope.$root.env + ':project.taskmgr.milestone.delete');
                    $state.go('project_milestones');
                });
            }
        });
    };

    $scope.reset = function() {
        $scope.milestone.title = '';
        $scope.milestone.due_date = '';
    };
}];
