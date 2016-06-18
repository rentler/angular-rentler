(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('NumericValidator', NumericValidator);

  NumericValidator.$inject = [];

  function NumericValidator() {
    var validator = {
      message: 'Invalid',
      validate: validate
    };

    return validator;
    
    function validate(value, instance, opts) {
      if (!opts || _.isNil(value) || _.isNumber(value))
        return true;

      return _.isString(value) && !_.isNaN(+value);
    }
  }

})();
