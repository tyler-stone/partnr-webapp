module.exports = ['$scope', '$rootScope', '$state', '$stateParams', '$log', 'users', function($scope, $rootScope, $state, $stateParams, $log, users) {
    $scope.loadComplete = false;
    $scope.user = null;
    $scope.connections = [];

    $scope.$parent.getProfileWrapperInfo().then(function(result) {
        $scope.user = result;
        users.getConnections($scope.user.id).then(function(res) {
            $scope.connections.push(res.data);
            $scope.loadComplete = true;
        });
    });
}];
