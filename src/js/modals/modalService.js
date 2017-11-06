module.exports = ['$uibModal', '$location', '$log', function($uibModal, $location, $log) {
    return {
        // modals

        // alert modal
        alert: function(title, message) {
            var modal = $uibModal.open({
                templateUrl: '/modals/alert_modal.html',
                controller: 'AlertModalController',
                resolve: {
                    title: function() {
                        return title;
                    },
                    message: function() {
                        return message;
                    },

                }
            });
        },

        // confirm modal
        confirm: function(message, callback) {
            var modal = $uibModal.open({
                templateUrl: '/modals/confirm_modal.html',
                controller: 'ConfirmModalController',
                resolve: {
                    message: function() {
                        return message;
                    }
                }
            });

            modal.result.then(callback);
        },

        selectCategories: function(selectedCategories, callback) {
            var modal = $uibModal.open({
                templateUrl: '/modals/select_categories_modal.html',
                controller: 'SelectCategoriesModalController',
                resolve: {
                    selectedCategories: function() {
                        return selectedCategories;
                    }
                }
            });

            modal.result.then(callback);
        }
    };
}];
