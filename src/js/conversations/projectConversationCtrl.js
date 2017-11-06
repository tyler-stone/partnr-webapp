module.exports = ['$rootScope', '$scope', '$stateParams', '$log', '$interval', 'toaster', 'conversations', function($rootScope, $scope, $stateParams, $log, $interval, toaster, conversations) {
    $scope.conversation = {};
    $scope.isMessageSubmitting = false;
    $scope.newMessage = "";
    $scope.loadComplete = false;


    var poll = $interval(function(callback) {
        conversations.getByProject($stateParams.project_id).then(function(result) {
            $log.debug(result.data);
            if (result.data.id) {
                $scope.conversation = result.data;
            }
        });
    }, $rootScope.pollDuration);

    $scope.$on('$destroy', function() {
        $log.debug("Cancelling message update requests");
        $interval.cancel(poll);
    });

    conversations.getByProject($stateParams.project_id).then(function(result) {
        $log.debug(result.data);
        $scope.loadComplete = true;
        if (result.data.id) {
            $scope.conversation = result.data;
        } else {
            toaster.error("Oops... Project chat wasn't initialized properly...");
        }
    });

    $scope.sendMessage = function() {
        $scope.isMessageSubmitting = true;

        conversations.addMessage($scope.conversation.id, $scope.newMessage).then(function(result) {
            $log.debug(result.data);
            $scope.newMessage = "";
            $scope.conversation.messages.push(result.data);
            $scope.isMessageSubmitting = false;
        });
    };
}];
