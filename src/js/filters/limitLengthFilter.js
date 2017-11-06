module.exports = function() {
    return function(value, length) {
        if (!value) return '';
        if (value.length <= length) return value;

        value = value.substr(0, length);
        return value + '...';
    };
};
