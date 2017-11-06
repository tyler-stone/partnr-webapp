module.exports = ['$scope', '$state', '$filter', '$stateParams', '$log', '$q', 'projects', 'milestones', 'tasks', 'principal', 'toaster', function($scope, $state, $filter, $stateParams, $log, $q, projects, milestones, tasks, principal, toaster) {
    $scope.project = {};
    $scope.searchText = '';
    $scope.tasks = [];
    $scope.milestones = [];
    $scope.milestoneTaskMap = [];
    $scope.viewingEntity = ($state.current.name.includes('task') ? 'Task' : 'Milestone');

    $scope.loadComplete = false;
    var loadSteps = 2;
    var loadStepsAchieved = 0;

    milestones.listByProject($stateParams.project_id).then(function(result) {
        $scope.milestones = result.data;
        doLoadStep();
    });

    tasks.listByProject($stateParams.project_id).then(function(result) {
        $scope.tasks = result.data;

        // Map tasks to a milestone
        for (var idx = 0; idx < $scope.tasks.length; idx++) {
            if ($scope.tasks[idx].milestone && $scope.tasks[idx].milestone.id) {
                if ($scope.milestoneTaskMap[$scope.tasks[idx].milestone.id] === undefined) {
                    $scope.milestoneTaskMap[$scope.tasks[idx].milestone.id] = [$scope.tasks[idx]];
                } else {
                    $scope.milestoneTaskMap[$scope.tasks[idx].milestone.id].push($scope.tasks[idx]);
                }
            }
        }

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
        for (var idx = 0; idx < $scope.milestones.length; idx++) {
            var milestone = $scope.milestones[idx];
            if ($scope.milestoneTaskMap[milestone.id] !== undefined) {
                milestone.tasksTotal = $scope.milestoneTaskMap[milestone.id].length;
                milestone.tasksComplete = $filter('filter')($scope.milestoneTaskMap[milestone.id], { status: 'complete' }).length;
            } else {
                milestone.tasksTotal = 0;
                milestone.tasksComplete = 0;
            }
        }
    };

    $scope.$on("taskUpdate", function() {
        syncTaskData();
    });

    $scope.newEntity = function() {
        if ($scope.viewingEntity === 'Milestone') {
            $state.go('project_milestone_create', { project_id: $stateParams.project_id });
        } else {
            $state.go('project_task_create', { project_id: $stateParams.project_id });
        }
    };
}];
