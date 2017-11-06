module.exports = ['$rootScope', '$http', '$log', 'principal', function($rootScope, $http, $log, principal) {
    return {
        get: function(id) {
            $log.debug('[TASK] Sending get request for task ' + id);
            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'tasks/' + id,
                headers: principal.getHeaders()
            });
        },

        listByProject: function(id) {
            $log.debug('[TASK] Getting list by project');
            $log.debug(id);

            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'tasks',
                headers: principal.getHeaders(),
                params: { project: id }
            });
        },

        listByProjectAndMilestone: function(project_id, milestone_id) {
            $log.debug('[TASK] Getting list by project and milestone');
            $log.debug(project_id);
            $log.debug(milestone_id);

            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'tasks',
                headers: principal.getHeaders(),
                params: {
                    project: project_id,
                    milestone: milestone_id
                }
            });
        },

        list: function() {
            $log.debug('[TASK] Sending list request');

            return $http({
                method: 'GET',
                url: $rootScope.apiRoute + 'tasks',
                headers: principal.getHeaders()
            });
        },

        create: function(task) {
            $log.debug("[TASK] Sending create request");

            task.owner = principal.getUser().id;
            $log.debug(task);

            return $http({
                method: 'POST',
                url: $rootScope.apiRoute + 'tasks',
                headers: principal.getHeaders(),
                data: task
            });
        },

        update: function(task) {
            $log.debug("[TASK] Sending update request");
            $log.debug(task);
            var taskToUpdate = angular.copy(task);

            if (taskToUpdate.skills.length > 0 && taskToUpdate.skills[0].id) {
                var strippedSkills = [];
                for (var i = 0; i < taskToUpdate.skills.length; i++) {
                    strippedSkills.push(taskToUpdate.skills[i].id);
                }
                taskToUpdate.skills = strippedSkills;
            }

            if (taskToUpdate.categories.length > 0 && taskToUpdate.categories[0].id) {
                var strippedCategories = [];
                for (var i = 0; i < taskToUpdate.categories.length; i++) {
                    strippedCategories.push(taskToUpdate.categories[i].id);
                }
                taskToUpdate.categories = strippedCategories;
            }

            if (taskToUpdate.milestone && taskToUpdate.milestone.id) {
                taskToUpdate.milestone = taskToUpdate.milestone.id;
            }

            if (taskToUpdate.user && taskToUpdate.user.id) {
                taskToUpdate.user = taskToUpdate.user.id;
            }

            return $http({
                method: 'PUT',
                url: $rootScope.apiRoute + 'tasks/' + taskToUpdate.id,
                headers: principal.getHeaders(),
                data: taskToUpdate
            });
        },

        delete: function(id) {
            $log.debug("[TASK] Sending delete request");

            return $http({
                method: 'DELETE',
                url: $rootScope.apiRoute + 'tasks/' + id,
                headers: principal.getHeaders()
            });
        }
    };
}];
