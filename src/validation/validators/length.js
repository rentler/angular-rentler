(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('LengthValidator', LengthValidator);

  LengthValidator.$inject = [];

  function LengthValidator() {
    function validate(value, instance, opts) {
      if (!opts || !value)
        return true;

      var minmax = _.isArray(opts) ? opts : opts.length,
          min = minmax[0] || (value ? value.length : 0),
          max = minmax[1] || (value ? value.length : 0);

      return _.isString(value) && value.length >= min && value.length <= max;
    }

    var length = {
      validate: validate,
      message: function (field, opts) {
        return _.format('{0} must be between {1} and {2} characters long.',
          _.capitalize(field),
          opts[0],
          opts[1]);
      }
    };

    return length;
  }

})();
