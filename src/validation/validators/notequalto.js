(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('NotEqualToValidator', NotEqualToValidator);

  NotEqualToValidator.$inject = [];

  function NotEqualToValidator() {
    var validator = {
      message: 'Invalid',
      validate: validate
    };

    return validator;

    function validate(value, instance, opts) {
      if (!opts || _.isNil(value))
        return true;

      var compareField = _.isString(opts) ? opts : opts.notEqualTo;

      var compareValue = _.get(instance, compareField);

      if (_.isString(value) && _.isString(compareValue)) {
        value = value.toLowerCase();
        compareValue = compareValue.toLowerCase();
      }
      
      return value !== compareValue;
    }
  }

})();
