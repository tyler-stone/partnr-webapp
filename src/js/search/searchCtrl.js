module.exports = ['$scope', '$rootScope', '$state', '$stateParams', '$q', '$log', 'principal', 'search', 'toaster', 'applications', function($scope, $rootScope, $state, $stateParams, $q, $log,
    principal, search, toaster, applications) {
    $scope.user = principal.getUser();
    $scope.projects = [];
    $scope.roles = [];
    $scope.users = [];
    $scope.entities = [];
    $scope.loadComplete = true;

    function getEntities(paramEntities) {
        if (paramEntities === undefined)
            return [];

        return paramEntities instanceof Array ? paramEntities : [paramEntities];
    }

    $scope.doSearch = function() {
        mixpanel.track($scope.$root.env + ':search');
        $state.go('search', { q: $scope.query, entities: $scope.entities });
    };

    $scope.doApply = function(role) {
        applications.create({ role: role }).then(function(result) {
            toaster.success('Request sent!');
        });
        $scope.canApply = false;
    };

    $scope.processInput = function(e) {
        if (e.which === 13)
            $scope.doSearch();
    };

    $scope.toggleEntityInQueryParams = function(entName) {
        if ($scope.entities.includes(entName)) {
            var ind = $scope.entities.indexOf(entName);
            $scope.entities = $scope.entities.slice(0, ind).concat($scope.entities.slice(ind + 1));
        } else {
            $scope.entities.push(entName);
        }
        $scope.doSearch();
    };

    if (!!$stateParams.q) {
        $scope.loadComplete = false;
        search.query($stateParams.q, getEntities($stateParams.entities))
            .then(function(res) {
                $scope.query = $stateParams.q;
                $scope.entities = getEntities($stateParams.entities);
                $scope.projects = res.data.projects;
                $scope.roles = res.data.roles;
                $scope.users = res.data.users;
                $scope.loadComplete = true;
            });
    }

}];
