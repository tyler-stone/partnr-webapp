module.exports = function() {
    return function(scope, elt, attrs) {
        attrs.$observe('pnBgImg', function(url) {
            // kinda hacky but this is a hotfix for project tile backgrounds
            if (url !== "" && url.indexOf('original/missing.png') === -1) {
                elt.css({
                    'background': 'url(' + url + ')',
                    'background-size': 'cover'
                });
            }
        });
    };
};
