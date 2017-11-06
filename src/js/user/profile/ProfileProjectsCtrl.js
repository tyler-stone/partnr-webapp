module.exports = ['$scope', '$rootScope', '$state', '$stateParams', '$log', 'toaster', 'projects', function($scope, $rootScope, $state, $stateParams, $log, toaster, projects) {
    $scope.loadComplete = false;
    $scope.user = null;
    $scope.projects = [];

    $scope.$parent.getProfileWrapperInfo().then(function(result) {
        $scope.user = result;
        projects.listByUser($scope.user.id).then(function(projects) {
            $scope.projects = projects;
            $scope.loadComplete = true;
            $scope.$broadcast('masonry.reload');
        });
    });
}];
