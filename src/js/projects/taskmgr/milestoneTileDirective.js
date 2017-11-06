module.exports = ['$rootScope', '$state', function($rootScope, $state) {
    return {
        restrict: 'AE',
        templateUrl: '/projects/taskmgr/milestone_tile.html',
        scope: {
            milestone: '='
        },
        link: function($scope, elem, attr, ctrl) {
            $scope.$state = $state;
        }
    };
}];
