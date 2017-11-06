module.exports =  ['$rootScope', '$state', function($rootScope, $state) {
    return {
        restrict: 'AE',
        templateUrl: '/projects/project_tile.html',
        scope: {
            project: '='
        },
        link: function($scope, elem, attr, ctrl) {
            $scope.$state = $state;
            console.log($scope.project);
            $scope.getProjectStatus = function(status) {
                if (status === 'not_started') {
                    return "Not Started";
                } else if (status === 'in_progress') {
                    return "In Progress";
                } else {
                    return "Complete";
                }
            };
        }
    };
}];
