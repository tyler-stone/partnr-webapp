module.exports = ['$scope', '$rootScope', '$state', '$log', '$q', '$timeout', 'projects', 'roles', 'principal', 'toaster', function($scope, $rootScope, $state, $log, $q, $timeout, projects, roles, principal, toaster) {
    $scope.step = 1;
    $scope.coverPhoto = null;
    $scope.project = {
        title: '',
        description: ''
    };

    $scope.ownerRole = { title: '' };
    $scope.roles = [{ title: '' }];
    $scope.loading = false;
    $scope.stepNames = [
        "Basic Info",
        "Your Role",
        "More Roles",
        "Cover Photo",
        "Finished"
    ];

    $scope.rolePlaceholders = [
        "Engineer",
        "Project Manager",
        "Botanist",
        "Programmer",
        "Designer",
        "Electrician",
        "Fabricator",
        "CAD Specialist",
        "Bounty Hunter"
    ];

    $scope.validateProject = function() {
        return ($scope.project.title.length > 0);
    };

    $scope.validateOwnerRole = function() {
        return roles.isValid($scope.ownerRole);
    };

    $scope.validateRole = function(role) {
        return roles.isValid(role);
    };

    var creationFailCallback = function() {
        $scope.loading = false;
        toaster.error("Project could not be created. Please try again.");
    };

    $scope.addCoverPhoto = function(image) {
        var file = image.files[0];
        $scope.coverPhoto = file;
    };

    $scope.stepUp = function() {
        $scope.step++;

        if ($scope.step === 5) {
            $scope.loading = true;
            $scope.doProjectCreate().then(function() {
                $scope.processOwnerRole().then(function() {
                    $scope.processAdditionalRoles().then(function() {
                        $scope.loading = false;
                    });
                }, creationFailCallback);
            }, creationFailCallback);
        }
    };

    $scope.stepDown = function() {
        $scope.step--;
    };

    $scope.doProjectCreate = function() {
        var deferred = $q.defer();
        var fd = new FormData();
        fd.append('id', $scope.project.id);
        fd.append('title', $scope.project.title);
        fd.append('description', $scope.project.description);
        if ($scope.coverPhoto !== null) {
            fd.append('cover_photo', $scope.coverPhoto);
        }
        if ($scope.validateProject()) {
            projects.create(fd).then(function(result) {
                $log.debug(result.data);
                if (result.data.id) {
                    $scope.project = result.data;
                    deferred.resolve();
                    mixpanel.track($scope.$root.env + ':project.create');
                } else {
                    $log.debug("[PROJECT] Create error");
                    if (result.data.error) { $log.debug(result.data.error); }
                    deferred.reject();
                }
            });
        } else {
            deferred.reject();
        }

        return deferred.promise;
    };

    $scope.processOwnerRole = function() {
        var deferred = $q.defer();

        if ($scope.validateOwnerRole()) {
            $scope.ownerRole.project = $scope.project.id;
            roles.create($scope.ownerRole).then(function(result) {
                if (result.data.id) {
                    $scope.ownerRole = result.data;
                    $scope.ownerRole.user = principal.getUser().id;
                    roles.update($scope.ownerRole).then(function() {
                        deferred.resolve();
                    });
                } else {
                    $log.debug("[PROJECT ROLE] Create error");
                    if (result.data.error) { $log.debug(result.data.error); }
                    deferred.reject();
                }
            });
        } else {
            deferred.reject();
        }

        return deferred.promise;
    };

    $scope.addRole = function() {
        $scope.roles.push({ title: '' });
    };

    $scope.processAdditionalRoles = function() {
        var deferred = $q.defer();
        var cleanedRoles = [];
        var rolesProcessed = 0;

        for (var i = 0; i < $scope.roles.length; i++) {
            var curRole = $scope.roles[i];
            if ($scope.validateRole(curRole)) {
                curRole.project = $scope.project.id;
                cleanedRoles.push(curRole);
            }
        }

        for (var i = 0; i < cleanedRoles.length; i++) {
            roles.create(cleanedRoles[i]).then(function(result) {
                rolesProcessed += 1;

                if (rolesProcessed === cleanedRoles.length) {
                    deferred.resolve();
                    $timeout(function() {
                        $state.go('project', { project_id: $scope.project.id });
                        toaster.success('Project created!');
                    }, 1000);
                }
            });
        }

        if (cleanedRoles.length === 0) {
            deferred.resolve();
            $timeout(function() {
                $state.go('project', { project_id: $scope.project.id });
                toaster.success('Project created!');
            }, 1000);
        }

        return deferred.promise;
    };
}];
