module.exports = ['$rootScope', '$state', 'routeUtils', function($rootScope, $state, routeUtils) {
    return {
        restrict: 'AE',
        templateUrl: '/feed/feed_activity.html',
        scope: {
            activity: '='
        },
        link: function($scope, elt, attr, ctrl) {
            $scope.$state = $state;

            $scope.resolveLink = function(a) {
                var subject_type = a.subject_type.toLowerCase();
                if (subject_type === "bmark") subject_type = "milestone";
                if (subject_type === "role" || subject_type === "comment") {
                    // hard coded edge case for now, because "role" doesn't have it's own state and should resolve to project
                    $state.go('project', { project_id: a.subject.project.id });
                } else {
                    routeUtils.resolveEntityLinkAndGo(a.subject[subject_type].links.self, a);
                }
            };
        }
    };
}];
