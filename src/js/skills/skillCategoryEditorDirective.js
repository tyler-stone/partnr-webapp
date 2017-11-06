module.exports =  ['$rootScope', '$state', '$log', 'skills', function($rootScope, $state, $log, skills) {
    return {
        restrict: 'AE',
        templateUrl: '/skills/skill_category_editor.html',
        scope: {
            categories: '=',
            skills: '='
        },
        link: function($scope, elem, attr, ctrl) {
            $log.debug($scope.categories);
            $log.debug($scope.skills);
            $scope.skillCategoryMap = [];

            $scope.$watch('skills', function() {
                if ($scope.skills) {
                    // prepare skills for display to the tag list and map skills to a category
                    for (var idx = 0; idx < $scope.skills.length; idx++) {
                        $scope.skills[idx].text = $scope.skills[idx].title;

                        if ($scope.skills[idx].category && $scope.skills[idx].category.id) {
                            if ($scope.skillCategoryMap[$scope.skills[idx].category.id]) {
                                $scope.skillCategoryMap[$scope.skills[idx].category.id].push($scope.skills[idx]);
                            } else {
                                $scope.skillCategoryMap[$scope.skills[idx].category.id] = [$scope.skills[idx]];
                            }
                        }
                    }

                    $log.debug("Skill/Category Map:");
                    $log.debug($scope.skillCategoryMap);
                }
            });

            $scope.$watch('skillCategoryMap', function() {
                $scope.$emit('category::skill-selector::change', $scope.skillCategoryMap);
            }, true);
        }
    };
}];
