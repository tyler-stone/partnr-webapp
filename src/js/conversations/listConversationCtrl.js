module.exports = ['$scope', 'conversations', function($scope, conversations) {
    $scope.userIdPattern = new RegExp("(\\d+),+|(\\d+)");
    $scope.userIdText = "";

    $scope.conversations = [];
    $scope.newConversation = {
        users: [],
        message: null
    };

    conversations.list().then(function(result) {
        $log.debug(result);
    });
}];
