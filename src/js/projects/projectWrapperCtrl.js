module.exports = ['$scope', '$state', '$stateParams', '$log', '$q', 'principal', 'projects', function($scope, $state, $stateParams, $log, $q, principal, projects) {
    $scope.loadComplete = false;
    $scope.isMember = false;
    $scope.isOwner = false;
    $scope.canApply = false;
    $scope.projectId = $stateParams.project_id;
    $scope.user = principal.getUser();
    $scope.project = null;

    $scope.$on('Photo_Update', function() {
        $log.debug('[PROJECT] Receiving Photo Update event');
        $scope.initialize();
    });

    console.log($stateParams);

    $scope.getProject = function(project) {
        return $scope.project;
    };

    $scope.getIsMember = function() {
        return $scope.isMember;
    };

    $scope.getIsOwner = function() {
        return $scope.isOwner;
    };

    $scope.getCanApply = function() {
        return $scope.canApply;
    };

    $scope.initialize = function() {
        var deferred = $q.defer();

        projects.get($stateParams.project_id).then(function(result) {
            $log.debug(result.data);
            $scope.project = result.data;

            if ($scope.user) {
                if (result.data.owner.id === principal.getUser().id) {
                    $scope.isOwner = true;
                    $scope.isMember = true;
                    $scope.canApply = false;
                }

                for (var i = 0; i < result.data.roles.length; i++) {
                    if (result.data.roles[i].user !== null) {
                        if (result.data.roles[i].user.id === principal.getUser().id) {
                            $scope.canApply = false;
                            $scope.isMember = true;
                            break;
                        }
                    }
                }
            } else {
                $scope.isOwner = false;
                $scope.isMember = false;
                $scope.canApply = false;
            }

            $scope.loadComplete = true;
            deferred.resolve({
                project: $scope.project,
                isOwner: $scope.isOwner,
                isMember: $scope.isMember,
                canApply: $scope.canApply
            });
        });

        return deferred.promise;
    };

    $scope.getProjectWrapperInfo = function() {
        var deferred = $q.defer();
        if ($scope.project !== null) {
            deferred.resolve({
                project: $scope.project,
                isOwner: $scope.isOwner,
                isMember: $scope.isMember,
                canApply: $scope.canApply
            });
        } else {
            $scope.initialize().then(function(result) {
                deferred.resolve(result);
            });
        }
        return deferred.promise;
    };

    $scope.getStatus = function() {
        var result = 'Not Started';

        if ($scope.project) {
            switch ($scope.project.status) {
                case 'not_started':
                    result = "Not Started";
                    break;
                case 'in_progress':
                    result = "In Progress";
                    break;
                case "complete":
                    result = "Completed";
                    break;
            }
        }

        return result;
    };

    $scope.initialize();
}];
