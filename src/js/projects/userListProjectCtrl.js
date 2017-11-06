module.exports = ['$scope', '$state', '$log', '$q', 'projects', 'principal', 'toaster', function($scope, $state, $log, $q, projects, principal, toaster) {
    $scope.projects = [];
    $scope.loadComplete = false;

    projects.listByUser(principal.getUser().id).then(function(result) {
        $scope.projects = result.data;
        $scope.loadComplete = true;
    });
}];
