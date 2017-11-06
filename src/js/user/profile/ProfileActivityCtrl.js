module.exports = ['$scope', '$rootScope', '$state', '$stateParams', '$log', 'toaster', 'users', 'feeds',
  function($scope, $rootScope, $state, $stateParams, $log, toaster, users, feeds) {
    $scope.loadComplete = false;
    $scope.user = null;
    $scope.endOfFeed = false;
    $scope.activities = [];
    var page = 0;

    $scope.$parent.getProfileWrapperInfo().then(function(result) {
        $log.debug(result);
        $scope.user = result;
        $scope.getNextFeedPage();
    });


    var makeReadable = function(attr) {
        return attr.replace('_', ' ');
    };


    var parse = function(activity) {
        var re = /{\w+_\w+}/;
        var result = activity.message;
        var unparsed;
        while ((unparsed = re.exec(result)) !== null) {
            for (var i = 0; i < unparsed.length; i++) {
                var ent = unparsed[i];
                var arr = ent.slice(1, -1).split('_');
                try {
                    result = result.replace(ent, makeReadable(activity.subject[arr[0]][arr[1]]));
                } catch (e) {
                    // if we couldn't parse a message, return null
                    return null;
                }
            }
        }

        return result;
    };

    $scope.getNextFeedPage = function() {
        if ($scope.endOfFeed) return;
        $scope.loadComplete = false;
        feeds.listUserActivity($scope.user.id, ++page).then(function(res) {
            if (res.data.length === 0) {
                angular.element('#feedScroll').remove();
                $scope.endOfFeed = true;
                $scope.loadComplete = true;
                return;
            }
            $log.debug('[PROFILE] recieved feed:');
            for (var i = 0; i < res.data.length; i++) {
                res.data[i]['user'] = res.data[i]['actor'];
                // get rid of "{user_name}" for now
                res.data[i].message = res.data[i].message.slice(res.data[i].message.indexOf('}') + 2);
                res.data[i].parsedMessage = parse(res.data[i]);
                // if we couldn't parse a message, don't display the activity
                if (res.data[i].parsedMessage === null) res.data[i].doNotDisplay = true;
                res.data[i].displayDate = (new Date(res.data[i].sent_at)).toDateString().slice(4);
            }
            $log.debug(res);
            $scope.activities = $scope.activities.concat(res.data);
            $scope.loadComplete = true;
        });
    };
}];
