module.exports = ['$timeout', function($timeout) {
    return {
        restrict: 'AE',
        scope: {
            messages: '='
        },
        templateUrl: '/chat/chat_conversation.html',
        link: function(scope, element, attrs) {
            var todayDate = new Date();
            scope.isLoaded = false;
            var previousScrollHeight = 0;

            function scrollTo(scrollHeight, scrollableElt, speed) {
                scrollableElt.animate({ scrollTop: scrollHeight }, speed, 'swing',
                    function() {
                        scope.isLoaded = true;
                    });
            }
            scope.adjustScroll = function() {
                var elt = angular.element(element[0].querySelector('.chat-conversation'));
                if (!scope.isLoaded) {
                    scrollTo(elt.prop('scrollHeight'), elt, 0);
                } else if (elt.scrollTop() + elt.innerHeight() === previousScrollHeight) {
                    scrollTo(previousScrollHeight, elt, 400);
                }
                previousScrollHeight = elt.prop('scrollHeight');
            };

            scope.returnDateFilter = function returnDateFilter(date) {
                var messageDate = new Date(date);
                if (todayDate.setHours(0, 0, 0, 0) == messageDate.setHours(0, 0, 0, 0)) {
                    return 'shortTime';
                } else {
                    return 'short';
                }
            };
        }
    };
}];
