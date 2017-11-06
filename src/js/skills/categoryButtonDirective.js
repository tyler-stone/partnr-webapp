module.exports = ['$rootScope', '$state', 'skills', function($rootScope, $state, skills) {
    return {
        restrict: 'AE',
        templateUrl: '/skills/category_button.html',
        scope: {
            category: '=',
            selectable: '=?',
            selected: '=?'
        },
        link: function($scope, elem, attr, ctrl) {

            $scope.click = function() {
                $scope.$emit('category::button::click', {
                    category: $scope.category
                });
            };

            $scope.buttonBackground = function() {
                var rgb = skills.hexToRgb($scope.category.color_hex);
                return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", 0.6)";
            };
        }
    };
}];
