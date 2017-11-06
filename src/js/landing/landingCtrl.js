module.exports = ['$scope','projects', function($scope, projects) {
    $scope.projects = [];
    $scope.loadComplete = false;

    projects.list().then(function(result) {
        $scope.projects = result.data;
        $scope.loadComplete = true;
    });
}];
