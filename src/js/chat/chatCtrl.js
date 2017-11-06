module.exports = ['$scope', '$log', 'users', 'principal', 'conversations', '$filter', '$interval', '$rootScope', '$timeout', 'search',
  function($scope, $log, users, principal, conversations, $filter, $interval, $rootScope, $timeout, search) {
    $scope.openConversation = { 'messages': [] };
    $scope.messageLength = 1000;
    $scope.currentUserId = principal.getUser().id;
    $scope.step = 1;
    $scope.isChatActive = false;
    $scope.title = "Your Conversations";
    $scope.lessThanOneSelected = true;
    $scope.isChatWindowOpen = false;
    $scope.users = [];
    $scope.newMessage = "";
    $scope.query = "";
    $scope.userSelectMsg = "Search for others to start a chat";
    $scope.selectedUsers = [];
    var pollAllConversationsPromise;
    var pollOpenConversationPromise;

    //Filters

    $scope.isNotUserFilter = function isNotUserFilter(user) {
        return (user.id !== $scope.currentUserId);
    };

    $scope.isAtLeastTwoAndNotCurrentUserFilter = function isAtLeastTwoAndNotCurrentUserFilter(element) {
        return !(element.users.length < 2 && !$scope.isNotUserFilter(element.users[0]));
    };

    //Polling

    function pollAllConversations(callback) {
        conversations.list().then(function(result) {
            $scope.conversations = $filter('filter')(result.data, $scope.isAtLeastTwoAndNotCurrentUserFilter);
            for (i = 0; i < $scope.conversations.length; i++) {
                processUserNames($scope.conversations[i]);
                $scope.conversations[i].date = new Date($scope.conversations[i].last_updated);
            }
            //$log.debug('[CHAT] pollAllConversations ', $scope.conversations);
        });
    }
    pollAllConversations();
    pollAllConversationsPromise = $interval(pollAllConversations, $rootScope.pollDuration);

    function processUserNames(conversation) {
        var displayableUsers = 1;
        conversation.users = $filter('filter')(conversation.users, $scope.isNotUserFilter);
        var usernameString = conversation.users[0].name;
        var searchableString = conversation.users[0].name;
        var allUsersInConversation = "You and " + conversation.users[0].name;
        var concatString = ", ";
        for (var i = 1; i < conversation.users.length; i++) {
            if (conversation.users[i].name.length + concatString.length + usernameString.length < 27) {
                usernameString = usernameString + concatString + conversation.users[i].name;
                displayableUsers++;
            }
            searchableString = searchableString + " " + conversation.users[i].name;
            allUsersInConversation = allUsersInConversation + concatString + conversation.users[i].name;


        }
        conversation.namelist = usernameString;
        conversation.searchableUsernames = searchableString;
        conversation.non_displayable_name_amount = conversation.users.length - displayableUsers;
        conversation.allUsersInConversation = allUsersInConversation;
    }

    function pollOpenConversation(conversation) {
        conversations.get(conversation.id).then(function(result) {
            $scope.openConversation = result.data;
            $scope.openConversation.namelist = conversation.namelist;
            $scope.openConversation.non_displayable_name_amount = conversation.non_displayable_name_amount;
            if (!$scope.openConversation.is_read) {
                conversations.changeIsRead(conversation.id, true).then(function(result) {
                    conversation.is_read = true;
                });
            }
        });
    }

    //Notifications

    function notify(msg) {
        $scope.notification = msg;
        $timeout(function() {
            $scope.notification = "";
        }, 3000);
    }

    //Activation/Deactivation of Chat

    $scope.activateChat = function activateChat(conversation) {
        $scope.isChatActive = true;
        $scope.title = conversation.namelist;
        conversations.get(conversation.id).then(function(result) {
            $scope.openConversation = result.data;
            $scope.openConversation.namelist = conversation.namelist;
            $scope.openConversation.non_displayable_name_amount = conversation.non_displayable_name_amount;
            $scope.openConversation.allUsersInConversation = conversation.allUsersInConversation;
            $scope.title = $scope.openConversation.namelist;
            $log.debug('[CHAT] open Conversation: ', $scope.openConversation);
            conversations.changeIsRead(conversation.id, true).then(function(result) {
                conversation.is_read = true;
            });
        });
        $interval.cancel(pollAllConversationsPromise);
        pollOpenConversationPromise = $interval(pollOpenConversation, $rootScope.pollDuration, 0, true, conversation);
    };

    //New Chat

    $scope.goStepForward = function goStepForward($event) {
        $event.stopPropagation();
        if ($scope.step + 1 === 2) {
            $scope.selectedUsers = [];
            $scope.lessThanOneSelected = true;
            $scope.title = "Select Chat Participants";
            $scope.newMessage = "";
            $scope.query = "";
            $scope.users = [];
            $scope.step = $scope.step + 1;
        }
        if ($scope.step + 1 === 3 && !$scope.isSendDisabled()) {
            createConversation();
        }
    };

    $scope.goStepBack = function goStepBack($event) {
        $event.stopPropagation();
        if ($scope.isChatActive) {
            $scope.isChatActive = false;
            $scope.openConversation = {};
            $interval.cancel(pollOpenConversationPromise);
            pollAllConversations();
            pollAllConversationsPromise = $interval(pollAllConversations, $rootScope.pollDuration);
        } else if ($scope.step === 1) {
            $scope.isChatWindowOpen = false;
        } else {
            $scope.step = $scope.step - 1;
            if ($scope.step === 2) {
                $scope.newMessage = "";
                $scope.selectedUsers = [];
                $scope.users = [];
                $scope.userSelectMsg = "Search for others to start a chat";
            }
        }
        $scope.title = "Your Conversations";
    };

    $scope.isSendDisabled = function isSendDisabled() {
        if ($scope.step === 2 && ($scope.newMessage.length < 1 || $scope.selectedUsers.length < 1)) {
            return true;
        } else {
            return false;
        }
    };

    $scope.searchForUser = function searchForUser(queryString) {
        search.query(queryString, ["User"]).then(function(result) {
                $log.debug(result.data);
                $scope.users = [];
                $scope.users = result.data.users.filter(function(user) {
                    return !$scope.selectedUsers.some(function(selectedUser) {
                        return selectedUser.id === user.id;
                    });
                });
                if ($scope.users.length < 1) {
                    $scope.userSelectMsg = "Hmm... we can't find the person you are looking for";
                }
                $scope.query = "";
            },
            function(error) {

            });
    };

    $scope.selectUser = function selectUser(user) {
        $scope.query = "";
        var index = $scope.selectedUsers.indexOf(user);
        if (index === -1) {
            $scope.selectedUsers.push(user);
            $scope.users.splice($scope.users.indexOf(user), 1);
        }
        ($scope.selectedUsers.length < 1) ? $scope.lessThanOneSelected = true: $scope.lessThanOneSelected = false;
    };

    $scope.unselectUser = function unselectUser(user) {
        var index = $scope.selectedUsers.indexOf(user);
        $scope.users.push(user);
        $scope.selectedUsers.splice(index, 1);
    };

    $scope.returnTooltipPlacement = function returnTooltipPlacement(index) {
        if (index / 5 === 1) {
            return "left";
        } else if (index === 0 || index / 6 === 1) {
            return "right";
        } else return "bottom";
    };

    function createConversation() {
        var selectedUserIds = [];
        for (var i = 0; i < $scope.selectedUsers.length; i++) {
            selectedUserIds.push($scope.selectedUsers[i].id);
        }
        $log.debug('[CHAT] selectUserIds', selectedUserIds);
        var newConversation = {
            users: selectedUserIds,
            message: $scope.newMessage
        };
        conversations.create(newConversation).then(function(result) {
            var conversation = result.data;
            processUserNames(conversation);
            conversation.date = new Date(conversation.last_updated);
            $scope.newMessage = "";
            $log.debug('[CHAT] newly created conversation', conversation);
            $scope.selectedUsers = [];
            $scope.activateChat(conversation);
            $scope.step = 1;
        });

    }

    //Send Message

    $scope.checkLength = function checkLength(maxLength) {
        if ($scope.newMessage.length > maxLength) {
            $scope.newMessage = $scope.newMessage.substring(0, maxLength);
        }
    };

    $scope.sendMessage = function sendMessage(event) {
        if (event.keyCode === 13 && $scope.step !== 2) {
            event.preventDefault();
            conversations.addMessage($scope.openConversation.id, $scope.newMessage).then(function(result) {
                    $scope.newMessage = "";
                    $scope.openConversation.messages.push(result.data);
                    mixpanel.track($scope.$root.env + ':chat.message.send');
                },
                function(result) {
                    notify(result.data.error);
                });
        }
    };
}];
