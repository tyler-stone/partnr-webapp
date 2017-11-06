module.exports = ['$scope', '$state', '$log', '$q', '$filter', 'toaster', 'users','principal', 'profiles', '$rootScope', '$timeout', function($scope, $state, $log, $q, $filter, toaster, users, principal, profiles, $rootScope, $timeout) {
    $scope.loadComplete = false;



    var editableAttributeList = function(type, template) {
        this.type = type;
        this.template = template;
        this.all = [];
        this.new = [];
        this.toDelete = [];

        this.addNewItem = function() {
            $log.debug("Add new item");
            this.new.push(angular.copy(this.template));
            $log.debug(this);
        };

        this.deleteNewItem = function(index) {
            $log.debug("Remove new item");
            this.new.splice(index, 1);
            $log.debug(this);
        };

        this.deleteExistingItem = function(id) {
            $log.debug("Remove existing item");
            var item = $filter('filter')(
                this.all,
                function(d) {
                    return d.id === id;
                })[0];
            var index = this.all.indexOf(item);
            this.all.splice(index, 1);
            this.toDelete.push(item);

            $log.debug(index);
            $log.debug(item);
            $log.debug(this.all);
            $log.debug(this.toDelete);
            $log.debug(this);
        };

        this.save = function() {
            var requests = [];

            for (var i = 0; i < this.all.length; i++) {
                if (profiles.isValidItem(this.all[i], this.type)) {
                    requests.push(profiles.updateItem(this.all[i].id, this.all[i], this.type));
                }
            }

            for (var i = 0; i < this.new.length; i++) {
                if (profiles.isValidItem(this.new[i], this.type)) {
                    requests.push(profiles.addItem(this.new[i], this.type));
                }
            }

            for (var i = 0; i < this.toDelete.length; i++) {
                requests.push(profiles.deleteItem(this.toDelete[i].id, this.type));
            }

            return $q.all(requests);
        };
    };

    $scope.user = null;
    $scope.avatar = null;
    $scope.updatedUser = {
        "firstName": null,
        "lastName": null
    };

    $scope.location = "";
    $scope.schools = new editableAttributeList("school", {
        school_name: "",
        grad_year: "",
        field: ""
    });
    $scope.positions = new editableAttributeList("position", {
        title: "",
        company: ""
    });
    $scope.interests = new editableAttributeList("interest", {
        title: ""
    });

    $scope.changeAvatar = function(image) {
        var file = image.files[0];
        var fd = new FormData();
        fd.append('image', file);
        $scope.avatar = fd;
    };

    users.get(principal.getUser().id).then(function(result) {
        $log.debug(result.data);
        $scope.user = result.data;
        if ($scope.user.profile) {
            if ($scope.user.profile.location) {
                $scope.location = $scope.user.profile.location.geo_string;
            }
            $scope.schools.all = $scope.user.profile.school_infos;
            $scope.positions.all = $scope.user.profile.positions;
            $scope.interests.all = $scope.user.profile.interests;
        }
        $scope.loadComplete = true;
    });

    $scope.doSave = function() {
        $scope.loadComplete = false;

        var requests = [];

        if ($scope.avatar !== null) {
            requests.push(users.postAvatar($scope.avatar).$promise);
        }

        var firstName = $scope.user.first_name;
        var lastName = $scope.user.lastName;

        if ($scope.updatedUser.firstName !== null || $scope.updatedUser.lastName !== null) {

            if ($scope.updatedUser.firstName !== null) {
                firstName = $scope.updatedUser.firstName;
            }
            if ($scope.updatedUser.lastName !== null) {
                lastName = $scope.updatedUser.lastName;
            }
            requests.push(users.updateName(firstName, lastName).$promise);
        }

        if (profiles.isValidLocation($scope.location)) {
            requests.push(profiles.addLocation($scope.location).$promise);
        }

        requests.push($scope.schools.save());
        requests.push($scope.positions.save());
        requests.push($scope.interests.save());

        $log.debug(requests);

        $q.all(requests).then(function(result) {
            principal.updateUserName(firstName, lastName);
            if ($scope.avatar !== null) {
                $timeout(function() {
                    $rootScope.$broadcast('Avatar_Update');
                }, 5000);
            }
            $log.debug(result);
            toaster.success("Profile updated!");
            $state.go('home.feed');
            $scope.loadComplete = true;
        });
    };
}];
