(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('RequiredValidator', RequiredValidator);

  RequiredValidator.$inject = [];

  function RequiredValidator() {
    var validator = {
      message: 'Required',
      validate: validate
    };

    return validator;
    
    function validate(value, instance, opts) {
      if (!opts)
        return true;

      return !(_.isNil(value) || 
              (_.isString(value) && _.trim(value) === '') || 
              (_.isArray(value) && value.length === 0));
    }
  }

})();
