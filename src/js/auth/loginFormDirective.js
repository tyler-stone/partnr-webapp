module.exports = function() {
  var ENTER_KEY = 13;

  return {
    restrict: 'E',
    templateUrl: '/auth/login_form.html',
    link: function(scope, elem) {
      elem.on('keydown', function(e) {
        if (e.keyCode === ENTER_KEY) {
          scope.doLogin();
        }
      });
    }
  };
};
