module.exports = ['$scope','$rootScope', '$state', '$stateParams', '$log', '$q', '$timeout', 'tasks', 'milestones', 'skills', 'principal', 'modals', 'toaster',function($scope, $rootScope, $state, $stateParams, $log, $q, $timeout, tasks, milestones, skills, principal, modals, toaster) {
    $scope.task = {
        title: '',
        description: '',
        status: 'not_started',
        milestone: null,
        project: $stateParams.project_id
    };
    $scope.crudState = ($state.current.name.includes('create') ? 'create' : 'edit');
    $scope.loadComplete = false;
    $scope.formLoading = false;
    $scope.skills = ($scope.task.skills ? $scope.task.skills : []);
    $scope.milestones = [];
    $scope.users = [];
    var loadSteps = 3;
    var loadStepsAchieved = 0;

    var doLoadStep = function() {
        loadStepsAchieved += 1;
        if (loadStepsAchieved === loadSteps) {
            $scope.loadComplete = true;
        }
    };

    if ($scope.crudState === 'edit') {
        tasks.get($stateParams.task_id).then(function(result) {
            $log.debug(result.data);
            $scope.task = result.data;
            $scope.task.milestone = ($scope.task.milestone ? $scope.task.milestone.id : null);
            $scope.task.user = ($scope.task.user ? $scope.task.user.id : null);
            doLoadStep();
        });
    } else {
        $scope.task.milestone = ($stateParams.mref ? parseInt($stateParams.mref) : null);
        doLoadStep();
    }

    milestones.listByProject($stateParams.project_id).then(function(result) {
        $scope.milestones = result.data;
        doLoadStep();
    });

    $scope.$parent.getProjectWrapperInfo().then(function(result) {
        $log.debug(result);
        $scope.project = result.project;
        for (var i = 0; i < result.project.roles.length; i++) {
            var role = result.project.roles[i];
            if (role.user && role.user.id) {
                $scope.users.push(role.user);
            }
        }

        doLoadStep();
    });

    var redirect = function() {
        if ($stateParams.mref) {
            $state.go('milestone', { milestone_id: $stateParams.mref });
        } else {
            $state.go('task');
        }
    };

    var creationFailCallback = function() {
        $scope.formLoading = false;
        toaster.error("Task could not be created. Please try again.");
    };

    var preProcessSkills = function(task) {
        var deferred = $q.defer();
        task.skills = (task.skills ? task.skills : []);
        $log.debug("[TASK] Preprocessing skills for task:");
        $log.debug(task);

        if (task.categories) {
            for (var i = 0; i < task.categories.length; i++) {
                task.categories[i] = task.categories[i].id;
            }
        }

        var promises = [];
        var existingSkills = [];

        for (var i = 0; i < $scope.skills.length; i++) {
            var catIdx = task.categories.findIndex(function(el) {
                return el === parseInt($scope.skills[i].category);
            });

            if (catIdx > -1) {
                if ($scope.skills[i].id) {
                    $log.debug("[TASK] Skill already exists in array, adding to existing skills");
                    $log.debug($scope.skills[i]);

                    existingSkills.push($scope.skills[i].id);
                } else {
                    $log.debug("[TASK] Adding skill to queue to be created");
                    $log.debug($scope.skills[i]);

                    promises.push(skills.create($scope.skills[i]));
                }
            }
        }

        if (promises.length > 0) {
            $q.all(promises).then(function(result) {
                $log.debug("[TASK] Skills created");
                $log.debug(result);
                task.skills = existingSkills;

                for (var i = 0; i < result.length; i++) {
                    task.skills.push(result[i].data.id);
                }
                $log.debug(task);
                deferred.resolve(task);
            }, creationFailCallback);
        } else {
            task.skills = existingSkills;
            $log.debug(task);
            deferred.resolve(task);
        }

        return deferred.promise;
    };

    $scope.$on('category::skill-selector::change', function(event, skills) {
        $scope.skills = [];
        for (var k in skills) {
            for (var i = 0; i < skills[k].length; i++) {
                if (!skills[k][i].id) {
                    $scope.skills.push({
                        title: skills[k][i].text,
                        category: k
                    });
                } else {
                    $scope.skills.push({
                        id: skills[k][i].id,
                        category: skills[k][i].category.id
                    });
                }
            }
        }
        $log.debug("[TASK] Skill updates");
        $log.debug($scope.skills);
    });

    $scope.selectCategories = function() {
        console.log($scope.task.categories);
        modals.selectCategories($scope.task.categories, function(categories) {
            if (categories) {
                $scope.task.categories = categories;
            }
        });
    };

    $scope.createTask = function() {
        var taskToSave = angular.copy($scope.task);
        $scope.formLoading = true;

        if (taskToSave.description === '') {
            delete taskToSave.description;
        }

        if (taskToSave.milestone === null) {
            delete taskToSave.milestone;
        }

        preProcessSkills(taskToSave).then(function(task) {
            tasks.create(task).then(function(result) {
                $log.debug("[TASK] New task created:");
                $log.debug(result.data);
                mixpanel.track($scope.$root.env + ':project.taskmgr.task.create');

                $scope.formLoading = false;

                if (result.data.id) {
                    redirect();
                }
            }, creationFailCallback);
        });
    };

    $scope.saveTask = function() {
        var taskToSave = angular.copy($scope.task);
        $scope.formLoading = true;

        preProcessSkills(taskToSave).then(function(task) {
            tasks.update(task).then(function(result) {
                $scope.formLoading = false;
                mixpanel.track($scope.$root.env + ':project.taskmgr.task.update');

                if (result.data.id) {
                    redirect();
                }
            });
        });
    };

    $scope.delete = function() {
        modals.confirm("Are you sure you want to delete this task?", function(result) {
            if (result) {
                $scope.formLoading = true;
                tasks.delete($scope.task.id).then(function() {
                    $scope.formLoading = false;
                    mixpanel.track($scope.$root.env + ':project.taskmgr.task.delete');
                    redirect();
                });
            }
        });
    };

    $scope.reset = function() {
        $scope.task = {
            title: '',
            description: '',
            status: 'not_started',
            milestone: null,
            project: $stateParams.project_id
        };
    };
}];
