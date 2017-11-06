module.exports = ['$scope', '$state', '$filter', '$stateParams', '$log', '$q', 'projects', 'milestones', 'tasks', 'principal', 'toaster', function($scope, $state, $filter, $stateParams, $log, $q, projects, milestones, tasks, principal, toaster) {
    $scope.now = new Date();
    $scope.milestoneDate = null;

    $scope.project = {};
    $scope.searchText = '';
    $scope.tasks = [];
    $scope.milestone = {};
    $scope.tasksComplete = 0;

    $scope.loadComplete = false;
    var loadSteps = 2;
    var loadStepsAchieved = 0;

    milestones.get($stateParams.milestone_id).then(function(result) {
        $scope.milestone = result.data;
        $scope.milestoneDate = new Date($scope.milestone.due_date);
        doLoadStep();
    });

    tasks.listByProjectAndMilestone($stateParams.project_id, $stateParams.milestone_id).then(function(result) {
        $scope.tasks = result.data;
        doLoadStep();
    });

    var doLoadStep = function() {
        loadStepsAchieved += 1;
        if (loadStepsAchieved >= loadSteps) {
            $scope.loadComplete = true;
            syncTaskData();
        }
    };

    var syncTaskData = function() {
        // Sync the task and milestone data
        $scope.tasksComplete = $filter('filter')($scope.tasks, { status: 'complete' }).length;
    };

    $scope.$on("taskUpdate", function() {
        syncTaskData();
    });

    $scope.newTask = function() {
        $state.go('project_task_create', { project_id: $stateParams.project_id, mref: $scope.milestone.id });
    };
}];
