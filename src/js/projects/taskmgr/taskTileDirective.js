module.exports = ['$rootScope', '$state', 'tasks', function($rootScope, $state, tasks) {
    return {
        restrict: 'AE',
        templateUrl: '/projects/taskmgr/task_tile.html',
        scope: {
            task: '=',
            mref: '='
        },
        link: function($scope, elem, attr, ctrl) {
            $scope.$state = $state;

            $scope.completeTask = function() {
                if ($scope.task.status != 'complete') {
                    $scope.task.status = 'complete';
                    tasks.update($scope.task).then(function(result) {
                        if (!result.data.id) {
                            $scope.task.status = 'not_started';
                        } else {
                            $rootScope.$broadcast('taskUpdate', $scope.task);
                        }
                    });
                } else {
                    $scope.task.status = 'not_started';
                    tasks.update($scope.task).then(function(result) {
                        if (!result.data.id) {
                            $scope.task.status = 'complete';
                        } else {
                            $rootScope.$broadcast('taskUpdate', $scope.task);
                        }
                    });
                }
            };
        }
    };
}];
