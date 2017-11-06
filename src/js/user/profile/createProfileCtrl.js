module.exports = ['$scope', '$state', '$log', '$q', 'toaster', 'profiles', 'users', function($scope, $state, $log, $q, toaster, profiles, users) {
    $scope.loadComplete = true;

    $scope.location = "";
    $scope.schools = [];
    $scope.positions = [];
    $scope.interests = [];
    $scope.avatar = null;
    $scope.addAvatar = function(image) {
        var file = image.files[0];
        var fd = new FormData();
        fd.append('image', file);
        $scope.avatar = fd;
    };

    $scope.addSchool = function() {
        $scope.schools.push({
            school_name: "",
            grad_year: "",
            field: ""
        });
    };

    $scope.deleteSchool = function(index) {
        $scope.schools.splice(index, 1);
    };

    $scope.addPosition = function() {
        $scope.positions.push({
            title: "",
            company: ""
        });
    };

    $scope.deletePosition = function(index) {
        $scope.positions.splice(index, 1);
    };

    $scope.addInterest = function() {
        $scope.interests.push({
            title: ""
        });
    };

    $scope.deleteInterest = function(index) {
        $scope.interests.splice(index, 1);
    };

    $scope.doSave = function() {
        $scope.loadComplete = false;

        var requests = [];

        if ($scope.avatar !== null) {
            requests.push(users.postAvatar($scope.avatar).$promise);
        }

        if (profiles.isValidLocation($scope.location)) {
            requests.push(profiles.addLocation($scope.location).$promise);
        }

        for (var i = 0; i < $scope.schools.length; i++) {
            if (profiles.isValidSchool($scope.schools[i])) {
                requests.push(profiles.addSchool($scope.schools[i]).$promise);
            }
        }

        for (var i = 0; i < $scope.positions.length; i++) {
            if (profiles.isValidPosition($scope.positions[i])) {
                requests.push(profiles.addPosition($scope.positions[i]).$promise);
            }
        }

        for (var i = 0; i < $scope.interests.length; i++) {
            if (profiles.isValidInterest($scope.interests[i])) {
                requests.push(profiles.addInterest($scope.interests[i]).$promise);
            }
        }

        $q.all(requests).then(function(result) {
            $log.debug(result);
            toaster.success("Profile created!");
            $state.go('home.feed');
            $scope.loadComplete = true;
        });
    };
}];
