module.exports = {
    radioCheck: function (value, radioValue) {
        if (value === radioValue) {
            return 'checked';
        }
        return '';
    }
};