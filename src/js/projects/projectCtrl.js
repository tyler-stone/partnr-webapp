module.exports = ['$scope', '$state', '$stateParams', '$log', '$q', 'projects', 'applications', 'principal', 'toaster', 'modals', 'roles', function($scope, $state, $stateParams, $log, $q, projects, applications, principal, toaster, modals, roles) {
    $scope.project = {};
    $scope.canApply = false;
    $scope.isOwner = false;
    $scope.isMember = false;
    $scope.canPost = false;
    $scope.loadComplete = false;
    $scope.user = principal.getUser();
    var loadSteps = 1;
    var loadStepsAchieved = 0;

    var doLoadStep = function() {
        loadStepsAchieved += 1;
        if (loadStepsAchieved === loadSteps) {
            $scope.loadComplete = true;
        }
    };

    var hasRole = function(project, userId) {
        var hasRole = false;
        for (var i = 0; i < project.roles.length; i++) {
            hasRole |= (project.roles[i].user && project.roles[i].user.id === userId);
        }
        return hasRole;
    };

    $scope.doApply = function(role) {
        applications.create({ role: role }).then(function(result) {
            toaster.success('Request sent!');
            mixpanel.track($scope.$root.env + ':project.application.create');
        });
        $scope.canApply = false;
    };

    $scope.doRemoveUser = function(role) {
        modals.confirm("Are you sure you want to remove the user from this role? It cannot be undone.", function(result) {
            if (result) {
                roles.update({ id: role.id, user: null }).then(function(res) {
                    toaster.success('Removed user from role.');
                    role.user = null;
                });
            }
        });
        role.canRemoveUser = false;
    };

    $scope.getStatus = function() {
        var result = 'Not Started';
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
        return result;
    };

    $scope.$parent.getProjectWrapperInfo().then(function(result) {
        $log.debug(result);
        $scope.project = result.project;
        $scope.isOwner = result.isOwner;
        $scope.isMember = result.isMember;
        $scope.canPost = ($scope.user ? true : false);

        $scope.project.roles.forEach(function(role) {
            role.canRemoveUser = !!role.user && !!$scope.user && ($scope.isOwner || role.user.id === $scope.user.id);
        });

        if ($scope.user) {
            $log.debug('got user');
            applications.list({ 'project': $stateParams.project_id, 'user': $scope.user.id }).then(function(result) {
                if (result.data.length > 0 || hasRole($scope.project, $scope.user.id) || $scope.isMember || $scope.isOwner) {
                    $scope.canApply = false;
                } else {
                    $scope.canApply = true;
                }
            });
        } else {
            $scope.canApply = false;
        }

        doLoadStep();
    });
}];
