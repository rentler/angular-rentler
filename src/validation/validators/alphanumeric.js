(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('AlphanumericValidator', AlphanumericValidator);

  AlphanumericValidator.$inject = [];

  function AlphanumericValidator() {
    var validator = {
      message: 'Invalid',
      validate: validate
    };
    
    return validator;
    
    function validate(value, instance, opts) {
      if (!opts || _.isNil(value))
        return true;

      return _.isString(value);
    }
  }

})();
