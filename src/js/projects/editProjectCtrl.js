module.exports = ['$scope', '$state', '$stateParams', '$log', '$q', '$filter', 'projects', 'applications', 'roles', 'principal', 'toaster', 'modals', '$rootScope', function($scope, $state, $stateParams, $log, $q, $filter, projects, applications, roles, principal, toaster, modals, $rootScope) {
    $scope.project = {
        status: 'not_started'
    };
    $scope.isOwner = false;
    $scope.loadComplete = false;
    $scope.newRoles = [];
    $scope.rolesToDelete = [];
    $scope.updatedPhoto = null;

    $scope.$parent.getProjectWrapperInfo().then(function(result) {
        $log.debug(result);
        $scope.project = result.project;
        $scope.isOwner = result.isOwner;
        $scope.loadComplete = true;
    });


    $scope.changeCoverPhoto = function(image) {
        var file = image.files[0];
        $scope.updatedPhoto = file;

    };

    $scope.addRole = function() {
        $scope.newRoles.push({
            title: "Add a title...",
            project: $scope.project.id
        });
    };

    $scope.deleteNewRole = function(index) {
        $scope.newRoles.splice(index, 1);
    };

    $scope.deleteRole = function(id) {
        var role = $filter('filter')(
            $scope.project.roles,
            function(d) {
                return d.id === id;
            })[0];
        var roleIndex = $scope.project.roles.indexOf(role);
        $scope.project.roles.splice(roleIndex, 1);
        $scope.rolesToDelete.push(role);
    };

    $scope.deleteProject = function() {
        modals.confirm("Are you sure you want to delete this project? It cannot be undone.", function(result) {
            if (result) {
                projects.delete($scope.project.id).then(function(result) {
                    $state.go('user_project_list');
                    toaster.success('Project deleted');
                });
            }
        });
    };

    $scope.doSave = function() {
        var preparedProject = angular.copy($scope.project);
        delete preparedProject.owner;
        $scope.loadComplete = false;
        var fd = new FormData();
        fd.append('id', preparedProject.id);
        fd.append('title', preparedProject.title);
        fd.append('status', preparedProject.status);
        fd.append('description', preparedProject.description);
        if ($scope.updatedPhoto !== null) {
            fd.append('cover_photo', $scope.updatedPhoto);
        }

        var requests = [];
        requests.push(projects.update(fd).$promise);

        for (var i = 0; i < $scope.rolesToDelete.length; i++) {
            requests.push(roles.delete($scope.rolesToDelete[i].id).$promise);
        }

        for (var i = 0; i < $scope.newRoles.length; i++) {
            if (roles.isValid($scope.newRoles[i])) {
                requests.push(roles.create($scope.newRoles[i]).$promise);
            }
        }

        $q.all(requests).then(function(result) {
            if ($scope.updatedPhoto !== null) {
                $log.debug('[PROJECT] Sending Photo Update event');
                $rootScope.$broadcast('Photo_Update');
            }
            $log.debug(result);
            toaster.success("Project updated!");
            $state.go('project', { id: $scope.project.id });
            $scope.loadComplete = true;
        });
    };
}];
