module.exports = ['$rootScope', '$timeout', function($rootScope, $timeout) {
    return {
        restrict: 'AE',
        templateUrl: '/toaster/toasts.html',
        link: function($scope, elem, attr, ctrl) {
            $scope.toasts = [];
            $scope.$on('toast', function(event, toast) {
                $scope.toasts.push(toast);
                $timeout(function() {
                    $scope.closeAlert($scope.toasts.indexOf(toast));
                }, $rootScope.toastDuration);
            });
            $scope.closeAlert = function(index) {
                if (index > -1) {
                    $scope.toasts.splice(index, 1);
                }
            };
        }
    };
}];
