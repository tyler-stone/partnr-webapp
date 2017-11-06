module.exports =  ['$state', function($state) {
    return {
        restrict: 'AE',
        templateUrl: '/user/user_card.html',
        scope: {
            user: '='
        },
        link: function($scope, elem, attr, ctrl) {
            $scope.$state = $state;

            function compareScores(scoredThing, otherScoredThing) {
                return otherScoredThing.score - scoredThing.score;
            }

            // if the skillscore exists on the user, sort it
            if (!!$scope.user.skillscore.scored) {
                $scope.user.skillscore.scored.skills.sort(compareScores);
                $scope.user.skillscore.scored.categories.sort(compareScores);
            }

            // give the categories and skills the correct classes they need
            $scope.user.skillscore.scored.categories.forEach(function(cat) {
                cat.divClass = 'pn-cat-' + cat.category.title.toLowerCase().replace(' ', '-');
            });
            $scope.user.skillscore.scored.skills.forEach(function(skill) {
                skill.divClass = 'pn-cat-' + skill.skill.category.title.toLowerCase().replace(' ', '-');
            });
        }
    };
}];
