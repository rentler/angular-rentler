(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('EqualsValidator', EqualsValidator);

  function EqualsValidator() {
    var validator = {
      validate: validate,
      message: 'Invalid'
    };
    
    return validator;

    function validate(value, instance, opts) {
      if (_.isNil(value)) return true;
      
      var otherValue = _.has(opts, 'equals') ? opts.equals : opts;

      if (_.isString(value) && _.isString(otherValue)) {
        value = value.toLowerCase();
        otherValue = otherValue.toLowerCase();
      }

      return _.isEqual(value, otherValue);
    }
  }

}());
