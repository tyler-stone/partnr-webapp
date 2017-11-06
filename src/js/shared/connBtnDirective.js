module.exports = function(connections) {
    return {
        restrict: 'AE',
        template: "<div ng-include='contentUrl'></div>",
        scope: {
            connectionUser: '=user',
            btnSize: '=btnsize'
        },
        link: function($scope, elem) {
            if (!$scope.connectionUser || !$scope.connectionUser.connection_status) {
                $scope.contentUrl = 'shared/connection/connection_connect_btn.html';
            } else {
                if (!$scope.connectionUser.connection_status)
                    $scope.connectionUser.connection_status = 'connect';

                $scope.contentUrl = 'shared/connection/connection_' + $scope.connectionUser.connection_status + '_btn.html';
            }

            $scope.$on('user.updated', function(e, user) {
                if (!!user) {
                    $scope.connectionUser = user;
                    $scope.contentUrl = 'shared/connection/connection_' + $scope.connectionUser.connection_status + '_btn.html';
                }
            });

            $scope.sendRequest = function() {
                connections.create($scope.connectionUser.id).then(function(res) {
                    $scope.contentUrl = 'shared/connection/connection_requested_btn.html';
                });
            };

            $scope.deleteConnection = function() {
                connections.deleteByUser($scope.connectionUser.id).then(function(res) {
                    $scope.contentUrl = 'shared/connection/connection_connect_btn.html';
                });
            };

            $scope.approveRequest = function() {
                connections.updateByUser($scope.connectionUser.id, 'accepted').then(function(res) {
                    $scope.contentUrl = 'shared/connection/connection_connected_btn.html';
                });
            };
        }
    };
};
